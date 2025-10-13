<div align="center">

# Git Garden

Developer portfolio showcase with 3D visualization of GitHub repositories

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D23.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.6.3-blue.svg)](https://www.typescriptlang.org/)
[![Vitest](https://img.shields.io/badge/tested%20with-vitest-6E9F18.svg)](https://vitest.dev/)

[Demo](https://git-garden.example.com) • [Documentation](./docs) • [Report Bug](https://github.com/ykashou/ts-git-garden/issues) • [Request Feature](https://github.com/ykashou/ts-git-garden/issues)

</div>

## 🚀 Features

- ✅ **3D Knowledge Graph**: Beautiful Three.js visualization of interconnected concepts
- ✅ **Portfolio Showcase**: Interactive project cards with garden-themed design
- ✅ **Research Papers**: Academic paper showcase with expandable abstracts
- ✅ **Sponsorships**: Bitcoin donation integration with QR codes
- ✅ **Arcane Blue Theme**: Beautiful custom dark theme with excellent readability
- ✅ **Responsive Design**: Works seamlessly on desktop and mobile
- ✅ **Performance Optimized**: Fast loading with Vite

## 🛠 Tech Stack

- **Framework**: React 18.3 + TypeScript 5.6
- **Build Tool**: Vite 5.4
- **Backend**: Express 4.21 + Node.js 23
- **3D Graphics**: Three.js 0.180 + react-force-graph-3d
- **Styling**: Tailwind CSS 3.4 + shadcn/ui components
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter 3.3
- **Database**: PostgreSQL + Drizzle ORM
- **Containerization**: Podman with nginx

## 📋 Prerequisites

- Node.js >= 23.0.0
- npm >= 10.0.0
- Podman >= 4.0 (for containerized deployment)
- PostgreSQL >= 14 (optional, for backend features)

## 🚦 Quick Start

### Using Container (Recommended)

```bash
# Clone repository
git clone https://github.com/ykashou/ts-git-garden.git
cd ts-git-garden

# Run development container
podman build -f ops/build/development.Containerfile -t git-garden:dev .
podman run --rm -p 5173:5173 git-garden:dev
```

Visit http://localhost:5173

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Open browser to http://localhost:5173
```

## 📁 Project Structure

```
ts-git-garden/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── HeroSection.tsx
│   │   │   ├── Navigation.tsx
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectShowcase.tsx
│   │   │   ├── ResearchPaper.tsx
│   │   │   ├── KnowledgeGraph3D.tsx
│   │   │   └── BitcoinDonation.tsx
│   │   ├── pages/          # Route pages
│   │   │   ├── Portfolio.tsx
│   │   │   ├── Research.tsx
│   │   │   ├── KnowledgeGraph.tsx
│   │   │   └── Sponsorships.tsx
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   │   ├── githubApi.ts
│   │   │   ├── queryClient.ts
│   │   │   └── utils.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/             # Static assets
│   │   └── data/           # Static JSON data
│   └── index.html
├── server/                  # Backend Express server
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/                  # Shared types/schemas
│   └── schema.ts
├── ops/                     # Operations (build, test, release)
│   └── build/
│       ├── development.Containerfile
│       ├── master.Containerfile
│       └── README.md
├── docs/                    # Documentation
├── public/                  # Public static files
│   └── data/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🧪 Testing

```bash
# Run unit tests (if configured)
npm test

# Type checking
npm run check

# Lint code (if configured)
npm run lint
```

## 🐳 Containerization

### Development

```bash
# Build development container
podman build -f ops/build/development.Containerfile -t git-garden:dev .

# Run with hot reload
podman run --rm -p 5173:5173 -v $(pwd):/app git-garden:dev
```

### Production

```bash
# Build production container
podman build -f ops/build/master.Containerfile -t git-garden:latest .

# Run production server
podman run --rm -p 8080:80 git-garden:latest
```

See [ops/build/README.md](ops/build/README.md) for detailed containerization instructions.

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
# GitHub API (optional, for enhanced features)
VITE_GITHUB_TOKEN=your_github_token

# API Configuration
VITE_API_BASE_URL=https://api.github.com

# Database (optional, for backend)
DATABASE_URL=postgresql://user:password@localhost:5432/git_garden

# Session Secret
SESSION_SECRET=your_session_secret_here
```

### GitHub Token

Generate a personal access token with `repo` scope for higher API rate limits and private repository access.

## 🎨 Customization

### Theming

The project uses a custom **Arcane Blue** theme. Edit `client/src/index.css` to customize colors:

- Primary: 240 100% 85% (soft blue)
- Secondary: 240 30% 25% (dark blue-gray)
- Background: 240 15% 8% (very dark blue-gray)

### 3D Configuration

Modify the 3D knowledge graph settings in `client/src/components/KnowledgeGraph3D.tsx`.

### Static Data

Update project and research data in:
- `public/data/config.json` - Portfolio configuration
- `public/data/papers.json` - Research papers
- `client/public/data/sponsorships.json` - Sponsorship information

## 🚀 Deployment

### Container Registry

```bash
# Tag for GitHub Container Registry
podman tag git-garden:latest ghcr.io/ykashou/git-garden:latest

# Push to registry
podman push ghcr.io/ykashou/git-garden:latest
```

### Static Hosting

Build and deploy the `dist/` folder to any static hosting provider:

```bash
npm run build
# Upload dist/public/ to your hosting provider
```

Supported platforms:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any nginx/Apache server

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Testing changes
- `chore:` - Build/tooling changes

## 📄 License

This project is licensed under the ACE License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) - React renderer for Three.js
- [react-force-graph-3d](https://github.com/vasturiano/react-force-graph-3d) - 3D force-directed graph
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- GitHub API for repository data

## 📚 Documentation

- [3D Knowledge Graph Documentation](docs/3d-knowledge-graph.md)
- [Research Page Upgrade](docs/research-page-upgrade.md)
- [Build Operations](ops/build/README.md)
- [Design Guidelines](docs/design_guidelines.md)
- [Dual Mode Architecture](docs/dual-mode-architecture.md)
- [Replit Integration](replit.md)
- [Testing Setup](test/README.md)

## 🔗 Links

- **GitHub**: [ykashou/ts-git-garden](https://github.com/ykashou/ts-git-garden)
- **Issues**: [GitHub Issues](https://github.com/ykashou/ts-git-garden/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ykashou/ts-git-garden/discussions)

---

<div align="center">
Made with ❤️ by <a href="https://github.com/ykashou">Yanal the Mage</a>
</div>

