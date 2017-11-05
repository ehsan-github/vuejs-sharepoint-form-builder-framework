// @flow
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import TextField from '../widgets/Text'
import NoteField from '../widgets/TextArea'
import SelectField from '../widgets/Select'
import NumberField from '../widgets/Number'
import DateTimeField from '../widgets/DateTime'
import ChoiceField from '../widgets/Choice'
import BooleanField from '../widgets/Boolean'
import MultiSelectField from '../widgets/MultiSelect'
import MultiChoiceField from '../widgets/MultiChoice'
import CustomSelectField from '../widgets/CustomSelect'
import CustomComputedField from '../widgets/CustomComputed'

export default {
    name: 'MasterDetail',
    components: {
        TextField, NoteField, SelectField, NumberField, DateTimeField,
        ChoiceField, BooleanField, MultiSelectField, MultiChoiceField,
        CustomSelectField, CustomComputedField
    },
    props:  ['fieldId', 'showFields'],
    data () {
        return {
            form: {}
        }
    },
    template: `
<div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
    <div class="el-table__header-wrapper">
        <table class="el-table__header">
            <thead>
                <tr>
                    <th class="button"></th>
                    <th class="radif">ردیف</th>
                    <th class='is-leaf' v-for='f in showingFields' :key='"head"+f.Guid' :class="f.Type">{{f.Title}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(row, r, idx) in showingRows' :class="{'even-row': idx%2==0, 'odd-row': idx%2==1, 'el-table__row': true}">
                    <td>
                        <el-button type="danger" plain v-if="idx != 0" @click='() => delRow(r, idx)'><i class="el-icon-delete"></i></el-button>
                    </td>
                    <td class="radif">{{idx + 1}}</td>
                    <td v-for='f in row' :key='r+f.Guid' :class="f.Type">
                        <div label-position="top">
                            <div :class="{'table-form': true, 'error-box': RamdaPath([idx, f.InternalName],transformedServerErrors) != undefined}" :prop='f.Guid'>
                                <el-tooltip class="item" :disabled="RamdaPath([idx, f.InternalName], transformedServerErrors) == undefined" :content="RamdaPath([idx, f.InternalName], transformedServerErrors)" placement="bottom">
                                <div v-if="f.Type === 'Text'">
                                    <TextField :value='f.value' :name="f.Title+r" :rules="{rules: {required: f.IsRequire, max: f.MaxLength}}" @change='v => change(idx, r, f.Guid, v)'></TextField>
                                </div>
                                <div v-else-if="f.Type === 'Note'">
                                    <NoteField :value='f.value' :name="f.Title+r" :rules="{rules: {required: f.IsRequire}}" @change='v => change(idx, r, f.Guid, v)'></NoteField>
                                </div>
                                <div v-else-if="f.Type === 'Boolean'" :key='f.Guid'>
                                    <BooleanField :value='f.value' @change='v => change(idx, r, f.Guid, v)'></BooleanField>
                                </div>
                                <div v-else-if="f.Type === 'Lookup'">
                                    <SelectField :value='f.value' :options='f.options' :name="f.Title+r" :rules="{rules: {required: f.IsRequire}}" @change='v => change(idx, r, f.Guid, v)'></SelectField>
                                </div>
                                <div v-else-if="f.Type === 'Choice'" :key='f.Guid'>
                                    <ChoiceField :value='f.value' :name="f.Title+r" :rules="{rules: {required: f.IsRequire}}" :options='f.options' @change='v => change(idx, r, f.Guid, v)'></ChoiceField>
                                </div>
                                <div v-else-if="f.Type === 'Number'">
                                    <NumberField :value='f.value' :name="f.Title+r" :rules="{rules: {required: f.IsRequire, min_value: f.MinValue, max_value: f.MaxValue}}" @change='v => change(idx, r, f.Guid, v)'></NumberField>
                                </div>
                                <div v-else-if="f.Type === 'DateTime'">
                                    <DateTimeField :value='f.value' :name="f.Title+r" :rules="{rules: {required: f.IsRequire}}" @change='v => change(idx, r, f.Guid, v)'></DateTimeField>
                                </div>
                                <div v-else-if="f.Type === 'LookupMulti'" :key='f.Guid'>
                                    <MultiSelectField :value='[]' :name="f.Title+r" :rules="{rules: {required: f.IsRequire}}" :options='f.options' @change='v => changeMulti(idx, r, f.Guid, v)'></MultiSelectField>
                                </div>
                                <div v-else-if="f.Type === 'MultiChoice'" :key='f.Guid'>
                                    <MultiChoiceField :value='[]' :name="f.Title+r" :rules="{rules: {required: f.IsRequire}}" :options='f.options' @change='v => changeMulti(idx, r, f.Guid, v)'></MultiChoiceField>
                                </div>
                                <div v-else-if="f.Type === 'CustomComputedField'">
<CustomComputedField :value="f.value"></CustomComputedField>
                                </div>
                                <div v-else-if="f.Type === 'RelatedCustomLookupQuery'">
                                    <CustomSelectField :value='f.value' :name="f.Title+r" :rules="{rules: {required: f.IsRequire}}" :options='f.options' @change='v => change(idx, r, f.Guid, v)'></CustomSelectField>
                                </div>
                                <div v-else>
                                    Not Supported Type: {{f.Type}}
                                </div>
                            </el-tooltip>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <el-button plain type="primary" @click='addRow'><i class="el-icon-plus"></i></el-button>
                    </td>
                </tr>
            </tfoot>
        </table>
    </div>
</div>
    `,
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
            masterFields(state) { return state.fields },
            serverErrors (state) { return state.serverErrors }
        }),
        transformedServerErrors(){ return transformErrors(this.serverErrors) },
        fields() { return this.field.fields || {} },
        rows() { return this.field.rows || [] },
        value() { return this.field.MasterLookupName },
        listOfShowFields() { return this.showFields ? this.showFields.split(',') : [] },
        showingFields() {
            return this.listOfShowFields.length ===  0 ?
                getFilteredView(this.field.RelatedFields || [], R.values(this.fields))
                : R.equals(this.fields, {}) ? {} : getSortedList(this.listOfShowFields, this.fields)
        },
        showingRows() {
            return this.listOfShowFields.length === 0 ?
                R.pipe(
                    R.map(R.values),
                    R.map(getFilteredView(this.field.RelatedFields || []))
                )(this.rows)
                : R.map(getSortedList(this.listOfShowFields), this.rows)
        },
        computedQueries() {
            let computedColumnsRows = R.map(R.filter(R.propEq('Type', 'CustomComputedField')), this.rows)
            return R.mapObjIndexed((obj, rowId) => {
                return R.mapObjIndexed(({ Guid, LookupList, LookupTitleField, Query, AggregationFunction }) => {
                    let requiredValues = transformFieldsList(this.rows[rowId])
                    let query = replaceQueryFields(Query, requiredValues)
                    return { id: Guid, masterId: this.fieldId, rowId, listId: LookupList, query, select: LookupTitleField , func: AggregationFunction }
                }, obj)
            }, computedColumnsRows)
        },
        customSelectQueries() {
            let customLookupRows = R.map(R.filter(R.propEq('Type', 'RelatedCustomLookupQuery')))(this.rows)
            let requiredMasterValues = transformFieldsList(this.masterFields)
            return R.mapObjIndexed((value, rowId) => {
                return R.mapObjIndexed(({ Guid, LookupList, Query }) => {
                    let requiredValues = transformFieldsList(this.rows[rowId])
                    let query0 = replaceQueryFields(Query, requiredValues)
                    let query = replaceQueryMasterFields(query0, requiredMasterValues)
                    return { id: Guid, masterId: this.fieldId, rowId, listId: LookupList, query }
                }, value)
            }, customLookupRows)
        },
    },
    watch: {
        computedQueries: {
            handler: function (computedQueries, old) {
                if (!R.equals(computedQueries, old)){
                    R.mapObjIndexed((val, key) => {
                        if (!R.equals(old[key], val)){
                            R.mapObjIndexed(obj => {
                                if(obj['query'].indexOf('null') === -1){
                                    this.MDLoadComputed(obj)
                                }
                            }, val)
                        }
                    }, computedQueries)
                }
            },
            deep: true
        },
        customSelectQueries: {
            handler: function (newValue, oldValue) {
                if (!R.equals(newValue, oldValue)){
                    R.mapObjIndexed((val, key) => {
                        if (!R.equals(oldValue[key], val)){
                            R.mapObjIndexed(obj => {
                                this.MDLoadFilteredOptions(obj)
                            }, val)
                        }
                    }, newValue)
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions([
            'MDLoadFields',
            'MDChangeFieldRow',
            'MDAddRow',
            'MDDelRow',
            'changeField',
            'MDLoadFilteredOptions',
            'MDLoadComputed',
            'removeServerError'
        ]),
        change (idx, rowId, fieldId, value) {
            this.removeServerError({ row: idx, internalName: this.rows[rowId][fieldId]['InternalName'] })
            this.form[rowId] = R.assoc(this.fieldId, value, this.form[rowId])
            this.MDChangeFieldRow ({ masterId: this.fieldId, rowId , fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        },
        changeMulti (idx, rowId, fieldId, value) {
            this.removeServerError({ row: idx, internalName: this.rows[rowId][fieldId]['InternalName'] })
            this.form[rowId] = R.assoc(this.fieldId, value, this.form[rowId])
            this.MDChangeFieldRow ({ masterId: this.fieldId, rowId , fieldId, value: value.toString() })
            this.$emit('input', value)
            this.$emit('change', value)
        },
        addRow () { this.MDAddRow({ id: this.fieldId }) },
        delRow (rowId, idx) {
            this.$confirm('ردیف '+(idx+1)+'  حذف خواهد شد. می‌خواهید ادامه دهید؟', 'اخطار', {
                confirmButtonText: 'بله',
                cancelButtonText: 'خیر',
                type: 'warning'
            }).then(() => {
                this.$message({
                    type: 'success',
                    message: 'ردیف '+(idx+1)+' با موفقیت حذف گردید'
                })
                this.MDDelRow({ id: this.fieldId, rowId, idx })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'حذف لغو گردید',
                })
            })
        },
        RamdaPath(arr, obj) { return R.path(arr, obj)}
    },
    async mounted () {
        await this.MDLoadFields({ id: this.fieldId, listId: this.field.LookupList })
        this.changeField({ id: this.fieldId, value: this.value })
        this.addRow()
    }
}

// {1: {InternalName: x, value: y}, ...} => {[x]: y, ...}
const transformFieldsList = R.pipe(
    R.values,
    R.reduce((acc, curr) => ({ ...acc, [curr.InternalName]: curr.value }), {})
)

const replaceQueryFields = (query, fields) => R.reduce(
    (q, field) => R.replace('{{'+field+'}}', fields[field], q),
    query,
    R.keys(fields)
)

const replaceQueryMasterFields = (query, fields) => R.reduce(
    (q, field) => R.replace('{{m.'+field+'}}', fields[field], q),
    query,
    R.keys(fields)
)
// we get [x, y, ...] & { id: {"InternalName": y}, ...} => [{"InternalName": x}, {"InternalName": y}]
const getSortedList = R.curry((list, fields) => R.map(x => R.find(R.propEq('InternalName', x), R.values(fields)), list))

const getFilteredView = R.curry((filterList, fields) => R.filter(field => filterList.includes(field.InternalName), fields))

// [{row: x, internalName: y, message: z}] => {'x': {'y': 'z'}}
const transformErrors = errors => R.pipe(
    R.map(R.groupBy(R.prop('InternalName'))),
    R.map(R.pipe(
        R.map(R.head),
        R.map(R.prop('Message'))))
)(R.groupBy(R.prop('RowNumber'), errors))
