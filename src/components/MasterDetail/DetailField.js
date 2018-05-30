// @flow
import R from 'ramda'
import TextField from '../../widgets/Text'
import NoteField from '../../widgets/TextArea'
import SelectField from '../../widgets/Select'
import NumberField from '../../widgets/Number'
import DateTimeField from '../../widgets/DateTime'
import ChoiceField from '../../widgets/Choice'
import BooleanField from '../../widgets/Boolean'
import MultiSelectField from '../../widgets/MultiSelect'
import MultiChoiceField from '../../widgets/MultiChoice'
import CustomSelectField from '../../widgets/CustomSelect'
import CustomMultiSelectField from '../../widgets/CustomMultiSelect'
import CustomComputedField from '../../widgets/CustomComputed'
import TimeField from '../../widgets/TimePicker'

export default {
    components: {
        TextField, NoteField, SelectField, NumberField, DateTimeField,
        ChoiceField, BooleanField, MultiSelectField, MultiChoiceField,
        CustomSelectField, CustomMultiSelectField, CustomComputedField, TimeField
    },
    render () {
        switch (this.fieldType) {
        case 'Text':
            return <TextField value={this.value} name={this.name} rules={this.rules} onChange={this.change} />
        case 'Note':
            return <NoteField value={this.value} name={this.name} rules={this.rules} onChange={this.change} />
        case 'Number':
            return <NumberField value={this.value} name={this.name} rules={this.rules} onChange={this.change} />
        case 'Boolean':
            return <BooleanField value={this.value} onChange={this.change} />
        case 'Lookup':
            return <SelectField value={this.value} options={this.onStoreOptions} name={this.name} rules={this.rules} onChange={this.change} />
        case 'LookupMulti':
            return <MultiSelectField value={this.value} options={this.onStoreOptions} name={this.name} rules={this.rules} onChange={this.changeMulti} />
        case 'DateTime':
            return <DateTimeField value={this.value} name={this.name} rules={this.rules} onChange={this.change} />
        case 'RelatedCustomLookupQuery':
            return <CustomSelectField value={this.value} options={this.onFieldOptions} name={this.name} rules={this.rules} onChange={this.change} />
        case 'CustomMultiSelect':
            return <CustomMultiSelectField value={this.value} options={this.onFieldOptions} name={this.name} rules={this.rules} onChange={this.changeMulti}></CustomMultiSelectField>
        case 'Choice':
            return <ChoiceField value={this.value} options={this.onFieldOptions} name={this.name} rules={this.rules} onChange={this.change} />
        case 'MultiChoice':
            return <MultiChoiceField value={this.value} options={this.onFieldOptions} name={this.name} rules={this.rules} onChange={this.changeMulti} />
        case 'CustomComputedField':
            return <CustomComputedField value={this.value} />
        case 'ComputedText':
            return <CustomComputedField value={this.value} />
        case 'Time':
            return <TimeField value={this.value} name={this.name} rules={this.rules} onChange={this.change} />
        default:
            return <div> Unxp T {this.fieldType}</div>
        }
    },
    props: [
        'field',
        'rowId',
        'idx',
        'index',
        'onStoreOptions'
    ],
    computed: {
        fieldId() { return this.field.Guid },
        fieldType() {
            let Type = this.field.Type
            if (Type == 'Text' && this.field.DefaultValue != null ){ //TODO needs checking for {{}} sign
                return 'ComputedText'
            }
            if (Type == 'Text' && this.field.MaxLength == 254){
                return 'Time'
            }
            if (Type == 'RelatedCustomLookupQuery' && this.field.AllowMultipleValue){
                return 'CustomMultiSelect'
            }
            return Type
        },
        value() { return this.field.value },
        name() { return this.field.Title + this.rowId },
        onFieldOptions() { return this.field.options },
        rules() {
            let rules = { rules: {
                required: this.field.IsRequire
            } }
            if (this.fieldType == 'Text') {
                rules = R.assocPath(['rules', 'max'], this.field.MaxLength, rules)
            }
            if (this.fieldType == 'Number') {
                rules = R.assocPath(['rules', 'min_value'], this.field.MinValue, rules)
                rules = R.assocPath(['rules', 'max_value'], this.field.MaxValue, rules)
            }
            return rules
        },
    },
    methods: {
        change (value) {
            this.$emit(
                    'change', {
                        value,
                        multi: false,
                        fieldId: this.field.Guid,
                        idx: this.idx,
                        rowId: this.rowId,
                        index: this.index
                    })
        },
        changeMulti (value) {
            this.$emit(
                'change', {
                    value,
                    multi: true,
                    fieldId: this.field.Guid,
                    idx: this.idx,
                    rowId: this.rowId,
                    index: this.index
                })
        }
    }
}
