# Repo Execution Boundary

## Status
pre-cutover draft

## Purpose
Этот документ фиксирует boundary между baseline runtime и repo mutation.

## Core rule
Research runtime не должен напрямую мутировать repo artifacts.

## What runtime may do
Runtime может:
- собирать `run_input_package`;
- исполнять baseline request flow;
- обновлять local client-managed `run_state`;
- собирать local `run_bundle`.

## What runtime must not do
Runtime не должен:
- переписывать approved docs;
- обновлять `version_registry`;
- обновлять `change_log`;
- менять `approved_contour_history`;
- создавать или коммитить governance changes;
- делать repo write-back как часть baseline run.

## Repo-bound changes
Любые repo-bound code / docs / spec changes должны идти через `Codex` execution side по approved handoff process, а не через research runtime.

## Why this boundary exists
Если research runtime и repo mutation смешать в `Phase 0`, baseline перестанет быть:
- testable;
- observable;
- repeatable.

Вместо baseline contour получится partially automated governance/runtime mix, что выходит за scope `Phase 0`.

## Explicit contradiction note
Текущий approved contour использует `VS Code/Codex` как active repo execution layer.  
В этом draft package label `Codex cloud` используется только как target executor label для future baseline architecture и не заменяет current approved rule.
