// @flow
import { mapActions, mapState } from 'vuex'
import jQuery from 'jquery'
import uuidv1 from 'uuid/v1'
import UploadField from '../widgets/Upload'
import R from 'ramda'

export default {
    components: { UploadField },
    template: `
        <UploadField :value='value' :name="name" :rules="rules" @change='change' />
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
                    required: this.field.IsRequire,
                }
            }
        }
    },
    methods: {
        ...mapActions(['changeField', 'uploadFieldFile']),
        change(value) {
            let getFile = getFileBuffer(value.raw);
            let fileName = value.name
            let fileExtention = R.last(fileName.split('.'))
            let saveName = uuidv1() + '.' + fileExtention
            getFile
                .then(arrayBuffer => this.uploadFieldFile({ arrayBuffer, id: this.fieldId, fileName, saveName, lookupList: this.field.LookupList } ))

            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}

const getFileBuffer = data => {
    var deferred = jQuery.Deferred();
    var reader = new FileReader();
    reader.onloadend = function (e) {
        deferred.resolve(e.target.result);
    }
    reader.onerror = function (e) {
        deferred.reject(e.target.error);
    }
    reader.readAsArrayBuffer(data);
    return deferred.promise();
}
