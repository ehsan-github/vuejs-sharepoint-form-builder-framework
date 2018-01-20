// @flow

export default {
    inject: ['$validator'],
    template: `
    <el-tooltip :disabled="!hasError" class="item" effect="dark" :content="firstError" placement="top-end">
        <el-time-select
            v-validate="rules"
            :class="{'error-box': hasError}"
            :data-vv-name='name'
            v-model="model"
            :default-value="model"
            :picker-options="{
                start: '00:00',
                step: '00:15',
                end: '23:45'
            }"
            @change="change"
        >
        </el-time-select>
    </el-tooltip>
    `,
    props: ['value', 'rules', 'name'],
    data() {
        return {
            model: ''
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
        this.model = this.value
    }
}
