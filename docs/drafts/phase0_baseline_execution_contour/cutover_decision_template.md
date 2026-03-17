# Cutover Decision Template

## Status
pre-cutover draft

## Purpose
Этот шаблон используется для отдельного cutover decision после `Phase 0` baseline checks.

## Decision metadata
- `decision_scope`:
- `baseline_package_version`:
- `review_date`:
- `review_owner`:

## Cutover question
Можно ли переводить `Phase 0 baseline execution contour` из pre-cutover draft package в active approved contour?

## Required review blocks
### 1. Repeatability
- comparable runs finish predictably:
- evidence:

### 2. Bundle completeness
- one consolidated bundle is produced on each run:
- evidence:

### 3. Runtime observability
- request refs and runtime state are auditable enough:
- evidence:

### 4. Provider policy stability
- provider policy remains explicit and stable:
- evidence:

### 5. Secret hygiene readiness
- environment-only secret handling is respected:
- evidence:

### 6. Unresolved contradictions vs current approved contour
- source of truth contradiction:
- research executor contradiction:
- output contract contradiction:
- executor naming contradiction:

### 7. Decision
- `go`
- `iterate`
- `no_go`

## Required rationale
Опиши:
- почему решение принято;
- какие gaps остаются;
- какие документы должны быть синхронизированы в случае реального cutover.
