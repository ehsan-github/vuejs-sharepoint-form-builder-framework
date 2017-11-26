import R from 'ramda'

// we get [x, y, ...] & { id: {"InternalName": y}, ...} => [{"InternalName": x}, {"InternalName": y}]
export const getSortedList = list => fields => R.map(x => R.find(R.propEq('InternalName', x), R.values(fields)), list)

export const getFilteredView = R.curry((filterList, fields) => R.filter(field => filterList.includes(field.InternalName), fields))

// [{row: x, internalName: y, message: z}] => {'x': {'y': 'z'}}
export const transformErrors = errors => R.pipe(
    R.map(R.groupBy(R.prop('InternalName'))),
    R.map(R.pipe(
        R.map(R.head),
        R.map(R.prop('Message'))))
)(R.groupBy(R.prop('RowNumber'), errors))

export const replaceQueryFields = fields => query => R.reduce(
    (q, field) => R.replace('{{'+field.InternalName+'}}', field.value || 'null', q),
    query,
    R.values(fields)
)

export const replaceQueryMasterFields = fields => query => R.reduce(
    (q, field) => R.replace('{{m.'+field.InternalName+'}}', field.value || 'null', q),
    query,
    R.values(fields)
)
