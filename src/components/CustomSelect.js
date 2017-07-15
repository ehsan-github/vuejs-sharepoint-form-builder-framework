// @flow

import { getFiltredItems } from '../api/index.js'

export default {
    template: `
        <div>
             <label>{{field.Title}}</label>:
             <el-select v-model="value" placeholder="انتخاب">
                 <el-option
                     v-for="item in options"
                     key="item.Id"
                     :label="item.Title"
                     :value="item.Id">
                 </el-option>
             </el-select>
         </div>
    `,
    props: ['field', 'data'],
    data () {
        return {
            value: '',
            options: []
        }
    },
    computed: {
        related () {
            const relatedFields = this.field.RelatedFields
            let relatedData = {}
            for (let relatedField of relatedFields) {
                relatedData[relatedField] = (this.data || {})[relatedField]
            }
            return relatedData
        }
    },
    async mounted () {
        this.options = await getFiltredItems(this.field.LookupList, this.related)
    }
}
