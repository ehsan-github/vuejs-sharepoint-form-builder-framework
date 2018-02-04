// @flow
import { mapState, mapActions } from 'vuex'
import Field from './Field'
import R from 'ramda'

export default {
    props: ['fieldId', 'showFields', 'headers'],
    components: { Field },
    template: `
    <div>
        <el-tooltip :disabled="fieldType == 'MasterDetail' || !hasError" class="item" effect="dark" :content="errorMessage" placement="bottom">
            <Field :fieldId="fieldId" :showFields="showFields" :headers="headers" @change="change" :class="[{'error-box': hasError, master: fieldType != 'MasterDetail'}, fieldType]"></Field>
        </el-tooltip>
        <div v-if="fieldType != 'File'" class="description">{{description}}</div>
    </div>
    `,
    computed: {
        ...mapState({
            fieldType (state) { return state.fields[this.fieldId].Type },
            fieldInternalName (state) { return state.fields[this.fieldId].InternalName },
            description (state) { return state.fields[this.fieldId].Description},
            serverErrors (state) { return state.serverErrors }
        }),
        error() { return getError(this.fieldInternalName, this.serverErrors) },
        hasError() { return this.error !== undefined },
        errorMessage() { return this.hasError ? this.error.Message : '' }
    },
    methods: {
        ...mapActions(['removeServerError']),
        change (value) {
            if (this.hasError) {
                this.removeServerError({ row: -1, internalName: this.fieldInternalName })
            }
            this.$emit('input', value)
            this.$emit('change', value)
        }
    }
}

const getError = (internalName, errors) => R.pipe(
    R.filter(R.propEq('RowNumber', -1)),
    R.filter(R.propEq('InternalName', internalName)),
    R.head
)(errors)
