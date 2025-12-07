# BX Team Website [![Discord](https://img.shields.io/discord/931595732752953375.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/qNyybSSPm5)

This repository contains the source code for the main BX Team website, including the documentation pages. Website is published at [bxteam.org](https://bxteam.org).

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
$ bun run build
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.
