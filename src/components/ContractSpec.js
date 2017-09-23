// @flow
import { mapState } from 'vuex'

export default {
    template: `
    <div>
        <h3>مشخصات پیمان</h3>
        <el-form ref='form' label-position="top">
            <el-col :span="12">
                <el-form-item label="Title">{{specs.Title}}</el-form-item>
            </el-col>
                <el-col :span="12">
            <el-form-item label="Area ID">{{specs.AreaId}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="Contractor ID">{{specs.ContractorUserId}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="Consultant ID">{{specs.ConsultentUserId}}</el-form-item>
            </el-col>
        </el-form>
    </div>
    `,
    computed: {
        ...mapState({
            specs: s => s.contractSpecs,
        })
    }
}
