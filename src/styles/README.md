# Modern CSS Architecture

This CSS architecture follows the **ITCSS (Inverted Triangle CSS)** methodology, organizing styles from generic to specific, ensuring low specificity and high maintainability.

## Directory Structure

```
src/styles/
├── index.css           # Main entry point
├── settings/          # Design tokens and configuration
│   ├── tokens.css     # CSS custom properties (colors, spacing, etc.)
│   └── media-queries.css # Breakpoints and media queries
├── tools/             # Mixins and functions
│   ├── functions.css  # CSS functions and calculations
│   └── mixins.css     # Reusable patterns
├── generic/           # Reset and normalize
│   ├── reset.css      # Modern CSS reset
│   └── box-sizing.css # Box model normalization
├── elements/          # Base HTML elements
│   ├── base.css       # Body, main, section, etc.
│   ├── typography.css # Headings, paragraphs, lists
│   ├── links.css      # Anchor tags and states
│   └── forms.css      # Form controls
├── objects/           # Layout patterns
│   ├── container.css  # Container system
│   ├── grid.css       # Grid layouts
│   ├── flex.css       # Flexbox utilities
│   └── stack.css      # Vertical spacing
├── components/        # UI components
│   ├── buttons.css    # Button styles
│   ├── cards.css      # Card components
│   ├── navigation.css # Nav components
│   ├── modals.css     # Modal dialogs
│   └── forms.css      # Form components
├── patterns/          # Complex UI patterns
│   ├── header.css     # Site header
│   ├── footer.css     # Site footer
│   ├── hero.css       # Hero sections
│   └── content-sections.css # Content layouts
├── utilities/         # Helper classes
│   ├── spacing.css    # Margin/padding utilities
│   ├── typography.css # Text utilities
│   ├── colors.css     # Color utilities
│   ├── display.css    # Display utilities
│   └── animations.css # Animation utilities
└── themes/           # Theme variations
    ├── dark.css      # Dark mode
    ├── contrast.css  # High contrast
    └── print.css     # Print styles
```

## Key Features

### 1. **Design Tokens**
All design decisions are centralized in CSS custom properties:
- Colors (brand, neutral, semantic)
- Typography (font families, sizes, weights)
- Spacing (consistent scale)
- Shadows, borders, animations

### 2. **Modern CSS Features**
- CSS Custom Properties for theming
- Logical properties (`margin-inline`, `padding-block`)
- Modern selectors (`:is()`, `:where()`, `:has()`)
- Container queries support
- CSS Grid and Flexbox
- Fluid typography with `clamp()`

### 3. **Accessibility First**
- Focus visible states
- Reduced motion support
- High contrast mode
- Screen reader utilities
- Semantic HTML styling

### 4. **Performance Optimized**
- Minimal specificity
- No deep nesting
- Efficient selectors
- CSS containment
- Modular architecture

### 5. **Developer Experience**
- Clear naming conventions
- BEM-inspired modifiers
- Comprehensive documentation
- Type-safe with CSS custom properties
- Easy to extend and maintain

## Usage Examples

### Using Design Tokens
```css
.my-component {
  color: var(--color-text-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-md);
}
```

### Using Utility Classes
```html
<!-- Spacing utilities -->
<div class="mt-4 mb-8 px-6">

<!-- Typography utilities -->
<h2 class="text-2xl font-bold text-brand">

<!-- Animation utilities -->
<button class="btn animate-fade-in hover-lift">
```

### Creating Components
```css
/* Follow the established patterns */
.component {
  /* Layout */
  display: flex;
  
  /* Spacing */
  padding: var(--spacing-4);
  
  /* Typography */
  font-size: var(--font-size-base);
  
  /* Visual */
  background: var(--color-surface-primary);
  
  /* Behavior */
  transition: all var(--duration-fast) var(--easing-out);
}
```

## Best Practices

1. **Use Design Tokens**: Always use CSS custom properties instead of hard-coded values
2. **Follow the Architecture**: Place new styles in the appropriate layer
3. **Keep Specificity Low**: Avoid ID selectors and deep nesting
4. **Mobile First**: Write base styles for mobile, enhance for larger screens
5. **Accessibility**: Always include focus states and respect user preferences
6. **Documentation**: Comment complex patterns and document new components

## Extending the System

When adding new styles:

1. **Identify the layer**: Determine which ITCSS layer your styles belong to
2. **Check existing patterns**: Look for similar components or utilities
3. **Use design tokens**: Leverage the existing token system
4. **Follow conventions**: Use consistent naming and structure
5. **Test accessibility**: Ensure keyboard navigation and screen reader support
6. **Document changes**: Update this README if adding new patterns

## Migration from Old System

The previous system had two main files:
- `animations.css`: Now split into `utilities/animations.css` and animation-related tokens
- `design-system.css`: Now distributed across multiple layers following ITCSS

Benefits of the new architecture:
- Better organization and findability
- Easier to maintain and extend
- Improved performance
- Better developer experience
- More scalable for large projects