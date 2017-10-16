// @flow
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import CustomSelect from '../widgets/CustomSelect'

export default {
    components: { CustomSelect },
    template: `
        <CustomSelect :value='value' :options='options' :name="name" :rules="rules" @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
            masterFields(state) { return state.fields }
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
        query() {
            const requiredValues = transformFieldsList(this.masterFields)
            const query = replaceQueryFields(this.field.Query, requiredValues)
            return query
        }
    },
    watch: {
        query: function (query){
            this.loadFilteredOptions({ id: this.fieldId, listId: this.field.LookupList, query })
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
        this.loadFilteredOptions({ id: this.fieldId, listId: this.field.LookupList, query: this.query })
    }
}

// {1: {InternalName: x, value: y}, ...} => {[x]: y, ...}
const transformFieldsList = R.pipe(
    R.values,
    R.reduce((acc, curr) => ({ ...acc, [curr.InternalName]: curr.value }), {})
)

const replaceQueryFields = (query, fields) => R.reduce(
    (q, field) => R.replace('{{'+field+'}}', fields[field], q),
    query,
    R.keys(fields)
)
