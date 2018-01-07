// @flow
// import R from 'ramda'

export default {
    inject: ['$validator'],
    template: `
        <el-upload
            class="upload-demo"
            action="/"
            name="ctl00$PlaceHolderMain$UploadDocumentSection$ctl05$InputFile"
            :on-change="change"
            :on-remove="remove"
            :auto-upload="false"
            :multiple="false"
            :file-list="fileList"
        >
            <el-button size="small" type="primary">Click to upload</el-button>
        </el-upload>
    `,
    props: ['value', 'rules', 'name'],
    data() {
        return {
            fileList: []
        }
    },
    computed: {
        hasError() { return this.$validator.errors.has(this.name) },
        firstError() { return this.$validator.errors.first(this.name) },
    },
    methods: {
        change(file) {
            this.fileList = [file]
            this.$emit('input', file)
            this.$emit('change', file)
        },
        remove() {
        }
    }
}

