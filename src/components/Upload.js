// @flow
import { mapActions, mapState } from 'vuex'
import UploadField from '../widgets/Upload'

export default {
    components: { UploadField },
    template: `
        <UploadField
            :value='value'
            :lookupList="lookupList"
            :name="name"
            :types="types"
            :volume="volume"
            :rules="rules"
            @change='change'
            @remove='remove'
            @addToDelete='addToDelete'
            @setValueNull='setValueNull'
        />
    `,
    props: ['fieldId'],
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        }),
        value () { return this.field.value },
        lookupList () { return this.field.LookupList },
        name (){ return this.field.Title },
        types() { return this.field.TypeFile.split(',') },
        volume() { return this.field.VolumeFile * 1000 },
        rules () {
            return {
                rules: {
                    required: this.field.IsRequire,
                }
            }
        }
    },
    methods: {
        ...mapActions(['addToAddFiles', 'removeFromAddFiles', 'addToDeleteFiles', 'changeField']),
        change({ FileName, Title, Content }){
            this.addToAddFiles({ id: this.fieldId, attachment: { InternalName: this.field.InternalName, LookupList: this.field.LookupList, FileName, Title, Content } })
        },
        setValueNull(){
            this.changeField({ id: this.fieldId, value: null })
        },
        remove(){
            this.removeFromAddFiles(this.fieldId)
        },
        addToDelete(FileName){
            this.addToDeleteFiles({ id: this.fieldId, attachment: { FileName, LookupList: this.lookupList, InternalName: this.field.InternalName, Content: '', Title: '' } })
        }
    }
}
