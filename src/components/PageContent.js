// @flow
import PageTemplate from '../templates'
import { mapActions } from 'vuex'

export default {
    inject: ['$validator'],
    template: `
        <el-row type='flex' justify='center' v-loading='loading'>
            <el-col :span='20'>
                <PageTemplate/>
                <el-row type='flex' justify='right'>
                    <el-button type='primary' @click='click'>ذخیره</el-button>
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
                message: 'در هنگام زخیره خطایی رخ داده است'
            })
            : this.saveData()
        }
    }
}
