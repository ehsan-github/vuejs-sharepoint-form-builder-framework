// @flow

export default {
    props: ['fields'],
    template: `
    <thead>
        <span>
            <tr>
                <th class="button"></th>
                <th class="radif">ردیف</th>
                <th class='is-leaf' v-for='f in fields' :key='f.Guid' :class="f.Type">{{f.Title}}</th>
            </tr>
        </span>
    </thead>
    `,
}
