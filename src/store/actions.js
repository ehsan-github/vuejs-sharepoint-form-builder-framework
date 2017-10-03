// @flow
import R from 'ramda'
import uuidv1 from 'uuid/v1'

import { getFieldsList, getItems, getFilteredItems, getContractSpec, saveFieldItems, getTemplate } from '../api'

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

const setContractValue = (value, items) => {
    let id = getFieldId('Contract', items)
    let newItems = R.assocPath([id, 'value'], value, items)
    return newItems
}

export function loadFields ({ commit, state }) {
    return new Promise((resolve, reject) => {
        getFieldsList(state.listId)
            .map(R.map(assignValue))
            .map(transformFieldsList)
            .map(R.reject(R.propEq ('Type', 'Counter')))
            .map(items => setContractValue(state.contractId, items))
            .fork(
                err => {
                    commit('addError', err)
                    reject(err)
                },
                res => {
                    commit('loadFields', res)
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

const filterList = (relatedFields, f) => relatedFields.includes(f.InternalName)

export function MDLoadFields ({ commit }, { id, relatedFields, listId } ) {
    return new Promise((resolve, reject) => {
        getFieldsList(listId)
            .map(R.map(assignValue))
            .map(transformFieldsList)
            .map(R.filter(f => filterList(relatedFields, f)))
            .fork(
                err => {
                    commit('addError', err);
                    reject(err);
                },
                fields => {
                    commit('MDLoadFields', { id, fields })
                    resolve(fields)
                }
            )
    })
}

export function MDChangeFieldRow ({ commit }, payload) {
    commit('MDChangeFieldRow', payload)
}

export function MDLoadOptions ({ commit }, { id, masterId, rowId, listId }) {
    return getItems(listId)
        .fork(
            err     => commit('addError', err),
            options => commit('MDLoadOptions', { id, masterId, rowId, options })
        )
}

export function MDLoadAllRowOptions ({ commit, state }, { masterId, rowId } ) {
    R.pipe (R.filter(R.propEq('Type', 'Lookup')), R.mapObjIndexed(
        (v, k) =>
            MDLoadOptions({ commit },
                          { id: k, masterId, rowId, listId: v.LookupList })
    ))(state.fields[masterId].fields)
}

export function MDLoadFilteredOptions ({ commit }, { id, masterId, rowId, listId, query }) {
    return getFilteredItems(listId, query)
        .fork(
            err     => commit('addError', err),
            options => commit('MDLoadOptions', { id, masterId, rowId, options })
        )
}

export function MDAddRow ({ commit }, { id }) {
    return new Promise(resolve => {
        let rowId = uuidv1()
        commit('MDAddRow', { id, rowId })
        resolve(rowId)
    })
}

export function MDDelRow ({ commit }, { id, idx }) {
    commit('MDDelRow', { id, idx })
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

const transFormFields= R.pipe(
    R.values,
    R.project(['InternalName', 'Type', 'value', 'rows', 'LookupList']),
    R.map(R.map(f => f == null ? '' : f)), // remove null values
    R.map(f => f.rows == '' ? R.assoc('rows', [], f) : f) // replace rows null value with empty array
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
        saveFieldItems(state.listId, data)
            .fork(
                err  => {
                    commit('addError', err)
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
    return getTemplate('EB9C37D1-FC44-458E-BADF-AB61DCCC004A', state.listId)
        .map(R.head)
        .fork(
            err  => commit('addError', err),
            succ => {
                let fields = transformFields(state.fields)
                let firstTemplate = replaceTemplateStr(succ.tamplate, fields)
                let secondTemplate = firstTemplate.replace(
                        /{{(\w+)(:[^}]+)?}}/,
                    (s, fname, fields) => {
                        return `<Field fieldId='{{${fname}}}' class="${fname}" showFields="${fields.substr(1).split(',')}" ></Field>`
                    }
                )
                let template = replaceNameWithId(secondTemplate, fields)
                console.log(template)
                commit('loadTemplateMetaData', { templateName: succ.tamplateName, template })
            }
        )
}

const transformFields= R.pipe(
    R.values,
    R.reduce((acc, curr) => ({
        ...acc,
        [curr.InternalName]: { 'id': curr.Guid, 'title': curr.Title }
    }), {})
)

const replaceTemplateStr = (str, fields) => R.reduce(
    (q, field) => R.replace(
        '{{'+field+'}}',
        `<span>${fields[field].title}</span>
        <Field fieldId="${fields[field].id}" class="${field}" ></Field>`,
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
