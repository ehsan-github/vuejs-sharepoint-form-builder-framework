// @flow
import { mapState } from 'vuex'

export default {
    template: `
    <div class="contractForm">
        <h3>مشخصات پیمان</h3>
        <el-form ref='form' label-position="top">
        <el-row justify="center" :gutter="24">
            <el-col :span="12">
                <el-form-item class="contractSpecs" label="پیمان">{{Title}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item class="contractSpecs" label="حوزه">{{Area}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item class="contractSpecs" label="پیمانکار">{{Contractor}}</el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item class="contractSpecs" label="مشاور">{{Consultant}}</el-form-item>
            </el-col>
        </el-row>
        </el-form>
    </div>
    `,
    computed: {
        ...mapState({
            specs: s => s.contractSpecs,
        }),
        Title () { return this.specs.Title || 'در حال بارگذاری' },
        Area () { return this.specs.Area ? this.specs.Area.Title : 'در حال بارگذاری' },
        Contractor () { return this.specs.Contractor ? this.specs.Contractor.Title : 'در حال بارگذاری' },
        Consultant () { return this.specs.Consultant ? this.specs.Consultant.Title : 'در حال بارگذاری' },
    }
}
