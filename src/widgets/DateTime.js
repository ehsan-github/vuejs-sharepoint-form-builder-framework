// @flow

export default {
    template: `
        <el-date-picker
            v-model="model"
            type="date"
            placeholder="Pick a day"
            @change="change">
        </el-date-picker>
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
