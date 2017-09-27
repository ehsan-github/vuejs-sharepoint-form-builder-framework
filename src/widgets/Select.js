// @flow

export default {
    template: `
        <el-select filterable :disabled="disabled" v-model="model" placeholder="انتخاب" @change="change">
            <el-option
                v-for="item in options"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id">
            </el-option>
        </el-select>
    `,
    props: ['options', 'value', 'disabled'],
    data () {
        return {
            model: null
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
