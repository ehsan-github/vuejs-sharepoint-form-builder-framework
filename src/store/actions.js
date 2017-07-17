// @flow
import R from 'ramda'
import { Future } from 'ramda-fantasy'
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

const lookupOptionsAssigner = listId => field =>
    getItems(listId).map(R.assoc('options', R.__, field))
const fetchExtra = listId => R.cond([
    [R.propEq('Type', 'Lookup'), lookupOptionsAssigner(listId)],
    [R.T, Future.of]
])
const loadDependencies = listId => R.traverse(Future.of, fetchExtra(listId))

export function loadFields ({ commit, state }) {
    return getFieldsList(state.listId)
        .map(R.map(assignValue))
        .chain(loadDependencies(state.listId))
        .map(transformFieldsList)
        .fork(
            err => commit('addError', err),
            result => commit('loadFields', result)
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
