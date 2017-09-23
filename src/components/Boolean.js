// @flow
import { mapActions, mapState } from 'vuex'
import Boolean from '../widgets/Boolean'

export default {
    components: { Boolean },
    template: `
        <Boolean :value='value' @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value() { return this.field.value }
    },
    methods: {
        ...mapActions(['changeField']),
        change(value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
