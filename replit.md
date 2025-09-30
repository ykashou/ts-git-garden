# Overview

This is a personal portfolio website built as a "Digital Garden" - a creative, nature-themed showcase for projects and research papers. The application features a static site architecture with client-side data management, designed to present development work and academic publications in an exploration-themed interface. The portfolio includes sections for projects (with garden growth metaphors), research papers, and Bitcoin donation functionality.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
**Framework**: React 18 with TypeScript and Vite for build tooling. Uses Wouter for lightweight client-side routing with three main routes: Portfolio (home), Research, and Admin.

**UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling. Implements a custom "Arcane Blue" dark theme with nature-inspired design elements and consistent 0.8rem border radius across components.

**State Management**: Client-side state management using React hooks and local storage. No external state management library - keeps things simple with component-level state and a centralized DataManager class.

**Component Structure**: Modular component architecture with reusable UI components (ProjectCard, ResearchPaper, BitcoinDonation) and page-level components. Includes example components for development/testing.

## Backend Architecture
**Static Site Approach**: The application is designed as a static site with no traditional backend. The server directory contains minimal Express setup primarily for development purposes, with the expectation of static deployment (like GitHub Pages).

**Data Management**: Client-side data persistence using localStorage through a DataManager class. Data is stored as JSON with Zod schemas for validation. Includes default seed data for projects and research papers.

**File Structure**: Separates client and server code, with shared schemas and types. The client directory contains all frontend code, while server is minimal and primarily for development tooling.

## Data Storage
**Local Storage**: All data persists in browser localStorage with keys for projects, papers, and configuration. No database required for deployment.

**Schema Validation**: Uses Zod schemas for type safety and data validation. Defines Project, ResearchPaper, and PortfolioConfig types with proper TypeScript inference.

**Data Models**: Projects include technology stacks, status (blooming/growing/mature), and links. Research papers include academic metadata like DOI, journal, authors, and abstracts.

## Design System
**Typography**: Poppins font family from Google Fonts for consistent typography across headings and body text.

**Color Palette**: Custom "Arcane Blue" theme with CSS variables for light/dark mode support. Uses HSL values for color consistency.

**Layout System**: Responsive grid layouts with Tailwind's breakpoint system. Consistent spacing using Tailwind's spacing scale (2, 4, 6, 8, 12, 16).

**Component Styling**: Hover effects with "elevate" classes, consistent border radius, and garden-themed visual metaphors throughout the interface.

# External Dependencies

## Core Dependencies
- **React 18**: Frontend framework with TypeScript support
- **Vite**: Build tool and development server with hot reload
- **Wouter**: Lightweight routing library for client-side navigation
- **Tailwind CSS**: Utility-first CSS framework for styling

## UI Components
- **Radix UI**: Headless component library for accessible UI primitives
- **Shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for creating variant-based component APIs

## Data & Validation
- **Zod**: Schema validation library for type-safe data handling
- **React Hook Form**: Form management with validation integration
- **@hookform/resolvers**: Integration between React Hook Form and Zod

## Development Tools
- **TypeScript**: Static type checking for enhanced development experience
- **PostCSS**: CSS processing with Autoprefixer
- **@replit/vite-plugin-runtime-error-modal**: Development error handling
- **QRCode.js**: Client-side QR code generation for Bitcoin donations

## External Services
- **Google Fonts**: Poppins font family hosting
- **GitHub Pages**: Intended deployment target for static hosting
- **Bitcoin Network**: For cryptocurrency donation functionality

The application is designed to be completely self-contained for static deployment, with no external APIs or server dependencies required in production.