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
import CustomComputedField from '../../widgets/CustomComputed'

export default {
    components: {
        TextField, NoteField, SelectField, NumberField, DateTimeField,
        ChoiceField, BooleanField, MultiSelectField, MultiChoiceField,
        CustomSelectField, CustomComputedField
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
        case 'Choice':
            return <ChoiceField value={this.value} options={this.onFieldOptions} name={this.name} rules={this.rules} onChange={this.change} />
        case 'MultiChoice':
            return <MultiChoiceField value={this.value} options={this.onFieldOptions} name={this.name} rules={this.rules} onChange={this.changeMulti} />
        case 'CustomComputedField':
            return <CustomComputedField value={this.value} />
        default:
            return <div> Unxp T {this.fieldType}</div>
        }
    },
    props: ['field', 'rowId', 'onStoreOptions'],
    computed: {
        fieldId() { return this.field.Guid },
        fieldType() { return this.field.Type },
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
            this.$emit('change', { value, multi: false })
        },
        changeMulti (value) {
            this.$emit('change', { value, multi: true })
        }
    }
}
