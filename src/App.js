import { getFieldsOfList, insertField } from './services/list_fields'
import { getListId } from './services/url_params'
import PageTemplate from './templates'

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
    data () {
        return {
            listId: getListId(),
            listFields: null,
            listMeta: null
        }
    },
    async mounted () {
        this.listFields = await getFieldsOfList(this.listId)
        console.log('Got fields:', this.listFields)
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
