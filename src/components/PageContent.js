// @flow
import PageTemplate from '../templates'
import { mapActions, mapGetters } from 'vuex'

export default {
    inject: ['$validator'],
    template: `
        <el-row type='flex' justify='center' v-loading='loading'>
            <el-col :span='24'>
                <PageTemplate/>
                <el-row type='flex' justify="center">
                    <el-col :span='2'>
                        <el-button class="save" type='success' @click='click'>ذخیره</el-button>
                    </el-col>
                    <el-col :span='2'>
                        <el-button class="cancel" type='danger' @click='cancel'>انصراف</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    `,
    props: {
        loading: Boolean
    },
    computed: {
        ...mapGetters(['serverHasNotError', 'detailsHasAtLeastOneRow']),
    },
    components: { PageTemplate },
    methods: {
        ...mapActions(['saveData', 'loadServerErrors']),
        click () {
            this.$validator.validateAll().then((result) => {
                if (result && this.serverHasNotError && this.detailsHasAtLeastOneRow) {
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
                                    message : 'در اطلاعات وارد شده خطا وجود دارد لطفا خطاها را رفع کرده مجددا ذخیره نمایید.'
                                })
                                this.loadServerErrors(JSON.parse(succ))
                            }
                        })
                }

                if (!this.detailsHasAtLeastOneRow){
                    return this.$message.error({
                        showClose : true,
                        title: 'خطا ',
                        message : 'فرم حاوی اطلاعات نمی‌باشد'
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
