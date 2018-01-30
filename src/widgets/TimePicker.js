// @flow

export default {
    inject: ['$validator'],
    template: `
    <el-tooltip :disabled="!hasError" class="item" effect="dark" :content="firstError" placement="top-end">
        <el-time-picker
            v-validate="rules"
            :class="{'error-box': hasError}"
            :data-vv-name='name'
            v-model="model"
            :default-value="defaultValue"
            arrow-control
            format="HH:mm"
            :clearable="false"
            @change="change"
        >
        </el-time-picker>
    </el-tooltip>
    `,
    props: ['value', 'rules', 'name'],
    data() {
        return {
            model: '',
            defaultValue: new Date()
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
        if (this.value){
            let [ hour, minute ] = this.value.split(':')
            this.defaultValue.setHours(hour, minute)
            let time = new Date(2017,1,1, hour, minute)
            this.model = time
        }
    }
}
