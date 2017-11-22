// @flow
import { mapActions, mapState } from 'vuex'
import CustomComputedField from '../widgets/CustomComputed'
import { replaceQueryFields } from './MasterDetail/functions'

export default {
    components: { CustomComputedField },
    template: `
        <CustomComputedField :value='value' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
            fields(state) { return state.fields }
        }),
        value () { return this.field.value },
        query () { return replaceQueryFields(this.field.Query, this.fields) }
    },
    watch : {
        query: {
            handler: function (query, old) {
                if (query != old){
                    this.loadComputed({ id: this.fieldId, listId: this.field.LookupList, query , select: this.field.LookupTitleField, func: this.field.AggregationFunction })
                }
            }
        }
    },
    methods: {
        ...mapActions(['loadComputed'])
    }
}
