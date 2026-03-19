# Validation Summary

## Run Goal
Проверить, даст ли GPT-5.4 mini более строгий и полезный validator verdict на том же retrieval evidence.

## Current Hypothesis
На том же source evidence model openai/gpt-5.4-mini должна лучше соблюдать one-to-one contract и осторожнее обращаться с confirmed_case/high confidence, чем предыдущие validator models.

## Source Run
phase0-retrieval-run-003

## Evidence Count
2

## Validated Signal Count
2

## Signal Type Counts
{
  "hold": 1,
  "confirmed_case": 1
}

## Summary
По одному record вернули один verdict на каждый evidence_id. Для evidence-001 данных недостаточно для confirmed_case, поэтому hold. Для evidence-002 есть достаточно признаков подтвержденного клиентского кейса, но с умеренной уверенностью из-за vendor-self-reported характера источника.
