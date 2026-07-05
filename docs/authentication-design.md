# Authentication Design

## Goal

Beluの認証状態をAPI側で一貫して扱い、Routeから認証ライブラリや低レベルなsession取得処理を直接扱わないようにする。

---

## Library

- Better Auth
- Organization Plugin

---

## Authentication Routes

Better Authの認証エンドポイントはAPIにマウントする。

```text
/api/auth/*
```

Better AuthのhandlerはHono routeから呼び出す。

---

## Auth Instance

Cloudflare WorkersではBindingsがリクエストコンテキストから提供される。

そのため、runtime用のBetter Authインスタンスはモジュールトップレベルのsingletonとして作成しない。
リクエストごとに `createAuth(c.env)` を呼び出し、D1 bindingと設定値を渡す。

Better Auth CLIのschema生成だけは `src/auth.config.ts` を利用する。
このファイルは生成用の設定であり、runtimeの認証処理では利用しない。

---

## Configuration

認証設定はCloudflare Workers Bindingから取得し、 `config.ts` を経由する。

```text
AUTH_BASE_URL
AUTH_SECRET
AUTH_TRUSTED_ORIGINS
DB
```

- `AUTH_SECRET` は本番では十分に長いランダム値を設定する。
- `AUTH_TRUSTED_ORIGINS` はカンマ区切りで複数指定できる。
- local devではWranglerのdev varsまたはsecret管理を利用する。

---

## Session

- Better Authのsessionを利用する。
- SessionはCookieベースで管理する。
- API側ではリクエストごとにsessionを取得する。
- 認証済みユーザー情報はHono Contextに保持する。

---

## Hono Context Variables

認証Middlewareで以下をContextへセットする。

```text
user
session
```

未ログインの場合はどちらもnullとする。

---

## Authentication Middleware

認証Middlewareは、リクエストごとにsessionを確認する。

sessionが存在する場合:

- userをContextへセットする。
- sessionをContextへセットする。

sessionが存在しない場合:

- userにnullをセットする。
- sessionにnullをセットする。

---

## Protected Routes

認証が必要なRouteでは `requireUser` middleware を利用する。

未ログインの場合はUnauthorizedExceptionをthrowする。

---

## Authorization

認証と認可は分離する。

Beluではログイン済みかどうかだけではなく、対象SpaceのMemberであることを確認する。
SpaceはBetter Auth Organizationとして扱う。

Space内の操作では、対象ユーザーがSpaceのMemberであることを必須とする。

---

## Space Permission

初期権限は以下のみとする。

```text
owner
member
```

### owner

- Spaceを管理できる。
- Memberを管理できる。
- Petを管理できる。
- Postを管理できる。
- Inviteを作成できる。

### member

- Spaceを閲覧できる。
- Petを閲覧できる。
- Postを作成できる。
- Postを閲覧できる。

---

## Cookie Policy

- WebとAPIは同一サイト配下で利用する前提とする。
- CookieはSameSite=Laxを基本とする。
- Cross-domain Cookieは初期段階では利用しない。

---

## Rules

- RouteからBetter Authの低レベルAPIを直接多用しない。
- 認証状態の取得はMiddlewareを通す。
- 認可はSpace単位で行う。
- 認証エラーはUnauthorizedExceptionをthrowする。
- 認可エラーはForbiddenExceptionをthrowする。

---

## Design Principles

- 認証と認可を分離する。
- 認証状態はHono Contextへ集約する。
- Better Authの実装詳細をRouteへ漏らさない。
- Organization管理はBetter Authへ委譲する。
- 必要になるまで過度な抽象化を行わない（YAGNI）。
