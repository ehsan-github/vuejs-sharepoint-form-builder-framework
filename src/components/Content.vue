<template>
  <el-row type='flex' justify='center' v-loading='loading'>
    <el-col :span='18'>
      <PageTemplate ref='template' />
      <el-button type='primary' onClick='click'>زخیره</el-button>
    </el-col>
  </el-row>
</template>

<script>
import PageTemplate from '../templates'

export default {
    props: {
        loading: Boolean
    },
    components: {PageTemplate},
    methods: {
        click () {}
    }
}
</script>

<style>

</style>
