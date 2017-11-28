// @flow
import { mapState } from 'vuex'

export default {
    template: `
    <div class="contractForm">
        <h3>مشخصات پیمان</h3>
        <el-row justify="center" :gutter="24">
            <el-col :span="12">
                <div class="field-title"> پیمان </div>
                <div class="master-item">{{Title}}</div>
            </el-col>
            <el-col :span="12">
                <div class="field-title"> حوزه </div>
                <div class="master-item">{{Area}}</div>
                </el-form>
            </el-col>
            <el-col :span="12">
                <div class="field-title"> پیمانکار </div>
                <div class="master-item">{{Contractor}}</div>
            </el-col>
            <el-col :span="12">
                <div class="field-title"> مشاور  </div>
                <div class="master-item">{{Consultant}}</div>
            </el-col>
        </el-row>
    </div>
    `,
    computed: {
        ...mapState({
            specs: s => s.contractSpecs,
        }),
        Title () { return this.specs.Title || '' },
        Area () { return this.specs.Area ? this.specs.Area.Title : '' },
        Contractor () { return this.specs.Contractor ? this.specs.Contractor.Title : '' },
        Consultant () { return this.specs.Consultant ? this.specs.Consultant.Title : '' },
    }
}
