<script setup lang="ts">
import {fetchEventSource} from "@microsoft/fetch-event-source";

fetchEventSource('/api/event-stream', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream'
  },
  body: JSON.stringify({
    event: 'hello',
  }),
  openWhenHidden: true,
  onmessage: (msg) => {
    console.log(msg.data)
  },
  onclose: () => {
    console.log('connection closed')
  },
  onerror: (err) => {
    console.log(err)
  },
  onopen: (response) => {
    console.log('connection opened', response)
    return Promise.resolve()
  }
})
</script>

<template>

</template>

<style scoped>

</style>