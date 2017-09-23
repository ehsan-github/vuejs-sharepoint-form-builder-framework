// @flow
import { mapActions, mapState } from 'vuex'
import MultiSelectField from '../widgets/MultiSelect'

export default {
    components: { MultiSelectField },
    template: `
        <MultiSelectField :value='value' :options='options' @change='change' />
    `,
    props: ['fieldId' ],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        // value() { return this.field.value},
        value() { return []},
        options() { return this.field.options },
    },
    methods: {
        ...mapActions(['changeField', 'loadOptions']),
        change (value) {
            this.changeField({ id: this.fieldId, value: value.toString() })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.loadOptions({ id: this.fieldId, listId: this.field.LookupList })
    }
}
