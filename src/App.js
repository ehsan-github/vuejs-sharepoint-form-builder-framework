import { getFieldsOfList, insertField } from './services/list_fields'
import PageContent from './components/Content'
import PageHeader from './components/Header'
import PageFooter from './components/Footer'
import { mapState, mapMutations } from 'vuex'

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
        saveData () {
            return this.$refs.template.values
        },
        click () {
            insertField(this.listId, this.saveData()).then(r => console.log(r))
        },
        ...mapMutations(['loadFields'])
    },
    computed: {
        ...mapState({
            listId: s => s.listId,
            listFields: s => s.fields
        })
    },
    async mounted () {
        const listFields = await getFieldsOfList(this.listId)
        this.loadFields(listFields)
        this.loading = false
    }
}
