// @flow
import { getFieldsList } from '../api'
import type { FieldType } from '../api/type'

export function loadFields ({ commit, state }) {
    getFieldsList(state.listId).fork(
        err => commit('addError', err),
        (result: FieldType) => commit('loadFields', result)
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
