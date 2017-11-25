// @flow

export default {
    template: `
        <tfoot>
            <span>
                <tr>
                    <td>
                        <el-button plain type="primary" @click='addRow'><i class="el-icon-plus"></i></el-button>
                    </td>
                </tr>
            </span>
        </tfoot>
    `,
    methods: {
        addRow () { this.$emit('addRow') }
    }
}
