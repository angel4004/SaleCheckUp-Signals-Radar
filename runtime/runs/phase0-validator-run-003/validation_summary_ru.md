# Validation Summary

## Run Goal
Проверить, станет ли validator строже на том же retrieval evidence при смене модели.

## Current Hypothesis
На том же source evidence model openai/gpt-5-mini должна лучше соблюдать one-to-one contract и осторожнее обращаться с confirmed_case/high confidence.

## Source Run
phase0-retrieval-run-003

## Evidence Count
2

## Validated Signal Count
2

## Signal Type Counts
{
  "monetizable_pain_signal": 1,
  "confirmed_case": 1
}

## Summary
Первое доказательство (анализ 15,910 звонков) выявляет экономически значимую проблему скрытых отказов после удаления IVR — сигнал о монетизируемой боли, но без финансовых данных. Второе доказательство (case study Evermore) содержит конкретного плательщика и количественные результаты, поэтому признано подтверждённым кейсом, но остаётся зависящим от самодекларации вендора и требует независимой проверки.
