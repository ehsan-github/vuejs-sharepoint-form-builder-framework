import { mapState } from 'vuex'
import TwoColumn from './TwoColumn'
import Custom from './Custom'
import Loading from './Loading'


export default {
    components: { TwoColumn, Custom, Loading },
    template: `
        <component :is="templateName" />
    `,
    computed: {
        ...mapState(['templateName'])
    }
}
