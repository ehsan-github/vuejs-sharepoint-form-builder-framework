// @flow
import R from 'ramda'
import uuidv1 from 'uuid/v1'

import { getFieldsList, getItems, getFilteredItems, getContractSpec, saveFieldItems, getTemplate, getItemMaster, getItemDetail } from '../api'

// [{Guid: 1}, ...] -> {1: {}, ...}
export const transformFieldsList = R.pipe(
    R.groupBy(f => f.Guid),
    R.map(R.head)
)

// {DefaultValue: 1} -> {DefaultValue: 1, value: 1}
const assignValue = R.pipe(
    R.juxt([f => f.DefaultValue, R.identity]),
    x => R.assoc('value', ...x)
)

const getFieldId = (InternalName, fields) => R.pipe( //find the key of first item with this internalName
    R.filter(R.propEq('InternalName', InternalName)),
    R.keys,
    R.head
)(fields)

const setContractValue = R.curry((value, items) => {
    let id = getFieldId('Contract', items)
    let newItems = R.assocPath([id, 'value'], value, items)
    return newItems
})

const addToSelect = (res, { InternalName }) => {
    return res + InternalName + ','
}

const constructSelect = R.pipe(
    R.reject(R.propEq('Type', 'MasterDetail')),
    R.values,
    R.reduce(addToSelect, ''),
    R.slice(0, -1) // Remove last comma :grin
)

export function loadFields ({ commit, state }) {
    return new Promise((resolve, reject) => {
        getFieldsList(state.listId)
            .map(R.map(assignValue))
            .map(transformFieldsList)
            .map(setContractValue(Number(state.contractId)))
            .fork(
                err => {
                    commit('addError', err)
                    reject(err)
                },
                res => {
                    commit('loadFields', res)
                    const select = constructSelect(res)
                    showFieldsList({ commit, state }, { select })
                    resolve(res)
                }
            )
    })
}

export function loadOptions({ commit }, { id, listId }) {
    return getItems(listId)
        .fork(
            err     => commit('addError', err),
            options => commit('loadOptions', { id, options })
        )
}

export function loadFilteredOptions({ commit }, { id, listId, query }) {
    return getFilteredItems(listId, query)
        .fork(
            err     => commit('addError', err),
            options => commit('loadOptions', { id, options })
        )
}

export function loadContractSpec({ commit, state }){
    return getContractSpec(state.contractId)
        .map(R.head) //TODO: should change for deployment!
        .fork(
            err => commit('addError', err),
            res => commit('loadContractSpec', res)
        )
}

export function changeField({ commit }, payload) {
    commit('changeField', payload)
}

export function loadComputed ({ commit }, { id, listId, query , select , func }) {
    let realFunc = computeFunction(func)
    if (query.indexOf('null') === -1) {
        return getFilteredItems(listId, query)
            .map(R.map(R.prop(select)))
            .fork(
                err      => commit('addError', err),
                computed => {
                    let value = Array.isArray(computed) ? realFunc(computed) : computed // it needs to check different strunctors of retruned value
                    commit('changeField', { id, value })
                }
            )
    }
    commit('changeField', { id, value: '' })
}

export function MDLoadFields ({ commit, state }, { id, listId, masterLookupName } ) {
    return new Promise((resolve, reject) => {
        getFieldsList(listId)
            .map(R.map(assignValue))
            .map(transformFieldsList)
            .fork(
                err => {
                    commit('addError', err);
                    reject(err);
                },
                fields => {
                    commit('MDLoadFields', { id, fields })
                    const select = constructSelect(fields)
                    showDetailFieldsList({ commit, state }, { id, listId, select, masterLookupName })
                    resolve(fields)
                }
            )
    })
}

export function MDChangeFieldRow ({ commit }, payload) {
    commit('MDChangeFieldRow', payload)
}

export function MDLoadOptions ({ state, commit }, { id, masterId, rowId, listId }) {
    return getItems(listId)
        .fork(
            err     => {
                err ? commit('addError', err+'<'+state.fields[masterId]['rows'][rowId][id]['InternalName']+'> field')
                    : commit('addError','<'+state.fields[masterId]['rows'][rowId][id]['InternalName']+'> field')
            },
            options => commit('MDLoadOptions', { id, masterId, rowId, options })
        )
}

function MDLoadLookupOptions ({ commit }, { masterId, id, listId }) {
    return getItems(listId)
        .fork(
            err     => commit('addError', err),
            options => commit('MDLoadLookupOptions', { id, masterId, options })
        )
}

export function MDLoadAllLookupOptions ({ commit, state }, { masterId } ) {
    R.pipe (
        R.filter(R.propSatisfies(R.either(R.equals('Lookup'), R.equals('LookupMulti')), 'Type')),
        R.mapObjIndexed(
            (v, id) =>
                MDLoadLookupOptions({ commit },
                                    { id, masterId, listId: v.LookupList })
        )
    )(state.fields[masterId].fields)
}

export function MDLoadFilteredOptions ({ state, commit }, { id, masterId, rowId, listId, query }) {
    return query.indexOf('null') === -1
        ? getFilteredItems(listId, query)
        .fork (
            err     => {
                err ? commit('addError', err+' ***there is an error in <'+state.fields[masterId]['rows'][rowId][id]['InternalName']+'> field')
                    : commit('addError','There is an error in <'+state.fields[masterId]['rows'][rowId][id]['InternalName']+'> field')
            },
            options => commit('MDLoadOptions', { id, masterId, rowId, options })
        )
    : commit('MDLoadOptions', { id, masterId, rowId, options: null })
}

export function MDAddRow ({ commit, state }, { id }) {
    let rowId = uuidv1()
    commit('MDAddRow', { id, rowId })
}

export function MDDelRow ({ commit }, rowProps) {
    commit('MDDelRow', rowProps)
}

const computeFunction = func => {
    switch(func) {
    case 'Sum':
        return R.sum
    case 'Multi':
        return R.product
    case 'Avg':
        return R.mean
    case 'Min':
        return R.apply(R.min)
    case 'Max':
        return R.apply(R.max)
    case 'First':
        return R.head
    }
}

export function MDLoadComputed ({ commit }, { id, masterId, rowId, listId, query , select , func }) {
    let realFunc = computeFunction(func)
    if (query.indexOf('null') === -1) {
        return getFilteredItems(listId, query)
            .map(R.map(R.prop(select)))
            .fork(
                err      => commit('addError', err),
                computed => {
                    let value = Array.isArray(computed) ? realFunc(computed) : computed // it needs to check different strunctors of retruned value
                    commit('MDChangeFieldRow', { masterId, rowId, fieldId: id, value })
                }
            )
    }
    commit('MDChangeFieldRow', { masterId, rowId, fieldId: id, value: null })
}

const transFormFields= R.pipe(
    R.values,
    R.project(['InternalName', 'Type', 'value', 'rows', 'LookupList']),
    R.map(R.map(f => f == null ? '' : f)), // remove null values
    R.map(f => f.rows == '' ? R.assoc('rows', [], f) : f), // replace rows null value with empty array
    R.map(f => (f.InternalName == 'ID' && f.value == '') ? R.assoc('value', 0, f) : f), // replace ID of null with 0 value
    R.reject(R.propEq('value', ''))
)

const transFormRows = R.map(
    R.ifElse(
        R.propEq('Type', 'MasterDetail'),
        field => R.assoc('rows', R.values(R.map(transFormFields, field.rows)), field),
        R.identity
    )
)

const transFormForSave = R.pipe(
        transFormFields,
        transFormRows
)

export function saveData ({ commit, state }) {
    let data = transFormForSave(state.fields)
    return new Promise((resolve, reject) => {
        saveFieldItems(state.listId, data, state.deletedItems)
            .fork(
                err  => {
                    commit('addError', 'در عملیات ذخیره سازی خطای شبکه رخ داد مجددا ذخیره کنید'),
                    reject(err)
                },
                succ => resolve(succ)
            )
    })
}

export function removeError ({ commit }, error) {
    commit('removeError', error)
}

export function loadTemplateMetaData({ commit, state }) {
    return getTemplate(state.listId)
        .map(R.head)
        .fork(
            err  => commit('loadTemplateMetaData', { templateName: 'TwoColumn', template: '' + err }),
            succ => {
                let fields = transformFields(state.fields)
                let firstTemplate = replaceTemplateStr(succ.template || '', fields)
                let secondTemplate = firstTemplate.replace(
                    new RegExp(/{{(\w+)(:[^}]+)?}}/, 'g'),
                    (s, fname, fields) => {
                        return `<Field fieldId='{{${fname}}}' class="${fname}" showFields="${fields.substr(1).split(',')}" ></Field>`
                    }
                )
                let template = replaceNameWithId(secondTemplate, fields)
                commit('loadTemplateMetaData', { templateName: succ.templateName || 'TwoColumn', template })
            }
        )
}

const transformFields= R.pipe(
    R.values,
    R.reduce((acc, curr) => ({
        ...acc,
        [curr.InternalName]: {
            'id': curr.Guid,
            'title': curr.Title,
            'intName': curr.InternalName,
            'isRequire': curr.IsRequire
        }
    }), {})
)

const replaceTemplateStr = (str, fields) => R.reduce(
    (q, field) => R.replace(
        new RegExp('{{'+field+'}}', 'g'),
        `<div :class="{require: ${fields[field].isRequire}}"><span class="${fields[field].intName}">${fields[field].title}</span><Field fieldId="${fields[field].id}" class="${field}" ></Field></div>`,
        q),
    str,
    R.keys(fields)
)

const replaceNameWithId = (str, fields) => R.reduce(
    (q, field) => R.replace(
        new RegExp('{{'+field+'}}', 'g'),
        `${fields[field].id}`,
        q),
    str,
    R.keys(fields)
)

export function removeServerError({ commit }, { row, internalName }){
    commit('removeServerError', { row, internalName })
}

export function loadServerErrors({ commit }, errors){
    commit('loadServerErrors', errors)
}
const shapeData = (value, InternalName) => { // key in the comming items is the InternalName of Field
    return typeof value == 'object' ? { InternalName, value: value ? value.Title : '' } : { InternalName, value }
}

export function loadFieldsList({ commit, state }, { items }) {
    let fieldValues = R.values(R.mapObjIndexed(shapeData, items))
    R.map(x => commit('setFieldValue', x), fieldValues)
    if (!state.isThereDetails) { commit('setLoadingFalse') }
}

export function showFieldsList ({ commit, state }, { select }) {
    let { listId, itemId } = state
    return getItemMaster(listId, itemId, select)
        .map(x => JSON.parse(x))
        .map(R.head)
        .fork(
            err     => commit('addError', err),
            items   => {
                loadFieldsList({ commit, state }, { items })
            }
        )
}

export function loadMasterFieldsList({ commit }, { items, id }) {
    return new Promise(resolve => {
        items.map((rowItems, k) => {
            let fieldValues = R.values(R.mapObjIndexed(shapeData, rowItems))
            R.map(x => commit('MDSetFieldRow', { ...x, masterId: id, rowIndex: k }), fieldValues)
            k == items.length - 1 ? setTimeout(() => resolve('done'), 3000) : null
        }
    )})
}

export function showDetailFieldsList ({ commit, state }, { id, listId, select, masterLookupName }) {
    let { itemId } = state
    return getItemDetail(listId, masterLookupName, itemId, select)
        .map(x => JSON.parse(x))
        .fork(
            err     => commit('addError', err),
            items   => {
                items.map(() => MDAddRow({ commit, state }, { id }))
                loadMasterFieldsList({ commit }, { items, id }).then(() => commit('setLoadingFalse'))
            }
        )
}
