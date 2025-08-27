<script setup lang="ts">
import { Button, Hr, Html, Text } from '@vue-email/components'

defineProps({
  url: String,
})
</script>

<template>
  <Html lang="en">
    <Text>Verify your email</Text>
    <Hr />
    <Button :href="url">
      Click me
    </Button>
  </Html>
</template>
