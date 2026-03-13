<script setup lang="ts">
import { BookOpen, Download, Github } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

type Project = {
  name: string;
  description: string;
  downloadUrl: string;
  docUrl: string;
  sourceUrl: string;
};

const projects: Project[] = [
  {
    name: 'DivineMC',
    description:
      'Multi-functional fork of Purpur, which focuses on the flexibility of your server and its optimization.',
    downloadUrl: '/downloads/divinemc',
    docUrl: '/docs/divinemc',
    sourceUrl: 'https://github.com/BX-Team/DivineMC',
  },
  {
    name: 'Quark',
    description:
      'A lightweight, runtime dependency management system for plugins running on Minecraft server platforms.',
    downloadUrl: '/docs/quark/usage/installing',
    docUrl: '/docs/quark',
    sourceUrl: 'https://github.com/BX-Team/Quark',
  },
  {
    name: 'NDailyRewards',
    description:
      'Simple and lightweight plugin that allows you to reward your players for playing on your server every day.',
    downloadUrl: 'https://modrinth.com/plugin/ndailyrewards',
    docUrl: '/docs/ndailyrewards',
    sourceUrl: 'https://github.com/BX-Team/NDailyRewards',
  },
];

const gridCols = computed(() => {
  if (projects.length === 1) return 'grid-cols-1';
  if (projects.length === 2) return 'sm:grid-cols-2';
  return 'sm:grid-cols-2 lg:grid-cols-3';
});
</script>

<template>
  <section id="projects" class="mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
    <header class="mb-10 max-w-2xl text-left">
      <h2 class="text-3xl font-semibold text-white">Our Projects</h2>
      <p class="mt-3 text-lg text-neutral-300">
        Explore our projects that we are currently developing and maintaining
      </p>
    </header>

    <div :class="`grid gap-6 ${gridCols}`">
      <Card
        v-for="project in projects"
        :key="project.name"
        class="flex h-full flex-col p-6 transition-all duration-200 hover:shadow-xl hover:ring-neutral-600/60"
      >
        <div class="flex-1">
          <div class="mb-3 flex items-start justify-between">
            <h3 class="text-lg font-medium text-neutral-100">{{ project.name }}</h3>
          </div>
          <p class="mt-2 text-sm leading-relaxed text-neutral-400">{{ project.description }}</p>
        </div>

        <div class="mt-6 space-y-3">
          <Button as-child class="w-full">
            <a
              v-if="project.downloadUrl.startsWith('http')"
              :href="project.downloadUrl"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`Download ${project.name}`"
              class="flex items-center justify-center"
            >
              <Download class="mr-2 size-4" />
              Download
            </a>
            <NuxtLink
              v-else
              :to="project.downloadUrl"
              :aria-label="`Download ${project.name}`"
              class="flex items-center justify-center"
            >
              <Download class="mr-2 size-4" />
              Download
            </NuxtLink>
          </Button>

          <div class="flex gap-2">
            <Button as-child variant="outline" size="sm" class="flex-1">
              <NuxtLink
                :to="project.docUrl"
                :aria-label="`Read Documentation for ${project.name}`"
                class="flex items-center justify-center"
              >
                <BookOpen class="mr-1 size-3" />
                Docs
              </NuxtLink>
            </Button>
            <Button as-child variant="outline" size="sm" class="flex-1">
              <a
                :href="project.sourceUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`View Source Code for ${project.name}`"
                class="flex items-center justify-center"
              >
                <Github class="mr-1 size-3" />
                Source
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  </section>
</template>
