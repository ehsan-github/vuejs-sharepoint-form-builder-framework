// @flow

export default {
    props: ['fields'],
    template: `
    <thead>
        <span class="header-span">
            <tr>
                <th class="button"></th>
                <th class="radif">ردیف</th>
                <th class='is-leaf' v-for='f in fields' :key='f.Guid' :class="f.Type">
                    <el-tooltip :disabled="f.Description == ''" effect="light" :content="f.Description" placement="top">
                    <div>
                    {{f.Title}}
                    </div>
                    </el-tooltip>
                </th>
            </tr>
        </span>
    </thead>
    `,
}
