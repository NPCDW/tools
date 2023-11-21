<template>
  <div style="margin: 20px">
    <el-input v-model="input" type="textarea" :rows="30"/>
    <el-button type="primary" @click="format">格式化</el-button>
  </div>
</template>

<script setup lang="ts">
import * as prettier from "prettier";
import parserHtml from 'prettier/plugins/html'
import {ref} from "vue";

const input = ref("");

function format() {
  prettier.format(input.value, {
    parser: "html",
    plugins: [parserHtml]
  }).then(res => {
    input.value = res
  }).catch(e => {
    input.value = e
  })
}
</script>

<style scoped>
</style>