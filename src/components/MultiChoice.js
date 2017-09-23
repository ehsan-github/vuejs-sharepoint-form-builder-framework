// @flow
import { mapActions, mapState } from 'vuex'
import MultiChoiceField from '../widgets/MultiChoice'

export default {
    components: { MultiChoiceField },
    template: `
        <MultiChoiceField :value='value' :options='options' @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        // value() { return this.field.value},
        value() { return [] },
        options() { return this.field.options },
    },
    methods: {
        ...mapActions(['changeField']),
        change (value) {
            this.changeField({ id: this.fieldId, value: value.toString() })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
