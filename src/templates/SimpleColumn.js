// @flow
import Field from '../components/FieldWrapper'
import { mapGetters } from 'vuex'
import R from 'ramda'

export default {
    template: `
    <div>
        <el-row v-for='(row, rowId) in rows' justify="center" type="flex" :gutter="4" :key='rowId'>
            <el-col :xs="24" :sm="24" :md="20" :lg="24" :xl="14">
                <el-row v-for='(rowFields, id) in row' :key='id' :gutter="20" justify="right" type="flex">
                    <el-col v-for='f in rowFields' :key='f.Guid' :span="isMasterOrNote(f) ? 24 : columnSpan" :class="[{'detail-col': !isMaster(f)}, 'main-col']">
                        <el-form ref='form' label-position="top" :class="{'master-field': isMaster(f)}">
                            <el-form-item :class="{require: f.IsRequire}">
                                <div :class="{'master-title': isMaster(f), 'detail-title': !isMaster(f)}">{{f.Title}}</div>
                                <div :class="{'master-item': isMaster(f), 'detail-item': !isMaster(f)}">
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
    props: ['columnsNum'],
    components: { Field },
    computed: {
        ...mapGetters({
            fields: 'filteredFields'
        }),
        columnSpan() { return Math.floor(24/this.columnsNum) },
        rows(){
            return R.pipe(
                R.values,
                buildRows,
                R.map(R.splitEvery(this.columnsNum))
            )(this.fields)
        }
    },
    methods: {
        isMasterOrNote(field){
            return R.either(
                R.propEq('Type', 'MasterDetail'),
                R.propEq('Type', 'Note'))(field)
        },
        isMaster(field){
            return !R.propEq('Type', 'MasterDetail', field)
        }
    }
}

const buildRows = fields => {
    if (fields.length == 0) return fields
    if (fields.length == 1) return [fields]
    if (R.pipe(R.head, isMasterOrNote)(fields)) {
        return R.concat([[R.head(fields)]], buildRows(R.tail(fields)))
    }
    let splited = R.splitWhen(isMasterOrNote, fields)
    return R.concat([R.head(splited)], buildRows(R.last(splited)))
}

const isMasterOrNote = R.either(
    R.propEq('Type', 'MasterDetail'),
    R.propEq('Type', 'Note'))
