// @flow
import { mapActions, mapState } from 'vuex'
import Number from '../widgets/Number'

export default {
    components: { Number },
    template: `
        <Number :value='value' @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value () { return this.field.value }
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
