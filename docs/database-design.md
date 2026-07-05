# Database Design

## Naming

### Table

- 複数形を使用する。
- `snake_case` を使用する。

例

```text
users
spaces
space_members
pets
posts
photos
invites
reactions
```

### Column

- `snake_case` を使用する。

例

```text
space_id
created_at
updated_at
```

---

## Primary Key

- UUIDv7 を採用する。
- すべてのテーブルで `id` を主キーとする。

---

## Foreign Key

- 外部キー制約を利用する。
- 関連テーブルには適切な Foreign Key を設定する。

---

## Common Columns

すべてのテーブルは以下のカラムを持つ。

```text
id
created_at
updated_at
```

---

## Timestamp

- UTCで保存する。
- 表示時にユーザーのタイムゾーンへ変換する。

---

## Soft Delete

- 採用しない。
- 必要になるまで実装しない（YAGNI）。

---

## Cascade Delete

- 外部キーは `ON DELETE CASCADE` を基本とする。
- 親データ削除時は関連データも削除する。

---

## Index

- 必要になったタイミングで追加する。
- 初期段階では過度な最適化を行わない。

---

## Unique Constraint

- 必要な箇所のみ設定する。
- 業務上の一意性を保証する場合に利用する。

例

```text
space_members (space_id, user_id)
```

---

## Design Principles

- シンプルな設計を優先する。
- 一般的なRDB設計に従う。
- 不要な抽象化や最適化は行わない（YAGNI）。
- データモデルはドメインモデルを反映する。
