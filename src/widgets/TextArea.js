// @flow

export default {
    inject: ['$validator'],
    template: `
    <el-tooltip :disabled="!hasError" class="item" effect="dark" :content="firstError" placement="top-start">
        <el-input
            v-validate="rules"
            :class="{'error-box': hasError}"
            :name='name'
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 4}"
            v-model="model"
            @change="change"
        >
        </el-input>
    </el-tooltip>
    `,
    props: ['value', 'rules', 'name'],
    data() {
        return {
            model: null
        }
    },
    computed: {
        hasError() { return this.$validator.errors.has(this.name) },
        firstError() { return this.$validator.errors.first(this.name) }
    },
    methods: {
        change(value) {
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        console.log('rules', this.rules)
        this.model = this.value
    }
}
