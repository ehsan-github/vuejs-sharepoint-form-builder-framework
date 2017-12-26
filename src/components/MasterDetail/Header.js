// @flow
import R from 'ramda'

export default {
    props: ['fields', 'headers'],
    template: `
    <thead>
        <span class="header-span">
            <tr v-for='(row, index) in constructedHeaders'>
                <th v-if='index == 0' :rowspan="constructedHeaders.length" class="button"></th>
                <th v-if='index == 0' :rowspan="constructedHeaders.length" class="radif">ردیف</th>
                <th v-for='f in row' :colspan="f.colspan || 1" :rowspan="f.rowSpan || 1" :key='f.Guid' :class="f.Type" class='is-leaf'>
                    <el-tooltip :disabled="f.Description == '' || !f.Description" effect="light" :content="f.Description" placement="top">
                    <div>
                        {{f.Title || f.name}}
                    </div>
                    </el-tooltip>
                </th>
            </tr>
        </span>
    </thead>
    `,
    computed: {
        validHeaders () {
            return this.headers ? JSON.parse(this.headers) || [[]] : [[]]
        },
        constructedHeaders() {
            let headers = R.map(addRowspan, R.tail(this.validHeaders))
            let renamings = R.head(this.validHeaders)
            let fields = [R.pipe(
                addRowspan,
                renameTitles(renamings)
            )(this.fields)]
            return R.reduce(reduceFunction, fields, headers)
        }
    }
}

const reduceFunction = (resultHeaders, group) => {
    return R.concat(
        makeTwoRows(R.head(resultHeaders), group),
        R.tail(resultHeaders))
}

const makeTwoRows = (row, group) => {
    return R.reduce(
        addToOneOfRows(group),
        [[], []],
        row)
}

const addToOneOfRows = group => (twoRows, item) => {
    let groupingFields = R.chain(R.prop('fields'), group)
    let itemName = item.InternalName || item.name
    if (R.contains(itemName, groupingFields)){
        let groupItem = getItemContains(itemName, group)
        return R.pipe(
            R.adjust(R.pipe(R.append(groupItem), R.uniq), 0),
            R.adjust(R.append(item), 1)
        )(twoRows)
    } else {
        return R.adjust(R.append(R.over(R.lensProp('rowSpan'), R.inc, item)), 0, twoRows)
    }
}

const getItemContains = (name, group) => R.find(item => R.contains(name, R.prop('fields', item)), group)

const addRowspan = R.map(R.assoc('rowSpan', 1))

const renameTitles = renamings => fields => R.reduce(renameTitle, fields, renamings)

const renameTitle = (fields, field) => {
    let index = R.findIndex(R.propEq('InternalName', R.prop('name', field)), fields)
    return R.adjust(R.assoc('Title', R.prop('title', field)), index, fields)
}
