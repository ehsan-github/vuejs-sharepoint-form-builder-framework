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
            :file-list="fileList"
            :on-preview="handlePreview"
            :multiple="false"
            :thumbnail-mode="true"
        >
            <el-button size="small" type="primary" >Click to upload</el-button>
            <div v-if='volume > 0 || types[0] != ""' slot="tip" class="el-upload__tip">فایل های {{types.join('/')}} {{volumeMessage}} </div>
        </el-upload>
    `,
    props: [
        'value',
        'rules',
        'name',
        'lookupList',
        'types',
        'volume'
    ],
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
        firstError() { return this.$validator.errors.first(this.name) },
        volumeMessage() { return this.volume == 0 ? '' : `با حجم کمتر از ${this.volume/1000}kb` }
    },
    methods: {
        ...mapActions(['addError']),
        change(file) {
            let [ oldFile ] = this.fileList
            if (oldFile && oldFile.saveName){
                this.$emit('addToDelete', oldFile.saveName)
            }
            this.fileList = []

            let getFile = getFileBuffer(file.raw)
            let Title = file.name
            let fileExtention = R.last(Title.split('.'))
            let FileName = uuidv1() + '.' + fileExtention
            if (!typeCheck(fileExtention, this.types)){
                this.addError(`فقط فرمت های ${this.types.join('/')} قابل قبول می باشد`)
            }
            if (!volumeCheck(file.size, this.volume)) {
                this.addError(`حجم فایل باید کمتر از ${this.volume/1000}kb باشد`)
            }
            if (typeCheck(fileExtention, this.types) && volumeCheck(file.size, this.volume)) {
                getFile
                    .then(arrayBuffer => {
                        let Content = arrayBuffer.split('base64,')[1]
                        this.fileList = [{ name: Title, url: '' }]
                        this.$emit('change', { FileName, Title, Content })
                    })
            }
        },
        remove() {
            let [ oldFile ] = this.fileList
            if (oldFile && oldFile.saveName){
                this.$emit('addToDelete', oldFile.saveName)
            }
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

const volumeCheck = (size, maxVolume) => R.or(maxVolume == 0, size <= maxVolume)

const typeCheck = (type, types) => R.or(types[0] == '', R.contains(type, types))
