import { getApiF, postApiF, path } from './utils'

export const getEntityTypeName = listId => getApiF(
    `/_api/lists(guid'${listId}')/listItemEntityTypeFullName`
).chain(path(r => r.ListItemEntityTypeFullName))

export const getFieldsList = listId => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/GetFieldsList',
    { listId }
)

export const addItem = (listId, item) => postApiF(
    `/_api/web/lists(guid'${listId}')/items`,
    item
)

export const saveFieldItems = (guid, fields) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/SaveFieldItems',
    { guid, fields }
)

export const getItems = listId => getApiF(
    `/_api/web/lists(guid'${listId}')/items`
).chain(path(r => r.results))

export const getFiltredItems = (listId, query) => getApiF(
    `/_api/web/lists(guid'${listId}')/items?${query}`
).chain(path(r => r.results))

export const getItemById = (listId, itemId) => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$select=Id eq ${itemId}`
).chain(path(r => r.results))

export const getContractSpec = cid => getApiF(
    `/_api/web/lists(guid'548C9C76-AAC3-404D-A24A-20BCD884A31B')/items?$filter=Id eq ${cid}`
)
    .chain(path(r => r.results))
