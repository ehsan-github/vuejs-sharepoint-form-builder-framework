import { getFieldsList, addItem, getEntityTypeName } from '../api'

export function getFieldsOfList (listId) {
    return getFieldsList(listId)
}

export async function insertField (listId, item) {
    // pass metaData
    item.__metadata = {type: await getEntityTypeName(listId)}
    return addItem(listId, item)
}
