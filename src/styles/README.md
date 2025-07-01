# Modern CSS Architecture

This project uses a modern, scalable CSS architecture based on cascade layers and design tokens. The system is inspired by the [astro-rss-reader](https://github.com/char5742/astro-rss-reader) project but enhanced with additional modern features and better organization.

## Architecture Overview

### Layer Structure

The CSS is organized using CSS Cascade Layers (`@layer`) for explicit priority control:

1. **reset** - Browser normalization and reset styles
2. **tokens** - Design system variables and tokens
3. **base** - Base HTML element styles
4. **layout** - Layout and grid systems
5. **components** - UI component styles
6. **utilities** - Utility classes
7. **overrides** - Theme and context overrides

### Key Features

- 🎨 **Modern Color System** - OKLCH color space with semantic tokens
- 📝 **Fluid Typography** - Responsive type scale using `clamp()`
- 🎭 **Motion Design** - Comprehensive animation system with accessibility support
- 📱 **Container Queries** - Component-responsive design
- 🌙 **Dark Mode** - Automatic light/dark theme support
- ♿ **Accessibility** - Built-in focus management and reduced motion support
- 🏗️ **Logical Architecture** - Clear separation of concerns with cascade layers

## Directory Structure

```
styles/
├── globals.css           # Main entry point with layer declarations
├── reset.css            # Modern CSS reset
├── tokens/              # Design system tokens
│   ├── index.css        # Token imports
│   ├── colors.css       # Color system (OKLCH)
│   ├── typography.css   # Font and text tokens
│   ├── spacing.css      # Spacing and layout tokens
│   ├── elevation.css    # Shadow and elevation system
│   ├── motion.css       # Animation and transition tokens
│   ├── breakpoints.css  # Responsive design tokens
│   └── z-index.css      # Z-index layering system
├── base/                # Base HTML element styles
│   ├── index.css        # Base imports
│   ├── typography.css   # Typography elements
│   ├── forms.css        # Form elements
│   ├── media.css        # Media elements
│   ├── tables.css       # Table elements
│   └── lists.css        # List elements
├── layout/              # Layout systems
├── components/          # UI components
├── utilities/           # Utility classes
└── overrides/           # Theme overrides
```

## Design Tokens

### Colors

The color system uses OKLCH color space for better perceptual uniformity:

```css
/* Primary colors with semantic naming */
--color-primary-500: oklch(58% 0.15 264);
--color-neutral-900: oklch(17% 0.006 264);

/* Semantic color assignments */
--color-text-primary: var(--color-neutral-900);
--color-interactive-primary: var(--color-primary-600);
```

### Typography

Fluid typography scales automatically across viewports:

```css
/* Base size scales from 16px to 18px */
--font-size-base: clamp(1rem, 0.95rem + 0.24vw, 1.125rem);

/* Semantic typography tokens */
--typography-heading-1: var(--font-weight-bold) var(--font-size-5xl)/var(--line-height-tight) var(--font-family-sans);
```

### Spacing

Consistent spacing system based on 4px base unit:

```css
--spacing-base: 0.25rem; /* 4px */
--spacing-4: calc(var(--spacing-base) * 4); /* 16px */

/* Fluid spacing for responsive layouts */
--spacing-fluid-lg: clamp(var(--spacing-8), 3vw, var(--spacing-16));
```

### Motion

Comprehensive motion system with accessibility support:

```css
/* Duration tokens */
--duration-fast: 150ms;
--duration-normal: 200ms;

/* Semantic motion tokens */
--motion-ui: var(--duration-fast) var(--easing-smooth);
--motion-content: var(--duration-normal) var(--easing-smooth);
```

## Usage Examples

### Using Design Tokens

```css
.my-component {
  color: var(--color-text-primary);
  background-color: var(--color-surface-primary);
  padding: var(--spacing-4) var(--spacing-6);
  border-radius: var(--radius-md);
  box-shadow: var(--elevation-sm);
  transition: var(--motion-ui);
}
```

### Using Utility Classes

```html
<div class="p-4 bg-surface-primary shadow-sm rounded-md transition-all">
  <h2 class="typography-h2 text-primary mb-4">Heading</h2>
  <p class="typography-body text-secondary">Content</p>
</div>
```

### Responsive Design

```html
<!-- Viewport-based responsive -->
<div class="hidden md:block lg:flex">Content</div>

<!-- Container query responsive -->
<div class="container-query">
  <div class="cq-md:flex cq-lg:grid">Content</div>
</div>
```

### Animations

```html
<!-- Entrance animations -->
<div class="animate-fade-in-up stagger-1">Item 1</div>
<div class="animate-fade-in-up stagger-2">Item 2</div>

<!-- Transition utilities -->
<button class="transition-all duration-fast ease-spring hover:shadow-md">
  Button
</button>
```

## Accessibility Features

### Motion Preferences

The system automatically respects user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 1ms;
    --easing-spring: linear;
  }
}
```

### Focus Management

Consistent focus styles across all interactive elements:

```css
.focus-ring-primary:focus-visible {
  box-shadow: var(--focus-ring-primary);
}
```

### High Contrast Support

Enhanced visibility for high contrast preferences:

```css
@media (prefers-contrast: high) {
  .shadow-sm {
    border: 1px solid var(--color-border-secondary);
  }
}
```

## Dark Mode

Automatic dark mode support using system preferences:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-background: var(--color-neutral-950);
    --color-text-primary: var(--color-neutral-100);
  }
}
```

## Performance Considerations

- **CSS Layers** provide predictable cascade without specificity wars
- **Custom Properties** enable efficient theme switching
- **Modern CSS Features** reduce JavaScript dependencies
- **Minimal Utility Classes** keep CSS bundle size manageable

## Browser Support

- Modern browsers supporting CSS Cascade Layers
- Graceful degradation for older browsers
- Progressive enhancement approach

## Migration Guide

When migrating from the old system:

1. Replace direct CSS variables with semantic tokens
2. Update utility class names to match new system
3. Use cascade layers for better organization
4. Adopt container queries for component responsiveness

## Contributing

When adding new styles:

1. Use existing design tokens when possible
2. Add new tokens to appropriate token files
3. Follow the layer architecture
4. Include accessibility considerations
5. Test with different color schemes and motion preferences

## Resources

- [CSS Cascade Layers](https://developer.mozilla.org/en-US/docs/Web/CSS/@layer)
- [OKLCH Color Space](https://oklch.com/)
- [Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Container_Queries)
- [Modern CSS Reset](https://piccalil.li/blog/a-modern-css-reset/)