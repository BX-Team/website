# BX Team Website [![Discord](https://img.shields.io/discord/931595732752953375.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/p7cxhw7E2M) [![Netlify Status](https://api.netlify.com/api/v1/badges/b70ca151-d5a5-4c8f-b1c8-1d63c4930aa9/deploy-status)](https://app.netlify.com/sites/bx-team-website/deploys)

This repository contains the source code for the main BX Team website. The website is built using this techo stack:

- [Next.js](https://nextjs.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)
- [Supabase](https://supabase.io)
- [S3 API](https://aws.amazon.com/s3)

## Getting Started

How to get docs running on your local machine for development.

### Prerequisites

- [node](https://nodejs.org)
- [bun](https://bun.sh/)

### Local Development

1. Clone the repository. If you plan to make changes, create a fork first!

```bash
$ git clone https://github.com/BX-Team/website
```

2. Install all required dependencies.

```bash
$ bun install
```

3. Start the development server.

```bash
$ bun dev
```

This will start a local development server and show you a link to local website. The majority of changes will
be instantly reflected live without the need to restart the development server or reload the page in
your browser. Edit away!

### Building

```bash
$ bun build
```
