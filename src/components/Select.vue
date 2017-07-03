<template>
<div>
     <label>{{field.Title}}</label>:
       <el-select v-model="value" placeholder="انتخاب" @change="change">
        <el-option
        v-for="item in options"
        key="item.Id"
        :label="item.Title"
        :value="item.Id">
        </el-option>
    </el-select>
</div>
</template>

<script>
import { getItems } from '../api/index.js'

export default {
    props: ['field'],
    data () {
        return {
            value: ''
        }
    },
    methods: {
        change (v) {
            this.$emit('change', v)
        }
    },
    asyncComputed: {
        options () {
            return getItems(this.field.LookupList)
        }}
}
</script>

<style>
    
</style>
