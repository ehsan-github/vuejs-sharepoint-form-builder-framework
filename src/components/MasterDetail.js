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
    props:  ['fieldId'],
    data () {
        return {
            form: {}
        }
    },
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
        }),
        fields() { return this.field.fields || {} },
        rows() { return this.field.rows },
        options() { return this.field.options },
        value() { return this.field.MasterLookupName }
    },
    methods: {
        ...mapActions([
            'MDLoadFields',
            'MDChangeFieldRow',
            'MDAddRow',
            'MDDelRow',
            'MDLoadOptions',
            'changeField'
        ]),
        change (rowId, fieldId, value) {
            this.form[rowId] = R.assoc(this.fieldId, value, this.form[rowId])
            this.MDChangeFieldRow ({ masterId: this.fieldId, rowId , fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        },
        addRow () { this.MDAddRow({ id: this.fieldId }) },
        delRow (idx) { this.MDDelRow({ id: this.fieldId, idx }) },
        loadOptions () {
            let keys = R.keys(R.filter(isLookup, this.fields))
            keys.map((fieldId) => {
                this.MDLoadOptions({ id: fieldId, masterId: this.fieldId, listId: this.fields[fieldId].LookupList })
            })
        }
    },
    mounted () {
        this.changeField({ id: this.fieldId, value: this.value })
        this.MDLoadFields({ id: this.fieldId, relatedFields: this.field.RelatedFields, listId: this.field.LookupList })
    },
    updated () {
        // TODO: place loadOptions in the right lifecycle method
        this.loadOptions()
    }
}

function isLookup (x) { return x.Type == 'Lookup' }
