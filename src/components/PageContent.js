// @flow
import PageTemplate from '../templates'
import { mapActions } from 'vuex'

export default {
    inject: ['$validator'],
    template: `
        <el-row type='flex' justify='center' v-loading='loading'>
            <el-col :span='24'>
                <PageTemplate/>
                <el-row type='flex' justify='right'>
                    <el-button class="save" type='success' @click='click'>ذخیره</el-button>
                    <el-button class="cancel" type='danger' @click='cancel'>انصراف</el-button>
                </el-row>
            </el-col>
        </el-row>
    `,
    props: {
        loading: Boolean
    },
    computed: {
        errorExists () { return this.$validator.errors.any() }
    },
    components: { PageTemplate },
    methods: {
        ...mapActions(['saveData', 'loadServerErrors']),
        click () {
            this.$validator.validateAll().then((result) => {
                if (result) {
                    return this.saveData()
                        .then(succ => {
                            if (succ == 'ok') {
                                this.$message.success({
                                    title: 'موفقیت ',
                                    showClose: true,
                                    message: 'داده ها با موفقیت زخیره شد'
                                })
                            }
                            else{
                                this.$message.error({
                                    showClose: true,
                                    title: 'خطا',
                                    message : succ
                                })
                                this.loadServerErrors(JSON.parse(succ))
                            }
                        })
                }

                this.$message.error({
                    title: 'خطا',
                    showClose: true,
                    message: 'در اطلاعات وارد شده خطا وجود دارد'
                })
            });
        },
        cancel () {
            alert('Canceled')
        }
    }
}
