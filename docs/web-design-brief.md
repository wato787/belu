# Web Design Brief

## Purpose

Belu Web MVPのUIデザインを依頼するためのブリーフ。

このブリーフは、デザイナーが画面設計とビジュアル方針を検討するための前提をまとめる。
実装仕様の詳細ではなく、プロダクト文脈、画面範囲、デザイン制約、期待する成果物を定義する。

---

## Product Summary

Beluは、ペットとの写真や思い出をSpace単位で共有、管理するWebアプリ。

中心となる体験は、Space内でPostを作成し、写真、Pet、Reactionと一緒に思い出を残すこと。
MVPでは、Photo単体の管理ではなく、PhotoはPostの一部として扱う。

Primary users:

- ペットとの日常を記録したいユーザー
- 家族や近しい人とSpaceを共有したいユーザー
- Space ownerとしてMemberやInviteを管理するユーザー

---

## Design Goal

MVPでは、派手なSNS体験よりも、日常の写真と思い出が自然に残せる落ち着いたプロダクト体験を優先する。
最初から多機能な管理画面を作らず、ログイン後にSpaceを選び、Space内で思い出を見たり投稿したりする最小体験を優先する。

Desired impression:

- あたたかい
- やさしい
- 読みやすい
- 写真が主役になる
- 使い方が迷子にならない

Avoid:

- 過度にかわいい表現
- 装飾過多
- 強いグラデーション
- Cardだらけの重い画面
- 写真よりUIが目立つ見た目

---

## Technical Constraints

Styling:

- CSS Modules
- Global CSSはreset、base typography、CSS variablesのみ
- Tailwind CSSは使わない
- shadcn/uiは使わない

Component foundation:

- Headless component libraryとしてBase UIを使う予定
- Base UIはDialog、Menu、Select、Tabsなど挙動が難しいUIの土台として使う
- Button、TextField、Page、EmptyStateなどは自前primitiveとして扱う

Implementation structure:

```text
apps/web/src/ui/
apps/web/src/features/{domain}/components/
apps/web/src/routes/
```

Design should respect:

- `ui` はdomain知識を持たない汎用primitive
- `features/*/components` はdomain固有UI
- `routes` は画面の組み立てのみ

Reference docs:

- `docs/web-screen-design.md`
- `docs/web-design-system.md`
- `docs/domain-model.md`

---

## Initial Design Tokens

以下のtokenを初期案として扱う。
必要があれば、デザイン提案の中で調整案を出してよい。

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

  /* radius */
  --radius-xs: 6px;
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;

  /* spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

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

  /* shadow */
  --shadow-xs: 0 1px 2px rgb(31 31 31 / 0.04);
  --shadow-sm: 0 4px 12px rgb(31 31 31 / 0.06);
  --shadow-md: 0 12px 32px rgb(31 31 31 / 0.08);

  /* z-index */
  --z-header: 10;
  --z-overlay: 20;
  --z-modal: 30;
  --z-toast: 40;
}
```

---

## Target Screens

MVPでは画面数と導線を最小限に保つ。
ログイン後は `/spaces` でSpaceを選ぶ。
Spaceは頻繁に切り替えるものではないため、Space switcherは常時表示しない。
Spaceを切り替える場合は `/spaces` に戻って選び直す想定。

Space内では、選択中Spaceの文脈だけを表示する。
主要導線はSpace内の最小ナビとして扱い、グローバルに大きく出しすぎない。

### `/`

Public home。

Purpose:

- 未ログインユーザー向けの入口
- `/login` への導線

Design notes:

- MVPではmarketing pageとして作り込みすぎない
- Beluの世界観が軽く伝わればよい

---

### `/login`

Sign in / sign up画面。

Purpose:

- email/passwordでログインまたはアカウント作成する
- ログイン後は元URLまたは `/spaces` に戻る

Design notes:

- 安心感と分かりやすさを優先
- sign in / sign upの切り替えが自然に分かる

---

### `/spaces`

Space選択画面。

Purpose:

- 所属Space一覧から利用するSpaceを選ぶ
- Spaceがない場合の空状態を表示する
- 必要に応じてSpaceを作成する

Design notes:

- ログイン後の最初の画面
- Spaceが複数あるケースと0件ケースを考慮
- Space switcherを常時表示しない前提で、この画面がSpace選択の入口になる
- 作り込みすぎず、選ぶ/作るが迷わないことを優先

---

### `/spaces/$spaceId`

Spaceホーム。

Purpose:

- 選択中Spaceの概要を表示する
- Posts / Pets / Members / Invites への入口になる

Design notes:

- App内のホームとして機能する
- 主要導線が迷わないことを優先
- Space名は分かるようにするが、Space切替UIを常時大きく置かない
- `/spaces` に戻る導線は必要

---

### `/spaces/$spaceId/posts`

投稿一覧画面。

Purpose:

- Space内のPostを一覧表示する
- 投稿作成と投稿詳細への導線を持つ

Design notes:

- 写真が主役
- Postカードは情報を詰め込みすぎない
- 空状態もMVPで必要

---

### `/spaces/$spaceId/posts/$postId`

投稿詳細画面。

Purpose:

- Post本文、写真、関連Pet、Reactionを表示する
- Post編集、削除への導線を持つ

Design notes:

- 写真閲覧の快適さを重視
- Reactionは軽く自然に押せる見た目にする
- コメントはMVP対象外

---

### `/spaces/$spaceId/pets`

Pet一覧画面。

Purpose:

- Space内のPet一覧を表示する
- Pet作成とPet詳細への導線を持つ

Design notes:

- Petプロフィールが見やすい
- Post作成時に関連付ける対象として理解しやすい

---

### `/spaces/$spaceId/pets/$petId`

Pet詳細画面。

Purpose:

- Petの基本情報を表示する
- Pet編集、削除への導線を持つ

Design notes:

- MVPでは詳細プロフィールを作り込みすぎない
- 将来的にPet別Postタイムラインを追加できる余白を残す

---

### `/spaces/$spaceId/members`

Member管理画面。

Purpose:

- Spaceに所属するMemberを一覧表示する
- ownerがMemberを削除できる

Design notes:

- 管理画面として明確であること
- 破壊的操作は慎重に見せる

---

### `/spaces/$spaceId/invites`

Invite管理画面。

Purpose:

- Inviteを作成、確認、削除する
- 招待URL共有への導線を持つ

Design notes:

- owner向け管理画面
- Invite作成後の共有導線が分かりやすい

---

### `/invites/$inviteId`

招待承認画面。

Purpose:

- Invite内容を確認する
- Space参加をAcceptまたはRejectする

Design notes:

- 参加先Spaceが明確に分かる
- Accept / Reject の判断が迷いにくい
- MVPではログイン必須Routeとして扱う

---

## Required Deliverables

MVP design proposal:

- Desktop layout
- Mobile layout
- Minimal navigation pattern
- Initial component set
- Empty state examples
- Form state examples
- Error state examples
- Loading state examples

Component design:

- Button
- TextField
- Field
- Page layout
- EmptyState
- Dialog
- Menu
- Select
- Tabs
- PostCard
- PetCard
- MemberRow
- InviteRow
- ReactionButton

Interaction notes:

- Navigation behavior
- Dialog behavior
- Destructive action confirmation
- Form validation display
- Mobile navigation behavior

---

## Design Priorities

1. MVPとして最小の画面構成にする
2. 写真と思い出が主役になる
3. ログイン後にSpaceを選ぶ流れが分かりやすい
4. Space内の現在地が分かりやすい
5. 投稿作成までの導線が自然
6. 管理画面が重くなりすぎない
7. Empty stateが寂しくなりすぎない
8. Mobileで破綻しない

---

## Open Questions For Designer

- Space内の最小ナビはsidebar、top nav、mobile bottom navのどれを軸にするか
- `/spaces` に戻る導線をどこに置くか
- Post一覧はgrid寄りかfeed寄りか
- 写真が複数枚あるPostの見せ方
- Reactionの見せ方
- Empty stateにイラストや画像を使うか
- Icon libraryを使うか
- Dark modeをMVPで考慮するか

---

## Non Goals

MVPデザインでは以下は対象外。

- Marketing LPの作り込み
- コメント機能
- Photo単体管理画面
- 高度な検索やフィルタ
- Role変更など詳細な権限管理
- Dark modeの完全設計
