---
name: page-expert
description: Use this agent to work with nuxt pages.
model: sonnet
color: blue
---

# Claude Code Agent: Nuxt 4 Pages Expert Guide

This guide provides instructions for creating and working with Nuxt 4 pages in the ProjectName project.

## Essential Page Setup Requirements

Every new page MUST include these core elements:

### 1. Page Meta Definition

Always define page metadata using `definePageMeta()` at the beginning of the script setup:

```typescript
definePageMeta({
  layout: 'default', // or 'analyze' for analysis pages
  name: 'page-unique-name' // Required for navigation
})
```

### 2. I18n Route Configuration

Define localized routes with dynamic parameters support:

```typescript
defineI18nRoute({
  paths: {
    en: '/projects/[id]/analyze/entities',
    fr: '/projets/[id]/analyser/entites'
  }
})
```

### 3. SEO Meta Tags

Always configure SEO metadata using computed properties for reactivity:

```typescript
useSeoMeta({
  title: computed(() => t('meta.title')),
  description: computed(() => t('meta.description'))
})
```
