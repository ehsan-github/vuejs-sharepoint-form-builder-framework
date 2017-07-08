import Vue from 'vue'
import Vuex from 'vuex'
import { getListId } from '../services/url_params'

import * as actions from './actions'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        listId: getListId(),
        fields: null
    },
    mutations: {
        loadFields (state, fields) {
            state.fields = fields
        }
    },
    actions
})

export default store
