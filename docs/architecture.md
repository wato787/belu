# Architecture

## Overview

BeluはCloudflareを中心としたWebアプリケーションとして構成する。

```text
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Frontend    │
│ React       │
└──────┬──────┘
       │ Hono RPC
       ▼
┌─────────────┐
│ Backend     │
│ Hono        │
└──┬────┬─────┘
   │    │
   │    └──────────────┐
   ▼                   ▼
Cloudflare D1     Cloudflare R2
```

## Frontend

- React
- TanStack Router
- TanStack Query

### Responsibilities

- UI Rendering
- Routing
- API Communication
- Client State Management

---

## Backend

- Hono
- Hono RPC

### Responsibilities

- API
- Authentication
- Authorization
- Domain Logic
- Data Access

---

## Database

- Cloudflare D1
- Drizzle ORM

### Responsibilities

- Data Persistence

---

## Object Storage

- Cloudflare R2

### Responsibilities

- Image Storage

### Upload Architecture

Postに紐付く写真は、ClientからR2へ直接アップロードする。

Backendは写真データを受け取らず、以下のみを行う。

- Authentication
- Space Membership Authorization
- Upload Request Validation
- R2 Object Key Generation
- Signed Upload URL Generation
- Post作成時のObject存在確認

```text
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. request signed upload URL
       ▼
┌─────────────┐
│ Backend     │
│ Hono        │
└──────┬──────┘
       │ 2. return signed PUT URL
       ▼
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 3. upload photo directly
       ▼
Cloudflare R2
```

R2 Bucket Bindingは、Worker内からR2 Objectを確認・削除する用途で利用する。
Clientへ渡す署名付きPUT URLの生成にはR2のS3互換Credentialを利用する。

Worker RuntimeではCloudflare REST API Tokenを利用しない。
署名付きURL生成に必要なCredentialは、対象Bucketへの最小権限を持つR2 S3 Credentialとして管理する。
R2 S3 Credentialの生値はTerraform stateに保存しない。
MVPでは、R2 S3 CredentialはCloudflareで発行し、Worker secretとして登録する。
環境が増えて手動運用が負担になった場合は、TerraformではなくCI/CDやSecret Managerによるsecret syncを検討する。

MVPでは未使用Objectのcleanupは実装しない。

---

## Authentication

- Better Auth

### Responsibilities

- Authentication
- Session Management

---

## Infrastructure

- Terraform
- Wrangler

### Responsibilities

Terraform

- Infrastructure Management
- R2 Bucket Management
- R2 CORS Management
- R2 Lifecycle Management

Wrangler

- Local Development
- Worker Deployment
- Worker Secrets Management
