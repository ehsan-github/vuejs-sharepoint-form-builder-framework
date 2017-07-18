// @flow
import R from 'ramda'
import { getFieldsList, getItems } from '../api'

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

export function loadFields ({ commit, state }) {
    return getFieldsList(state.listId)
        .map(R.map(assignValue))
        .map(transformFieldsList)
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

export function saveData (/*{ state }*/) {
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

export function changeField({ commit }, payload) {
    commit('changeField', payload)
}
