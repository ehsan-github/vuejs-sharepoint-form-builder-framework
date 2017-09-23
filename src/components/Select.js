// @flow
import { mapActions, mapState } from 'vuex'
import SelectField from '../widgets/Select'

export default {
    components: { SelectField },
    template: `
        <SelectField :value='value' :options='options' @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value() { return this.field.value },
        options() { return this.field.options },
    },
    methods: {
        ...mapActions(['changeField', 'loadOptions']),
        change (value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.loadOptions({ id: this.fieldId, listId: this.field.LookupList })
    }
}
