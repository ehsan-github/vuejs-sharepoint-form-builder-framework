// @flow

export default {
    template: `
        <el-select filterable v-model="model" multiple placeholder="انتخاب" @change="change">
            <el-option
                v-for="item in options"
                :key="item"
                :label="item"
                :value="item">
            </el-option>
        </el-select>
    `,
    props: ['options', 'value'],
    data () {
        return {
            model: []
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
