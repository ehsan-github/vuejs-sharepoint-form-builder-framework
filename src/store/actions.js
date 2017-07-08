import { getFieldsOfList } from '../services/list_fields'

export async function loadFields ({commit, state}) {
    const listFields = await getFieldsOfList(state.listId)
    commit('loadFields', listFields)
}
