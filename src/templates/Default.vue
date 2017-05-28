<template>
  <div>
    <Field v-for="f in fields" :field="f" key="f.Id" ref="fields" :data="values" />
  </div>
</template>

<script>
import Field from '../components/Field'

export default {
    components: {Field},
    props: ['fields'],
    computed: {
        values () {
            return this.$refs.fields
        }
    }
}
</script>

<<style>
    
</style>
