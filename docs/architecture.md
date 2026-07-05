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

* React
* TanStack Router
* TanStack Query

### Responsibilities

* UI Rendering
* Routing
* API Communication
* Client State Management

---

## Backend

* Hono
* Hono RPC

### Responsibilities

* API
* Authentication
* Authorization
* Domain Logic
* Data Access

---

## Database

* Cloudflare D1
* Drizzle ORM

### Responsibilities

* Data Persistence

---

## Object Storage

* Cloudflare R2

### Responsibilities

* Image Storage

---

## Authentication

* Better Auth

### Responsibilities

* Authentication
* Session Management

---

## Infrastructure

* Terraform
* Wrangler

### Responsibilities

Terraform

* Infrastructure Management

Wrangler

* Local Development
* Worker Deployment
