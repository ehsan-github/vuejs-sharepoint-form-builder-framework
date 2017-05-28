
export function getListId () {
    const params = new URLSearchParams(location.search)
    return params.get('List')
}
