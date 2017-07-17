// @flow
import { mapActions, mapState } from 'vuex'

export default {
    template: `
        <el-select v-model="model" placeholder="انتخاب" @change="change">
            <el-option
                v-for="item in options"
                :key="item.Id"
                :label="item.Title"
                :value="item.Id">
            </el-option>
        </el-select>
    `,
    props: ['fieldId'],
    data () {
        return {
            model: null
        }
    },
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
        }),
        options() { return this.field.options }
    },
    methods: {
        ...mapActions(['changeField']),
        change (value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.model = this.field.value
    }
}
