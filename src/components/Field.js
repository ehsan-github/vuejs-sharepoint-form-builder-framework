import TextField from './Text'
import NumberField from './Number'
import BooleanField from './Boolean'
import SelectField from './Select'
// import CustomSelectField from './CustomSelect'

export default {
    components: { TextField, NumberField, BooleanField, SelectField },
    props: ['field', 'data'],
    render () {
        switch (this.field.TypeAsString) {
        case 'Text':
            return <TextField ref="field" field={this.field}></TextField>
        case 'Number':
            return <NumberField ref="field" field={this.field}></NumberField>
        case 'Boolean':
            return <BooleanField ref="field" field={this.field}></BooleanField>
        case 'Lookup':
            return <SelectField ref="field" field={this.field} options={this.options}></SelectField>
        // case 'CustomLookup':
        //     return <CustomSelectField ref="field" field={this.field} options={this.options} data={this.data}></CustomSelectField>
        default:
           throw new Error(`Unexpected Type: ${this.field.TypeAsString}`)
        }
    },
    computed: {
        value () {
            return this.field.TypeAsString === 'Lookup'
            ? {[`${this.field.InternalName}Id`]: this.$refs.field.value}
            : {[this.field.InternalName]: this.$refs.field.value}
            // return {[this.field.InternalName]: this.$refs.field.value}
        }
    }
}
