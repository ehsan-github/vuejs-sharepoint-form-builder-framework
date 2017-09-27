// @flow
import Field from '../components/Field'
import ContractSpecForm from '../components/ContractSpec'
import { mapState, mapGetters } from 'vuex'
import R from 'ramda'

export default {
    template: `
    <div>
        <ContractSpecForm />
        <el-row justify="end" :gutter="10">
            <el-form ref='form' :model='form' label-position="top">
                <el-col v-for='(f, id) in fields' :key='id' :span="f.Type == 'MasterDetail' ? 24 : 12">
                    <el-form-item :key='id' :class="{require: f.IsRequire}" :label='f.Title' :prop='id'>
                        <Field :fieldId='id' ref='fields' @change='v => change(id, v)' />
                    </el-form-item>
                </el-col'>
            </el-form>
        </el-row>
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
            specs: s => s.contractSpecs,
        }),
        ...mapGetters({
            fields: 'filteredFields'
        })
    },
    methods: {
        change (id, value) {
            this.form = R.assoc(id, value, this.form)
        }
    }
}
