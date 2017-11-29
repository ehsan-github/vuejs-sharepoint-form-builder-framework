// @flow
import { mapActions, mapState } from 'vuex'
import Number from '../widgets/Number'

export default {
    components: { Number },
    template: `
        <Number :value='value' :name="name" :rules='rules' @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value () { return this.field.value },
        name (){ return this.field.Title },
        rules () {
            return {
                rules: {
                    max_value: this.field.MaxValue,
                    min_value: this.field.MinValue,
                    between: [this.field.MinValue, this.field.MaxValue],
                    required: this.field.IsRequire
                }
            }
        }
    },
    methods: {
        ...mapActions(['changeField']),
        change (value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('change', value)
        }
    }
}
