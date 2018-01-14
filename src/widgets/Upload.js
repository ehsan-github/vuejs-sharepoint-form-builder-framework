// @flow
import { mapActions } from 'vuex'
import { loadUploadedFile } from '../api'
import jQuery from 'jquery'
import uuidv1 from 'uuid/v1'
import R from 'ramda'

export default {
    inject: ['$validator'],
    template: `
        <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            name="ctl00$PlaceHolderMain$UploadDocumentSection$ctl05$InputFile"
            :on-change="change"
            :on-remove="remove"
            :auto-upload=false
            :uploadFiles="fileList"
            :file-list="fileList"
            :on-preview="handlePreview"
        >
            <el-button size="small" type="primary">Click to upload</el-button>
        </el-upload>
    `,
    props: ['value', 'rules', 'name', 'lookupList'],
    data() {
        return {
            fileList: []
        }
    },
    mounted(){
        if (this.value) {
            loadUploadedFile(this.lookupList, this.value)
                .map(R.head)
                .fork(
                    ()   => {},
                    succ => {
                        let saveName = R.last(succ.EncodedAbsUrl.split(['/']))
                        this.fileList = [{ name: succ.Title, url: succ.EncodedAbsUrl, saveName }]
                    }
                )
        }
    },
    computed: {
        hasError() { return this.$validator.errors.has(this.name) },
        firstError() { return this.$validator.errors.first(this.name) }
    },
    methods: {
        ...mapActions(['addError']),
        change(file) {
            let [ oldFile ] = this.fileList
            if (oldFile.saveName){
                this.$emit('addToDelete', oldFile.saveName)
            }

            this.fileList = []
            let getFile = getFileBuffer(file.raw);
            let Title = file.name
            let fileExtention = R.last(Title.split('.'))
            let FileName = uuidv1() + '.' + fileExtention
            getFile
                .then(arrayBuffer => {
                    let Content = arrayBuffer.split('base64,')[1]
                    this.fileList = [{ name: Title, url: '' }]
                    this.$emit('change', { FileName, Title, Content })
                })
        },
        remove() {
            let [ oldFile ] = this.fileList
            if (oldFile.saveName){
                this.$emit('addToDelete', oldFile.saveName)
            }

            this.$refs.upload.clearFiles()
            this.$emit('remove')
        },
        handlePreview(file){
            if (file.url != ''){
                window.open(file.url,'_blank');
            }
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
    reader.readAsDataURL(data);
    return deferred.promise();
}
