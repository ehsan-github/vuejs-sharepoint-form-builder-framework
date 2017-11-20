// @flow
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import Row from './Row'

export default {
    name: 'MasterDetail',
    components: { Row },
    props:  ['fieldId', 'showFields'],
    template: `
        <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
            <div class="el-table__header-wrapper">
                <table ref="table" class="el-table__header">
                    <thead ref="header" @scroll="handleScroll" class="fixes-position hidden" :class="{visible: headIsOnTop}">
                        <span>
                        <tr :key="1">
                            <th class="button"></th>
                            <th class="radif">ردیف</th>
                            <th class='is-leaf' v-for='f in showingFields' :key='"head-fixed"+f.Guid' :class="f.Type">{{f.Title}}</th>
                        </tr>
                        </span>
                    </thead>
                    <thead>
                        <span>
                        <tr :key="2">
                            <th class="button"></th>
                            <th class="radif">ردیف</th>
                            <th class='is-leaf' v-for='f in showingFields' :key='"head-main"+f.Guid' :class="f.Type">{{f.Title}}</th>
                        </tr>
                        </span>
                    </thead>
                    <tbody>
                        <transition-group
                            enter-active-class="animated fadeIn"
                            leave-active-class="animated lightSpeedOut"
                        >
                            <Row v-for='(row, id, idx) in showingRows' :options="options" :serverErrors="transformedServerErrors[idx]" :key="id" :masterId="fieldId" :row="row" :id="id" :idx="idx" @delRow="delRow"/>
                        </transition-group>
                    </tbody>
                    <tfoot>
                        <span>
                        <tr>
                            <td>
                                <el-button plain type="primary" @click='addRow'><i class="el-icon-plus"></i></el-button>
                            </td>
                        </tr>
                        </span>
                    </tfoot>
                </table>
            </div>
        </div>
    `,
    data (){
        return {
            headIsOnTop: false,
        }
    },
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
            masterFields(state) { return state.fields },
            serverErrors (state) { return state.serverErrors }
        }),
        transformedServerErrors(){ return transformErrors(this.serverErrors) },
        fields() { return this.field.fields || {} },
        rows() { return this.field.rows || [] },
        options(){ return this.field.options },
        value() { return this.field.MasterLookupName },
        listOfShowFields() { return this.showFields ? this.showFields.split(',') : [] },
        showingFields() {
            return this.listOfShowFields.length ===  0 ?
                getFilteredView(this.field.RelatedFields || [], R.values(this.fields))
                : R.equals(this.fields, {}) ? {} : getSortedList(this.listOfShowFields)(this.fields)
        },
        showingRows() {
            return this.listOfShowFields.length === 0 ?
                R.pipe(
                    R.map(R.values),
                    R.map(getFilteredView(this.field.RelatedFields || []))
                )(this.rows)
                : R.map(getSortedList(this.listOfShowFields), this.rows)
        },
    },
    methods: {
        ...mapActions([
            'MDLoadFields',
            'MDAddRow',
            'MDDelRow',
            'changeField',
            'MDLoadAllLookupOptions',
        ]),
        addRow () { this.MDAddRow({ id: this.fieldId }) },
        delRow (rowId, idx) {
            this.$confirm('ردیف '+(idx+1)+'  حذف خواهد شد. می‌خواهید ادامه دهید؟', 'اخطار', {
                confirmButtonText: 'بله',
                cancelButtonText: 'خیر',
                type: 'warning'
            }).then(() => {
                this.MDDelRow({ id: this.fieldId, rowId, idx })
                this.$message({
                    type: 'success',
                    message: 'ردیف '+(idx+1)+' با موفقیت حذف گردید'
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: 'حذف لغو گردید',
                })
            })
        },
        handleScroll() {
            if (this.$refs.table.getBoundingClientRect().top <= 0) {
                this.headIsOnTop = true
            } else {
                this.headIsOnTop = false
            }
        }
    },
    async mounted () {
        await this.MDLoadFields({ id: this.fieldId, listId: this.field.LookupList })
        this.MDLoadAllLookupOptions({ masterId: this.fieldId })
        this.changeField({ id: this.fieldId, value: this.value })
        this.addRow()
    },
    updated(){
        console.log(this.showingRows)
    },
    created() {
        window.addEventListener('scroll', this.handleScroll)
    },
    destroyed() {
        window.removeEventListener('scroll', this.handleScroll)
    }
}

// we get [x, y, ...] & { id: {"InternalName": y}, ...} => [{"InternalName": x}, {"InternalName": y}]
const getSortedList = list => fields => R.map(x => R.find(R.propEq('InternalName', x), R.values(fields)), list)

const getFilteredView = R.curry((filterList, fields) => R.filter(field => filterList.includes(field.InternalName), fields))

// [{row: x, internalName: y, message: z}] => {'x': {'y': 'z'}}
const transformErrors = errors => R.pipe(
    R.map(R.groupBy(R.prop('InternalName'))),
    R.map(R.pipe(
        R.map(R.head),
        R.map(R.prop('Message'))))
)(R.groupBy(R.prop('RowNumber'), errors))
