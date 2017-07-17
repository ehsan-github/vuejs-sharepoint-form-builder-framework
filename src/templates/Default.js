// @flow
import Field from '../components/Field'
import { mapState, mapActions } from 'vuex'
import R from 'ramda'

export default {
    template: `
        <el-form ref='form' :model='form'>
            <el-form-item v-for='(f, id) in fields' key='id' :label='f.Title' :prop='id'>
                <Field :field='f' ref='fields' :data='f.value' @change='v => change(id, v)' />
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
        ...mapActions(['changeField']),
        change (id, value) {
            this.form = R.assign(id, value, this.form)
            this.changeField({ id, value })
        }
    }
}
