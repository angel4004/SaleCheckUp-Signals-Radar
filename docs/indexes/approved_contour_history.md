# Approved Contour History

This file is the canonical contour history layer for approved governance states.

Full text recovery is performed through Git history.
Contour-level recovery is performed through the snapshot files in `docs/history/approved_contours/`.

## Current Pointers

- `current_working_snapshot_id`: `approved_contour_2026-03-15_decision_008`
- `current_committed_snapshot_id`: `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening`
- `current_committed_approved_contour_sha`: `e30164588f005064a072bf222419926ff8eb49aa`

## Snapshot Registry

| snapshot_id | status | effective_date | approved_contour_commit_sha | source | file | notes |
|---|---|---|---|---|---|---|
| `approved_contour_2026-03-14_foundation` | approved | 2026-03-14 | `c95a8afe64bff8b39444ba6a9630e65e921ecc91` | `decision_001`, `decision_002`, 2026-03-14 sync package | `docs/history/approved_contours/approved_contour_2026-03-14_foundation.md` | First coherent committed governance contour. |
| `approved_contour_2026-03-15_decision_003` | approved_backfilled | 2026-03-15 | `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf` | `decision_003`, `patch_plan_005` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_003.md` | Historical contour recovered from Git after explicit history layer was introduced. |
| `approved_contour_2026-03-15_alignment_after_decision_003` | approved_backfilled | 2026-03-15 | `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf` | `patch_plan_006` | `docs/history/approved_contours/approved_contour_2026-03-15_alignment_after_decision_003.md` | Residual sync alignment after `decision_003`. |
| `approved_contour_2026-03-15_decision_004` | approved_backfilled | 2026-03-15 | `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf` | `decision_004`, `patch_plan_007` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_004.md` | Execution-boundary contour recovered from Git. |
| `approved_contour_2026-03-15_decision_005` | approved | 2026-03-15 | `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf` | `decision_005`, `patch_plan_008` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_005.md` | Last committed approved contour at the start of this pass. |
| `approved_contour_2026-03-15_decision_006` | approved | 2026-03-15 | `33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea` | `decision_006`, `patch_plan_009` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_006.md` | Committed contour after the history-model migration package. |
| `approved_contour_2026-03-15_decision_007` | approved | 2026-03-15 | `3d3c5945ed7b338025712f94282dfd43ca1e9d3f` | `decision_007`, `patch_plan_010` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_007.md` | Committed contour after introducing the canonical handoff contract. |
| `approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening` | approved | 2026-03-15 | `e30164588f005064a072bf222419926ff8eb49aa` | `patch_plan_011` | `docs/history/approved_contours/approved_contour_2026-03-15_patch_011_handoff_contract_rendering_hardening.md` | Committed contour after handoff-contract rendering hardening. |
| `approved_contour_2026-03-15_decision_008` | pending_commit | 2026-03-15 | `e30164588f005064a072bf222419926ff8eb49aa` | `decision_008`, `patch_plan_012` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_008.md` | Current working contour for Wave 1 Search Operating System. |
