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
import { getFiltredItems } from '../api/index.js'

export default {
    props: ['field', 'data'],
    data () {
        return {
            value: ''
        }
    },
    computed: {
        related () {
            const relatedFields = this.field.RelatedFields
            let relatedData = {}
            for (let relatedField of relatedFields) {
                relatedData[relatedField] = (this.data || {})[relatedField]
            }
            return relatedData
        }
    },
    asyncComputed: {
        options () {
            console.log('data:', this.data)
            console.log('related:', this.related)
            return getFiltredItems(this.field.LookupList, this.related)
        }
    },
    watch: {
        'data': function (v, o) {
            console.log('data', v, o)
        }
    }
}
</script>

<style>
    
</style>
