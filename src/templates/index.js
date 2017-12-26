import { mapState } from 'vuex'
import SimpleColumn from './SimpleColumn'
import SimpleColumn2 from './SimpleColumn2'
import TwoSide from './TwoSide'
import Custom from './Custom'
import Loading from './Loading'


export default {
    components: { SimpleColumn, SimpleColumn2, Custom, Loading, TwoSide },
    template: `
        <component :is="templateName" :columnsNum="columnsNum"/>
    `,
    computed: {
        ...mapState(['templateName', 'columnsNum'])
    }
}
