<script setup lang="ts">
import Navbar from '@/components/ui/Navbar.vue';
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <Navbar />
    <slot />
  </div>
</template>
