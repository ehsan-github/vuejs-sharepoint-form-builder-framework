import { addItem, getEntityTypeName } from '../api'

export async function insertField (listId, item) {
    // pass metaData
    item.__metadata = { type: await getEntityTypeName(listId) }
    return addItem(listId, item)
}
