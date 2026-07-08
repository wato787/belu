# Web Screen Design

## Purpose

Belu WebのMVP画面構成を定義する。

このドキュメントでは、UIの見た目や詳細なレイアウトは決めない。
まずはRouteごとの責務、主なfeature依存、MVPで扱う範囲を固定する。

---

## Principles

- URLを持つ画面は `apps/web/src/routes` に置く。
- 画面本体やdomain専用componentは `apps/web/src/features/{domain}/components` に置く。
- Route fileは認証、loader、params/search取得、画面componentの組み立てに寄せる。
- Server stateは `features/{domain}/keys.ts`、`queries.ts`、`mutations.ts` で管理する。
- UI詳細が未確定の間は、画面componentは責務が分かる薄いplaceholderに留める。

---

## Public Routes

### `/`

Public home。

MVPでは簡易的な入口として扱う。
未ログインユーザーに対して、ログイン画面への導線を持つ想定。

Primary feature:

- なし

MVP scope:

- アプリ名表示
- `/login` への導線

---

### `/login`

認証画面。

Better Authのemail/passwordによるsign in / sign upを扱う。
ログイン済みの場合は `/spaces` へredirectする。

Primary feature:

- auth client

MVP scope:

- email/password sign in
- email/password sign up
- redirect searchを使ったログイン後の復帰

---

## Authenticated Routes

Authenticated routeは `_authenticated` pathless layout配下に置く。
ログイン判定は `authClient.getSession()` を直接呼び、TanStack Queryには乗せない。

MVPでは、ログイン直後の遷移先は `/spaces` とする。
Spaceは頻繁に切り替えるものではないため、Space switcherを常時表示しない。
ユーザーは `/spaces` でSpaceを選び、その後は選択中Spaceの画面内で過ごす。

Space内の主要導線は、選択中Space配下の画面でのみ表示する。
常時グローバルナビではなく、最小限のSpace内ナビとして扱う。

---

### `/spaces`

Space選択画面。

ユーザーが所属しているSpaceの一覧を表示し、利用するSpaceを選ぶ。
ログイン後の最初のアプリ画面として扱う。
Space切り替えが必要な場合も、この画面に戻って選び直す。

Primary feature:

- `spaces`

MVP scope:

- 所属Space一覧
- Space詳細への導線
- Spaceがない場合の空状態
- Space作成への最小導線

Deferred:

- 詳細なオンボーディング
- 高度な並び替えや検索
- 常時表示のSpace switcher

---

### `/spaces/$spaceId`

Spaceホーム。

選択中Spaceの概要と、主要domainへの入口を表示する。
Space配下画面の起点として扱う。
MVPでは、Space選択後の実質的なホーム画面とする。

Primary feature:

- `spaces`

Related features:

- `posts`
- `pets`
- `members`
- `invites`

MVP scope:

- Space名などの基本情報
- Posts / Pets / Members / Invites への導線
- `/spaces` へ戻る導線

Deferred:

- ダッシュボード集計
- 最近のアクティビティ
- 常時表示のSpace switcher

---

### `/spaces/$spaceId/posts`

投稿一覧画面。

Space内のPostを一覧表示する。
Beluの中心画面として、写真と思い出を閲覧する入口になる。

Primary feature:

- `posts`

Related features:

- `pets`
- `spaces`

MVP scope:

- Post一覧
- Post詳細への導線
- 投稿作成への導線
- 空状態

Deferred:

- 高度なフィルタ
- 無限スクロール最適化

---

### `/spaces/$spaceId/posts/$postId`

投稿詳細画面。

Post本文、写真、関連Pet、Reactionを表示する。
Postに対する更新や削除もこの画面から扱う想定。

Primary feature:

- `posts`

Related features:

- `pets`

MVP scope:

- Post詳細
- Photo表示
- Reaction表示と更新
- Post編集/削除への導線

Deferred:

- コメント
- Photo単体管理

---

### `/spaces/$spaceId/pets`

Pet一覧画面。

Space内で管理するPetを一覧表示する。
Post作成時に関連付ける対象としても使われる。

Primary feature:

- `pets`

MVP scope:

- Pet一覧
- Pet詳細への導線
- Pet作成への導線
- 空状態

Deferred:

- 詳細なプロフィール項目
- 並び替え

---

### `/spaces/$spaceId/pets/$petId`

Pet詳細画面。

Petのプロフィールと関連するPostへの導線を表示する。

Primary feature:

- `pets`

Related features:

- `posts`

MVP scope:

- Pet基本情報
- Pet編集/削除への導線

Deferred:

- Pet別Postタイムライン

---

### `/spaces/$spaceId/members`

Member管理画面。

Spaceに所属するMemberを管理する。
MVPではowner向けの管理画面として扱う。

Primary feature:

- `members`

MVP scope:

- Member一覧
- Member削除

Deferred:

- Role変更
- 権限の詳細管理

---

### `/spaces/$spaceId/invites`

Invite管理画面。

Spaceへの招待を作成、確認、削除する。
MVPではowner向けの管理画面として扱う。

Primary feature:

- `invites`

MVP scope:

- Invite一覧
- Invite作成
- Invite削除

Deferred:

- 招待メール送信
- 招待URL共有UIの作り込み

---

### `/invites/$inviteId`

招待承認画面。

招待されたユーザーがSpace参加を承認または拒否する。
Space所属前でもアクセスされる画面だが、MVPではログイン必須Routeとして扱う。

Primary feature:

- `invites`

MVP scope:

- Invite内容表示
- Accept
- Reject

Deferred:

- 未ログインユーザー向けの招待受け入れ導線

---

## First Implementation Order

MVPでは、最初から全画面を作り込まない。
まずはログイン後にSpaceを選び、Space内でPostを閲覧、作成できる流れを優先する。

UI詳細を決める前に、以下の順で画面責務とデータ接続を薄く通す。

1. `/spaces`
2. `/spaces/$spaceId`
3. `/spaces/$spaceId/posts`
4. `/spaces/$spaceId/posts/$postId`
5. `/spaces/$spaceId/pets`
6. `/spaces/$spaceId/members`
7. `/spaces/$spaceId/invites`
8. `/invites/$inviteId`

各画面では、まずRoute loaderとfeature query/mutationの型接続を確認する。
UI実装はデザインシステムの方針を決めた後に進める。
