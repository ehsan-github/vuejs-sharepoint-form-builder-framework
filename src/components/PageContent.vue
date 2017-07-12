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
            this.saveData().then(r => {
                this.$notify.success({
                    title: 'موفقیت',
                    message: 'داده ها با موفقیت زخیره شد'
                })
            }).catch(e => {
                this.$notify.error({
                    title: 'خطا',
                    message: 'در هنگام زخیره خطایی رخ داده است'
                })
            })
        }
    }
}
</script>

<style>

</style>
