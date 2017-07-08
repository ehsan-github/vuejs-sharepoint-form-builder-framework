import Vue from 'vue'
import Vuex from 'vuex'
import { getListId } from './services/url_params'
import { getFieldsOfList } from './services/list_fields'

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
    actions: {
        async loadFields ({commit, state}) {
            const listFields = await getFieldsOfList(state.listId)
            commit('loadFields', listFields)
        }
    }
})

export default store
