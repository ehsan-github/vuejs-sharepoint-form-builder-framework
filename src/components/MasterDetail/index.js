// @flow
import { mapActions, mapState } from 'vuex'
import R from 'ramda'
import Row from './Row'
import TableHeader from './Header'
import TableFooter from './Footer'
import { getSortedList, getFilteredView, transformErrors } from '../../functions'

export default {
    components: { Row, TableHeader, TableFooter },
    props:  ['fieldId', 'showFields'],
    template: `
        <div class="el-table el-table--fit el-table--enable-row-hover el-table--enable-row-transition">
            <div class="el-table__header-wrapper">
                <table ref="table" class="el-table__header">
                    <TableHeader
                        :fields="showingFields"
                        class="fixes-position hidden"
                    <TableHeader :fields="showingFields" />
                    <tbody>
                        <transition-group enter-active-class="animated fadeIn" leave-active-class="animated lightSpeedOut" >
                            <Row v-for='(row, id, idx) in rows'
                                :relatedFields="relatedFields"
                                :listOfShowFields="listOfShowFields"
                                :options="field.options"
                                :serverErrors="transformedServerErrors[idx]"
                                :key="id" :masterId="fieldId"
                                :row="row" :id="id" :idx="idx"
                                @delRow="delRow" />
                        </transition-group>
                    </tbody>
                    <TableFooter @addRow="addRow"/>
                </table>
            </div>
        </div>
    `,
    // data (){ return { headIsOnTop: false } },
    computed: {
        ...mapState({
            field(state) { return state.fields[this.fieldId] },
            masterFields(state) { return state.fields },
            serverErrors (state) { return state.serverErrors }
        }),
        rows() { return this.field.rows || [] },
        fields() { return this.field.fields || {} },
        relatedFields() { return this.field.RelatedFields || [] },
        transformedServerErrors(){ return transformErrors(this.serverErrors) },
        listOfShowFields() { return this.showFields ? this.showFields.split(',') : [] },
        showingFields() {
            if (this.listOfShowFields.length ===  0) {
                return getFilteredView(
                    this.relatedFields,
                    R.values(this.fields))
            } else if (R.equals(this.fields, {})) {
                return []
            } else {
                return getSortedList(this.listOfShowFields)(this.fields) }
        }
    },
    methods: {
        ...mapActions([
            'MDLoadFields',
            'MDAddRow',
            'MDDelRow',
            'changeField',
            'MDLoadAllLookupOptions'
        ]),
        addRow () { this.MDAddRow({ id: this.fieldId }) },
        delRow (rowId, idx) {
            this.$confirm(
                'ردیف ' + (idx + 1) + '  حذف خواهد شد. می‌خواهید ادامه دهید؟',
                'اخطار',
                { confirmButtonText: 'بله', cancelButtonText: 'خیر', type: 'warning' }
            )
            .then(() => {
                this.MDDelRow({ id: this.fieldId, rowId, idx })
                this.$message({
                    type: 'success',
                    message: 'ردیف ' + (idx + 1) + ' با موفقیت حذف گردید' })
            })
            .catch(() => {
                this.$message({ type: 'info', message: 'حذف لغو گردید' })
            })
        },
        // handleScroll() {
        //     if (this.$refs.table.getBoundingClientRect().top <= 0 && this.$refs.table.getBoundingClientRect().bottom >= 100) {
        //         this.headIsOnTop = true
        //     } else {
        //         this.headIsOnTop = false
        //     }
        // }
    },
    async mounted () {
        await this.MDLoadFields({ id: this.fieldId, listId: this.field.LookupList, masterLookupName: this.field.MasterLookupName })
        this.MDLoadAllLookupOptions({ masterId: this.fieldId })
        this.changeField({ id: this.fieldId, value: this.field.MasterLookupName })
        // window.addEventListener('scroll', this.handleScroll)
    }
}
