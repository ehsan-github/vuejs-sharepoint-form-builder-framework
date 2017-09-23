// @flow
import { mapActions, mapState } from 'vuex'
import TextField from '../widgets/Text'

export default {
    components: { TextField },
    template: `
        <TextField :value='value' @change='change' />
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
        change(value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
}
