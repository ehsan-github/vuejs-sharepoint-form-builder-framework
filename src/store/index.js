import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loading: true,
        listId: new URLSearchParams(location.search).get('List'),
        fields: null
    },
    mutations: {
        loadFields (state, fields) {
            state.fields = fields
            state.loading = false
        }
    },
    actions
})

export default store
