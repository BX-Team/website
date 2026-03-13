<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { GradientBackground } from '@/components/ui/gradient-background';

function scrollToProjects(e: MouseEvent) {
  e.preventDefault();
  document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
</script>

<template>
  <section class="relative isolate min-h-screen">
    <GradientBackground />

    <div class="mx-auto max-w-7xl px-6 py-20 sm:px-8 lg:px-12 lg:py-32">
      <div class="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div class="text-center lg:text-left">
          <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl">
            Welcome to
            <span class="block">BX Team</span>
          </h1>

          <p class="mt-6 text-base leading-7 text-neutral-300 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
            BX Team is an open source community that focuses on development and maintenance of high-quality Minecraft
            server software. We aim to provide a stable and optimized experience for both server owners and players.
          </p>

          <div class="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row lg:items-start lg:justify-start">
            <Button as-child class="w-full sm:w-auto px-6 py-2">
              <NuxtLink to="/docs">Documentation</NuxtLink>
            </Button>
            <Button as-child variant="ghost" class="w-full sm:w-auto px-6 py-2">
              <a
                href="#projects"
                target="_self"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2"
                @click="scrollToProjects"
              >
                Our projects
                <ArrowRight class="ml-2 size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
        </div>

        <div class="hidden justify-end lg:flex">
          <div class="relative">
            <div class="absolute inset-0 scale-110 rounded-full bg-blue-500/20 blur-3xl" />
            <div class="relative size-80 xl:size-96">
              <NuxtImg
                src="/logo.png"
                alt="BX Team Logo"
                class="size-full object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
