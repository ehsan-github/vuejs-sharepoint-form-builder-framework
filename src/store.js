import Vue from 'vue'
import Vuex from 'vuex'
import { getListId } from './services/url_params'

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
    }
})

export default store
