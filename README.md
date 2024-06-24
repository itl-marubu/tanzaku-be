# Ferris-Contact

フェリス女学院案件の連絡先収集サーバー

開発: [@mizphses]

OpenAPI Spec: [/docs/openapi.yaml](/docs/openapi.yaml)

## 構成
* インフラ: Cloudflare Worker
* サーバ: Hono + Wrangler
* DB: D1
  * ORM: Prisma

## DBに変更を加える方法
`prisma/schema.prisma`編集後，以下を順次実行
```bash
pnpm migrations:create マイグレーションのファイル名
pnpm migrations:write migrations/00**_ファイル名.sql # 00**は自動採番。確認のこと。
pnpm migrate:dev #開発環境に適用
```

本番環境への適用は，原則リリース時に実施

## リリース方法
Actionsから[Release Production](https://github.com/Kuloca-LLC/ferris-contact/actions/workflows/release-deploy.yaml)を回す。
