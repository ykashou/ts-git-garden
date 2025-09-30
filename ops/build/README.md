# Build Operations

This directory contains Containerfiles for building and deploying the Git Garden application.

## Containerfiles

### development.Containerfile
Development container with hot-reload capabilities.

**Build:**
```bash
podman build -f ops/build/development.Containerfile -t git-garden:dev .
```

**Run:**
```bash
podman run --rm -p 5173:5173 -v $(pwd):/app git-garden:dev
```

Features:
- Hot module replacement
- Development dependencies included
- Volume mounting for live code updates
- Exposed on port 5173

### master.Containerfile
Production-ready multi-stage container with nginx.

**Build:**
```bash
podman build -f ops/build/master.Containerfile -t git-garden:latest .
```

**Run:**
```bash
podman run --rm -p 8080:80 git-garden:latest
```

Features:
- Multi-stage build (Node builder + nginx runtime)
- Optimized production bundle
- SPA routing support
- Minimal image size
- Exposed on port 80

## Multi-platform Builds

Build for multiple architectures:

```bash
podman build \
  --platform linux/amd64,linux/arm64 \
  -f ops/build/master.Containerfile \
  -t ghcr.io/ykashou/git-garden:latest \
  .
```

## Registry Push

Tag and push to GitHub Container Registry:

```bash
# Tag for registry
podman tag git-garden:latest ghcr.io/ykashou/git-garden:latest
podman tag git-garden:latest ghcr.io/ykashou/git-garden:v1.0.0

# Push to registry
podman push ghcr.io/ykashou/git-garden:latest
podman push ghcr.io/ykashou/git-garden:v1.0.0
```

## Version Tagging

Create a versioned release build:

```bash
VERSION=v1.0.0

# Build with multiple tags
podman build -f ops/build/master.Containerfile \
  -t git-garden:${VERSION} \
  -t git-garden:1.0 \
  -t git-garden:1 \
  -t git-garden:latest \
  .

# Tag for registry
podman tag git-garden:${VERSION} ghcr.io/ykashou/git-garden:${VERSION}
podman tag git-garden:${VERSION} ghcr.io/ykashou/git-garden:1.0
podman tag git-garden:${VERSION} ghcr.io/ykashou/git-garden:1
podman tag git-garden:${VERSION} ghcr.io/ykashou/git-garden:latest

# Push all tags
podman push ghcr.io/ykashou/git-garden:${VERSION}
podman push ghcr.io/ykashou/git-garden:1.0
podman push ghcr.io/ykashou/git-garden:1
podman push ghcr.io/ykashou/git-garden:latest
```

## Cleanup

Remove old containers and images:

```bash
# Remove specific image
podman rmi git-garden:old-tag

# List all git-garden images
podman images git-garden

# Prune unused images
podman image prune -a
```

## Security Scanning

Scan images for vulnerabilities:

```bash
# Using trivy
trivy image git-garden:latest

# Using podman scan (if available)
podman scan git-garden:latest
```

## Troubleshooting

### Container won't start
```bash
# Check logs
podman logs <container-id>

# Run interactively
podman run -it git-garden:latest sh
```

### Port already in use
```bash
# Use different port
podman run --rm -p 8081:80 git-garden:latest
```

### Build fails
```bash
# Clear cache and rebuild
podman build --no-cache -f ops/build/master.Containerfile -t git-garden:latest .
```

