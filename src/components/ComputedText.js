// @flow
import { mapActions, mapState } from 'vuex'
import ComputedText from '../widgets/CustomComputed'
import { replaceQueryFields } from '../functions'

export default {
    components: { ComputedText },
    template: `
        <ComputedText :value='value' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
            fields(state) { return state.fields }
        }),
        value () { return this.field.value },
        defaultValue () { return replaceQueryFields(this.fields)(this.field.DefaultValue) }
    },
    watch : {
        defaultValue: {
            handler: function (defVal, old) {
                if (defVal != old){
                    this.changeField({ id: this.fieldId, value: eval(defVal) })
                }
            }
        }
    },
    methods: {
        ...mapActions(['changeField'])
    },
    mounted(){
        this.changeField({ id: this.fieldId, value: eval(this.defaultValue) })
    }
}
