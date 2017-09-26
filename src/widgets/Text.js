// @flow

export default {
    inject: ['$validator'],
    template: `
        <div>
            <el-input v-validate.initial="rules" :class="{'error-box': $validator.errors.has(name)}" :name='name' v-model="model" @change="change"></el-input>
            <span class="error" v-show="$validator.errors.has(name)">{{ $validator.errors.first(name) }}</span>
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
