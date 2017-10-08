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

export default {
    name: 'MasterDetail',
    components: {
        TextField, NoteField, SelectField, NumberField, DateTimeField,
        ChoiceField, BooleanField, MultiSelectField, MultiChoiceField,
        CustomSelectField
    },
    props:  ['fieldId', 'showFields'],
    data () {
        return {
            form: {}
        }
    },
    template: `
        <table class="el-table__header">
            <thead>
                <tr>
                    <th class="button"></th>
                    <th class="radif">ردیف</th>
                    <th class='is-leaf' v-for='f in showingFields' :key='f.Guid' :class="f.Type">{{f.Title}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(row, r, idx) in showingRows'>
                    <td>
                        <el-button class="red button" v-if="r != 0" @click='() => delRow(r)'>حذف ردیف</el-button>
                    </td>
                    <td class="radif">{{idx + 1}}</td>
                    <td v-for='f in row' :key='r+f.Guid' :class="f.Type">
                        <El-form @submit.prevent ref='form[r]' :model='form[r]' label-position="top">
                            <el-form-item class='table-form' :prop='f.Guid'>
                                <div v-if="f.Type === 'Text'">
                                    <TextField :value='f.value' :name="f.Title" :rules="{rules: {required: f.IsRequire}}" @change='v => change(r, f.Guid, v)'></TextField>
                                </div>
                                <div v-else-if="f.Type === 'Note'">
                                    <NoteField :value='f.value' @change='v => change(r, f.Guid, v)'></NoteField>
                                </div>
                                <div v-else-if="f.Type === 'Boolean'" :key='f.Guid'>
                                    <BooleanField :value='f.value' @change='v => change(r, f.Guid, v)'></BooleanField>
                                </div>
                                <div v-else-if="f.Type === 'Lookup'">
                                    <SelectField :value='f.value' :options='f.options' @change='v => change(r, f.Guid, v)'></SelectField>
                                </div>
                                <div v-else-if="f.Type === 'Choice'" :key='f.Guid'>
                                    <ChoiceField :value='f.value' :options='f.options' @change='v => change(r, f.Guid, v)'></ChoiceField>
                                </div>
                                <div v-else-if="f.Type === 'Number'">
                                    <NumberField :value='f.value' :name="f.Title" :rules="{rules: {between: [f.MinValue, f.MaxValue]}}" @change='v => change(r, f.Guid, v)'></NumberField>
                                </div>
                                <div v-else-if="f.Type === 'DateTime'">
                                    <DateTimeField :value='f.value' @change='v => change(r, f.Guid, v)'></DateTimeField>
                                </div>
                                <div v-else-if="f.Type === 'LookupMulti'" :key='f.Guid'>
                                    <MultiSelectField :value='f.value' :options='f.options' @change='v => change(r, f.Guid, v)'></MultiSelectField>
                                </div>
                                <div v-else-if="f.Type === 'MultiChoice'" :key='f.Guid'>
                                    <MultiChoiceField :value='f.value' :options='f.options' @change='v => change(r, f.Guid, v)'></MultiChoiceField>
                                </div>
                                <div v-else-if="f.Type === 'CustomComputedField'">
                                    <el-input :disabled="true" :value="f.value"></el-input>
                                </div>
                                <div v-else-if="f.Type === 'RelatedCustomLookupQuery'">
                                    <CustomSelectField :value='f.value' :options='f.options' @change='v => change(r, f.Guid, v)'></CustomSelectField>
                                </div>
                                <div v-else>
                                    Not Supported Type: {{f.Type}}
                                </div>
                            </el-form-item>
                        </el-form>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <el-button class="green button" @click='addRow'>ردیف جدید</el-button>
                    </td>
                </tr>
            </tfoot>
        </table>
    `,
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
            masterFields(state) { return state.fields }
        }),
        fields() { return this.field.fields || {} },
        rows() { return this.field.rows || [] },
        value() { return this.field.MasterLookupName },
        listOfShowFields(){ return this.showFields ? this.showFields.split(',') : [] },
        showingFields(){
            return this.listOfShowFields.length ===  0 ?
                R.values(this.fields)
                : R.equals(this.fields, {}) ? {} : getSortedList(this.listOfShowFields, this.fields)
        },
        showingRows(){
            return this.listOfShowFields.length === 0 ?
                R.map(R.values, this.rows)
                : R.map(getSortedList(this.listOfShowFields), this.rows)
        },
        computedValues() {},
        computedQueries() {
            let computedRows = R.map(R.filter(R.propEq('Type', 'CustomComputedField')))(this.rows)
            return R.mapObjIndexed((value, rowId) => {
                return R.mapObjIndexed(({ Guid, LookupList, LookupTitleField, Query, AggregationFunction }) => {
                    let requiredValues = transformFieldsList(this.rows[rowId])
                    let query = replaceQueryFields(Query, requiredValues)
                    return { id: Guid, masterId: this.fieldId, rowId, listId: LookupList, query, select: LookupTitleField , func: AggregationFunction }
                }, value)
            }, computedRows)
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
        customSelectOptions() { /* */ },
    },
    watch: {
        computedQueries:{
            handler: function (newValue, oldValue) {
                if (!R.equals(newValue, oldValue)){
                    R.mapObjIndexed((val, key) => {
                        if (!R.equals(oldValue[key], val)){
                            R.mapObjIndexed(obj => {
                                if(obj['query'].indexOf('null') === -1){
                                    this.MDLoadComputed(obj)
                                }
                            }, val)
                        }
                    }, newValue)
                }
            },
            deep: true
        },
        customSelectQueries:{
            handler: function (newValue, oldValue) {
                if (!R.equals(newValue, oldValue)){
                    R.mapObjIndexed((val, key) => {
                        if (!R.equals(oldValue[key], val)){
                            R.mapObjIndexed(obj => {
                                if(obj['query'].indexOf('null') === -1){
                                    this.MDLoadFilteredOptions(obj)
                                }
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
            'MDLoadComputed'
        ]),
        change (rowId, fieldId, value) {
            this.form[rowId] = R.assoc(this.fieldId, value, this.form[rowId])
            this.MDChangeFieldRow ({ masterId: this.fieldId, rowId , fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        },
        addRow () { this.MDAddRow({ id: this.fieldId }) },
        delRow (idx) { this.MDDelRow({ id: this.fieldId, idx }) },
    },
    async mounted () {
        await this.MDLoadFields({ id: this.fieldId, relatedFields: this.field.RelatedFields, listId: this.field.LookupList })
        this.changeField({ id: this.fieldId, value: this.value })
        this.addRow()
    },
    updated(){
        // console.log()
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
