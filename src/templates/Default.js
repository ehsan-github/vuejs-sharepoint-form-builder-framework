// @flow
import Field from '../components/Field'

export default {
    template: `
        <el-form ref='form' :model='form'>
            <el-form-item v-for='f in fields' key='f.Id' :label='f.Title'>
                <Field :field="f" ref="fields" :data="values" @change="change" />
            </el-form-item>
        </el-form>
    `,
    components: { Field },
    props: {
        fields: Array
    },
    data () {
        return {
            values: {},
            form: {}
        }
    },
    mounted () {
        const unwatch = this.$watch('$refs.fields', (val) => {
            // console.log('watch', val, this.fields)
            if (!val || val.length !== this.fields.length) {
                return
            }
            for (const field of this.$refs.fields) {
                this.values = { ...this.values, ...field.value }
            }
            unwatch()
        }, { immediate: true })
    },
    methods: {
        change (val) {
            // console.log('default change', val)
            this.values = { ...this.values, ...val }
        }
    }
}
