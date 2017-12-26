// @flow
import { mapState } from 'vuex'

import TextField from './Text'
import TextAreaField from './TextArea'
import NumberField from './Number'
import SelectField from './Select'
import CustomSelectField from './CustomSelect'
import DateTimeField from './DateTime'
import BooleanField from './Boolean'
import MasterDetail from './MasterDetail'
import MultiSelectField from './MultiSelect'
import ChoiceField from './Choice'
import MultiChoiceField from './MultiChoice'
import CustomComputedField from './CustomComputed'

export default {
    components: { TextField, TextAreaField, NumberField, BooleanField, SelectField, CustomSelectField, DateTimeField, MasterDetail, ChoiceField, MultiChoiceField },
    props: ['fieldId', 'showFields', 'headers'],
    render () {
        switch (this.fieldType) {
        case 'Text':
            return <TextField fieldId={this.fieldId} onChange={this.change}></TextField>
        case 'Number':
            return <NumberField fieldId={this.fieldId} onChange={this.change}></NumberField>
        case 'Boolean':
            return <BooleanField fieldId={this.fieldId} onChange={this.change}></BooleanField>
        case 'Lookup':
            return <SelectField fieldId={this.fieldId} onChange={this.change}></SelectField>
        case 'LookupMulti':
            return <MultiSelectField fieldId={this.fieldId} onChange={this.change}></MultiSelectField>
        case 'DateTime':
            return <DateTimeField fieldId={this.fieldId} onChange={this.change}></DateTimeField>
        case 'RelatedCustomLookupQuery':
            return <CustomSelectField fieldId={this.fieldId} multiple={false} onChange={this.change}></CustomSelectField>
        case 'MasterDetail':
            return <MasterDetail fieldId={this.fieldId} onChange={this.change} showFields={this.showFields} headers={this.headers}></MasterDetail>
        case 'Choice':
            return <ChoiceField fieldId={this.fieldId} onChange={this.change}></ChoiceField>
        case 'MultiChoice':
            return <MultiChoiceField fieldId={this.fieldId} onChange={this.change}></MultiChoiceField>
        case 'Note':
            return <TextAreaField fieldId={this.fieldId} onChange={this.change}></TextAreaField>
        case 'CustomComputedField':
            return <CustomComputedField fieldId={this.fieldId} />
        default:
            return <div>Unexpected Type: {this.fieldType}</div>
        }
    },
    computed: {
        ...mapState({
            fieldType (state) { return state.fields[this.fieldId].Type }
        })
    },
    methods: {
        change (value) {
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
