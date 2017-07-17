// @flow
import Field from '../components/Field'
import { mapState } from 'vuex'
import R from 'ramda'

export default {
    template: `
        <el-form ref='form' :model='form' label-position="top">
            <el-form-item v-for='(f, id) in fields' :key='id' :label='f.Title' :prop='id'>
                <Field :fieldId='id' ref='fields' @change='v => change(id, v)' />
            </el-form-item>
        </el-form>
    `,
    components: { Field },
    data () {
        return {
            form: {}
        }
    },
    computed: {
        ...mapState({
            fields: s => s.fields
        })
    },
    methods: {
        change (id, value) {
            this.form = R.assign(id, value, this.form)
        }
    }
}
