# Web Design System

## Purpose

Belu Webのデザインシステム方針を定義する。

デザイナー向けの依頼内容は `docs/web-design-brief.md` で定義する。

このドキュメントでは、実装前に以下を固定する。

- Styling strategy
- UI primitiveの置き場
- Base UIの利用方針
- Design tokenの命名と候補

---

## Styling Strategy

Belu WebはCSS Modulesを基本のstyling手段とする。

```text
apps/web/src/components/Button/Button.tsx
apps/web/src/components/Button/Button.module.css
```

Global CSSはreset、base typography、CSS variablesのみを担当する。

```text
apps/web/src/styles.css
```

Domain固有のcomponentは `features/{domain}/components` に置き、必要に応じてcomponent単位のディレクトリにCSS Moduleを置く。

```text
apps/web/src/features/posts/components/PostCard/PostCard.tsx
apps/web/src/features/posts/components/PostCard/PostCard.module.css
```

---

## Base UI

Headless component libraryとしてBase UIを利用する。

Base UIは見た目を持たないaccessible componentの土台として扱う。
Belu固有の見た目はCSS Modulesとdesign tokenで実装する。

Base UIを使うもの:

- Dialog
- Menu
- Popover
- Select
- Tabs
- Tooltip
- Checkbox
- Switch

Base UIを使わなくてよいもの:

- Button
- TextField
- Page
- Stack
- EmptyState
- VisuallyHidden

これらはDOMとCSSだけで十分に扱えるため、まずは自前primitiveとして実装する。

---

## Component Boundaries

```text
apps/web/src/components/
```

アプリ横断のprimitiveを置く。
Domain知識を持たない。

Examples:

- `Button`
- `TextField`
- `Field`
- `Page`
- `EmptyState`
- `Dialog`
- `Menu`
- `Tabs`

```text
apps/web/src/features/{domain}/components/
```

Domain固有のcomponentを置く。
`components` のprimitiveを組み合わせる。

Examples:

- `PostCard`
- `PostForm`
- `ReactionButton`
- `PetProfile`
- `SpaceSwitcher`

```text
apps/web/src/routes/
```

Route fileは画面の組み立てを担当する。
UI詳細は持たない。

Responsibilities:

- `loader`
- `beforeLoad`
- params/search取得
- feature componentへのprops受け渡し

---

## Token Principles

Design tokenはCSS variablesとして `styles.css` に定義する。

Tokenは用途ベースのsemantic tokenを優先する。
色名そのものをcomponentに直接持ち込まない。

Good:

```css
color: var(--color-text);
background: var(--color-surface);
border-color: var(--color-border);
```

Avoid:

```css
color: #1f2933;
background: #ffffff;
```

---

## Initial Tokens

### Color

Beluはペットと思い出を扱うため、温かさは持たせる。
ただし、MVPでは甘くしすぎず、写真とテキストが読みやすい落ち着いたneutralを基調にする。

```css
:root {
  /* color */
  --color-bg: #faf8f5;
  --color-surface: #ffffff;
  --color-surface-muted: #f3eee8;

  --color-text: #1f1f1f;
  --color-text-muted: #6f6a64;
  --color-text-subtle: #9a9289;

  --color-border: #e8e2da;
  --color-border-strong: #d7cec4;

  --color-primary: #8b6a4e;
  --color-primary-hover: #75583f;
  --color-primary-text: #ffffff;

  --color-accent: #c67c4e;
  --color-accent-muted: #f4e3d8;

  --color-danger: #d96c6c;
  --color-danger-bg: #fff0f0;
}
```

### Radius

```css
:root {
  /* radius */
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
}
```

### Spacing

4pxを基準にしつつ、MVPではよく使う段階に絞る。

```css
:root {
  /* spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;
}
```

### Typography

```css
:root {
  /* typography */
  --font-sans: Inter, "Noto Sans JP", system-ui, sans-serif;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 20px;
  --font-size-xl: 24px;
  --font-size-2xl: 32px;

  --line-height-tight: 1.25;
  --line-height-normal: 1.6;

  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
}
```

### Shadow

影は控えめに使う。
情報構造は余白とborderを優先する。

```css
:root {
  /* shadow */
  --shadow-xs: 0 1px 2px rgb(31 31 31 / 0.04);
  --shadow-sm: 0 4px 12px rgb(31 31 31 / 0.06);
  --shadow-md: 0 12px 32px rgb(31 31 31 / 0.08);
}
```

### Z Index

```css
:root {
  /* z-index */
  --z-header: 10;
  --z-overlay: 20;
  --z-modal: 30;
  --z-toast: 40;
}
```

---

## Initial UI Primitives

最初に作るprimitive:

- `Button`
- `TextField`
- `Field`
- `Page`
- `EmptyState`

Base UI導入後に作るprimitive:

- `Dialog`
- `Menu`
- `Select`
- `Tabs`
- `Tooltip`

---

## Non Goals

MVPでは以下を行わない。

- Tailwind CSSの導入
- shadcn/uiの導入
- Component libraryの過剰な抽象化
- すべてのUIをBase UIでwrapする
- Domain固有componentの早すぎる共通化
- Card中心の画面設計

---

## Open Decisions

- Base UI packageを導入するタイミング
- Icon libraryを使うかどうか
- Dark modeをMVPで扱うかどうか
- Layout container tokenを定義するかどうか
