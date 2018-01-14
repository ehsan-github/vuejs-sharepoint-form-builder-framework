// @flow
import { mapActions, mapState } from 'vuex'
import UploadField from '../widgets/Upload'

export default {
    components: { UploadField },
    template: `
        <UploadField :value='value' :lookupList="lookupList" :name="name" :rules="rules" @change='change' @remove='remove' @addToDelete="addToDelete"/>
    `,
    props: ['fieldId'],
    data(){
        return {
            uploadedValue: null
        }
    },
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
        ...mapActions(['addToAddFiles', 'removeFromAddFiles', 'addToDeleteFiles']),
        change({ FileName, Title, Content }){
            this.addToAddFiles({ id: this.fieldId, attachment: { InternalName: this.field.InternalName, LookupList: this.field.LookupList, FileName, Title, Content } })
        },
        remove(){
            this.removeFromAddFiles(this.fieldId)
        },
        addToDelete(FileName){
            this.addToDeleteFiles({ FileName, LookupList: this.lookupList, InternalName: this.field.InternalName, Content: '', Title: '' })
        }
    }
}
