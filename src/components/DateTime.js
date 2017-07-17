// @flow
import { mapActions, mapState } from 'vuex'

export default {
    template: `
        <el-date-picker
            v-model="model"
            type="date"
            placeholder="Pick a day"
            @change="change">
        </el-date-picker>
    `,
    props: ['fieldId'],
    data () {
        return {
            model: null
        }
    },
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] }
        })
    },
    methods: {
        ...mapActions(['changeField']),
        change(value) {
            this.changeField({ id: this.fieldId, value })
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.model = this.field.value
    }
}
