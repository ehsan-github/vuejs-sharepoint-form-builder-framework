import Vue from 'vue'
import Vuex from 'vuex'
import R from 'ramda'

import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loading: true,
        listId: new URLSearchParams(location.search).get('List'),
        fields: null,
        errors: []
    },
    getters: {
        isError: s => s.errors.length > 0,
        firstError: s => s.errors[0]
    },
    mutations: {
        loadFields (state, fields) {
            state.fields = fields
            state.loading = false
        },
        addError (state, error) {
            state.errors.push(error)
        },
        removeError (state, error) {
            state.errors = R.reject(R.equals(error), state.errors)
        }
    },
    actions
})

export default store
