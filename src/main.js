// @flow
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import VeeValidate from 'vee-validate'

import './assets/global.css'
import 'element-ui/lib/theme-default/index.css'
import locale from 'element-ui/lib/locale/lang/fa'

import App from './components/App'
import store from './store'

window.__disableNativeFetch = true
/* eslint-disable no-undef */
require('fetch-ie8')
require('animate.css')

const messages = {
    after: (field, [target]) => `باید بعد از تاریخ ${target} باشد.`,
    alpha_dash: () => 'فقط می تواند از حروف، اعداد، خط فاصله و زیرخط تشکیل شود.',
    alpha_num: () => 'فقط میتواند از حروف و اعداد تشکیل شود.',
    alpha_spaces: () => 'فقط می تواند از حروف و فاصله تشکیل شود.',
    alpha: () => 'فقط می تواند از حروف تشکیل شود.',
    before: (field, [target]) => `باید قبل از تاریخ ${target} باشد.`,
    between: (field, [min, max]) => `باید بین ${min} و ${max} کارکتر باشد.`,
    confirmed: () => 'با تاییدیه اش مطابقت ندارد.',
    credit_card: () => 'غیر معتبر است.',
    date_between: (field, [min, max]) => `باید بین تاریخ ${min} and ${max} باشد.`,
    date_format: (field, [format]) => `باید در قالب ${format} باشد.`,
    decimal: (field, [decimals] = ['*']) => `باید یک مقدار عددی ${decimals === '*' ? '' : ' با حداکثر ' + decimals + ' اعشار'} باشد.`,
    digits: (field, [length]) => `باید یک مقدار عددی و دقیقاً ${length} رقم باشد.`,
    dimensions: (field, [width, height]) => `باید در اندازه ${width} پیکسل عرض و ${height} پیکسل ارتفاع باشد.`,
    email: () => 'باید یک پست الکترونیک معتبر باشد.',
    ext: () => 'باید یک فایل معتبر باشد.',
    image: () => 'باید یک تصویر باشد.',
    in: () => 'باید یک مقدار معتبر باشد.',
    ip: () => 'باید یک آدرس آی پی معتبر باشد.',
    max: (field, [length]) => `نباید بیشتر از ${length} کارکتر باشد.`,
    max_value: (field, [max]) => `مقدار باید ${max} یا کمتر باشد.`,
    mimes: () => 'باید از نوع معتبر باشد.',
    min: (field, [length]) => `باید حداقل ${length} کارکتر باشد.`,
    min_value: (field, [min]) => `مقدار باید ${min} یا بیشتر باشد.`,
    not_in: () => 'باید یک مقدار معتبر باشد.',
    numeric: () => 'فقط می تواند عددی باشد.',
    regex: () => 'قالب قابل قبول نیست.',
    required : () => 'اين فيلد الزامى می‌باشد',
    size: (field, [size]) => `حجم کمتر از ${localizeSize(size)} باشد.`,
    url: () => 'باید یک تارنمای معتبر باشد.'
}

const dictionary = {
    fa: {
        messages,
        attributes:{}
    }
};

const veeValidateConfig = {
    errorBagName: 'veeErrors', // change if property conflicts.
    fieldsBagName: 'veeFields',
    delay: 0,
    locale: 'fa',
    dictionary,
    strict: true,
    classes: false,
    classNames: {
        touched: 'touched', // the control has been blurred
        untouched: 'untouched', // the control hasn't been blurred
        valid: 'valid', // model is valid
        invalid: 'invalid', // model is invalid
        pristine: 'pristine', // control has not been interacted with
        dirty: 'dirty' // control has been interacted with
    },
    events: 'input|blur',
    inject: false,
    validity: true,
    aria: true
}

Vue.use(VeeValidate, veeValidateConfig)

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App class="new"/>',
    components: { App },
    store
})
