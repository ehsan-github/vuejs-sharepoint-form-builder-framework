<template>
<div>
     <label>{{field.Title}}</label>:
    <el-input placeholder="Please input" v-model="value"></el-input>
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
