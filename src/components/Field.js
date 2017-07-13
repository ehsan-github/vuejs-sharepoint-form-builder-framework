import TextField from './Text'
import NumberField from './Number'
import BooleanField from './Boolean'
import SelectField from './Select'
import CustomSelectField from './CustomSelect'
import DateTimeField from './DateTime'

export default {
    components: { TextField, NumberField, BooleanField, SelectField, CustomSelectField, DateTimeField },
    props: ['field', 'data'],
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
      //  case 'MD':
       //     return <SelectField ref="field" field={this.field}></SelectField>
        case 'RelatedCustomLookupQuery':
            return <CustomSelectField ref='field' field={this.field} data={this.data}></CustomSelectField>
        default:
            // throw new Error(`Unexpected Type: ${this.field.Type}`)
            console.log(`Unexpected Type: ${this.field.Type}`)
        }
    },
    computed: {
        value () {
            return this.field.Type === 'Lookup'
            ? { [`${this.field.InternalName}Id`]: this.$refs.field.value }
            : { [this.field.InternalName]: this.$refs.field.value }
        }
    },
    methods: {
        change (val) {
            this.$emit('change', this.value)
        }
    }
}
