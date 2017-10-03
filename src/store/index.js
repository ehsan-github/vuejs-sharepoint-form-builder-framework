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
        errors: [],
        templateName: 'Loading',
        templateStr: ''
    }: StoreType),
    getters: {
        isError: s => s.errors.length > 0,
        firstError: s => s.errors[0],
        filteredFields: s => R.pipe(
            R.reject(R.propEq('InternalName', 'Contract')),
            R.reject(R.propEq('InternalName', 'Title'))
        )(s.fields)
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
            state.fields[id] = { ...state.fields[id], rows: {} }
        },
        MDChangeFieldRow (state, { masterId, rowId, fieldId, value }) {
            let rows = state.fields[masterId].rows
            rows[rowId] = R.assocPath([fieldId, 'value'], value, rows[rowId])
            state.fields = R.assocPath([masterId, 'rows'], rows, state.fields)
        },
        MDAddRow (state, { id, rowId }) {
            const fields = { ...state.fields[id].fields }
            let rows = state.fields[id].rows
            rows[rowId] = fields
            state.fields = R.assocPath([id, 'rows'], rows, state.fields)
        },
        MDDelRow (state, { id, idx }) {
            let rows = R.dissoc(idx, state.fields[id].rows)
            state.fields = R.assocPath([id, 'rows'], rows, state.fields)
        },
        MDLoadOptions (state, { id, masterId, rowId, options }) {
            if (R.prop(rowId, state.fields[masterId].rows)) {
                let rows = state.fields[masterId].rows
                rows[rowId] = R.assocPath([id, 'options'], options, rows[rowId])
                state.fields = R.assocPath([masterId, 'rows'], rows, state.fields)
            }
        },
        addError (state, error) {
            state.errors.push(error)
        },
        removeError (state, error) {
            state.errors = R.reject(R.equals(error), state.errors)
        },
        loadContractSpec (state, specs) {
            state.contractSpecs = specs
        },
        loadTemplateMetaData(state, { templateName, template }){
            state.templateName = templateName
            state.templateStr = template
        }
    },
    actions
})

export default store
