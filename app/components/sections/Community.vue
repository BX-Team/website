<script setup lang="ts">
import { Github, MessageCircle } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { siteConfig } from '@/config/site';

const communities = [
  {
    title: 'Discord',
    description: 'Join our Discord community to get support, share your experiences, and connect with other users.',
    icon: MessageCircle,
    buttonText: 'Join Discord',
    href: siteConfig.links.discord,
  },
  {
    title: 'GitHub',
    description: 'Contribute to BX Team, report issues, and explore our open source codebase on GitHub.',
    icon: Github,
    buttonText: 'View GitHub',
    href: siteConfig.links.github,
  },
];

const gridCols = computed(() => {
  if (communities.length === 1) return 'grid-cols-1';
  if (communities.length === 2) return 'sm:grid-cols-2';
  return 'sm:grid-cols-2 lg:grid-cols-3';
});
</script>

<template>
  <section class="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-28">
    <header class="max-w-2xl">
      <h2 class="text-3xl font-semibold text-white">Join our community</h2>
      <p class="mt-3 text-lg text-neutral-300">
        Connect with our community, contribute to development, and stay up to date.
      </p>
    </header>

    <div :class="`mt-10 grid gap-6 ${gridCols}`">
      <Card
        v-for="item in communities"
        :key="item.title"
        class="flex h-full flex-col p-6 transition-all duration-200 hover:ring-neutral-600/60"
      >
        <div class="flex flex-1 gap-4">
          <div class="shrink-0">
            <div class="rounded-lg bg-neutral-700/50 p-2.5">
              <component :is="item.icon" class="size-5 text-neutral-100" />
            </div>
          </div>
          <div>
            <h3 class="font-medium text-neutral-100">{{ item.title }}</h3>
            <p class="mt-1.5 text-sm text-neutral-400">{{ item.description }}</p>
          </div>
        </div>

        <div class="mt-6 border-t border-neutral-800 pt-4">
          <Button as-child variant="secondary" class="w-full">
            <a :href="item.href" target="_blank" rel="noopener noreferrer">
              {{ item.buttonText }}
            </a>
          </Button>
        </div>
      </Card>
    </div>
  </section>
</template>
