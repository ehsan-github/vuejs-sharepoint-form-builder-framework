<template>
<div>
     <el-checkbox v-model="value">{{field.Title}}</el-checkbox>
</div>
</template>

<script>
export default {
    props: ['field'],
    data () {
        return {
            value: false
        }
    }
}
</script>

<style>
    
</style>
