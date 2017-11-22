// @flow
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import Row from './Row'
import Header from './DetailHead'
import { getSortedList, getFilteredView,transformErrors } from './functions'

export default {
    components: { Row, Header },
    props:  ['fieldId', 'showFields'],
    template: `
        <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
            <div class="el-table__header-wrapper">
                <table ref="table" class="el-table__header">
                    <Header :fields="showingFields" :key="1" @scroll="handleScroll" class="fixes-position hidden" :class="{visible: headIsOnTop}" />
                    <Header :fields="showingFields" :key="2" />
                    <tbody>
                        <transition-group enter-active-class="animated fadeIn" leave-active-class="animated lightSpeedOut" >
                            <Row v-for='(row, id, idx) in showingRows' :options="field.options" :serverErrors="transformedServerErrors[idx]" :key="id" :masterId="fieldId" :row="row" :id="id" :idx="idx" @delRow="delRow" />
                        </transition-group>
                    </tbody>
                    <tfoot>
                      <span><tr><td>
                        <el-button plain type="primary" @click='addRow'><i class="el-icon-plus"></i></el-button>
                      </td></tr></span>
                    </tfoot>
                </table>
            </div>
        </div>
    `,
    data (){ return { headIsOnTop: false } },
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
            masterFields(state) { return state.fields },
            serverErrors (state) { return state.serverErrors }
        }),
        transformedServerErrors(){ return transformErrors(this.serverErrors) },
        listOfShowFields() { return this.showFields ? this.showFields.split(',') : [] },
        showingFields() {
            return this.listOfShowFields.length ===  0 ?
                getFilteredView(this.field.RelatedFields || [], R.values(this.field.fields || {}))
                : R.equals(this.field.fields || {}, {}) ? {} : getSortedList(this.listOfShowFields)(this.field.fields || {})
        },
        showingRows() {
            return this.listOfShowFields.length === 0 ?
                R.pipe(
                    R.map(R.values),
                    R.map(getFilteredView(this.field.RelatedFields || []))
                )(this.field.rows || [])
                : R.map(getSortedList(this.listOfShowFields), this.field.rows || [])
        },
    },
    methods: {
        ...mapActions(['MDLoadFields', 'MDAddRow', 'MDDelRow', 'changeField', 'MDLoadAllLookupOptions']),
        addRow () { this.MDAddRow({ id: this.fieldId }) },
        delRow (rowId, idx) {
            this.$confirm('ردیف '+(idx+1)+'  حذف خواهد شد. می‌خواهید ادامه دهید؟', 'اخطار', { confirmButtonText: 'بله', cancelButtonText: 'خیر', type: 'warning' })
                .then(() => {
                    this.MDDelRow({ id: this.fieldId, rowId, idx })
                    this.$message({ type: 'success', message: 'ردیف '+(idx+1)+' با موفقیت حذف گردید' }) })
                    .catch(() => { this.$message({ type: 'info', message: 'حذف لغو گردید' }) })
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
        this.changeField({ id: this.fieldId, value: this.field.MasterLookupName })
        this.addRow()
        window.addEventListener('scroll', this.handleScroll)
    }
}
