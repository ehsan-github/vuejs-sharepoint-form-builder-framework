import { getFieldsOfList, insertField } from './services/list_fields'
import { getListId } from './services/url_params'
import DefaultTemplate from './templates/Default'

const templates = {
    default: DefaultTemplate
}

export default {
    name: 'app',
    components: { DefaultTemplate },
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
        /* eslint-disable no-unused-vars */
        const Template = templates[this.listMeta]

        return (
            <div id="app" dir='rtl' v-loading={!this.listFields}>
                <Template fields={this.listFields} ref="template" />
                <el-button onClick={this.click}>save</el-button>
            </div>
        )
    }
}
