// @flow
import Field from '../components/FieldWrapper'
import { mapGetters } from 'vuex'

export default {
    template: `
    <div>
        <el-row justify="start" :gutter="20">
                <el-col v-for='(f, id) in fields' :key='id' :span="f.Type == 'MasterDetail' ? 24 : 12">
            <el-form ref='form' label-position="top">
                    <el-form-item :key='id' :class="{require: f.IsRequire}">
                        <div v-if="f.Type != 'MasterDetail'" class="field-title">{{f.Title}}</div>
                        <div :class="{'master-item': f.Type != 'MasterDetail'}">
                            <Field :fieldId='id' ref='fields'/>
                        </div>
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
