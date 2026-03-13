<script setup lang="ts">
import { siteConfig } from '@/config/site';

useHead({
  titleTemplate: title => {
    if (!title) return siteConfig.name;
    return `${title} | ${siteConfig.name}`;
  },
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
