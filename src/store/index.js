import Vue from 'vue'
import Vuex from 'vuex'
import { getListId } from '../services/url_params'

import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        loading: true,
        listId: getListId(),
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
