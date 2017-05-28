<template>
<div>
     <label>{{field.Title}}</label>:
       <el-select v-model="value" placeholder="انتخاب">
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
    props: ['field', 'data'],
    data () {
        return {
            value: ''
        }
    },
    computed: {
        related () {
            const relatedFields = this.field.RelatedTo
            let relatedData = {}
            for (relatedField of relatedFields) {
                relatedData[relatedField] = this.data.filter(d => d.Id === relatedField)[0]
            }
            return relatedData
        }
    },
    asyncComputed: {
        options () {
            return getFiltredItems(this.field.LookupList, this.related)
        }}
}
</script>

<style>
    
</style>
