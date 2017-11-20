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
    components: {
        TextField, NoteField, SelectField, NumberField, DateTimeField,
        ChoiceField, BooleanField, MultiSelectField, MultiChoiceField,
        CustomSelectField, CustomComputedField
    },
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
                            <div v-if="f.Type === 'Text'">
                                <TextField :value='f.value' :name="f.Title+id" :rules="{rules: {required: f.IsRequire, max: f.MaxLength}}" @change='v => change(idx, id, f.Guid, v)'></TextField>
                            </div>
                            <div v-else-if="f.Type === 'Note'">
                                <NoteField :value='f.value' :name="f.Title+id" :rules="{rules: {required: f.IsRequire}}" @change='v => change(idx, id, f.Guid, v)'></NoteField>
                            </div>
                            <div v-else-if="f.Type === 'Boolean'" :key='f.Guid'>
                                <BooleanField :value='f.value' @change='v => change(idx, id, f.Guid, v)'></BooleanField>
                            </div>
                            <div v-else-if="f.Type === 'Lookup'">
                                <SelectField :value='f.value' :options='options[f.Guid]' :name="f.Title+id" :rules="{rules: {required: f.IsRequire}}" @change='v => change(idx, id, f.Guid, v)'></SelectField>
                            </div>
                            <div v-else-if="f.Type === 'Choice'" :key='f.Guid'>
                                <ChoiceField :value='f.value' :name="f.Title+id" :rules="{rules: {required: f.IsRequire}}" :options='f.options' @change='v => change(idx, id, f.Guid, v)'></ChoiceField>
                            </div>
                            <div v-else-if="f.Type === 'Number'">
                                <NumberField :value='f.value' :name="f.Title+id" :rules="{rules: {required: f.IsRequire, min_value: f.MinValue, max_value: f.MaxValue}}" @change='v => change(idx, id, f.Guid, v)'></NumberField>
                            </div>
                            <div v-else-if="f.Type === 'DateTime'">
                                <DateTimeField :value='f.value' :name="f.Title+id" :rules="{rules: {required: f.IsRequire}}" @change='v => change(idx, id, f.Guid, v)'></DateTimeField>
                            </div>
                            <div v-else-if="f.Type === 'LookupMulti'" :key='f.Guid'>
                                <MultiSelectField :value='[]' :name="f.Title+id" :rules="{rules: {required: f.IsRequire}}" :options='options[f.Guid]' @change='v => changeMulti(idx, id, f.Guid, v)'></MultiSelectField>
                            </div>
                            <div v-else-if="f.Type === 'MultiChoice'" :key='f.Guid'>
                                <MultiChoiceField :value='[]' :name="f.Title+id" :rules="{rules: {required: f.IsRequire}}" :options='f.options' @change='v => changeMulti(idx, id, f.Guid, v)'></MultiChoiceField>
                            </div>
                            <div v-else-if="f.Type === 'CustomComputedField'">
        <CustomComputedField :value="f.value"></CustomComputedField>
                            </div>
                            <div v-else-if="f.Type === 'RelatedCustomLookupQuery'">
                                <CustomSelectField :value='f.value' :name="f.Title+id" :rules="{rules: {required: f.IsRequire}}" :options='f.options' @change='v => change(idx, id, f.Guid, v)'></CustomSelectField>
                            </div>
                            <div v-else>
                                Not Supported Type: {{f.Type}}
                            </div>
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
                    R.map(obj => {
                        if(obj['query'].indexOf('null') === -1){
                            this.MDLoadComputed(obj)
                        }
                    }, computedQueries)
                }
            },
            deep: true
        },
        customSelectQueries: {
            handler: function (newValue, oldValue) {
                if (!R.equals(newValue, oldValue)){
                    R.map((obj, id) => {
                        if (!R.equals(obj, oldValue[id]))
                            this.MDLoadFilteredOptions(obj)
                    }, newValue)
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions([
            'MDChangeFieldRow',
            'MDLoadFilteredOptions',
            'MDLoadComputed',
            'removeServerError'
        ]),
        change (idx, rowId, fieldId, value) {
            this.removeServerError({ row: idx, internalName: this.row[idx]['InternalName'] })
            this.MDChangeFieldRow ({ masterId: this.masterId, rowId , fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        },
        changeMulti (idx, rowId, fieldId, value) {
            this.removeServerError({ row: idx, internalName: this.row[idx]['InternalName'] })
            this.MDChangeFieldRow ({ masterId: this.masterId, rowId , fieldId, value: value.toString() })
            this.$emit('input', value)
            this.$emit('change', value)
        },
        delRow (rowId, idx) {
            this.$emit('delRow', rowId, idx)
        },
        loadCustomSelects(){
            R.map(obj => { this.MDLoadFilteredOptions(obj) }, this.customSelectQueries)
        },
        loadComputeds(){
            R.map(obj => { this.MDLoadFilteredOptions(obj) }, this.computedQueries)
        },
    },
    mounted(){
        this.loadCustomSelects()
        this.loadComputeds()
    }
}

const replaceQueryFields = (query, fields) => R.reduce(
    (q, field) => R.replace('{{'+field.InternalName+'}}', field.value, q),
    query,
    R.values(fields)
)

const replaceQueryMasterFields = (query, fields) => R.reduce(
    (q, field) => R.replace('{{m.'+field.InternalName+'}}', field.value, q),
    query,
    R.values(fields)
)
