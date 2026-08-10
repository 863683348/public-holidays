# P0: homepage today/compare entry + footer links — add 6 message keys per locale.
# Line-level insertion keeps the diff minimal: only the new keys touch each file.
import io
import json
import os

MESSAGES = os.path.join(os.path.dirname(__file__), "..", "src", "i18n", "messages")

DATA = {
    "en": {
        "todayCount": "{count, plural, one {# country on holiday today} other {# countries on holiday today}}",
        "todayCountLink": "View all →",
        "compareCardTitle": "Compare holidays across countries",
        "compareCardDesc": "See 2–6 countries side by side and spot shared days off.",
        "footerCompare": "Compare countries",
        "footerToday": "Today's holidays",
    },
    "zh": {
        "todayCount": "{count, plural, other {今天有 # 个国家放假}}",
        "todayCountLink": "查看全部 →",
        "compareCardTitle": "跨国家对比假期",
        "compareCardDesc": "并排查看 2–6 个国家的假期，找出共同的休息日。",
        "footerCompare": "国家对比",
        "footerToday": "今日假期",
    },
    "ja": {
        "todayCount": "{count, plural, other {今日は # か国が祝日です}}",
        "todayCountLink": "すべて見る →",
        "compareCardTitle": "国別に祝日を比較",
        "compareCardDesc": "2〜6か国を並べて表示し、共通の休日を見つけます。",
        "footerCompare": "国別比較",
        "footerToday": "今日の祝日",
    },
    "ko": {
        "todayCount": "{count, plural, other {오늘 공휴일인 국가 #곳}}",
        "todayCountLink": "전체 보기 →",
        "compareCardTitle": "국가별 공휴일 비교",
        "compareCardDesc": "2~6개 국가를 나란히 비교하고 공통 휴일을 찾아보세요.",
        "footerCompare": "국가 비교",
        "footerToday": "오늘의 공휴일",
    },
    "es": {
        "todayCount": "{count, plural, one {# país de fiesta hoy} other {# países de fiesta hoy}}",
        "todayCountLink": "Ver todos →",
        "compareCardTitle": "Compara festivos entre países",
        "compareCardDesc": "Compara 2–6 países lado a lado y encuentra los días festivos compartidos.",
        "footerCompare": "Comparar países",
        "footerToday": "Fiestas de hoy",
    },
    "de": {
        "todayCount": "{count, plural, one {# Land mit Feiertag heute} other {# Länder mit Feiertag heute}}",
        "todayCountLink": "Alle anzeigen →",
        "compareCardTitle": "Feiertage zwischen Ländern vergleichen",
        "compareCardDesc": "Vergleichen Sie 2–6 Länder nebeneinander und entdecken Sie gemeinsame freie Tage.",
        "footerCompare": "Länder vergleichen",
        "footerToday": "Feiertage heute",
    },
    "fr": {
        "todayCount": "{count, plural, one {# pays en fête aujourd'hui} other {# pays en fête aujourd'hui}}",
        "todayCountLink": "Tout voir →",
        "compareCardTitle": "Comparez les jours fériés entre pays",
        "compareCardDesc": "Affichez 2 à 6 pays côte à côte et repérez les jours fériés partagés.",
        "footerCompare": "Comparer les pays",
        "footerToday": "Fêtes d'aujourd'hui",
    },
    "pt": {
        "todayCount": "{count, plural, one {# país em feriado hoje} other {# países em feriado hoje}}",
        "todayCountLink": "Ver todos →",
        "compareCardTitle": "Compare feriados entre países",
        "compareCardDesc": "Veja 2–6 países lado a lado e encontre dias de folga em comum.",
        "footerCompare": "Comparar países",
        "footerToday": "Feriados de hoje",
    },
    "it": {
        "todayCount": "{count, plural, one {# paese in festa oggi} other {# paesi in festa oggi}}",
        "todayCountLink": "Vedi tutti →",
        "compareCardTitle": "Confronta le festività tra paesi",
        "compareCardDesc": "Confronta 2–6 paesi fianco a fianco e individua i giorni di festa condivisi.",
        "footerCompare": "Confronta paesi",
        "footerToday": "Festività di oggi",
    },
    "ru": {
        "todayCount": "{count, plural, other {Стран на выходном сегодня: #}}",
        "todayCountLink": "Смотреть все →",
        "compareCardTitle": "Сравните праздники между странами",
        "compareCardDesc": "Сравните 2–6 стран бок о бок и найдите общие выходные дни.",
        "footerCompare": "Сравнить страны",
        "footerToday": "Праздники сегодня",
    },
    "ar": {
        "todayCount": "{count, plural, other {عدد الدول التي لديها عطلة اليوم: #}}",
        "todayCountLink": "عرض الكل ←",
        "compareCardTitle": "قارن العطلات بين الدول",
        "compareCardDesc": "اعرض 2-6 دول جنبًا إلى جنب واكتشف أيام العطل المشتركة.",
        "footerCompare": "قارن الدول",
        "footerToday": "أعياد اليوم",
    },
}

for lang, vals in DATA.items():
    path = os.path.join(MESSAGES, f"{lang}.json")
    with io.open(path, encoding="utf-8") as f:
        lines = f.readlines()

    out = []
    hit_today = hit_clock = hit_privacy = False
    for line in lines:
        stripped = line.lstrip()
        # Footer: insert compare/today before the privacy link (tools first).
        if stripped.startswith('"privacy":'):
            hit_privacy = True
            out.append(f'    "compare": "{vals["footerCompare"]}",\n')
            out.append(f'    "today": "{vals["footerToday"]}",\n')
            out.append(line)
            continue
        out.append(line)
        # Home: insert the today-count bar keys after todayNone.
        if stripped.startswith('"todayNone":'):
            hit_today = True
            out.append(f'    "todayCount": "{vals["todayCount"]}",\n')
            out.append(f'    "todayCountLink": "{vals["todayCountLink"]}",\n')
        # Home: insert the compare-card keys after worldClockCardDesc.
        elif stripped.startswith('"worldClockCardDesc":'):
            hit_clock = True
            out.append(f'    "compareCardTitle": "{vals["compareCardTitle"]}",\n')
            out.append(f'    "compareCardDesc": "{vals["compareCardDesc"]}",\n')

    assert hit_today, f"{lang}: todayNone anchor not found"
    assert hit_clock, f"{lang}: worldClockCardDesc anchor not found"
    assert hit_privacy, f"{lang}: privacy anchor not found"

    with io.open(path, "w", encoding="utf-8", newline="\n") as f:
        f.writelines(out)

    with io.open(path, encoding="utf-8") as f:
        json.load(f)
    print(f"{lang}: OK")
