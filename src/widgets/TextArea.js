// @flow

export default {
    template: `
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" v-model="model" @change="change"></el-input>
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
