# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Koyo-AI-lab-fe Frontend

Nuxt 4 application with TypeScript, PrimeVue, and Ory Kratos authentication.

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3 and TypeScript
- **Runtime**: Bun
- **UI Framework**: PrimeVue 4 with volt (tailwind integration) + Tailwind CSS 4
- **State Management**: Pinia + Vue Query (@peterbud/nuxt-query)
- **Backend Integration**: @toarunokon/koyo-ai-lab-sdk (located in node_modules)
- **Validation**: Zod schemas with PrimeVue Forms integration
- **Internationalization**: @nuxtjs/i18n (English/French)

## Project Structure

```
src/
├── constants/        # Constants files
├── components/       # Business logic components
├── composables/      # Reusable composition functions
├── layouts/          # Page layouts (default, analyze)
├── middleware/       # Route middleware (auth.global.ts)
├── pages/            # File-based routing
├── stores/           # Pinia state stores
├── types/            # TypeScript definitions
└── volt/             # Custom PrimeVue component library (ESLint ignored)
```

## Internationalization

- English (default) and French support

## Development Workflow

- After making changes, always run: `bun nuxi typecheck | grep <file-path>`

## Critical Vue/Nuxt Composables Rule

**ALWAYS call composables at the setup root level, NEVER inside functions or event handlers.**

## Form Validation

Uses **Zod schemas with PrimeVue Forms** for type-safe validation.
Always use the `validation-expert` agent for validation.

## Git Workflow

- **Bypassing Husky Hooks**: To commit, ignore husky hooks: `HUSKY=0 git commit -m "your-commit-message"`

## Date Handling Guidelines

Date Library: Day.js

- Use Day.js for all date parsing, formatting, and manipulation
- Always prefer a localized date format like LL

## Primevue (volt) components

Primevue (volt) components are auto-imported with the P prefix. For example, PButton.

Only for the button component, instead of using the severity property, you must use the corresponding severity component. (e.g. : PSecondaryButton)

## Encoding

Be careful with the french encoding for special characters like "é"

## Composables (~/src/composables)

Prefer to group your composables inside a single file if they are related. Never create a file only for one composable.
E.g. : instead of naming your file `useAnalyzeDownload`, name the file `download` and put all the download related composable inside it.

- When you create a mutation composable with a toast for the error/success feedback, don't forget to add your translations to the global i18n translations (i18n/locales)

## Best practices

- Always consider that user provided data is unexpected. For a datatable with a title property, make sure to add a max width and truncate the text if it exceeds it.
- Computed should always be readonly. Never use a computed with a setter.
- If a page has multiple tabs, and that a tab needs backend data, always fetch it lazily if we don't need it at load.
- For selects, when possible, lazy load their data on the @show event. Set the loading property while it loads, and show a loading empty message if the data is undefined.
- For selects that update a backend state, make sure to reset its value to its previous value if an error is returned
- Always prefer NuxtLink over RouterLink
- Always use tailwind classes for styling. Never use inline styles or custom css classes.

## Agents (CRITICAL)

**You are an ORCHESTRATOR, not an implementer.** You MUST delegate all implementation tasks to the appropriate specialized agent. Do NOT write code, create components, or implement features yourself.

### Orchestrator Rules

1. **ALWAYS delegate** - For any implementation task, identify and use the appropriate agent
2. **Never implement directly** - Do not write code yourself; spawn an agent to do it
3. **Ask permission first** - If no existing agent matches the task, ask the user: "No specialized agent exists for this task. May I proceed without an agent?"
4. **Coordinate multiple agents** - For complex tasks, break them down and delegate to multiple agents as needed
5. **Review agent output** - After an agent completes, verify the work meets requirements

### Available Agents

#### page-expert

Use this agent when you want to create a new page from scratch.

#### validation-expert

Use this agent to implement UI validation with Zod schemas and PrimeVue Forms.

#### ui-design-expert

Use this agent to implement UIs with Tailwind, PrimeVue Volt, and Vue components.

### When No Agent Exists

If the task doesn't fit any available agent, you MUST ask:

> "This task requires [describe task]. No specialized agent exists for this. May I proceed without delegating to an agent?"

Only proceed with direct implementation after explicit user approval.
