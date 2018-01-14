import { getApiF, postApiF, path } from './utils'

import { /*CONTRACTS_LIST_ID, */TEMPLATE_LIST_ID } from '../constants'

export const getEntityTypeName = listId => getApiF(
    `/_api/lists(guid'${listId}')/listItemEntityTypeFullName`
).chain(path(r => r.ListItemEntityTypeFullName))

export const getFieldsList = (listId, itemId, contentTypeId) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/GetFieldsList',
    { listId, itemId, formType: 'Edit', contentTypeId }
)

export const getListData = listId => getApiF(
    `/_api/web/lists(guid'${listId}')`
)

export const addItem = (listId, item) => postApiF(
    `/_api/web/lists(guid'${listId}')/items`,
    item
)

export const saveFieldItems = (guid, fields, deletedItems, addFiles, deleteFiles) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/SaveFieldItems',
    { guid, fields, deletedItems, addFiles, deleteFiles }
)

export const getItems = listId => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$filter=FSObjType eq 0`
).chain(path(r => r.results))

export const getFilteredItems = (listId, query) => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$filter=${query} and FSObjType eq 0`
).chain(path(r => r.results))

export const getItemById = (listId, itemId) => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$select=Id eq ${itemId}`
).chain(path(r => r.results))

// export const getContractSpec = cid => getApiF(
//     `/_api/web/lists(guid'${CONTRACTS_LIST_ID}')/items?$filter=Id eq ${cid}&$select=Title,Area/Title,Contractor/Title,Consultant/Title&$expand=Area,Contractor,Consultant`
// )
//     .chain(path(r => r.results))

export const getTemplate = title => getApiF(
    `/_api/web/lists(guid'${TEMPLATE_LIST_ID}')/items?$filter=Title eq '${title}' and formType eq 'Edit'`
).chain(path(r => r.results))

export const getItemMaster = (listId, itemNumber, select) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/GetData',
    { listId, fieldName: 'ID', value: Number(itemNumber), select }
)

export const getItemDetail = (listId, fieldName, itemNumber, select) => postApiF(
    '/_Layouts/15/BaseSolution/Services.aspx/GetData',
    { listId, fieldName, value: Number(itemNumber), select }
)

export const loadUploadedFile = (listId, itemId) => getApiF(
    `/_api/web/lists(guid'${listId}')/items?$select=EncodedAbsUrl,Title&$filter=Id eq ${itemId}`
).chain(path(r => r.results))
