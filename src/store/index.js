// @flow
import Vue from 'vue'
import Vuex from 'vuex'
import R from 'ramda'

import * as actions from './actions'
import { urlParam } from '../functions'

Vue.use(Vuex)

/*::
type StoreType = {}
*/

const store = new Vuex.Store({
    state: ({
        loading: true,
        listId: urlParam('List'),
        itemId: urlParam('ID'),
        contentTypeId: urlParam('ContentTypeId') || '',
        dContentTypeId: urlParam('dContentTypeId') || '',
        listData: {},
        fields: {},
        addFiles: {},
        deleteFiles: {},
        histories: [],
        errors: [],
        serverErrors: [],
        deletedItems: [],
        templateName: 'Loading',
        columnsNum: 2,
        templateStr: ''
    }: StoreType),
    getters: {
        isError: s => s.errors.length > 0,
        firstError: s => s.errors[0],
        serverHasNotError: s => s.serverErrors.length == 0,
        filteredFields: s => R.pipe(
            R.reject(R.propEq('InternalName', 'ID')),
        )(s.fields),
        isThereDetails: s => R.pipe(R.values,
                                    R.filter(R.propEq('Type', 'MasterDetail')),
                                    R.isEmpty,
                                    R.not)(s.fields),
        detailsHasAtLeastOneRow: s => {
            if (s.isThereDetails) {
                return R.pipe(
                    R.values,
                    R.filter(R.propEq('Type', 'MasterDetail')),
                    R.head,
                    R.ifElse(R.both(R.prop('rows'), R.prop('IsRequire')), R.identity, R.assocPath(['rows', 'value', 'fakeVal'], 0)),           // If we don't show MasterDetail field or it is not required we generate fake value for rows
                    R.prop('rows'),
                    R.values,
                    R.isEmpty,
                    R.not
                )(s.fields)
            } else {
                return true
            }
        },
        requiredFilesFilled: s => {
            let requiredFiles = R.pipe(
                R.filter(
                    R.both(
                        R.propEq('Type', 'File'),
                        R.propEq('IsRequire', true))),
                R.keys)(s.fields)
            return requiredFiles.every(x => R.or(
                R.has(x, s.addFiles),
                s.fields[x].value != null
            ))
        }
    },
    mutations: {
        loadFields (state, fields) {
            state.fields = fields
        },
        setListData (state, listData){
            state.listData = listData
        },
        loadOptions (state, { id, options }) {
            state.fields[id] = { ...state.fields[id], options }
        },
        changeField (state, { id, value }) {
            state.fields = R.assocPath([id, 'value'], value, state.fields)
        },
        setFieldValue(state, { InternalName, value }) {
            let id = getFieldId(InternalName, state.fields)
            value = R.head(value.split(';#'))
            value = isNaN(value) || value == '' ? value : Number(value)
            if (value == 'True') value = true
            id ? state.fields = R.assocPath([id, 'value'], value, state.fields) : null
        },
        MDLoadFields (state, { id, fields }) {
            state.fields[id] = { ...state.fields[id], fields }
            state.fields[id] = { ...state.fields[id], rows: {}, options: {} }
        },
        MDChangeFieldRow (state, { masterId, rowId, fieldId, value }) {
            state.fields = R.assocPath([masterId, 'rows', rowId, fieldId, 'value'], value, state.fields)
        },
        MDSetFieldRow (state, { masterId, rowIndex, InternalName, value }) {
            let fieldId = getFieldId(InternalName, state.fields[masterId].fields)
            let rowId = R.keys(state.fields[masterId].rows)[rowIndex]
            let fieldType = state.fields[masterId].rows[rowId][fieldId]['Type']
            if (fieldType == 'LookupMulti') {
                value = R.pipe(
                    R.filter(x => Number(x)),
                    R.map(x => Number(x))
                )(value.split(';#'))
            } else {
                value = R.head(value.split(';#'))
                value = isNaN(value) || value == '' ? value : Number(value)
            }
            if (value == 'True') value = true
            if (fieldId && value) {
                state.fields[masterId].rows[rowId] = R.assocPath([fieldId, 'value'], value, state.fields[masterId].rows[rowId])
            }
        },
        MDAddRow (state, { id, rowId }) {
            const fields = { ...state.fields[id].fields }
            state.fields = R.assocPath([id, 'rows', rowId], fields, state.fields)
        },
        MDDelRow (state, { id, rowId, idx }) {
            let ItemId = R.pipe(
                R.values,
                R.find(R.propEq('InternalName', 'ID')),
                R.prop('value')
            )(state.fields[id].rows[rowId])
            if (!R.isNil(ItemId)) {
                state.deletedItems = R.append({ ListId: state.fields[id].LookupList, ItemId }, state.deletedItems)
            }

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
                state.fields = R.assocPath([masterId, 'rows', rowId, id, 'options'], options, state.fields)
            }
        },
        MDLoadLookupOptions (state, { id, masterId, options }) {
            state.fields = R.assocPath([masterId, 'options', id], options, state.fields)
        },
        addError (state, error) {
            state.errors.push(error)
        },
        removeError (state, error) {
            state.errors = R.reject(R.equals(error), state.errors)
        },
        loadTemplateMetaData(state, { templateName, template, columnsNum }){
            state.templateName = templateName
            state.templateStr = template
            state.columnsNum = columnsNum
        },
        removeServerError(state, { row, internalName }){
            let relatedFields = R.pipe(
                R.filter(
                    R.where({
                        RowNumber: R.equals(row),
                        InternalName: R.equals(internalName)
                    })),
                R.head,
                R.prop('RelatedFields')
            )(state.serverErrors)
            state.serverErrors = R.reduce(
                (errors, fieldName) => R.reject(
                    R.where({
                        RowNumber: R.equals(row),
                        InternalName: R.equals(fieldName)
                    }),
                    errors
                ),
                state.serverErrors,
                relatedFields
            )
        },
        loadServerErrors(state, errors){
            state.serverErrors = errors
        },
        setLoadingFalse(state){
            state.loading = false
        },
        setLoadingTrue(state){
            state.loading = true
        },
        loadHistories(state, histories){
            state.histories = histories
        },
        addToAddFiles(state, { id, attachment }){
            state.addFiles = R.assoc(id, attachment, state.addFiles)
        },
        removeFromAddFiles(state, id){
            state.addFiles = R.dissoc(id, state.addFiles)
        },
        addToDeleteFiles(state, { id, attachment }){
            state.deleteFiles = R.assoc(id, attachment, state.deleteFiles)
        }
    },
    actions
})

const getFieldId = (InternalName, fields) => R.pipe( //find the key of first item with this internalName
    R.filter(R.propEq('InternalName', InternalName)),
    R.keys,
    R.head
)(fields)

export default store
