// @flow
import { mapState } from 'vuex'

import TextField from './Text'
import NumberField from './Number'
import BooleanField from './Boolean'
import SelectField from './Select'
import CustomSelectField from './CustomSelect'
import DateTimeField from './DateTime'

export default {
    components: { TextField, NumberField, BooleanField, SelectField, CustomSelectField, DateTimeField },
    props: ['fieldId'],
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
        case 'DateTime':
            return <DateTimeField fieldId={this.fieldId} onChange={this.change}></DateTimeField>
        case 'RelatedCustomLookupQuery':
            return <CustomSelectField fieldId={this.fieldId} onChange={this.change}></CustomSelectField>
        default:
            return <div>Unexpected Type: {this.fieldType}</div>
        }
    },
    computed: {
        ...mapState({
            fieldType(state) { return state.fields[this.fieldId].Type }
        })
    },
    methods: {
        change (value) {
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
