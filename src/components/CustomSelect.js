// @flow
import { mapActions, mapState } from 'vuex'
import CustomSelect from '../widgets/CustomSelect'

export default {
    components: { CustomSelect },
    template: `
        <CustomSelect :value='value' :options='options' @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value() { return this.field.value },
        options() { return this.field.options },
        related () {
            const relatedFields = this.field.RelatedFields
            let relatedData = {}
            for (let relatedField of relatedFields) {
                relatedData[relatedField] = (this.data || {})[relatedField]
            }
            return relatedData
        }
    },
    methods: {
        ...mapActions(['changeField', 'loadOptions']),
        change(value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.loadOptions({ id: this.fieldId, listId: this.field.LookupList, query: this.field.Query })
    }
}
