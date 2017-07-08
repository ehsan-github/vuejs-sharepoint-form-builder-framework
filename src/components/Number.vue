<template>
<el-row>
     <label>{{field.Title}}</label>:
    <el-input-number ref="input" v-model="value" :controls="false" size="small" @change="change"></el-input-number>
</el-row>
</template>

<script>
export default {
    props: ['field'],
    data () {
        return {value: 0}
    },
    methods: {
        change (v) {
            setTimeout(() => { this.value = Math.floor(parseFloat(v) || 0) }, 0)
        }
    }
}
</script>

<style>

</style>
