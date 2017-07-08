import PageContent from './components/Content'
import PageHeader from './components/Header'
import PageFooter from './components/Footer'
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
