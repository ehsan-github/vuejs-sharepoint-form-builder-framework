// @flow
import { mapActions, mapState } from 'vuex'

export default {
    template: `
        <el-input-number v-model="model" :controls="false" size="small" @change="change"></el-input-number>
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
        change (v) {
            setTimeout(() => {
                this.model = v|0
                this.changeField({ id: this.fieldId, value: this.model })
                this.$emit('input', this.model)
                this.$emit('change', this.model)
            }, 50)
        }
    },
    mounted() {
        this.model = this.field.value
    }
}
