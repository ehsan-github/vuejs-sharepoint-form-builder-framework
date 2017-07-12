import PageContent from './PageContent'
import PageHeader from './PageHeader'
import PageFooter from './PageFooter'
import { mapActions } from 'vuex'

export default {
    name: 'app',
    components: { PageContent, PageHeader, PageFooter },
    render () {
        return (
            <div id="app" dir='rtl'>
                <PageHeader/>
                <PageContent loading={this.loading}/>
                <PageFooter/>
            </div>
        )
    },
    data () {
        return {
            loading: true
        }
    },
    methods: {
        ...mapActions(['loadFields'])
    },
    async mounted () {
        await this.loadFields()
        this.loading = false
    }
}
