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
    components: { PageTemplate },
    methods: {
        ...mapActions(['saveData']),
        click () {
            this.$validator.errors.any()
                ? this.$notify.error({
                    title: 'خطا',
                    message: 'در اطلاعات وارد شده خطا وجود دارد'
                })
            : this.saveData()
                .then(succ => {
                    succ == 'ok'
                        ? this.$notify.success({
                            title: 'موفقیت ',
                            message: 'داده ها با موفقیت زخیره شد'
                        })
                    : this.$notify.error({
                        title: 'خطا',
                        message : succ
                    })
                })
        },
        cancel () {
            alert('Canceled')
        }
    }
}
