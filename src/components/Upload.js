// @flow
import { mapActions, mapState } from 'vuex'
import UploadField from '../widgets/Upload'

export default {
    components: { UploadField },
    template: `
        <UploadField :value='value' :lookupList="lookupList" :name="name" :rules="rules" @change='change' />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value () { return this.field.value },
        lookupList () { return this.field.LookupList },
        name (){ return this.field.Title },
        rules () {
            return {
                rules: {
                    required: this.field.IsRequire,
                }
            }
        }
    },
    methods: {
        ...mapActions(['changeField', 'addError']),
        change(value) {
            this.changeField({ id: this.fieldId, value })
        }
    }
}
