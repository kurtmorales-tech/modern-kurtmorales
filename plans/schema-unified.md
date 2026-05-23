# Implementation Plan: Unified Schema Package

## Goal
Create a shared TypeBox-based schema package to synchronize data models between the Bun backend and React frontend, replacing manual validation with runtime schema checks.

## Tasks

1. **Initialize Schema Package**
   - Create directory `packages/schema`.
   - Initialize `package.json` with name `@kurtmorales/schema` and dependency `@sinclair/typebox`.
   - Set up `tsconfig.json` for the package.
   - File: `packages/schema/package.json`, `packages/schema/tsconfig.json`

2. **Define Core Utility Schemas**
   - Create `Tag` and `Upload` schemas used across multiple domains.
   - File: `packages/schema/src/common.ts`
   - Acceptance: Types match existing `Tag` and `Upload` interfaces.

3. **Define Domain Schemas**
   - Implement TypeBox schemas for:
     - `Post`: title, slug, excerpt, contentMarkdown, date, readTime, tags[], cover, status ('draft' | 'published').
     - `Project`: title, type, tech, description, link, image, order.
     - `Template`: title, description, tech, demoUrl, sourceUrl, tags[], featured, price, order.
     - `Subscriber`: email (regex validation), name, status ('subscribed' | 'unsubscribed').
     - `ContactMessage`: name, email (regex), project, budget, message.
     - `Newsletter`: title, subject, preheader, contentMarkdown, html, text, status ('draft' | 'sending' | 'sent'), sentAt, recipientsCount.
   - File: `packages/schema/src/index.ts` (or split by domain)
   - Acceptance: `Static<typeof Schema>` matches current `backend/src/db.ts` and `apps/web/src/types.ts`.

4. **Backend Integration: Validation Layer**
   - Import schemas into `backend/src/server.ts`.
   - Replace manual regex/null checks in `POST /api/subscribers` and `POST /api/contact` with `Value.Errors()` from TypeBox.
   - Implement a helper function `validateRequest(schema, body)` to return standardized 400 error responses.
   - File: `backend/src/server.ts`
   - Acceptance: Invalid email or missing required fields return a structured JSON error instead of generic "A valid email is required".

5. **Frontend Integration: Type Synchronization**
   - Update `apps/web/package.json` to include `@kurtmorales/schema` (via workspace).
   - Remove duplicate interfaces in `apps/web/src/types.ts` and replace them with imports from `@kurtmorales/schema`.
   - File: `apps/web/src/types.ts`, `apps/web/package.json`
   - Acceptance: `apps/web` compiles without type errors; `Post`, `Project`, etc., are sourced from the shared package.

## Files to Modify
- `backend/src/server.ts` - replace manual validation with schema checks.
- `apps/web/src/types.ts` - replace local types with shared package types.
- `apps/web/package.json` - add schema dependency.

## New Files
- `packages/schema/package.json` - package config.
- `packages/schema/tsconfig.json` - TS config.
- `packages/schema/src/common.ts` - `Tag`, `Upload` schemas.
- `packages/schema/src/index.ts` - Primary domain schemas and exported types.

## Dependencies
- **Task 2 & 3** must be complete before **Task 4 & 5**.
- **Task 1** must be complete before any other task.

## Risks
- **Breaking Changes**: Changing a field name in the schema will break both FE and BE. This is the *intended* benefit, but requires careful initial mapping.
- **Circular Dependencies**: Ensure `common.ts` doesn't depend on domain schemas.
- **TypeBox Versioning**: Ensure `@sinclair/typebox` version is consistent across the monorepo to avoid `instanceof` or compatibility issues.

## Validation Contract
The implementation is considered successful when:
1. **Runtime Validation**: Sending a `POST` request to `/api/contact` with a missing `message` or invalid `email` returns a `400 Bad Request` with specific field errors.
2. **Compile-time Sync**: Changing a field in `packages/schema/src/index.ts` triggers TypeScript errors in both `backend/src/server.ts` and `apps/web/src/pages/PostPage.tsx` (or other consumers).
3. **Zero Duplication**: Searching for `interface Post` or `type Post` only returns one result in the entire project (the shared package).
4. **No Regressions**: Existing `GET` endpoints continue to return the same JSON structure.