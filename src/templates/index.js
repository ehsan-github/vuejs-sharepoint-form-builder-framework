import { mapState } from 'vuex'
import TwoColumn from './TwoColumn'
import Custom from './Custom'


export default {
    components: { TwoColumn, Custom },
    template: `
        <component :is="templateName" />
    `,
    computed: {
        ...mapState(['templateName'])
    }
}
