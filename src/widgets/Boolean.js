// @flow

export default {
    template: `
        <el-checkbox :value="value == 1" @change="change"></el-checkbox>
    `,
    props: ['value'],
    methods: {
        change(event) {
            let value = event.target.checked ? '1' : '0'
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}
