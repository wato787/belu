# Domain Model

## Overview

Beluで利用するドメインモデルを定義する。

本ドキュメントでは、データベース設計ではなく、Beluにおける概念とその責務を定義する。

---

## User

Beluを利用するユーザー。

### Responsibilities

- ログインする
- Spaceへ参加する
- Postを作成する

---

## Space

写真や思い出を共有する単位。

BeluのすべてのデータはSpaceに属する。

### Responsibilities

- Memberを管理する
- Petを管理する
- Postを管理する

---

## Member

Spaceへ所属するユーザー。

UserとSpaceの関係を表す。

### Responsibilities

- Spaceへ参加する
- Space内で操作を行う

---

## Pet

Spaceで管理されるペット。

### Responsibilities

- プロフィールを持つ
- Postへ関連付けられる

---

## Post

思い出を記録する投稿。

Beluにおける中心となるドメイン。

### Responsibilities

- Photoを持つ
- Petへ関連付けられる
- Memberによって作成される

---

## Photo

Postに紐付く写真。

Photo単体では存在せず、必ずPostに属する。
ClientはPost作成前にR2へ写真を直接アップロードできるが、Beluのドメイン上でPhotoになるのはPost作成時とする。

### Responsibilities

- Postを構成する
- R2 Object Keyを保持する

---

## Invite

Spaceへ参加するための招待。

### Responsibilities

- UserをSpaceへ招待する

---

## Reaction

Postに対するリアクション。

### Responsibilities

- Postへリアクションする

---

# Domain Relationship

```text
User
 │
 └─ Member
      │
      ▼
    Space
    ├── Pet
    ├── Post
    │     ├── Photo
    │     └── Reaction
    └── Invite
```
