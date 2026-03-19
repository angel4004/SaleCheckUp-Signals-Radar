# Runtime Operations

## Purpose
Этот файл фиксирует локальные операционные правила использования runtime workspace.

## Rule 1. Read runtime outputs as UTF-8
Runtime outputs в PowerShell читаются только одним из двух способов:

### Option A
`Get-Content <path> -Encoding UTF8`

### Option B
`python -X utf8 -c "print(open(r'<path>', encoding='utf-8').read())"`

## Rule 2. Do not trust plain Get-Content for runtime outputs
Не использовать для runtime artifacts чтение без явного указания кодировки:

`Get-Content <path>`

Без `-Encoding UTF8` PowerShell может показать кракозябры даже если файл записан корректно.

## Rule 3. Use UTF-8 in the current shell
Если нужно разово нормализовать текущую PowerShell-сессию, использовать:

`chcp 65001 > $null`

`[Console]::InputEncoding  = [System.Text.UTF8Encoding]::new()`

`[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()`

`$OutputEncoding = [System.Text.UTF8Encoding]::new()`

`$env:PYTHONIOENCODING = "utf-8"`

## Rule 4. Prefer Python viewer for JSON/JSONL inspection
Для JSON и JSONL предпочтителен Python viewer, потому что он надёжнее показывает UTF-8 и удобнее форматирует содержимое.

### Example for JSON
`python -X utf8 -c "import json; print(json.dumps(json.load(open(r'.\path\file.json', encoding='utf-8')), ensure_ascii=False, indent=2))"`

### Example for JSONL
`python -X utf8 -c "print(open(r'.\path\file.jsonl', encoding='utf-8').read())"`

## Rule 5. This is an ops rule, not a model rule
Проблема с кракозябрами относится к локальному чтению файлов в PowerShell.
Она не считается проблемой:
- чата
- Project mode
- модели
- OpenRouter contour