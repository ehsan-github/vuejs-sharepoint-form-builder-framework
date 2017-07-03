<template>
  <div>
    <Field v-for="f in fields" :field="f" key="f.Id" ref="fields" :data="values" @change="change" />
  </div>
</template>

<script>
import Field from '../components/Field'

export default {
    components: {Field},
    props: {
        fields: {
            type: Array,
            default: []
        }
    },
    data () {
        return {
            values: {}
        }
    },
    mounted () {
        const unwatch = this.$watch('$refs.fields', (val) => {
            console.log('watch', val, this.fields)
            if (!val || val.length !== this.fields.length) {
                return
            }
            for (const field of this.$refs.fields) {
                this.values = {...this.values, ...field.value}
            }
            unwatch()
        }, {immediate: true})
    },
    methods: {
        change (val) {
            console.log('default change', val)
            this.values = {...this.values, ...val}
        }
    }
}
</script>

<style>

</style>
