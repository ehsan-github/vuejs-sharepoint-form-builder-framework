// @flow
import Field from '../components/Field'
import ContractSpecForm from '../components/ContractSpec'
import { mapState } from 'vuex'
import R from 'ramda'

export default {
    template: `
    <div>
        <ContractSpecForm />
        <el-form ref='form' :model='form' label-position="top">
            <el-form-item v-for='(f, id) in fields' :key='id' :label='f.Title' :prop='id'>
                <Field :fieldId='id' ref='fields' @change='v => change(id, v)' />
            </el-form-item>
        </el-form>
    </div>
    `,
    components: { Field, ContractSpecForm },
    data () {
        return {
            form: {}
        }
    },
    computed: {
        ...mapState({
            fields: s => s.fields,
            specs: s => s.contractSpecs,
        })
    },
    methods: {
        change (id, value) {
            this.form = R.assoc(id, value, this.form)
        }
    }
}
