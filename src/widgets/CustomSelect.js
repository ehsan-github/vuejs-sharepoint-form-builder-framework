// @flow
import R from 'ramda'

export default {
    template: `
        <el-select filterable v-model="model" placeholder="انتخاب" @change="change">
            <el-option
                v-for="item in options"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id">
            </el-option>
        </el-select>
    `,
    props: ['options', 'value'],
    data () {
        return {
            model: null
        }
    },
    watch: {
        options: {
            handler: function (newValue, oldValue){
                if (!R.equals(newValue, oldValue)){
                    this.model = null
                }
            },
            deep: true
        }
    },
    methods: {
        change(value) {
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.model = this.value
    }
}
