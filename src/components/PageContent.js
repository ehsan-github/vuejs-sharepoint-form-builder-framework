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
        ...mapActions(['saveData']),
        click () {
            if (this.errorExists) {
                this.$message.error({
                    title: 'خطا',
                    message: 'در اطلاعات وارد شده خطا وجود دارد'
                })
            }
            else {
                this.saveData()
                    .then(succ => {
                        if (succ == 'ok') {
                            this.$message.success({
                                title: 'موفقیت ',
                                message: 'داده ها با موفقیت زخیره شد'
                            })
                        }
                        else{
                            this.$message.error({
                                title: 'خطا',
                                message : succ
                            })
                        }
                    })
            }
        },
        cancel () {
            alert('Canceled')
        }
    }
}
