# Nuxt front-end project template
If you just forked this template, start by reading the `CHECKLIST.md` file.

# Introduction

This is a [nuxt 4](https://nuxt.com/) project with vue 3. Make sure you familiarize yourself with nuxt [directory structure](https://nuxt.com/docs/4.x/directory-structure) first.

## Styling
We use [tailwindcss](https://tailwindcss.com/) for css. 
UI library is [primevue](https://primevue.org/) with [volt](https://volt.primevue.org/) (for tailwind integration).

Volt components are inside `src/volt`. If you need a volt component that is not there yet, run `npx volt-vue add [ComponentName] --outdir src`
Volt components are automatically imported with the prefix P. For example, for a Button, use PButton.

## I18n
We use nuxt-i18n for internationalization.
For shared translations across all pages, add them to `i18n/locales/{locale}.json`
Always prefer [component scoped](https://i18n.nuxtjs.org/docs/guide/per-component-translations) translations when possible (json format)

## Validation
For validation, we use [zod](https://www.npmjs.com/package/zod) and primevue forms

# Setup

### Install the dependencies 
```bash
bun install
```

### Env vars
Duplicate the .env.template file and rename it `.env`. Fill the required env vars.

### Development server
```bash
bun dev
```

# Development with AI
Familiarize yourself with the available agents below.
To create a new UI from scratch based on a figma design, you should run `claude --agent ui-design-expert`. This will make the ui-design-expert agent the main agent, and will make him able to orchestrate the other agents for you automatically.

## Agents

### create-page-expert
A simple agent to create and setup a new empty page

### ui-design-expert
An agent expert in creating UIs based on figma designs

### validation-expert
An agent expert in implementing UI validation using primevue forms and zod

### backend-integration-expert
An agent expert in binding the UI with the backend through the sdk.

## Add a new agent
You can use claude code /agents command to do that. 
After adding it, make sure to:
- reference it inside `CLAUDE.md` Agents section
- if it handles a subtask of the UI (e.g. validation), reference it inside the ui-design-expert at `.claude/agents/ui-design-expert`
# koyo-ai-lab-fe
