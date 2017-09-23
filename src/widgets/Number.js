// @flow

export default {
    template: `
        <el-input-number v-model="model" :controls="false" size="small" @change="change"></el-input-number>
    `,
    props: ['value'],
    data () {
        return {
            model: null
        }
    },
    methods: {
        change (value) {
            setTimeout(() => {
                this.model = value|0
                this.$emit('input', value)
                this.$emit('change', value)
            }, 50)
        }
    },
    mounted() {
        this.model = this.value
    }
}
