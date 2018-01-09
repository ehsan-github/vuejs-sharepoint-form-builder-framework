// @flow
import { mapActions } from 'vuex'
import { uploadFile, getListItem, updateListItem, deleteListItem, loadUploadedFile } from '../api'
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
        >
            <el-button size="small" type="primary">Click to upload</el-button>
        </el-upload>
    `,
    props: ['value', 'rules', 'name', 'lookupList'],
    data() {
        return {
            fileList: [],
            uri: '',
            itemMetadata: {}
        }
    },
    mounted(){
        if (this.value) {
            loadUploadedFile(this.lookupList, this.value)
                .map(R.head)
                .fork(
                    ()   => {},
                    succ => {
                        this.fileList = [{ name: succ.Title, url: succ.EncodedAbsUrl }]
                        this.uri = `/_api/Web/GetFileByServerRelativeUrl('${succ.EncodedAbsUrl.replace(/^.*\/\/[^\/]+/, '')}')`
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
            this.remove()
            this.fileList = []
            let getFile = getFileBuffer(file.raw);
            let fileName = file.name
            let fileExtention = R.last(fileName.split('.'))
            let saveName = uuidv1() + '.' + fileExtention
            getFile
                .then(arrayBuffer => {
                    this.uploadFieldFile(arrayBuffer, fileName, saveName, this.lookupList)
                })
        },
        remove() {
            this.$refs.upload.clearFiles()
            deleteListItem(this.uri, this.itemMetadata)
                .fork(
                    err  => this.addError(err),
                    () => {}
                )
        },
        uploadFieldFile(arrayBuffer, fileName, saveName, lookupList){
            uploadFile(lookupList, arrayBuffer, saveName)
                .fork(
                    err  => this.addError(err),
                    file => {
                        this.fileList = [{ name: fileName, url: file.__metadata.uri }]
                        this.uri= file.__metadata.uri
                        this.itemMetadata = file.__metadata
                        getListItem(file.ListItemAllFields.__deferred.uri)
                            .fork(
                                err  => this.addError(err),
                                listItem => {
                                    this.$emit('change', listItem.Id)
                                    updateListItem(listItem.__metadata, saveName, fileName)
                                        .fork(
                                            err  => this.addError(err),
                                            () => {}
                                        )
                                }
                            )
                    }
                )
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
