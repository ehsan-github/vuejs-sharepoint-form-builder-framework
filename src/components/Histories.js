// @flow
import { mapState } from 'vuex'
import R from 'ramda'
import moment from 'moment-jalaali'

export default {
    template: `
        <el-table
            :data="tableData"
            border
            style="width: 80%"
        >
            <el-table-column
                prop="UserName"
                label="کاربر"
                width="150">
            </el-table-column>
            <el-table-column
                prop="state"
                label="رویداد"
                width="90">
            </el-table-column>
            <el-table-column
                prop="HistoryDate"
                label="تاریخ"
                width="125">
            </el-table-column>
            <el-table-column
                prop="Description"
                label="توضیحات">
            </el-table-column>
        </el-table>
    `,
    computed: {
        ...mapState({
            histories: s => s.histories
        }),
        tableData() {
            return R.map(fixDate, this.histories)
        }
    }
}

const fixDate = R.over(
    R.lensProp('HistoryDate'),
    R.pipe(
        x => moment(x).toDate(),
        x => moment(x, 'llll').format('jYYYY-jMM-jDD')
    )
)
