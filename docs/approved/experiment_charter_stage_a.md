# Experiment Charter — Stage A v0.8

## Название этапа
**Этап A — проверка исследовательской машины**

## Суть этапа
На этом этапе мы не строим production contour. Мы проверяем, способен ли Manus в заданной рамке работать как правильная исследовательская машина для задачи SaleCheckUp.

## Основная гипотеза
**При наличии фиксированной инструкции, контракта выхода, правил фильтрации и набора тестовых примеров Manus способен стабильно находить релевантные монетизируемые сигналы для SaleCheckUp, отсеивать шум, помогать понимать не только за что платят, но и сколько платят, и выдавать результат в форме, пригодной для дальнейшей автоматизации.**

## Boundary of execution contours
Этот charter описывает только research execution contour этапа A.

- `ChatGPT Project` используется как thinking / feedback / governance layer для feedback, contradictions, reasoning, decisions, change scope и sync impact.
- `Manus` является research execution layer для run'ов и проверки гипотез этапа A.
- `VS Code/Codex` является repo/spec execution layer для изменения approved revisions на stable paths и repo artifacts.
- Repo/spec handoff между ChatGPT Project и VS Code/Codex должен идти по `docs/approved/vscode_codex_handoff_contract.md`; versioned repo artifacts инстанцируют этот contract для конкретной задачи.
- Repo changes не должны исполняться напрямую в web chat.
- Каждый run должен быть привязан к approved contour через stable approved paths и полный Git commit SHA.

Изменения самого charter, как и других approved docs, не должны вноситься через manual chat handoff.

## Субъект инициативы
Инициатор этой исследовательской работы — **Илья Суворов**, CPO и фаундер бизнес-гипотезы, которая реализуется через продукт SaleCheckUp.

Илья работает в R&D-отделе TravelLine и ищет через SaleCheckUp новые источники выручки для компании TravelLine.

## Что считается правильной исследовательской машиной
Правильная исследовательская машина — это контур, который:
- находит не просто интересные материалы, а монетизируемые сигналы;
- начинает каждый run с явного decision question и uncertainty reduction target;
- управляет search space по времени, географиям, source types и revisit/new lanes, а не ищет неявно;
- различает semantic type сигнала и состояние решения по записи;
- отсекает шум;
- корректно удерживает пограничные случаи без ложного accepted-решения;
- объясняет, почему сигнал важен;
- структурирует результат;
- помогает понимать, за что и сколько платит рынок;
- честно показывает coverage, uncovered areas, blind spots и stopping reason;
- помогает рождать новые гипотезы для SaleCheckUp.

## Что именно проверяем
1. **Корректность отбора**  
   Manus находит кейсы, near-money боли и технологические сдвиги, а не просто новости.

2. **Корректность фильтрации**  
   Manus не заливает нас AI-шумом, релизами и vague marketing.

3. **Полезность результата**  
   Выход Manus помогает формулировать новые гипотезы для SaleCheckUp и понимать, за что и сколько платят.

4. **Стабильность структуры**  
   JSON-слой стабилен и пригоден для будущей автоматизации.

5. **Корректность многослойной классификации**  
   Manus:
   - корректно различает `signal_type`;
   - корректно выставляет `resolution_status`;
   - не смешивает semantic type и resolution state;
   - корректно оценивает `evidence_strength`.

6. **Управляемость поиска**  
   Manus:
   - явно фиксирует decision question и uncertainty to reduce;
   - явно объясняет выбор временного окна, географий и source coverage plan;
   - явно показывает covered / uncovered areas, blind spots, stopping reason и next search lane.

## Definition of Done
Этап A считается успешным, если одновременно выполняются следующие условия:

1. **Корректность понимания задачи**  
   Не менее 70% принятых материалов после ручной проверки признаются:
   - релевантными;
   - не шумными;
   - полезными для дальнейшего осмысления.

2. **Контроль шума**  
   Не более 20% принятых материалов после ручной ревизии оказываются шумом.

3. **Качество гипотез**  
   Не менее чем в 60% run'ов Manus выдает хотя бы 1 гипотезу для SaleCheckUp, которую можно оценить как понятную, релевантную и достойную дальнейшего разбора.

4. **Стабильность структуры**  
   На 3 последовательных run'ах:
   - не менее 90% обязательных полей заполнены корректно;
   - нет критических поломок схемы;
   - `case / signal / hold / reject` не смешиваются;
   - `signal_type` и `resolution_status` не смешиваются в одном поле.

5. **Корректность многослойной классификации**  
   На тестовом наборе материалов:
   - точность определения `signal_type` не ниже 80%;
   - точность определения `resolution_status` не ниже 80%;
   - пограничные случаи не превращаются автоматически в сильные accepted-cases без достаточных оснований.

6. **Search governance и completeness reporting**  
   На 3 последовательных run'ах:
   - в `run_manifest.json` явно заданы decision question, uncertainty to reduce, search space, coverage summary, stopping rule и next lane;
   - в `run_synthesis_ru.md` явно объяснены выбор времени, географий, source types, covered / uncovered areas и blind spots;
   - run не останавливается без явного stopping reason и next-run rationale.

## Критерии перехода в этап B
Переход в этап B возможен только если:
- выполнены основные критерии этапа A;
- минимум 3 последовательных run'а дали стабильный результат;
- накопленный output уже хочется не просто читать, а системно хранить, валидировать и автоматизировать.

## Формат решения по этапу A
После серии run'ов принимается одно из решений:
- **Go** — Manus доказал, что это правильная исследовательская машина;
- **Iterate** — логика перспективна, но нужны доработки;
- **No-Go** — в текущей рамке Manus не дает нужного качества.

## Следующий шаг
Использовать уже синхронизированный approved contour:
- `docs/approved/project_brief.md`
- `docs/approved/spec_governance.md`
- `docs/approved/decision_log.md`
- `docs/approved/master_instruction.md`
- `docs/approved/vscode_codex_handoff_contract.md`
- `docs/approved/output_contract.md`
- `docs/approved/test_set.md`
- `docs/approved/experiment_charter_stage_a.md`

После этого:
1. выполнить следующий research run в Manus по актуальному набору approved docs и зафиксировать stable approved paths + commit SHA в `run_manifest.json` вместе с явным search-governance layer;
2. если нужен repo/spec change, сначала зафиксировать handoff package по canonical handoff contract, а затем исполнять задачу в VS Code/Codex;
3. обновлять спецификацию только по итогам явного review loop и approved revision sync.
