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
        serverErrors: [],
        templateName: 'Loading',
        templateStr: ''
    }: StoreType),
    getters: {
        isError: s => s.errors.length > 0,
        firstError: s => s.errors[0],
        serverHasNotError: s => s.serverErrors.length == 0,
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
        MDDelRow (state, { id, rowId, idx }) {
            let rows = R.dissoc(rowId, state.fields[id].rows)
            state.fields = R.assocPath([id, 'rows'], rows, state.fields)
            state.serverErrors = R.pipe(       // fixing serverErrors state on row deletion
                R.reject(R.propEq('row', idx)),
                R.map(R.ifElse(
                    R.propSatisfies(R.lt(idx), 'row'),
                    R.over(R.lensProp('row'), R.dec),
                    R.identity))
            )(state.serverErrors)
        },
        MDLoadOptions (state, { id, masterId, rowId, options }) {
            if (R.prop(rowId, state.fields[masterId].rows)) {
                let rows = state.fields[masterId].rows
                rows[rowId] = R.assocPath([id, 'options'], options, rows[rowId])
                rows[rowId] = R.assocPath([id, 'values'], null, rows[rowId])
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
        },
        removeServerError(state, { row, internalName }){
            state.serverErrors = R.reject(
                R.where({
                    RowNumber: R.equals(row),
                    InternalName: R.equals(internalName)
                }), state.serverErrors)
        },
        loadServerErrors(state, errors){
            state.serverErrors = errors
        }
    },
    actions
})

export default store
