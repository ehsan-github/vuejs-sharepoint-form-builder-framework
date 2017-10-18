// @flow

export default {
    template: `
        <el-checkbox v-model="model" @change="change"></el-checkbox>
    `,
    props: ['value'],
    data () {
        return {
            model: 0
        }
    },
    methods: {
        change(event) {
            let value = event.target.checked ? '1' : '0'
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.model = this.value == 1 ? true : false
    }
}
