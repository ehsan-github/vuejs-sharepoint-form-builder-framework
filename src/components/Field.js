// @flow
import { mapActions, mapState } from 'vuex'

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
        switch (this.field.Type) {
        case 'Text':
            return <TextField ref='field' field={this.field}></TextField>
        case 'Number':
            return <NumberField ref='field' field={this.field}></NumberField>
        case 'Boolean':
            return <BooleanField ref='field' field={this.field}></BooleanField>
        case 'Lookup':
            return <SelectField ref='field' field={this.field} onChange={this.change}></SelectField>
        case 'DateTime':
            return <DateTimeField ref='field' field={this.field}></DateTimeField>
        case 'RelatedCustomLookupQuery':
            return <CustomSelectField ref='field' field={this.field} data={this.data}></CustomSelectField>
        default:
            return <div>Unexpected Type: {this.field.Type}</div>
        }
    },
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        })
    },
    methods: {
        ...mapActions(['changeField']),
        change (value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('change', value)
        }
    }
}
