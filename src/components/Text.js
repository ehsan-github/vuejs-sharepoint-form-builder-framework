// @flow

export default {
    template: `
        <div>
            <label>{{field.Title}}</label>:
            <el-input placeholder="Please input" v-model="value"></el-input>
        </div>
    `,
    props: ['field'],
    data () {
        return {
            value: ''
        }
    }
}
