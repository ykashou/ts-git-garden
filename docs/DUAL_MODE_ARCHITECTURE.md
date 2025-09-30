# Dual-Mode Digital Garden Architecture

## Overview

This document outlines the architecture for transforming the current single-user GitHub portfolio into a dual-mode system controlled by the `ENABLE_USER_AUTH` environment variable.

## Two Deployment Cases

### Case 1: Userless Portfolio
- **Environment**: `ENABLE_USER_AUTH=false`
- **Authentication**: None required
- **GitHub Access**: Server `GITHUB_TOKEN` + config username
- **Deployment**: Fully public, static-deployable (GitHub Pages compatible)
- **Use Case**: Clone/remix with just GitHub credentials
- **Target Users**: Individual developers wanting simple portfolio hosting

### Case 2: Single User Portfolio
- **Environment**: `ENABLE_USER_AUTH=true`
- **Authentication**: Owner logs in via GitHub OAuth (automatic connection)
- **GitHub Access**: Owner's OAuth token (encrypted server-side)
- **Deployment**: Each deployment serves exactly one user
- **Use Case**: Portfolio-as-a-Service platform managing many individual instances
- **Target Users**: Non-technical users wanting managed portfolio hosting

## Architecture Components

### Data Model Extensions

```typescript
// Additions to shared/schema.ts
AdminProfile extends PortfolioConfig {
  githubUsername?: string;
  githubUserId?: string;
}

AdminSession {
  id: string;
  createdAt: Date;
  expiresAt: Date;
}

// Server-only (never sent to client)
GitHubConnection {
  accessTokenEnc: string;
  provider: 'github';
}
```

### Storage Interface Updates

```typescript
// Extensions to IStorage in server/storage.ts
interface IStorage {
  // Existing methods...
  
  // Admin profile management
  getAdminProfile(): Promise<AdminProfile | null>;
  setAdminProfile(profile: AdminProfile): Promise<void>;
  
  // Session management
  upsertSession(session: AdminSession): Promise<void>;
  getSession(id: string): Promise<AdminSession | null>;
  deleteSession(id: string): Promise<void>;
  
  // Project caching
  getProjectsCache(): Promise<{ projects: Project[], fetchedAt: Date } | null>;
  setProjectsCache(projects: Project[], fetchedAt: Date): Promise<void>;
  
  // GitHub connection
  getGitHubConnection(): Promise<GitHubConnection | null>;
  setGitHubConnection(connection: GitHubConnection): Promise<void>;
}
```

### API Routes

#### Public Routes (Always Available)
```javascript
GET /api/projects     // Uses GITHUB_TOKEN (Case 1) or cached owner data (Case 2)
GET /api/config      // Public portfolio information
GET /api/papers      // Research papers (existing)
```

#### Admin Routes (Case 2 Only, Requires GitHub Login)
```javascript
// Authentication
GET /api/auth/github/login     // Redirect to GitHub OAuth
GET /api/auth/github/callback  // Handle OAuth callback
POST /api/auth/logout          // Clear session
GET /api/auth/me              // Current user status

// Admin management
GET /api/admin/status          // GitHub connection status, user info
POST /api/admin/revalidate     // Refresh projects cache
PATCH /api/admin/profile       // Edit portfolio settings
```

### Frontend Updates

#### Feature Gating
- **Environment Variable**: `VITE_ENABLE_USER_AUTH`
- **Conditional Routes**: `/admin`, `/login` (only shown when enabled)
- **Public Experience**: Identical in both cases
- **Admin Panel**: Portfolio management, GitHub connection status, cache refresh

#### Route Structure
```javascript
// Always available
/                    // Portfolio home
/research           // Research papers
/graph              // Knowledge graph
/sponsor            // Sponsorships

// Case 2 only (gated by VITE_ENABLE_USER_AUTH)
/admin              // Admin dashboard
/login              // GitHub OAuth login (redirect)
```

### Environment Configuration

#### Case 1: Userless Portfolio
```bash
ENABLE_USER_AUTH=false
GITHUB_TOKEN=personal_access_token
# Uses public/data/config.json for portfolio info
```

#### Case 2: Single User Portfolio
```bash
ENABLE_USER_AUTH=true
SESSION_SECRET=jwt_signing_key_for_cookies
GITHUB_CLIENT_ID=oauth_app_id
GITHUB_CLIENT_SECRET=oauth_app_secret
APP_BASE_URL=https://yourdomain.com
```

### Security Considerations

#### Authentication Flow (Case 2)
1. User clicks "Login with GitHub"
2. Redirect to GitHub OAuth with state parameter
3. GitHub callback exchanges code for access token
4. Server encrypts and stores token, creates session
5. Sets httpOnly, Secure, SameSite=Lax cookie
6. Admin routes now accessible

#### Token Management
- **Client**: Never receives GitHub tokens
- **Server**: Stores encrypted tokens using `SESSION_SECRET`
- **Cache**: Public project data cached for performance
- **Sessions**: JWT-signed cookies with expiration

### Platform Scaling Strategy

#### Portfolio-as-a-Service Model
- **Each deployment** = one user's portfolio instance
- **Platform provisions**:
  - Unique subdomain/domain per user
  - OAuth credentials (shared app or per-instance)
  - Environment variables per deployment
- **Revenue model**: Subscription per portfolio instance
- **Management**: Platform dashboard for provisioning/billing

#### Deployment Options
```javascript
// Option A: Shared OAuth App
GITHUB_CLIENT_ID=platform_shared_app_id
// Callback: https://platform.com/auth/callback?instance=user123

// Option B: Per-Instance OAuth Apps  
GITHUB_CLIENT_ID=user_specific_app_id
// Callback: https://user123.platform.com/api/auth/github/callback
```

## Implementation Phases

### Phase 1: Core Infrastructure
- [ ] Add feature flag detection (`ENABLE_USER_AUTH`)
- [ ] Extend storage interface and MemStorage implementation
- [ ] Add admin profile and session schemas
- [ ] Implement unified `/api/projects` and `/api/config` endpoints

### Phase 2: Authentication System
- [ ] GitHub OAuth flow implementation
- [ ] Session management and middleware
- [ ] Token encryption/decryption utilities
- [ ] Admin route protection

### Phase 3: Frontend Integration
- [ ] Feature-gate admin routes with `VITE_ENABLE_USER_AUTH`
- [ ] Create admin dashboard component
- [ ] Add GitHub login button and flow
- [ ] Implement profile editing interface

### Phase 4: Cache and Performance
- [ ] Project cache implementation
- [ ] Cache invalidation strategies
- [ ] Graceful fallbacks for missing tokens
- [ ] Performance optimization

### Phase 5: Deployment and Testing
- [ ] Environment configuration documentation
- [ ] Deployment scripts for both modes
- [ ] End-to-end testing suite
- [ ] Platform provisioning automation

## Benefits

### For Individual Users (Case 1)
- **Simple setup**: Just GitHub token required
- **Static hosting**: Deploy anywhere (GitHub Pages, Netlify, etc.)
- **Full control**: Own the code and hosting
- **No dependencies**: No authentication complexity

### For Platform Users (Case 2)
- **Managed hosting**: No technical setup required
- **Automatic updates**: Platform handles maintenance
- **GitHub integration**: Seamless OAuth connection
- **Professional domains**: Custom URLs available

### For Platform Operators
- **Scalable architecture**: Each user = isolated instance
- **Revenue potential**: Subscription model per portfolio
- **Low maintenance**: Standardized deployments
- **Market differentiation**: Technical + non-technical users

## Technical Decisions

### Why Single-User Per Deployment?
- **Security**: Complete data isolation between users
- **Scalability**: Horizontal scaling model
- **Customization**: Per-user environment configuration
- **Reliability**: User issues don't affect others

### Why Feature Flags?
- **Code maintainability**: Single codebase for both modes
- **Testing**: Easier to verify both paths work
- **Migration**: Smooth transition between modes
- **Deployment**: Same build, different configuration

### Why GitHub OAuth Only?
- **Target audience**: Developers and tech-adjacent users
- **Automatic integration**: Portfolio content from GitHub
- **Reduced complexity**: No password management needed
- **Trust**: Users already have GitHub accounts

## Future Considerations

### Potential Enhancements
- **Database backends**: PostgreSQL, SQLite options
- **Multiple Git providers**: GitLab, Bitbucket support
- **Custom domains**: User-provided domain mapping
- **Themes**: Multiple design templates
- **Analytics**: Portfolio visitor tracking
- **Team features**: Organization portfolios

### Platform Extensions
- **Billing integration**: Stripe/subscription management
- **Admin dashboard**: User management interface
- **API access**: Programmatic portfolio updates
- **White-label**: Custom branding options
- **Enterprise**: Team/organization accounts