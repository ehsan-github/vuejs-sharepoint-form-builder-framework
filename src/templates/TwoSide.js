// @flow
import Field from '../components/FieldWrapper'
import { mapGetters } from 'vuex'
import R from 'ramda'

export default {
    template: `
    <div>
        <el-row justify="center" type="flex" :gutter="4">
            <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="7">
                <el-row v-for='f in masterFields' :key='f.Guid' :gutter="20" justify="space-around" type="flex">
                    <el-col :span="24">
                        <el-form ref='form' label-position="top" class="master-field">
                            <el-form-item :class="{require: f.IsRequire}">
                                <div class='master-title'>{{f.Title}}</div>
                                <div class='master-item'>
                                    <Field :fieldId='f.Guid'/>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
            <el-col v-if="detailsField" :xs="24" :sm="24" :md="16" :lg="18" :xl="17">
                <el-row v-for='f in detailsField' :key='f.Guid' :gutter="20" justify="right" type="flex">
                    <el-col :span="24" class='detail-col-2'>
                        <el-form ref='form' label-position="top" class="master-field">
                            <el-form-item>
                                <div class='detail-title'>{{f.Title}}</div>
                                <div class='detail-item'>
                                    <Field :fieldId='f.Guid'/>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
    </div>
    `,
    components: { Field },
    computed: {
        ...mapGetters({
            fields: 'filteredFields'
        }),
        masterFields(){
            return R.reject(R.propEq('Type', 'MasterDetail'), this.fields)
        },
        detailsField() {
            return R.filter(R.propEq('Type', 'MasterDetail'), this.fields)
        }
    }
}
