import R from 'ramda'
import {Future} from 'ramda-fantasy'

// General fetch future

const fetchF = R.curry(
    (options, addr) => new Future(
        (l, r) => fetch(addr, options).then(r).catch(l)
    )
)

// Utility functions

const json = res => new Future((l, r) => res.json().then(r).catch(l))

export const path = pfn => res => new Future((l, r) => R.pipe(
    R.tryCatch(pfn, R.F),
    R.ifElse(R.identity, r, l)
)(res))

const jsonifyF = R.tryCatch(
    R.compose(Future.of, JSON.stringify),
    Future.reject
)

// fetch options

const getOpt = { method: 'GET' }
const postOpt = { method: 'POST' }
const headerOpt = (...headers) => ({headers: R.mergeAll(headers)})

const acceptHdr = { Accept: 'application/json;odata=verbose' }
const contentHdr = { 'Content-Type': 'application/json;odata=verbose' }
const credHdr = { credentials: 'include' }
const digestHdr = digest => ({ 'X-RequestDigest': digest })

// General request apis

const requestFormDigest = R.chain(
    Future.of('/_api/contextinfo'),
    fetchF(R.merge(postOpt, headerOpt(acceptHdr))),
    json,
    path(r => r.d.GetContextWebInformation.FormDigestValue)
)

export const getApiF = addr => R.chain(
    fetchF(R.merge(getOpt, headerOpt(acceptHdr, contentHdr, credHdr)), addr),
    json,
    path(r => r.d)
)

export const postApiF = (addr, body) => R.chain(
    R.sequence(Future.of, [jsonifyF(body), requestFormDigest]),
    ([body, digest]) => fetchF(R.merge(postOpt, headerOpt(acceptHdr, contentHdr, credHdr, digestHdr(digest))), addr),
    json,
    path(r => r.d)
)
