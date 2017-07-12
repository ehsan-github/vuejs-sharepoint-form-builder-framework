import { getFieldsList } from '../api'

export function loadFields ({commit, state}) {
    getFieldsList(state.listId).fork(
        err => commit('addError', err),
        result => commit('loadFields', result)
    )
}

export function saveData ({state}) {
}
