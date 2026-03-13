<script setup lang="ts">
import { Github, MessageCircle } from 'lucide-vue-next';
import { siteConfig } from '@/config/site';

const linkSections = [
  {
    title: 'BX Team',
    links: [
      { href: '/docs', label: 'Documentation' },
      { href: '/team', label: 'Our team' },
      { href: 'https://status.bxteam.org', label: 'Status' },
      { href: 'https://repo.bxteam.org', label: 'Maven Repo' },
    ],
  },
  {
    title: 'Resources',
    links: [{ href: '/resources/flags', label: 'Flags Generator' }],
  },
  {
    title: 'Community',
    links: [{ href: siteConfig.links.discord, label: 'Discord' }],
  },
];

const socials = [
  { href: siteConfig.links.github, label: 'GitHub', icon: Github },
  { href: siteConfig.links.discord, label: 'Discord', icon: MessageCircle },
];

const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="border-t border-neutral-800/80 bg-background/50 backdrop-blur-xl">
    <div class="container mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div class="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-5">
        <!-- Brand column -->
        <section class="text-left lg:col-span-2">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 rounded-xl transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            <NuxtImg src="/logo.png" alt="" :width="28" :height="28" class="rounded-xl" />
            <h2 class="text-base font-semibold">BX Team</h2>
          </NuxtLink>

          <p class="mt-1 text-sm text-neutral-400">
            BX Team is an open source community that focuses on development and maintenance of high-quality Minecraft
            server software. We aim to provide a stable and optimized experience for both server owners and players.
          </p>

          <div class="mt-6 flex gap-4">
            <a
              v-for="social in socials"
              :key="social.href"
              :href="social.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${social.label} (opens in new tab)`"
              class="text-neutral-300 transition-colors hover:text-neutral-100"
            >
              <component :is="social.icon" class="size-4.5" />
            </a>
          </div>
        </section>

        <!-- Link columns -->
        <div class="grid gap-8 sm:grid-cols-2 lg:col-span-3 lg:grid-cols-3">
          <section
            v-for="section in linkSections"
            :key="section.title"
            class="space-y-3"
          >
            <h3 class="text-sm font-medium">{{ section.title }}</h3>
            <ul role="list" class="space-y-1.5">
              <li v-for="link in section.links" :key="link.href" role="listitem">
                <a
                  v-if="link.href.startsWith('http')"
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-neutral-400 transition-colors duration-200 hover:text-white"
                >{{ link.label }}</a>
                <NuxtLink
                  v-else
                  :to="link.href"
                  class="text-sm text-neutral-400 transition-colors duration-200 hover:text-white"
                >{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </section>
        </div>
      </div>

      <div class="mt-8 flex flex-col items-start justify-between gap-4 border-t border-neutral-800/80 pt-8 text-sm sm:flex-row sm:items-center">
        <p class="text-neutral-400">
          &copy; {{ currentYear }} BX Team. Not affiliated with Mojang Studios or Microsoft.
        </p>
      </div>
    </div>
  </footer>
</template>
