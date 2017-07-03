
// Utility requests

async function requestFormDigest () {
    const result = await fetch('/_api/contextinfo', {
        method: 'POST',
        headers: {
            Accept: 'application/json;odata=verbose'
        }
    })
    const t = await result.json()
    return t.d.GetContextWebInformation.FormDigestValue
}

export async function getEntityTypeName (listId) {
    const result = await fetch(`/_api/lists(guid'${listId}')/listItemEntityTypeFullName`, {
        headers: {
            Accept: 'application/json;odata=verbose'
        }
    })
    const t = await result.json()
    return t.d.ListItemEntityTypeFullName
}

// General request function

async function request (url, body) {
    let digest = {}
    if (body != null) {
        digest['X-RequestDigest'] = await requestFormDigest()
    }
    return fetch(url, {
        method: body == null ? 'GET' : 'POST',
        body: body == null ? body : JSON.stringify(body),
        headers: {
            Accept: 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose',
           // Authorization: 'Bearer',
            credentials: 'include',
            ...digest
        }
    }).then(r => r.json()).then(r => r.d)
}

// API
export async function getFieldsList (listId) {
    let digest = {}
    digest['X-RequestDigest'] = await requestFormDigest()
    return fetch('/_Layouts/15/BaseSolution/Services.aspx/GetFieldsList', {
        method: 'POST',
        body: JSON.stringify({ listId: 'D683087D-D4CF-46F4-8EBB-B93D0CBFA607' }), // JSON.stringify({'listId': listId}),
        headers: {
            Accept: 'application/json;odata=verbose',
            'Content-Type': 'application/json;odata=verbose',
            credentials: 'include',
            ...digest
        }
    }).then(r => r.json())
    .then(r => {
        return r.d
    })
}

export function addItem (listId, item) {
    return request(`/_api/web/lists(guid'${listId}')/items`, item)
}
export function getItems (listId) {
    return request(`/_api/web/lists(guid'${listId}')/items`).then(r => r.results)
}
export function getFiltredItems (listId, query) {
    return request(`/_api/web/lists(guid'${listId}')/items?${query}`).then(r => r.results)
}
export function getItemById (listId, itemId) {
    return request(`/_api/web/lists(guid'${listId}')/items?$select=Id eq ${itemId}`).then(r => r.results)
}
