// @flow
import PageContent from './PageContent'
import PageHeader from './PageHeader'
import PageFooter from './PageFooter'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
    name: 'app',
    components: { PageContent, PageHeader, PageFooter },
    render () {
        return (
            <div id='app' dir='rtl'>
                <PageHeader/>
                <PageContent loading={this.loading}/>
                <PageFooter/>
            </div>
        )
    },
    computed: {
        ...mapGetters({
            isError: 'isError',
            error: 'firstError'
        }),
        ...mapState({
            loading: s => s.loading
        })
    },
    methods: {
        ...mapActions([
            'loadFields',
            'removeError',
            'loadContractSpec',
            'loadTemplateMetaData'
        ])
    },
    watch: {
        isError: function (isError) {
            if (isError) {
                this.$message.error({
                    message: `An error occured: ${this.error}`,
                    duration: 5000,
                    showClose: true,
                    onClose: () => this.removeError(this.error)
                })
            }
        }
    },
    async mounted () {
        await this.loadFields()
        this.loadTemplateMetaData()
        this.loadContractSpec()
    }
}
