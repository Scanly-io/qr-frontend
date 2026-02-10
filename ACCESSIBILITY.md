# Accessibility Features Guide

## Overview

The QR Frontend editor is built with **WCAG 2.1 AA compliance** in mind, providing comprehensive keyboard navigation, screen reader support, and accessibility features for all users.

---

## 🎯 Key Accessibility Features

### 1. **Keyboard Navigation**
Full keyboard access to all editor functions without requiring a mouse.

#### Navigation Shortcuts
| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate between sections |
| `Shift + Tab` | Navigate backwards |
| `?` | Show keyboard shortcuts panel |
| `Esc` | Close modals/deselect blocks |

#### Block Management
| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Select previous/next block |
| `Enter` | Edit selected block |
| `Delete` or `Backspace` | Delete selected block |
| `Ctrl + D` | Duplicate selected block |

#### Editor Actions
| Shortcut | Action |
|----------|--------|
| `Ctrl + S` | Save microsite |
| `Ctrl + P` | Preview microsite |
| `Ctrl + Z` | Undo last action |
| `Ctrl + Shift + Z` | Redo last action |

#### View Controls
| Shortcut | Action |
|----------|--------|
| `Ctrl + 1` | Toggle block palette |
| `Ctrl + 2` | Toggle block inspector |
| `Ctrl + 3` | Toggle split view |

---

### 2. **Skip Navigation Links**
Skip links appear at the top of the page when focused (Tab from page load):
- **Skip to canvas** - Jump directly to the main editing area
- **Skip to blocks** - Jump to the block palette

---

### 3. **Screen Reader Support**

#### Live Regions
The editor includes ARIA live regions that announce:
- Block additions and deletions
- Save status updates
- Navigation changes
- Error messages

#### ARIA Labels
All interactive elements have descriptive labels:
- Buttons include `aria-label` attributes
- Links have meaningful text
- Form inputs have associated labels
- Icons are properly described

#### Semantic HTML
- Proper heading hierarchy (`<h1>` → `<h6>`)
- Semantic landmarks (`<main>`, `<nav>`, `<aside>`)
- Lists for related items
- Buttons vs links used appropriately

---

### 4. **Focus Management**

#### Focus Indicators
All interactive elements have visible focus indicators:
- **2px solid outline** with the theme color
- **4px shadow** for enhanced visibility
- Works with keyboard and mouse focus

#### Focus Trapping
Modals and dialogs trap focus within them:
- Tab cycles through modal elements
- Shift+Tab cycles backwards
- Can't accidentally tab out of modal
- Escape key closes and restores focus

---

### 5. **Keyboard Shortcuts Panel**

Press `?` to open the comprehensive keyboard shortcuts panel:
- **Searchable** - Filter shortcuts by description or key
- **Categorized** - Organized by function (Navigation, Block Management, etc.)
- **Accessible** - Full keyboard navigation and screen reader support
- **Always Available** - Accessible from any part of the editor

---

## 🛠️ Implementation Details

### Custom Hooks

#### `useAnnouncer()`
Hook for announcing messages to screen readers.

```typescript
const announce = useAnnouncer();
announce('Block added successfully', 'polite'); // or 'assertive'
```

#### `useKeyboardNavigation(options)`
Comprehensive keyboard shortcut management.

```typescript
useKeyboardNavigation({
  onSave: handleSave,
  onPreview: handlePreview,
  onDelete: handleDelete,
  // ... more callbacks
  enabled: true,
});
```

#### `useFocusManagement(items, selectedId, onSelect)`
Manages focus for list navigation (e.g., blocks).

```typescript
const { selectNext, selectPrevious } = useFocusManagement(
  blockIds,
  selectedBlockId,
  setSelectedBlockId
);
```

#### `useFocusTrap(containerRef, options)`
Traps focus within a container (e.g., modals).

```typescript
const modalRef = useRef<HTMLDivElement>(null);
useFocusTrap(modalRef, {
  enabled: isOpen,
  onEscape: handleClose,
  restoreFocus: true,
});
```

---

### Components

#### `<KeyboardShortcutsPanel />`
Full-featured keyboard shortcuts documentation panel.

```tsx
<KeyboardShortcutsPanel
  isOpen={showShortcuts}
  onClose={() => setShowShortcuts(false)}
/>
```

#### `<ScreenReaderAnnouncer />`
Component for announcing dynamic content to screen readers.

```tsx
<ScreenReaderAnnouncer
  message="Block added successfully"
  priority="polite"
/>
```

---

## 🎨 CSS Classes

### Screen Reader Only
```css
.sr-only {
  /* Visually hidden but accessible to screen readers */
}

.sr-only-focusable:focus {
  /* Becomes visible when focused */
}
```

### Focus Styles
All interactive elements automatically receive enhanced focus styles:

```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

button:focus-visible,
a:focus-visible,
input:focus-visible {
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}
```

---

## ✅ WCAG 2.1 AA Compliance Checklist

### Perceivable
- [x] All images have alt text
- [x] Color is not the only visual means of conveying information
- [x] Sufficient color contrast (4.5:1 for normal text)
- [x] Content can be presented in different ways without losing meaning

### Operable
- [x] All functionality available from keyboard
- [x] No keyboard traps
- [x] Skip navigation links provided
- [x] Page titled appropriately
- [x] Focus order is logical
- [x] Link purpose clear from link text

### Understandable
- [x] Page language identified
- [x] Navigation mechanisms consistent
- [x] Labels and instructions provided for form inputs
- [x] Error messages clear and helpful

### Robust
- [x] Valid HTML/ARIA markup
- [x] Status messages announced to screen readers
- [x] Compatible with assistive technologies

---

## 🧪 Testing Recommendations

### Screen Readers
Test with at least one screen reader:
- **Windows**: NVDA (free) or JAWS
- **macOS**: VoiceOver (built-in)
- **Linux**: Orca

### Keyboard Testing
1. Unplug your mouse
2. Navigate the entire editor using only keyboard
3. Verify all features are accessible
4. Check focus indicators are visible

### Browser Extensions
- **axe DevTools** - Automated accessibility testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Includes accessibility audit

---

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices Guide](https://www.w3.org/WAI/ARIA/apg/)
- [WebAIM Articles](https://webaim.org/articles/)
- [A11y Project](https://www.a11yproject.com/)

---

## 🚀 Future Enhancements

- [ ] High contrast mode
- [ ] Reduced motion support
- [ ] Customizable keyboard shortcuts
- [ ] Voice control integration
- [ ] AI-powered accessibility suggestions

---

## 💡 Tips for Developers

1. **Always test with keyboard** - Tab through your UI regularly
2. **Use semantic HTML** - Proper elements convey meaning
3. **Add ARIA when needed** - But prefer native HTML
4. **Test with screen readers** - Even 5 minutes helps
5. **Focus management matters** - Think about where focus goes
6. **Announce dynamic changes** - Use live regions
7. **Provide alternatives** - Multiple ways to accomplish tasks

---

## 🤝 Contributing

When adding new features, ensure:
1. All interactive elements are keyboard accessible
2. ARIA labels are provided where needed
3. Focus management is handled properly
4. Changes are announced to screen readers
5. Color contrast meets WCAG standards

---

**Remember:** Accessibility is not a feature—it's a fundamental right. Building accessible software makes the web better for everyone! 🌈
