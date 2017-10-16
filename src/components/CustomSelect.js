// @flow
import { mapActions, mapState } from 'vuex'
import CustomSelect from '../widgets/CustomSelect'

export default {
    components: { CustomSelect },
    template: `
        <CustomSelect :value='value' :options='options' :name="name" :rules="rules" @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value() { return this.field.value },
        options() { return this.field.options },
        name (){ return this.field.Title },
        rules () {
            return {
                rules: {
                    required: this.field.IsRequire
                }
            }
        },
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
        ...mapActions(['changeField', 'loadFilteredOptions']),
        change(value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.loadFilteredOptions({ id: this.fieldId, listId: this.field.LookupList, query: this.field.Query })
    }
}
