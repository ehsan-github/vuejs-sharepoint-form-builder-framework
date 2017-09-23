// @flow
import R from 'ramda'
import { getFieldsList, getItems, getFilteredItems, getContractSpec, saveFieldItems } from '../api'

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

const isIDType = R.propEq('Type', 'Counter')

export function loadFields ({ commit, state }) {
    return getFieldsList(state.listId)
        .map(R.map(assignValue))
        .map(transformFieldsList)
        .map(R.reject(isIDType))
        .fork(
            err => commit('addError', err),
            res => commit('loadFields', res)
        )
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
    return getFieldsList(listId)
        .map(R.map(assignValue))
        .map(transformFieldsList)
        .map(R.filter(f => filterList(relatedFields, f)))
        .fork(
            err => commit('addError', err),
            fields => {
                commit('MDLoadFields', { id, fields })
                commit('MDAddRow', { id })
            }
        )
}

export function MDChangeFieldRow ({ commit }, payload) {
    commit('MDChangeFieldRow', payload)
}

export function MDLoadOptions ({ commit }, { id, masterId, listId }) {
    return getItems(listId)
        .fork(
            err     => commit('addError', err),
            options => commit('MDLoadOptions', { id, masterId, options })
        )
}

export function MDAddRow ({ commit }, { id }) {
    commit('MDAddRow', { id })
}

export function MDDelRow ({ commit }, { id, idx }) {
    commit('MDDelRow', { id, idx })
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
        field => R.assoc('rows', (R.map(transFormFields, field.rows)), field),
        R.identity
    )
)

const transFormForSave = R.pipe(
        transFormFields,
        transFormRows
)

export function saveData ({ commit, state }) {
    let data = transFormForSave(state.fields)
    return saveFieldItems(state.listId, data)
        .fork(
            err  => commit('addError', err),
            succ => alert('Data was successfuly saved'+succ)
        )
    // .then(r => {
    //     this.$notify.success({
    //         title: 'موفقیت',
    //         message: 'داده ها با موفقیت زخیره شد'
    //     })
    // }).catch(e => {
    //     this.$notify.error({
    //         title: 'خطا',
    //         message: 'در هنگام زخیره خطایی رخ داده است'
    //     })
    // })
}

export function removeError ({ commit }, error) {
    commit('removeError', error)
}
