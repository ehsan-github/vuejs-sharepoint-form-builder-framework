import { mapState } from 'vuex'
import SimpleColumn from './SimpleColumn'
import Custom from './Custom'
import Loading from './Loading'


export default {
    components: { SimpleColumn, Custom, Loading },
    template: `
        <component :is="templateName" :columnsNum="columnsNum"/>
    `,
    computed: {
        ...mapState(['templateName', 'columnsNum'])
    }
}
