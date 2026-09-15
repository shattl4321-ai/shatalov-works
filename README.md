# SHATALOV WORKS — Design V2

## 1. Что это

Альтернативная дизайн-версия личного сайта **SHATALOV WORKS** (Дмитрий Шаталов).

Позиционирование:
- «Прикладные ИИ-решения для реальных задач»
- «Проектирую. Собираю. Запускаю.»
- «Одна задача. Одна ответственность. Один результат.»

Стек: HTML / CSS / vanilla JS. Без frontend-фреймворков.

## 2. Статус

| | |
|---|---|
| Ветка | `design/shatalov-works-v2` |
| Production | **не эта версия** |
| `main` | **не трогать** |
| Deploy | **не выполнялся** |

Версия визуально закончена и сохранена отдельно. Тимлид счёл её перегруженной для текущего учебного этапа — в production остаётся прежний вариант. Эту ветку можно вернуть после обучения.

## 3. Основная идея дизайна

- Инженерная мастерская, не SaaS-шаблон
- Paper / desk / editorial-атмосфера
- Спокойная взрослая B2B-подача
- Реальные проекты как результат работы, не абстрактные кейсы

## 4. HERO

### Desktop

- Утверждённая композиция по approved PNG
- Layered entry: **«Мастерская собирается»**
- После entry — цельный approved PNG (seamless handoff)
- Spatial-focus / cursor-depth **удалены** (артефакты швов)
- SVG-network / «змейки» **не используются**
- `prefers-reduced-motion` → сразу static PNG

Главный asset:

`assets/design-reference/hero-v2-desktop-1920x1080.png`

### Mobile

Отдельный approved PNG-stack (без desktop assembly motion):

- `assets/design-reference/mobile-hero-screen-clean.png`
- `assets/design-reference/mobile-process-results-clean.png`

## 5. Нижняя часть сайта

Светлые секции: **Работы** → **Чем занимаюсь** → **О мастерской** → **Принципы**.

- Один full-bleed wrapper `.site-lower`
- Единый atmospheric background (не tile, не «листы» по секциям)
- Секции прозрачные поверх общего environment
- **Contact / footer** остаются тёмными

Asset:

`assets/backgrounds/shatalov-works-lower-bg-01.png`

## 6. Реальные проекты

- [GreenScan / «Зелёный сканер»](https://green-scan.ru)
- [ServiceAct / «Акт обслуживания»](https://serviceact.ru)
- [«Корзина рядом»](https://korzinaryadom.ru)

## 7. Основные файлы

| Файл / папка | Назначение |
|---|---|
| `index.html` | Разметка сайта |
| `styles.css` | Основные стили + нижний atmospheric background |
| `hero-trace.css` | Desktop/mobile HERO (canvas, entry, hotspots) |
| `script.js` | Entry assembly, reduced-motion, mobile nav, reveal |
| `assets/design-reference/` | Approved HERO PNG (desktop + mobile) |
| `assets/backgrounds/` | Фон светлой нижней части |

## 8. Локальный запуск

```bash
python -m http.server 8765
```

Открыть: [http://127.0.0.1:8765/](http://127.0.0.1:8765/)

## 9. Git workflow

Правило:

**хорошая версия → commit → эксперимент**

Если эксперимент неудачный → rollback к checkpoint.

- Не использовать бездумно `git add .`
- Перед commit: `git status --short`
- Не трогать `main` / production без явного решения

## 10. Важные решения / история

- Desktop HERO утверждён
- Mobile HERO утверждён
- SVG-network / линии — неудачное направление, удалены
- Spatial-focus / cursor depth — неудачен, удалён
- Entry «Мастерская собирается» сохранена
- Flash на handoff layered → static PNG исправлен
- Atmospheric background нижних секций утверждён
- Ветка **сознательно не merge’ится в `main`**

## 11. Возврат к проекту позже

1. `git checkout design/shatalov-works-v2`
2. `git pull`
3. `python -m http.server 8765`
4. Открыть `http://127.0.0.1:8765/`
5. Сначала посмотреть текущий вид — потом уже менять дизайн
