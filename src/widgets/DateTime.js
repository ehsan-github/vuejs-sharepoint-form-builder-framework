// @flow
import Datepicker from 'vue-jalaali-datepicker/vue-jalaali-datepicker-es6'
import moment from 'moment-jalaali'

export default {
    inject: ['$validator'],
    components: { Datepicker },
    template: `
    <el-tooltip :disabled="!hasError" class="item" effect="dark" :content="firstError" placement="top-start">
<div><i class="el-icon-date" style="display: inline-block;position: absolute;margin: 11px 80px;color: darkgray;"></i>
        <Datepicker
            v-validate="rules"
            :class="{'error-box': hasError, 'el-input__inner': true}"
            :data-vv-name='name'
            v-model="model"
            :date="startTime"
            :option="option"
            :limit="limit"
            @change="change">
        </Datepicker>
</div>
    </el-tooltip>
    `,
    props: ['value', 'name', 'rules'],
    data () {
        return {
            model: new Date(),
            startTime: {
                time: '' // '1396-05-02' (type=day) && '["1396/05/02", "1396/06/02", "1396/07/02"]' (type="multi-day")
            },
            option: {
                type: 'day',
                week: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                month: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
                format: 'jYYYY-jMM-jDD',
                placeholder: 'انتخاب کنید',
                inputStyle: {
                    'display': 'inline-block',
                    'padding': '4px',
                    'line-height': '22px',
                },
                color: {
                    header: '#ccc',
                    headerText: '#f00'
                },
                buttons: {
                    ok: 'انتخاب',
                    cancel: 'انصراف'
                },
                overlayOpacity: 0.5, // 0.5 as default
                dismissible: true // as true as default
            },
            timeoption: {
                type: 'min',
                week: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                month: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
                format: 'jYYYY-jMM-jDD HH:mm'
            },
            limit: [{
                type: 'weekday',
                available: [1, 2, 3, 4, 5]
            }],
        }
    },
    computed: {
        hasError() { return this.$validator.errors.has(this.name) },
        firstError() { return this.$validator.errors.first(this.name) }
    },
    methods: {
        change(newValue) {
            let value = moment(newValue, 'jYYYY-jMM-jDD HH:mm').format('YYYY/MM/DD HH:mm')
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        this.model = this.value
    }
}
