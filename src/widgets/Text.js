// @flow

export default {
    template: `
        <el-input placeholder="Please input" v-model="model" @change="change"></el-input>
    `,
    props: ['value'],
    data() {
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
