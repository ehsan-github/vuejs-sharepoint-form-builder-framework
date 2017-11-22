    // @flow
    import { mapActions, mapState } from 'vuex'
    import R from 'ramda'
    import DetailField from './DetailField'
    import { replaceQueryFields, replaceQueryMasterFields } from './functions'

    export default {
        components: { DetailField },
        props: ['masterId', 'row', 'id', 'idx', 'serverErrors', 'options'],
        template: `
            <tr :class="[{'even-row': idx%2==0, 'odd-row': idx%2==1}, 'el-table__row']" :key="id">
                <td>
                    <el-button type="danger" plain @click='() => delRow(id, idx)'><i class="el-icon-delete"></i></el-button>
                </td>
                <td class="radif">{{idx + 1}}</td>
                <td v-for='f in row' :key='id+f.Guid' :class="f.Type">
                    <div label-position="top">
                        <div :class="['table-form', {'error-box': serverErrors ? serverErrors[f.InternalName] != undefined : false}]">
                            <el-tooltip class="item" :disabled="serverErrors?serverErrors[f.InternalName] == undefined : true" :content="serverErrors ? serverErrors[f.InternalName] : null" placement="bottom">
                                <DetailField :field="f" :rowId="id" :onStoreOptions="options[f.Guid]" @change="v => change(idx, id, f.Guid, v)" @changeMulti="v => changeMulti(idx, id, f.Guid, v)"/>
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
            computedQueries() {
                let computedColumns = R.filter(R.propEq('Type', 'CustomComputedField'), this.row)
                return R.map(({ Guid, LookupList, LookupTitleField, Query, AggregationFunction }) => {
                    let query = replaceQueryFields(Query, this.row)
                    return { id: Guid, masterId: this.masterId, rowId: this.id, listId: LookupList, query, select: LookupTitleField , func: AggregationFunction }
                }, computedColumns)
            },
            customSelectQueries() {
                let customLookup= R.filter(R.propEq('Type', 'RelatedCustomLookupQuery'), this.row)
                return R.map(({ Guid, LookupList, Query }) => {
                    let query0 = replaceQueryFields(Query, this.row)
                    let query = replaceQueryMasterFields(query0, this.masterFields)
                    return { id: Guid, masterId: this.masterId, rowId: this.id, listId: LookupList, query }
                }, customLookup )
            },
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
            }
        },
        methods: {
            ...mapActions(['MDChangeFieldRow', 'MDLoadFilteredOptions', 'MDLoadComputed', 'removeServerError']),
            change (idx, rowId, fieldId, value) {
                this.removeServerError({ row: idx, internalName: this.row[idx]['InternalName'] })
                this.MDChangeFieldRow ({ masterId: this.masterId, rowId , fieldId, value })
            },
            changeMulti (idx, rowId, fieldId, value) {
                this.removeServerError({ row: idx, internalName: this.row[idx]['InternalName'] })
                this.MDChangeFieldRow ({ masterId: this.masterId, rowId , fieldId, value: value.toString() })
            },
            delRow (rowId, idx) {
                this.$emit('delRow', rowId, idx)
            },
            loadCustomSelects(){
                R.map(
                  obj => { this.MDLoadFilteredOptions(obj) }, this.customSelectQueries)
            },
            loadComputeds(){
                R.map(
                  obj => { this.MDLoadFilteredOptions(obj) },
                   this.computedQueries)
            },
        },
        mounted(){
            this.loadCustomSelects()
            this.loadComputeds()
        }
    }
