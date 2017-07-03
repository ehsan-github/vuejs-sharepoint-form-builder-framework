<template>
  <div class="block">
     <label>{{field.Title}}</label>:
    <el-date-picker
      v-model="value"
      type="date"
      placeholder="Pick a day">
    </el-date-picker>
  </div>
</template>



<script>
export default {
    props: ['field'],
    data () {
        return {
            value: ''
        }
    }
}
</script>

<style>
    
</style>

