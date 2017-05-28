
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
    return fetch('/_api/' + url, {
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

export function getFieldsList (listId) {
    return request(`web/lists(guid'${listId}')/fields`)
        .then(r => r.results
                    .filter(f => f.InternalName === 'Title' || !f.FromBaseType)
                    .map(f => ({
                        DefaultValue: f.DefaultValue,
                        Description: f.Description,
                        Id: f.Id,
                        InternalName: f.InternalName,
                        Title: f.Title,
                        Required: f.Required,
                        TypeAsString: f.TypeAsString,
                        LookupList: f.LookupList ? f.LookupList.replace('{', '').replace('}', '') : '',
                        LookupField: f.LookupField,
                        QueryLookup: f.QueryLookup
                    })))
}

export function addItem (listId, item) {
    return request(`web/lists(guid'${listId}')/items`, item)
}
export function getItems (listId) {
    return request(`web/lists(guid'${listId}')/items`).then(r => r.results)
}
export function getItemById (listId, itemId) {
    return request(`web/lists(guid'${listId}')/items?$select=Id eq ${itemId}`).then(r => r.results)
}
