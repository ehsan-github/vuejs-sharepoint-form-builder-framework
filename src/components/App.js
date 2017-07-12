import PageContent from './PageContent'
import PageHeader from './PageHeader'
import PageFooter from './PageFooter'
import { mapActions, mapState } from 'vuex'

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
    computed: {
        ...mapState({
            loading: s => s.loading
        })
    },
    methods: {
        ...mapActions(['loadFields'])
    },
    mounted () {
        this.loadFields()
    }
}
