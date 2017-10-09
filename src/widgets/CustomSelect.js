// @flow
import R from 'ramda'

export default {
    inject: ['$validator'],
    template: `
    <el-tooltip :disabled="!$validator.errors.has(name)" class="item" effect="dark" :content="$validator.errors.first(name)" placement="top-start">
        <el-select v-validate.initial="rules" :class="{'error-box': $validator.errors.has(name)}" :name='name'filterable v-model="model" placeholder="انتخاب" @change="change">
            <el-option
                v-for="item in options"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id">
            </el-option>
        </el-select>
    </el-tooltip>
    `,
    props: ['options', 'value', 'name', 'rules'],
    data () {
        return {
            model: null
        }
    },
    watch: {
        options: {
            handler: function (newValue, oldValue){
                if (!R.equals(newValue, oldValue)){
                    this.model = null
                }
            },
            deep: true
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
