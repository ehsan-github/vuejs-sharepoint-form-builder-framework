<template>
  <el-row type='flex' justify='center' v-loading='loading'>
    <el-col :span='18'>
      <PageTemplate/>
      <el-button type='primary' @click='click'>زخیره</el-button>
    </el-col>
  </el-row>
</template>

<script>
import PageTemplate from '../templates'
import { mapActions } from 'vuex'

export default {
    props: {
        loading: Boolean
    },
    components: {PageTemplate},
    methods: {
        ...mapActions(['saveData']),
        click () {
            this.saveData()
        }
    }
}
</script>

<style>

</style>
