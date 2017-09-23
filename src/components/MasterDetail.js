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

export default {
    name: 'MasterDetail',
    components: { TextField, NoteField, SelectField, NumberField, DateTimeField, ChoiceField, BooleanField, MultiSelectField, MultiChoiceField },
    props:  ['fieldId'],
    data () {
        return {
            form: {}
        }
    },
    template: `
        <table class="el-table__header">
            <thead>
                <tr>
                    <th></th>
                    <th class='is-leaf' v-for='f in fields' :key='f.Guid'>{{f.Title}}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for='(row, r) in rows'>
                    <td>
                        <el-button v-if="r != 0" @click='() => delRow(r)'>Delete Row</el-button>
                    </td>
                    <td v-for='(f, idx) in row' :key='r+idx'>
                        <El-form @submit.prevent ref='form[r]' :model='form[r]' label-position="top">
                            <el-form-item class='table-form' :prop='idx'>
                                <div v-if="f.Type === 'Text'">
                                    <TextField :value='f.value' :name="f.Title" :rules="{rules: {required: f.IsRequire}}" @change='v => change(r, idx, v)'></TextField>
                                </div>
                                <div v-else-if="f.Type === 'Note'">
                                    <NoteField :value='f.value' @change='v => change(r, idx, v)'></NoteField>
                                </div>
                                <div v-else-if="f.Type === 'Boolean'" :key='idx'>
                                    <BooleanField :value='f.value' @change='v => change(r, idx, v)'></BooleanField>
                                </div>
                                <div v-else-if="f.Type === 'Lookup'">
                                    <SelectField :value='f.value' :options='options[idx]' @change='v => change(r, idx, v)'></SelectField>
                                </div>
                                <div v-else-if="f.Type === 'Choice'" :key='idx'>
                                    <ChoiceField :value='f.value' :options='options[idx]' @change='v => change(r, idx, v)'></ChoiceField>
                                </div>
                                <div v-else-if="f.Type === 'Number'">
                                    <NumberField :value='f.value' :name="f.Title" :rules="{rules: {between: [f.MinValue, f.MaxValue]}}" @change='v => change(r, idx, v)'></NumberField>
                                </div>
                                <div v-else-if="f.Type === 'DateTime'">
                                    <DateTimeField :value='f.value' @change='v => change(r, idx, v)'></DateTimeField>
                                </div>
                                <div v-else-if="f.Type === 'LookupMulti'" :key='idx'>
                                    <MultiSelectField :value='f.value' :options='options[idx]' @change='v => change(r, idx, v)'></MultiSelectField>
                                </div>
                                <div v-else-if="f.Type === 'MultiChoice'" :key='idx'>
                                    <MultiChoiceField :value='f.value' :options='options[idx]' @change='v => change(r, idx, v)'></MultiChoiceField>
                                </div>
                                <div v-else-if="f.Type === 'CustomComputedField'">
                                    <el-input :disabled="true" :value="f.value"></el-input>
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
                        <el-button @click='addRow'>Add Row</el-button>
                    </td>
                </tr>
            </tfoot>
        </table>
    `,
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
        }),
        fields() { return this.field.fields || {} },
        rows() { return this.field.rows },
        options() { return this.field.options },
        value() { return this.field.MasterLookupName },
        computedValues() {},
        computedQueries() {
            let computedRows = R.map(R.filter(R.propEq('Type', 'CustomComputedField')))(this.rows)
            return Object.keys(computedRows).map(rowId => {
                return R.map(({ Query }) => {
                    let requiredValues = transformFieldsList(this.rows[rowId])
                    let query = replaceQueryFields(Query, requiredValues)
                    return query
                }, computedRows[rowId])
            })
        },
        customSelectQueries() {},
        customSelectOptions() { /* */ },
    },
    methods: {
        ...mapActions([
            'MDLoadFields',
            'MDChangeFieldRow',
            'MDAddRow',
            'MDDelRow',
            'changeField',
            'MDLoadAllOptions',
            'MDLoadComputed'
        ]),
        change (rowId, fieldId, value) {
            this.form[rowId] = R.assoc(this.fieldId, value, this.form[rowId])
            this.MDChangeFieldRow ({ masterId: this.fieldId, rowId , fieldId, value })
            this.updateComputed(rowId)
            this.$emit('input', value)
            this.$emit('change', value)
        },
        addRow () { this.MDAddRow({ id: this.fieldId }) },
        delRow (idx) { this.MDDelRow({ id: this.fieldId, idx }) },
        updateComputed (rowId) {
            let computedRow = R.filter(R.propEq('Type', 'CustomComputedField'))(this.rows[rowId])
            R.map(({ Guid, LookupList, LookupTitleField, Query, AggregationFunction }) => {
                let requiredValues = transformFieldsList(this.rows[rowId])
                let query = replaceQueryFields(Query, requiredValues)
                query.indexOf('null') === -1
                    ? this.MDLoadComputed ({ id: Guid, masterId: this.fieldId, rowId, listId: LookupList, query, select: LookupTitleField , func: AggregationFunction })
                : null
            }, computedRow)
        }
    },
    async mounted () {
        this.changeField({ id: this.fieldId, value: this.value })
        await this.MDLoadFields({ id: this.fieldId, relatedFields: this.field.RelatedFields, listId: this.field.LookupList })
        this.MDLoadAllOptions({ masterId: this.fieldId })
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
