import { getFieldsOfList, insertField } from './services/list_fields'
import PageTemplate from './templates'
import { mapState } from 'vuex'

export default {
    name: 'app',
    components: { PageTemplate },
    methods: {
        saveData () {
            return this.$refs.template.values
        },
        click () {
            insertField(this.listId, this.saveData()).then(r => console.log(r))
        }
    },
    computed: {
        ...mapState({
            listId: s => s.listId,
            listFields: s => s.fields
        })
    },
    async mounted () {
        const listFields = await getFieldsOfList(this.listId)
        this.$store.commit('loadFields', listFields)
    },
    render () {
        const {listFields} = this
        return (
            <div id="app" dir='rtl' v-loading={!listFields}>
                <PageTemplate fields={listFields || []} ref='template' />
                <el-button onClick={this.click}>save</el-button>
            </div>
        )
    }
}
