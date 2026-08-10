#!/usr/bin/env python3
"""Insert the `today` i18n namespace into all 11 message files.

Surgical string insertion (before the root closing brace) so the rest of each
file stays byte-for-byte identical. Validates JSON before and after.
"""
import json
import glob
import sys

BASE = "C:/Users/l'x/WorkBuddy/2026-08-04-13-14-21/public-holidays/src/i18n/messages"

TODAY = {
  "en": {
    "metaTitle": "Which countries have a public holiday today?",
    "metaDescription": "See every country on a public holiday today, plus a live world clock. Dates are shown in UTC, so you always know who is off — anywhere.",
    "eyebrow": "Today's public holidays",
    "heroTitle": "Who is off work today?",
    "heroCount": "{count, plural, one {# country is on holiday today} other {# countries are on holiday today}}",
    "asOf": "As of {date} (UTC)",
    "utcNote": "Dates are shown in UTC. In Asia-Pacific the local date may already be tomorrow — this page does not guess your timezone.",
    "clockTitle": "World clock",
    "emptyStateTitle": "No country is on holiday today",
    "emptyState": "An unusually quiet day worldwide — no tracked country has a public holiday today.",
    "emptyCta": "Compare countries instead",
    "upstreamUnavailable": "Holiday data is temporarily unavailable. Please try again shortly."
  },
  "zh": {
    "metaTitle": "今天哪些国家在放假？",
    "metaDescription": "查看今天所有放假的公共假期国家，并附实时世界时钟。日期以 UTC 显示，让你随时掌握世界各地是否休假。",
    "eyebrow": "今日公共假期",
    "heroTitle": "今天哪些国家放假？",
    "heroCount": "{count, plural, other {今天有 # 个国家放假}}",
    "asOf": "数据截至 {date}（UTC）",
    "utcNote": "日期均以 UTC 显示。在亚太地区，当地日期可能已是明天——本页不会猜测你的时区。",
    "clockTitle": "世界时钟",
    "emptyStateTitle": "今天没有国家放假",
    "emptyState": "全球难得的安静一天——今天没有任何受追踪国家有公共假期。",
    "emptyCta": "改用多国对比",
    "upstreamUnavailable": "假期数据暂时不可用，请稍后再试。"
  },
  "ja": {
    "metaTitle": "今日、祝日の国はどこ？",
    "metaDescription": "今日祝日の国をすべて確認できます。世界時計付き。日付は UTC で表示され、世界中のどこが休みかがひと目でわかります。",
    "eyebrow": "今日の祝日",
    "heroTitle": "今日、休みの国はどこ？",
    "heroCount": "{count, plural, other {今日は # か国が祝日です}}",
    "asOf": "{date}（UTC）時点",
    "utcNote": "日付は UTC で表示しています。アジア太平洋地域では、現地の日付がすでに翌日になっている場合があります。",
    "clockTitle": "世界時計",
    "emptyStateTitle": "今日、祝日の国はありません",
    "emptyState": "世界的に珍しく静かな一日です。今日、祝日のある国はありません。",
    "emptyCta": "代わりに国の比較を見る",
    "upstreamUnavailable": "祝日データが一時的に利用できません。しばらくしてからもう一度お試しください。"
  },
  "ko": {
    "metaTitle": "오늘 공휴일인 나라는?",
    "metaDescription": "오늘 공휴일인 모든 국가와 실시간 세계시계를 확인하세요. 날짜는 UTC 기준으로 표시되어 어디가 쉬는지 한눈에 알 수 있습니다.",
    "eyebrow": "오늘의 공휴일",
    "heroTitle": "오늘 쉬는 나라는?",
    "heroCount": "{count, plural, other {오늘 공휴일인 국가 #곳}}",
    "asOf": "{date} (UTC) 기준",
    "utcNote": "날짜는 UTC 기준으로 표시됩니다. 아시아·태평양 지역에서는 현지 날짜가 이미 내일일 수 있습니다.",
    "clockTitle": "세계시계",
    "emptyStateTitle": "오늘 공휴일인 나라가 없습니다",
    "emptyState": "전 세계적으로 드물게 조용한 날입니다. 오늘 공휴일인 국가가 없습니다.",
    "emptyCta": "대신 국가 비교하기",
    "upstreamUnavailable": "공휴일 데이터를 일시적으로 불러올 수 없습니다. 잠시 후 다시 시도해 주세요."
  },
  "es": {
    "metaTitle": "¿Qué países tienen un día festivo hoy?",
    "metaDescription": "Consulta todos los países con día festivo hoy, más un reloj mundial en directo. Las fechas se muestran en UTC, para saber siempre quién descansa.",
    "eyebrow": "Días festivos de hoy",
    "heroTitle": "¿Quién descansa hoy?",
    "heroCount": "{count, plural, one {# país está de fiesta hoy} other {# países están de fiesta hoy}}",
    "asOf": "Datos al {date} (UTC)",
    "utcNote": "Las fechas se muestran en UTC. En Asia-Pacífico, la fecha local puede ser ya mañana: esta página no adivina tu zona horaria.",
    "clockTitle": "Reloj mundial",
    "emptyStateTitle": "Ningún país está de fiesta hoy",
    "emptyState": "Un día inusualmente tranquilo en todo el mundo: ningún país tiene un día festivo hoy.",
    "emptyCta": "Comparar países en su lugar",
    "upstreamUnavailable": "Los datos de festivos no están disponibles temporalmente. Inténtalo de nuevo en unos momentos."
  },
  "de": {
    "metaTitle": "Welche Länder haben heute einen Feiertag?",
    "metaDescription": "Alle Länder mit Feiertag heute auf einen Blick, plus Weltzeituhr. Die Daten werden in UTC angezeigt – so weißt du immer, wer frei hat.",
    "eyebrow": "Feiertage heute",
    "heroTitle": "Wer hat heute frei?",
    "heroCount": "{count, plural, one {# Land hat heute einen Feiertag} other {# Länder haben heute einen Feiertag}}",
    "asOf": "Stand {date} (UTC)",
    "utcNote": "Die Daten werden in UTC angezeigt. In Asien-Pazifik kann das lokale Datum bereits morgen sein – diese Seite rät deine Zeitzone nicht.",
    "clockTitle": "Weltzeituhr",
    "emptyStateTitle": "Heute hat kein Land Feiertag",
    "emptyState": "Ein ungewöhnlich ruhiger Tag weltweit – heute hat kein erfasstes Land einen Feiertag.",
    "emptyCta": "Stattdessen Länder vergleichen",
    "upstreamUnavailable": "Die Feiertagsdaten sind derzeit nicht verfügbar. Bitte versuche es gleich noch einmal."
  },
  "fr": {
    "metaTitle": "Quels pays sont en jour férié aujourd'hui ?",
    "metaDescription": "Voyez tous les pays en jour férié aujourd'hui, plus une horloge mondiale en direct. Les dates sont affichées en UTC, pour savoir qui est en congé où que ce soit.",
    "eyebrow": "Jours fériés du jour",
    "heroTitle": "Qui est en congé aujourd'hui ?",
    "heroCount": "{count, plural, one {# pays est en jour férié aujourd'hui} other {# pays sont en jour férié aujourd'hui}}",
    "asOf": "En date du {date} (UTC)",
    "utcNote": "Les dates sont affichées en UTC. En Asie-Pacifique, la date locale peut déjà être demain : cette page ne devine pas votre fuseau horaire.",
    "clockTitle": "Horloge mondiale",
    "emptyStateTitle": "Aucun pays n'est en jour férié aujourd'hui",
    "emptyState": "Une journée exceptionnellement calme dans le monde : aucun pays suivi n'a de jour férié aujourd'hui.",
    "emptyCta": "Comparer des pays à la place",
    "upstreamUnavailable": "Les données des jours fériés sont temporairement indisponibles. Veuillez réessayer dans un instant."
  },
  "pt": {
    "metaTitle": "Quais países estão em feriado hoje?",
    "metaDescription": "Veja todos os países em feriado hoje, além de um relógio mundial ao vivo. As datas são exibidas em UTC, para você saber sempre quem está de folga.",
    "eyebrow": "Feriados de hoje",
    "heroTitle": "Quem está de folga hoje?",
    "heroCount": "{count, plural, one {# país está em feriado hoje} other {# países estão em feriado hoje}}",
    "asOf": "Dados de {date} (UTC)",
    "utcNote": "As datas são exibidas em UTC. Na Ásia-Pacífico, a data local pode já ser amanhã — esta página não adivinha o seu fuso horário.",
    "clockTitle": "Relógio mundial",
    "emptyStateTitle": "Nenhum país está em feriado hoje",
    "emptyState": "Um dia incomumente tranquilo no mundo — nenhum país monitorado tem feriado hoje.",
    "emptyCta": "Comparar países em vez disso",
    "upstreamUnavailable": "Os dados de feriados estão temporariamente indisponíveis. Tente novamente em instantes."
  },
  "it": {
    "metaTitle": "Quali paesi sono in festa oggi?",
    "metaDescription": "Scopri tutti i paesi in festa oggi, più un orologio mondiale in tempo reale. Le date sono mostrate in UTC, per sapere sempre chi è in ferie.",
    "eyebrow": "Festività di oggi",
    "heroTitle": "Chi è in ferie oggi?",
    "heroCount": "{count, plural, one {# paese è in festa oggi} other {# paesi sono in festa oggi}}",
    "asOf": "Dati al {date} (UTC)",
    "utcNote": "Le date sono mostrate in UTC. In Asia-Pacifico la data locale potrebbe essere già domani: questa pagina non indovina il tuo fuso orario.",
    "clockTitle": "Orologio mondiale",
    "emptyStateTitle": "Nessun paese è in festa oggi",
    "emptyState": "Una giornata insolitamente tranquilla nel mondo: nessun paese monitorato ha una festività oggi.",
    "emptyCta": "Confronta i paesi invece",
    "upstreamUnavailable": "I dati sulle festività non sono temporaneamente disponibili. Riprova tra poco."
  },
  "ru": {
    "metaTitle": "В каких странах сегодня выходной?",
    "metaDescription": "Все страны, где сегодня выходной, плюс мировые часы в реальном времени. Даты показаны в UTC — вы всегда знаете, кто отдыхает.",
    "eyebrow": "Праздники сегодня",
    "heroTitle": "Кто сегодня отдыхает?",
    "heroCount": "{count, plural, other {Стран на выходном сегодня: #}}",
    "asOf": "По состоянию на {date} (UTC)",
    "utcNote": "Даты показаны в UTC. В Азиатско-Тихоокеанском регионе местная дата может быть уже завтрашней — эта страница не угадывает ваш часовой пояс.",
    "clockTitle": "Мировые часы",
    "emptyStateTitle": "Сегодня ни в одной стране нет выходного",
    "emptyState": "Необычно тихий день во всём мире: ни в одной отслеживаемой стране сегодня нет праздника.",
    "emptyCta": "Вместо этого сравнить страны",
    "upstreamUnavailable": "Данные о праздниках временно недоступны. Пожалуйста, попробуйте ещё раз чуть позже."
  },
  "ar": {
    "metaTitle": "ما الدول التي لديها عطلة رسمية اليوم؟",
    "metaDescription": "اطّلع على جميع الدول التي لديها عطلة رسمية اليوم، مع ساعة عالمية مباشرة. تُعرض التواريخ بتوقيت UTC لتعرف دائمًا من في إجازة.",
    "eyebrow": "العطلات الرسمية اليوم",
    "heroTitle": "من في إجازة اليوم؟",
    "heroCount": "{count, plural, other {عدد الدول التي لديها عطلة اليوم: #}}",
    "asOf": "اعتبارًا من {date} (UTC)",
    "utcNote": "تُعرض التواريخ بتوقيت UTC. في منطقة آسيا والمحيط الهادئ، قد يكون التاريخ المحلي هو الغد بالفعل — لا تخمّن هذه الصفحة منطقتك الزمنية.",
    "clockTitle": "الساعة العالمية",
    "emptyStateTitle": "لا توجد دولة في عطلة اليوم",
    "emptyState": "يوم هادئ بشكل غير معتاد حول العالم — لا توجد أي دولة مُتتبَّعة لديها عطلة رسمية اليوم.",
    "emptyCta": "قارن الدول بدلاً من ذلك",
    "upstreamUnavailable": "بيانات العطلات غير متاحة مؤقتًا. يرجى المحاولة مرة أخرى بعد قليل."
  },
}

EXPECTED_KEYS = [
    "metaTitle", "metaDescription", "eyebrow", "heroTitle", "heroCount",
    "asOf", "utcNote", "clockTitle", "emptyStateTitle", "emptyState",
    "emptyCta", "upstreamUnavailable",
]

def main():
    errors = []
    for path in sorted(glob.glob(BASE + "/*.json")):
        lang = path.replace("\\", "/").rsplit("/", 1)[-1].split(".")[0]
        with open(path, "r", encoding="utf-8") as f:
            text = f.read()
        # Validate original
        try:
            json.loads(text)
        except json.JSONDecodeError as e:
            errors.append(f"{path}: invalid JSON before insert: {e}")
            continue

        if '"today"' in text:
            errors.append(f"{path}: today namespace already present, skipping")
            continue

        today = TODAY.get(lang)
        if today is None:
            errors.append(f"{path}: no translation for lang {lang}")
            continue

        missing = [k for k in EXPECTED_KEYS if k not in today]
        if missing:
            errors.append(f"{path}: missing keys {missing}")
            continue

        assert text.endswith("}\n"), f"{path}: unexpected ending"
        # text = "...  }\n}\n" — strip the trailing newline, the root close
        # brace, and the newline that precedes it, so we splice the new
        # namespace directly after the last key's closing brace.
        assert text.endswith("\n}\n"), f"{path}: expected root close + newline"
        prefix = text[:-3]  # "...  }" (last namespace's closing brace)

        inner = json.dumps(today, ensure_ascii=False, indent=2)
        inner_indented = inner.replace("\n", "\n  ")
        new = prefix + ',\n  "today": ' + inner_indented + "\n}\n"

        # Validate after
        try:
            parsed = json.loads(new)
        except json.JSONDecodeError as e:
            errors.append(f"{path}: invalid JSON after insert: {e}")
            continue
        assert "today" in parsed, f"{path}: today missing after insert"

        with open(path, "w", encoding="utf-8", newline="\n") as f:
            f.write(new)
        print(f"OK {path} (today namespace, {len(today)} keys)")

    if errors:
        print("\nERRORS:")
        for e in errors:
            print(" -", e)
        sys.exit(1)
    print(f"\nAll {len(glob.glob(BASE + '/*.json'))} message files updated.")

if __name__ == "__main__":
    main()
