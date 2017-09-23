// @flow

export default {
    template: `
        <el-select v-model="model" placeholder="انتخاب" @change="change">
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
