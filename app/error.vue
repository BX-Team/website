<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next';
import type { NuxtError } from '#app';
import { Button } from '@/components/ui/button';
import { GradientBackground } from '@/components/ui/gradient-background';
import { siteConfig } from '@/config/site';

const props = defineProps<{
  error: NuxtError;
}>();

const handleError = () => clearError({ redirect: '/' });

const errorTitle = computed(() => {
  if (props.error.statusCode === 404) {
    return "We've lost this page";
  }
  return 'Something went wrong';
});

const errorMessage = computed(() => {
  if (props.error.statusCode === 404) {
    return "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.";
  }
  return props.error.statusMessage || 'An unexpected error occurred. Please try again later.';
});
</script>

<template>
  <div class="relative flex min-h-screen items-center justify-center">
    <GradientBackground />

    <section class="mx-auto w-full max-w-2xl px-6 text-center sm:px-8 lg:px-12 py-20">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl">
        {{ errorTitle }}
      </h1>

      <p class="mt-4 text-muted-foreground sm:text-lg">
        {{ errorMessage }}
      </p>

      <nav class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center" aria-label="Error page navigation">
        <Button size="lg" @click="handleError">
          <ArrowLeft class="size-4 mr-2" aria-hidden="true" />
          Back to Home
        </Button>

        <Button as-child variant="secondary" size="lg">
          <NuxtLink :to="siteConfig.links.discord" external target="_blank">
            Report this on our Discord
          </NuxtLink>
        </Button>
      </nav>
    </section>
  </div>
</template>
