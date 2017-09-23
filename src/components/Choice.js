// @flow
import { mapActions, mapState } from 'vuex'
import ChoiceField from '../widgets/Choice'

export default {
    components: { ChoiceField },
    template: `
        <ChoiceField :value='value' :options='options' @change='change' />
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
        ...mapActions(['changeField']),
        change (value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
