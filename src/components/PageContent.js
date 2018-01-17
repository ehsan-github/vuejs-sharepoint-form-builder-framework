// @flow
import PageTemplate from '../templates'
import ContractSpecForm from '../components/ContractSpec'
import TitleHeader from '../widgets/TitleHeader'
import Histories from './Histories'

import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    inject: ['$validator'],
    components: { PageTemplate, ContractSpecForm, TitleHeader, Histories },
    template: `
        <el-row type='flex' justify='center' v-loading='loading'>
            <el-col :span='24'>
                <TitleHeader :title="listData.Title" />
                <PageTemplate class="border"/>
                <el-row type='flex' justify="center">
                    <el-col :xs="24" :sm="20" :md="18" :lg="18" :xl="16" class="centeralize">
                        <div>مشاهده سوابق</div>
                        <Histories />
                    </el-col>
                </el-row>
                <el-row type='flex' justify="center" class="footer">
                    <el-col :span='2'>
                        <el-button class="save" type='primary' @click='click'>ذخیره</el-button>
                    </el-col>
                    <el-col :span='2'>
                        <el-button class="cancel" type='primary' @click='cancel'>انصراف</el-button>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    `,
    props: {
        loading: Boolean
    },
    computed: {
        ...mapGetters(['serverHasNotError', 'detailsHasAtLeastOneRow', 'requiredFilesFilled']),
        ...mapState({
            specs: s => s.contractSpecs,
            listData: s => s.listData,
        }),
        listName(){
            return this.listData.EntityTypeName.slice(0, -4)
        },
        redirectURL(){
            return '/Lists/' + this.listName + '/AllItems.aspx'
        }
    },
    methods: {
        ...mapActions(['saveData', 'loadServerErrors']),
        click () {
            this.$validator.validateAll().then((result) => {
                if (result && this.serverHasNotError && this.detailsHasAtLeastOneRow && this.requiredFilesFilled) {
                    return this.saveData()
                        .then(succ => {
                            if (succ == 'ok') {
                                this.$message.success({
                                    title: 'موفقیت ',
                                    showClose: true,
                                    message: 'داده ها با موفقیت ذ‌خیره شد'
                                })
                                setTimeout(()=> {
                                    location.href = this.redirectURL
                                }, 1000)
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
            setTimeout(()=> {
                location.href = this.redirectURL
            }, 10)
        }
    }
}
