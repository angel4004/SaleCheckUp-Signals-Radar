# Secret Policy v0

## Status
pre-cutover draft

## Purpose
Этот документ фиксирует minimal secret hygiene для `Phase 0 baseline execution contour`.

## Baseline secret
Используется только один runtime secret:
- `OPENROUTER_API_KEY`

## Loading rule
Secret должен загружаться только из environment.

Допустимые locations:
- local shell environment;
- local untracked `.env`-style files, которые игнорируются Git.

Недопустимые locations:
- tracked files;
- docs;
- markdown;
- prompts;
- examples;
- screenshots committed into repo.

## Repo hygiene requirements
Repo должен игнорировать:
- `.env`
- `.env.local`
- `.env.*`

Repo должен содержать только safe example:
- `env.example`

## Leak response rule
Если secret попал в:
- repo history;
- logs;
- screenshots;
- markdown;
- prompts;
- tracked files,

он считается compromised.

Required response:
1. rotate / revoke the secret;
2. stop treating the exposed value as valid;
3. remove future plaintext reuse;
4. document the incident outside the secret value itself.

## Boundary
Этот policy:
- не вводит secret manager;
- не вводит production KMS;
- не вводит server-side secret orchestration.
