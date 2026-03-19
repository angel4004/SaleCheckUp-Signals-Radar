# Validation Summary

## Run Goal
Проверить, что validator больше не даёт confirmed_case для vendor/self-reported evidence без независимой верификации.

## Current Hypothesis
После policy cap rule evidence из vendor/customer-story класса должно максимум попадать в monetizable_pain_signal или hold.

## Source Run
phase0-retrieval-run-003

## Evidence Count
2

## Validated Signal Count
2

## Signal Type Counts
{
  "monetizable_pain_signal": 1,
  "hold": 1
}

## Summary
Проверка подтвердила policy cap rule: vendor/customer-story evidence не повышен до confirmed_case без независимой верификации. Первый источник классифицирован как monetizable_pain_signal из-за явной экономически значимой потери звонков, второй — как hold из-за сильной, но неподтверждённой маркетинговой истории.
