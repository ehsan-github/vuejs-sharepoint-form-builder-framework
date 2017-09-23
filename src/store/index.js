// @flow
import Vue from 'vue'
import Vuex from 'vuex'
import R from 'ramda'

import * as actions from './actions'

Vue.use(Vuex)

/*::
type StoreType = {}
*/

const store = new Vuex.Store({
    state: ({
        loading: true,
        listId: new URLSearchParams(location.search).get('List'),
        contractId: new URLSearchParams(location.search).get('Cid'),
        contractSpecs: {},
        fields: {},
        errors: []
    }: StoreType),
    getters: {
        isError: s => s.errors.length > 0,
        firstError: s => s.errors[0]
    },
    mutations: {
        loadFields (state, fields) {
            state.fields = fields
            state.loading = false
        },
        loadOptions (state, { id, options }) {
            state.fields[id] = { ...state.fields[id], options }
        },
        changeField (state, { id, value }) {
            state.fields = R.assocPath([id, 'value'], value, state.fields)
        },
        MDLoadFields (state, { id, fields }) {
            state.fields[id] = { ...state.fields[id], fields }
            state.fields[id] = { ...state.fields[id], rows: [] }
            state.fields[id] = { ...state.fields[id], options: {} }
        },
        MDChangeFieldRow (state, { masterId, rowId, fieldId, value }) {
            state.fields[masterId].rows[rowId] = R.assocPath([fieldId, 'value'], value, state.fields[masterId].rows[rowId])
        },
        MDAddRow (state, { id }) {
            let fields = state.fields[id].fields
            state.fields[id].rows.push(fields)
        },
        MDDelRow (state, { id, idx }) {
            let rows = R.remove(idx, 1, state.fields[id].rows)
            state.fields = R.assocPath([id, 'rows'], rows, state.fields)
        },
        MDLoadOptions (state, { id, masterId, options }) {
            state.fields[masterId].options[id] = options
        },
        addError (state, error) {
            state.errors.push(error)
        },
        removeError (state, error) {
            state.errors = R.reject(R.equals(error), state.errors)
        },
        loadContractSpec (state, specs) {
            state.contractSpecs = specs
        }
    },
    actions
})

export default store
