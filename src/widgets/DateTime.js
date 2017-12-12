// @flow
import Datepicker from 'vue-jalaali-datepicker/vue-jalaali-datepicker-es6'
import moment from 'moment-jalaali'
import R from 'ramda'

export default {
    inject: ['$validator'],
    components: { Datepicker },
    template: `
    <el-tooltip :disabled="!hasError" class="item" effect="dark" :content="firstError" placement="top-start">
<div><i class="el-icon-date" style="display: inline-block;position: absolute;margin: 11px 80px;color: darkgray;"></i>
        <Datepicker
            v-validate:value="rules"
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
            model: {
                time: ''
            },
            startTime: {
                time: '' // '1396-05-02' (type=day) && '["1396/05/02", "1396/06/02", "1396/07/02"]' (type="multi-day")
            },
            option: {
                type: 'day',
                week: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'],
                month: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
                format: 'jYYYY-jMM-jDD',
                placeholder: '',
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
                format: 'jYYYY-jMM-jDD'
            },
            limit: [{
                type: 'weekday',
                available: [1, 2, 3, 4, 5, 6]
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
            this.model = { time: newValue }
            this.$emit('input', value)
            this.$emit('change', value)
        }
    },
    mounted() {
        if (this.value) {
            let value = R.pipe(
                R.split(' '),
                R.head,
                R.split('/'),
                ([m, d, y]) => [y, m, d],
                R.join('/')
            )(this.value)
            let time = moment(value, 'YYYY/MM/DD').format('jYYYY-jMM-jDD')
            this.model = { time }
            this.startTime = { time }
        } else {
            this.model = {
                time: ''
            }
        }
    }
}
