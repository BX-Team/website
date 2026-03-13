<script setup lang="ts">
import { Menu, X, Github } from 'lucide-vue-next';
import { siteConfig } from '@/config/site';

const mobileMenuOpen = ref(false);

const navLinks = [
  { label: 'Documentation', to: '/docs', external: false },
  { label: 'Team', to: '/team', external: false },
  { label: 'Status', to: 'https://status.bxteam.org', external: true },
];
</script>

<template>
  <header class="sticky top-0 z-50 border-b border-neutral-800/80 bg-background/80 backdrop-blur-xl">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-14 items-center justify-between gap-4">
        <!-- Logo and Navigation -->
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20 shrink-0"
          >
            <NuxtImg src="/logo.png" alt="BX Team" width="28" height="28" class="rounded-xl" />
            <span class="font-semibold text-sm">BX Team</span>
          </NuxtLink>

          <!-- Desktop navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <template v-for="link in navLinks" :key="link.to">
              <a
                v-if="link.external"
                :href="link.to"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3 py-2 text-sm font-medium text-[#7E7E7E] hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >{{ link.label }}</a>
              <NuxtLink
                v-else
                :to="link.to"
                class="px-3 py-2 text-sm font-medium text-[#7E7E7E] hover:text-foreground transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >{{ link.label }}</NuxtLink>
            </template>
          </nav>
        </div>

        <!-- Social links + mobile toggle -->
        <div class="flex items-center gap-2">
          <a
            :href="siteConfig.links.github"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            class="rounded-md p-2 text-neutral-400 transition-colors hover:text-neutral-100"
          >
            <Github class="size-4.5" />
          </a>
          <a
            :href="siteConfig.links.discord"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Discord"
            class="rounded-md p-2 text-neutral-400 transition-colors hover:text-neutral-100"
          >
            <!-- Discord icon (SVG) -->
            <svg role="img" viewBox="0 0 24 24" class="size-4.5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.03.056A19.9 19.9 0 0 0 6.1 21.022a.077.077 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
          </a>

          <!-- Mobile hamburger -->
          <button
            class="md:hidden rounded-md p-2 text-neutral-400 transition-colors hover:text-neutral-100"
            :aria-label="mobileMenuOpen ? 'Close menu' : 'Open menu'"
            @click="mobileMenuOpen = !mobileMenuOpen"
          >
            <X v-if="mobileMenuOpen" class="size-5" />
            <Menu v-else class="size-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile menu -->
    <div v-show="mobileMenuOpen" class="border-t border-neutral-800/80 md:hidden">
      <nav class="mx-auto max-w-7xl space-y-1 px-4 py-3 sm:px-6">
        <template v-for="link in navLinks" :key="link.to">
          <a
            v-if="link.external"
            :href="link.to"
            target="_blank"
            rel="noopener noreferrer"
            class="block rounded-md px-3 py-2 text-sm text-[#7E7E7E] hover:text-foreground transition-colors hover:bg-accent"
            @click="mobileMenuOpen = false"
          >{{ link.label }}</a>
          <NuxtLink
            v-else
            :to="link.to"
            class="block rounded-md px-3 py-2 text-sm text-[#7E7E7E] hover:text-foreground transition-colors hover:bg-accent"
            @click="mobileMenuOpen = false"
          >{{ link.label }}</NuxtLink>
        </template>
      </nav>
    </div>
  </header>
</template>
