// @flow
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import DetailField from './DetailField'
import { replaceQueryFields, replaceQueryMasterFields } from '../../functions'
import { getSortedList, getFilteredView } from '../../functions'

export default {
    components: { DetailField },
    props: ['relatedFields', 'listOfShowFields', 'masterId', 'row', 'id', 'idx', 'serverErrors', 'options'],
    template: `
            <tr :class="[{'even-row': idx%2==0, 'odd-row': idx%2==1}, 'el-table__row']" :key="id">
                <td class="button">
                    <el-button type="danger" plain @click='delRow(id, idx)'><i class="el-icon-delete"></i></el-button>
                </td>
                <td class="radif"><div>{{idx + 1}}</div></td>
                <td v-for='(f, index) in showingRow' :key='id+f.Guid' :class="f.Type">
                    <div label-position="top">
                        <div :class="['table-form', {'error-box': serverErrors ? serverErrors[f.InternalName] != undefined : false}]">
                            <el-tooltip class="item" :disabled="serverErrors?serverErrors[f.InternalName] == undefined : true" :content="serverErrors ? serverErrors[f.InternalName] : null" placement="bottom">
                                <DetailField :field="f" :rowId="id" :idx="idx" :index="index" :onStoreOptions="options[f.Guid] || []" @change="change" :class="f.InternalName"/>
                            </el-tooltip>
                        </div>
                    </div>
                </td>
            </tr>
        `,
    computed :{
        ...mapState({
            masterFields(state) { return state.fields },
        }),
        showingRow() {
            if (this.listOfShowFields.length === 0) {
                return R.pipe(
                    R.values,
                    getFilteredView(this.relatedFields)
                )(this.row)
            } else {
                return getSortedList(this.listOfShowFields)(this.row)
            }
        },
        computedQueries() {
            let computedColumns = R.filter(R.propEq('Type', 'CustomComputedField'), this.showingRow)
            return R.map(({ Guid, LookupList, LookupTitleField, Query, AggregationFunction }) => {
                let query = R.pipe(
                    replaceQueryFields(this.showingRow),
                    replaceQueryMasterFields(this.masterFields)
                )(Query)
                return { id: Guid, masterId: this.masterId, rowId: this.id, listId: LookupList, query, select: LookupTitleField , func: AggregationFunction }
            }, computedColumns)
        },
        customSelectQueries() {
            let customLookup= R.filter(R.propEq('Type', 'RelatedCustomLookupQuery'), this.showingRow)
            return R.map(({ Guid, LookupList, Query }) => {
                let query = R.pipe(
                    replaceQueryFields(this.showingRow),
                    replaceQueryMasterFields(this.masterFields)
                )(Query)
                return { id: Guid, masterId: this.masterId, rowId: this.id, listId: LookupList, query }
            }, customLookup )
        },
        computedText() {
            let computedText = R.filter(
                R.both(
                    R.propEq('Type', 'Text'),
                    f => f.DefaultValue != null
                ),
                this.showingRow)
            return R.map(({ Guid, DefaultValue }) => {
                let query = R.pipe(
                    replaceQueryFields(this.showingRow),
                    replaceQueryMasterFields(this.masterFields)
                )(DefaultValue)
                return { fieldId: Guid, masterId: this.masterId, rowId: this.id, value: eval(query) }
            }, computedText )
        }
    },
    watch: {
        computedQueries: {
            handler: function (computedQueries, old) {
                if (!R.equals(computedQueries, old)){
                    R.map((obj, id) => { if(!R.equals(obj, old[id])){ this.MDLoadComputed(obj) } }, computedQueries)
                }
            },
            deep: true
        },
        customSelectQueries: {
            handler: function (customSelectQueries, oldValue) {
                if (!R.equals(customSelectQueries, oldValue)){
                    R.map((obj, id) => { if (!R.equals(obj, oldValue[id])) this.MDLoadFilteredOptions(obj) }, customSelectQueries)
                }
            },
            deep: true
        },
        computedText: {
            handler: function (computedText, oldValue) {
                if (!R.equals(computedText, oldValue)){
                    R.map((obj, id) => { if (!R.equals(obj, oldValue[id])) this.MDChangeFieldRow(obj) }, computedText)
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(['MDChangeFieldRow', 'MDLoadFilteredOptions', 'MDLoadComputed', 'removeServerError']),
        change ({ value, multi, idx, rowId, index, fieldId }) {
            if (multi) value = value.toString()
            if (this.serverErrors && this.serverErrors[this.showingRow[index]['InternalName']]) {
                this.removeServerError({ row: idx, internalName: this.showingRow[index]['InternalName'] })
            }
            this.MDChangeFieldRow ({ masterId: this.masterId, rowId , fieldId, value })
        },
        delRow (rowId, idx) {
            this.$emit('delRow', rowId, idx)
        },
        loadCustomSelects(){
            R.map(
                obj => { this.MDLoadFilteredOptions(obj) },
                this.customSelectQueries)
        },
        loadComputeds(){
            R.map(
                obj => { this.MDLoadComputed(obj) },
                this.computedQueries)
        },
        evaluateComputedTexts(){
            R.map(
                obj => { this.MDChangeFieldRow(obj) },
                this.computedText)
        }
    },
    mounted(){
        this.loadCustomSelects()
        this.loadComputeds()
        this.evaluateComputedTexts()
    }
}
