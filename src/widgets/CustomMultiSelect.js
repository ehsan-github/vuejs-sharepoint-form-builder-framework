// @flow
import R from 'ramda'
import { mapState } from 'vuex'

export default {
    inject: ['$validator'],
    template: `
    <el-tooltip :disabled="!hasError" class="item" effect="dark" :content="firstError" placement="top-end">
        <el-select
            v-validate="rules"
            :class="{'error-box': hasError}"
            :name='name'
            filterable
            v-model="model"
            multiple
            placeholder="انتخاب"
            @change="change"
        >
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
            model: []
        }
    },
    computed: {
        ...mapState({
            loadingFinished: state => !state.loading
        }),
        hasError() { return this.$validator.errors.has(this.name) },
        firstError() { return this.$validator.errors.first(this.name) }
    },
    watch: {
        options: {
            handler: function (newValue, oldValue){
                if (!R.equals(newValue, oldValue) && this.loadingFinished){
                    this.model = []
                    this.$emit('change', null)
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
        this.model = this.value || []
    }
}
