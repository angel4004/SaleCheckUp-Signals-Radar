# Approved Contour History

This file is the canonical contour history layer for approved governance states.

Full text recovery is performed through Git history.
Contour-level recovery is performed through the snapshot files in `docs/history/approved_contours/`.

## Current Pointers

- `current_working_snapshot_id`: `approved_contour_2026-03-15_decision_007`
- `current_committed_snapshot_id`: `approved_contour_2026-03-15_decision_006`
- `current_committed_approved_contour_sha`: `33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea`

## Snapshot Registry

| snapshot_id | status | effective_date | approved_contour_commit_sha | source | file | notes |
|---|---|---|---|---|---|---|
| `approved_contour_2026-03-14_foundation` | approved | 2026-03-14 | `c95a8afe64bff8b39444ba6a9630e65e921ecc91` | `decision_001`, `decision_002`, 2026-03-14 sync package | `docs/history/approved_contours/approved_contour_2026-03-14_foundation.md` | First coherent committed governance contour. |
| `approved_contour_2026-03-15_decision_003` | approved_backfilled | 2026-03-15 | `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf` | `decision_003`, `patch_plan_005` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_003.md` | Historical contour recovered from Git after explicit history layer was introduced. |
| `approved_contour_2026-03-15_alignment_after_decision_003` | approved_backfilled | 2026-03-15 | `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf` | `patch_plan_006` | `docs/history/approved_contours/approved_contour_2026-03-15_alignment_after_decision_003.md` | Residual sync alignment after `decision_003`. |
| `approved_contour_2026-03-15_decision_004` | approved_backfilled | 2026-03-15 | `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf` | `decision_004`, `patch_plan_007` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_004.md` | Execution-boundary contour recovered from Git. |
| `approved_contour_2026-03-15_decision_005` | approved | 2026-03-15 | `e1f5c9b7a248baad0b8de1e466af4ca16eef52bf` | `decision_005`, `patch_plan_008` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_005.md` | Last committed approved contour at the start of this pass. |
| `approved_contour_2026-03-15_decision_006` | approved | 2026-03-15 | `33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea` | `decision_006`, `patch_plan_009` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_006.md` | Committed contour after the history-model migration package. |
| `approved_contour_2026-03-15_decision_007` | pending_commit | 2026-03-15 | `33fa8ecbc066025bbdbc2b6e1b94a9fb50b817ea` | `decision_007`, `patch_plan_010` | `docs/history/approved_contours/approved_contour_2026-03-15_decision_007.md` | Current working contour for handoff-contract Wave 0; final commit grounding requires the next Git commit. |
