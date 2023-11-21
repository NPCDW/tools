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

async function format() {
  input.value = await prettier.format(input.value, {
    parser: "html",
    plugins: [parserHtml]
  });
}
</script>

<style scoped>
</style>