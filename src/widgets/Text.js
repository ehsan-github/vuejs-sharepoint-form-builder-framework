// @flow

export default {
    template: `
        <div>
            <el-input placeholder="Please input" v-validate.initial="rules" :name='name' v-model="model" @change="change"></el-input>
            <span v-show="veeErrors.has(name)">{{ veeErrors.first(name) }}</span>
        </div>
    `,
    props: ['value', 'rules', 'name'],
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
