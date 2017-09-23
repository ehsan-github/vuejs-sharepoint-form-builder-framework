// @flow

export default {
    template: `
        <el-checkbox v-model="model" @change="change"></el-checkbox>
    `,
    props: ['value'],
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
