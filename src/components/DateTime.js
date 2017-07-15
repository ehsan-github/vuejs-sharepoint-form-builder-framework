// @flow

export default {
    template: `
        <div class="block">
            <label>{{field.Title}}</label>:
            <el-date-picker
                v-model="value"
                type="date"
                placeholder="Pick a day">
            </el-date-picker>
        </div>
    `,
    props: ['field'],
    data () {
        return {
            value: ''
        }
    }
}
