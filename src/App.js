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
    asyncComputed: {
        listId () {
            return getListId()
        },
        listFields () {
            return this.listId && getFieldsOfList(this.listId)
        },
        listMeta () {
            return Promise.resolve('default')
        }
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
