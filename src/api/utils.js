// @flow
import R from 'ramda'
import { Future } from 'ramda-fantasy'

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
const headerOpt = (...headers) => ({ headers: R.mergeAll(headers) })

const acceptHdr = { Accept: 'application/json;odata=verbose' }
const contentHdr = { 'Content-Type': 'application/json;odata=verbose' }
const credHdr = { credentials: 'include' }
const digestHdr = digest => ({ 'X-RequestDigest': digest })

// General request apis

const requestFormDigest = R.pipeK(
    fetchF(R.merge(postOpt, headerOpt(acceptHdr))),
    json,
    path(r => r.d.GetContextWebInformation.FormDigestValue)
)('/_api/contextinfo')

export const getApiF = R.pipeK(
    fetchF(R.merge(getOpt, headerOpt(acceptHdr, contentHdr, credHdr))),
    json,
    path(r => r.d)
)

export const postApiF = R.pipeK(
    (addr, body) => R.sequence(Future.of, [Future.of(addr), jsonifyF(body), requestFormDigest]),
    ([addr, body, digest]) => {
        const opts = R.mergeAll([postOpt, headerOpt(acceptHdr, contentHdr, credHdr, digestHdr(digest)), { body }])
        return fetchF(opts, addr)
    },
    json,
    path(r => r.d)
)
