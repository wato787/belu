# Authentication Design

## Goal

Beluの認証状態をAPI側で一貫して扱い、Routeから認証ライブラリや低レベルなsession取得処理を直接扱わないようにする。

---

## Library

- Better Auth

---

## Implementation Timing

認証実装はDatabase基盤の導入後に行う。

Better Authはユーザー、session、accountなどの永続化を必要とするため、D1およびDrizzleの基盤が整ってから導入する。

初期段階では設計のみを定義し、依存パッケージや認証Routeは追加しない。

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

そのため、Better Authのインスタンスはモジュールトップレベルのsingletonとして作成しない。

認証処理では、リクエストコンテキストから必要なBindingsを参照できる形にする。

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

認証が必要なRouteでは、Context上のuserを確認する。

未ログインの場合はUnauthorizedExceptionをthrowする。

---

## Authorization

認証と認可は分離する。

Beluではログイン済みかどうかだけではなく、対象SpaceのMemberであることを確認する。

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
- Database基盤が整うまで認証実装を先行しない。
- 必要になるまで過度な抽象化を行わない（YAGNI）。
