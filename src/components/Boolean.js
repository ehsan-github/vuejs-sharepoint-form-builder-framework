// @flow

export default {
    template: `
        <div>
             <el-checkbox v-model="value">{{field.Title}}</el-checkbox>
        </div>
    `,
    props: ['field'],
    data () {
        return {
            value: false
        }
    }
}
