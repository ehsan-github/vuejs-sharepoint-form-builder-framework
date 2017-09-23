// @flow
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import VeeValidate from 'vee-validate'

import './assets/global.css'
import 'element-ui/lib/theme-default/index.css'

import App from './components/App'
import store from './store'

window.__disableNativeFetch = true
/* eslint-disable no-undef */
require('fetch-ie8')

const dictionary = {
    fa: {
        messages:{
            required: () => 'اين فيلد الزمى ميباشد'
        },
        attributes:{
            emial: 'email address'
        }
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
    inject: true,
    validity: true,
    aria: true
}

Vue.use(VeeValidate, veeValidateConfig)

Vue.use(ElementUI)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    components: { App },
    store
})
