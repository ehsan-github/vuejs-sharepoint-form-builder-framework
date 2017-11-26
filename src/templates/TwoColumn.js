// @flow
import Field from '../components/FieldWrapper'
import { mapGetters } from 'vuex'

export default {
    template: `
    <div>
        <el-row justify="start" :gutter="24">
                <el-col v-for='(f, id) in fields' :key='id' :span="f.Type == 'MasterDetail' ? 24 : 12">
            <el-form ref='form' label-position="top">
                    <el-form-item :key='id' :class="{require: f.IsRequire}" :label='f.Type == "MasterDetail" ? null : f.Title' :prop='id'>
                        <Field :fieldId='id' ref='fields'/>
                    </el-form-item>
            </el-form>
                </el-col'>
        </el-row>
    </div>
    `,
    components: { Field },
    computed: {
        ...mapGetters({
            fields: 'filteredFields'
        })
    }
}
