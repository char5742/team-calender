# 008 CSS Naming Guideline – Scoped, Minimal, Predictable

**Status**: Accepted  
**Date**: 2025-07-06

## Context

During recent refactors we migrated the calendar component to **component-scoped CSS**.  
We observed an anti-pattern: adding redundant prefixes such as `member-avatar`, `day-cell`, etc. inside the component's own stylesheet.  These prefixes add noise, reduce readability, and provide no additional scoping value because Astro already scopes class names per component at build time.

## Decision

1. **Default to Scoped Styles**  
   All UI styling must live in the same `.astro` file as the markup whenever possible.

2. **Minimal Class Names**  
   Inside a scoped stylesheet use the simplest semantic word necessary:

   | Element role                | Recommended | ❌ Avoid            |
   |-----------------------------|-------------|--------------------|
   | コンテナ（行）              | `.row`      | `.member-row`      |
   | 見出しセル                  | `.header`   | `.calendar-header` |
   | 日付セル                    | `.cell`     | `.day-cell`        |

3. **No Component Prefixes**  
   Do *not* repeat the component name or domain (`member-`, `day-`, `calendar-`, etc.) inside its own stylesheet.

4. **Global / Shared Classes**  
   Global utility or token classes (e.g. `visual-primary`, `content-appear-delay-2`) are still allowed **only** when:

   * they are defined in `design-system.css`, **and**
   * they serve a cross-component purpose (animation, colour token, etc.).

5. **Testing Hooks**  
   E2E テストで使用するセレクタは、既存互換のため `.event-block` のようなグローバルクラスを残す。ただし新規テストには `data-e2e="…"` 属性の利用を推奨する。

## Consequences

* Stylesheets become shorter and easier to maintain.
* Selector specificity stays low, reducing override bugs.
* Naming collisions are virtually impossible thanks to Astro's hashing.

## How to Enforce

1. **Code Review Gate** – PR reviewer must reject new prefixes that duplicate component context.
2. **Lint Rule (future)** – Evaluate [`stylelint` selector-max-compound-selectors] and custom regexp rules to flag banned prefixes.

---

_This ADR codifies our CSS naming convention going forward._ 