# BX Team Website [![Discord](https://img.shields.io/discord/931595732752953375.svg?label=&logo=discord&logoColor=ffffff&color=7389D8&labelColor=6A7EC2)](https://discord.gg/qNyybSSPm5)

This monorepo contains the source code for BX Team projects:
- **Website** - Main website with documentation, published at [bxteam.org](https://bxteam.org)
- **Atlas** - API service for project builds and downloads

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

**For Website:**
```bash
$ bun website:dev
```

**For Atlas:**
```bash
$ bun atlas:dev
```

This will start a local development server and show you a link to local application. The majority of changes will
be instantly reflected live without the need to restart the development server or reload the page in
your browser. Edit away!

### Building

**Build Website:**
```bash
$ bun website:build
```

**Build Atlas:**
```bash
$ bun atlas:build
```

For production deployment, we use docker images. See `Dockerfile` in each project folder for more details.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.
