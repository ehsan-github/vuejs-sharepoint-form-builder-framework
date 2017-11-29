// @flow

export default {
    inject: ['$validator'],
    template: `
    <el-tooltip :disabled="!hasError" class="item" effect="dark" :content="firstError" placement="top-start">
            <el-input
                v-validate="rules"
                :class="{'error-box': hasError}"
                :name="name"
                :value="value"
                :controls="false"
                size="small"
                @change="change"
            >
            </el-input>
    </el-tooltip>
    `,
    props: ['value', 'rules', 'name'],
    computed: {
        hasError() { return this.$validator.errors.has(this.name) },
        firstError() { return this.$validator.errors.first(this.name) }
    },
    methods: {
        change (value) {
            this.$emit('change', value)
        }
    }
}
