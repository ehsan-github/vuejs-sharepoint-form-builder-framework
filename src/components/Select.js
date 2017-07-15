// @flow
import { getItems } from '../api/index.js'

export default {
    template: `
        <div>
            <label>{{field.Title}}</label>:
            <el-select v-model="value" placeholder="انتخاب" @change="change">
                <el-option
                    v-for="item in options"
                    key="item.Id"
                    :label="item.Title"
                    :value="item.Id">
                </el-option>
            </el-select>
        </div>
    `,
    props: ['field'],
    data () {
        return {
            value: '',
            options: []
        }
    },
    methods: {
        change (v) {
            this.$emit('change', v)
        }
    },
    async mounted () {
        this.options = await getItems(this.field.LookupList)
    }
}
