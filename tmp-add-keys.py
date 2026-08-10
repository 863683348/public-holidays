import json, glob, collections, os

COUNTRY_ADD = {
    "en": {"faqWhenNextAnswer": "The next public holiday in {country} is {holiday} on {date}."},
    "zh": {"faqWhenNextAnswer": "{country}的下一个公共假期是{date}的{holiday}。"},
    "de": {"faqWhenNextAnswer": "Der nächste Feiertag in {country} ist {holiday} am {date}."},
    "fr": {"faqWhenNextAnswer": "Le prochain jour férié en {country} est {holiday} le {date}."},
    "es": {"faqWhenNextAnswer": "El próximo día festivo en {country} es {holiday} el {date}."},
    "it": {"faqWhenNextAnswer": "La prossima festività pubblica in {country} è {holiday} il {date}."},
    "ja": {"faqWhenNextAnswer": "{country}の次の祝日は{date}の{holiday}です。"},
    "ko": {"faqWhenNextAnswer": "{country}의 다음 공휴일은 {date} {holiday}입니다."},
    "pt": {"faqWhenNextAnswer": "O próximo feriado público em {country} é {holiday} em {date}."},
    "ru": {"faqWhenNextAnswer": "Следующий государственный праздник в стране {country} — {holiday} {date}."},
    "ar": {"faqWhenNextAnswer": "العطلة الرسمية القادمة في {country} هي {holiday} في {date}."},
}

HD_ADD = {
    "en": {
        "adjacentHeading": "This holiday in other years",
        "datesWeekdayHeading": "Weekday",
        "faqNextOccurrence": "When is the next {name} in {country}?",
        "faqNextOccurrenceAnswer": "The next {name} in {country} is on {date}.",
        "faqNextOccurrenceNone": "The next {name} in {country} has not been announced yet.",
        "nextYearLink": "{name} in {year}",
        "prevYearLink": "{name} in {year}",
        "regionsHeading": "Regions where observed",
    },
    "zh": {
        "adjacentHeading": "其他年份的同一节日",
        "datesWeekdayHeading": "星期",
        "faqNextOccurrence": "{country}的下一个{name}是什么时候？",
        "faqNextOccurrenceAnswer": "{country}的下一个{name}是{date}。",
        "faqNextOccurrenceNone": "{country}的下一个{name}尚未公布。",
        "nextYearLink": "{year}年的{name}",
        "prevYearLink": "{year}年的{name}",
        "regionsHeading": "庆祝地区",
    },
    "de": {
        "adjacentHeading": "Dieser Feiertag in anderen Jahren",
        "datesWeekdayHeading": "Wochentag",
        "faqNextOccurrence": "Wann ist der nächste {name} in {country}?",
        "faqNextOccurrenceAnswer": "Der nächste {name} in {country} ist am {date}.",
        "faqNextOccurrenceNone": "Der nächste {name} in {country} wurde noch nicht bekannt gegeben.",
        "nextYearLink": "{name} im Jahr {year}",
        "prevYearLink": "{name} im Jahr {year}",
        "regionsHeading": "Regionen, in denen gefeiert wird",
    },
    "fr": {
        "adjacentHeading": "Ce jour férié les autres années",
        "datesWeekdayHeading": "Jour de la semaine",
        "faqNextOccurrence": "Quand est le prochain {name} en {country} ?",
        "faqNextOccurrenceAnswer": "Le prochain {name} en {country} a lieu le {date}.",
        "faqNextOccurrenceNone": "Le prochain {name} en {country} n'a pas encore été annoncé.",
        "nextYearLink": "{name} en {year}",
        "prevYearLink": "{name} en {year}",
        "regionsHeading": "Régions concernées",
    },
    "es": {
        "adjacentHeading": "Este festivo en otros años",
        "datesWeekdayHeading": "Día de la semana",
        "faqNextOccurrence": "¿Cuándo es el próximo {name} en {country}?",
        "faqNextOccurrenceAnswer": "El próximo {name} en {country} es el {date}.",
        "faqNextOccurrenceNone": "El próximo {name} en {country} aún no se ha anunciado.",
        "nextYearLink": "{name} en {year}",
        "prevYearLink": "{name} en {year}",
        "regionsHeading": "Regiones donde se celebra",
    },
    "it": {
        "adjacentHeading": "Questa festività negli altri anni",
        "datesWeekdayHeading": "Giorno della settimana",
        "faqNextOccurrence": "Quando è il prossimo {name} in {country}?",
        "faqNextOccurrenceAnswer": "Il prossimo {name} in {country} è il {date}.",
        "faqNextOccurrenceNone": "Il prossimo {name} in {country} non è ancora stato annunciato.",
        "nextYearLink": "{name} nel {year}",
        "prevYearLink": "{name} nel {year}",
        "regionsHeading": "Regioni in cui è osservato",
    },
    "ja": {
        "adjacentHeading": "他の年のこの祝日",
        "datesWeekdayHeading": "曜日",
        "faqNextOccurrence": "{country}の次の{name}はいつですか？",
        "faqNextOccurrenceAnswer": "{country}の次の{name}は{date}です。",
        "faqNextOccurrenceNone": "{country}の次の{name}はまだ発表されていません。",
        "nextYearLink": "{year}年の{name}",
        "prevYearLink": "{year}年の{name}",
        "regionsHeading": "祝われる地域",
    },
    "ko": {
        "adjacentHeading": "다른 연도의 이 공휴일",
        "datesWeekdayHeading": "요일",
        "faqNextOccurrence": "{country}의 다음 {name}은(는) 언제인가요?",
        "faqNextOccurrenceAnswer": "{country}의 다음 {name}은(는) {date}입니다.",
        "faqNextOccurrenceNone": "{country}의 다음 {name}은(는) 아직 발표되지 않았습니다.",
        "nextYearLink": "{year}년의 {name}",
        "prevYearLink": "{year}년의 {name}",
        "regionsHeading": "기념되는 지역",
    },
    "pt": {
        "adjacentHeading": "Este feriado em outros anos",
        "datesWeekdayHeading": "Dia da semana",
        "faqNextOccurrence": "Quando é o próximo {name} em {country}?",
        "faqNextOccurrenceAnswer": "O próximo {name} em {country} é em {date}.",
        "faqNextOccurrenceNone": "O próximo {name} em {country} ainda não foi anunciado.",
        "nextYearLink": "{name} em {year}",
        "prevYearLink": "{name} em {year}",
        "regionsHeading": "Regiões onde é observado",
    },
    "ru": {
        "adjacentHeading": "Этот праздник в другие годы",
        "datesWeekdayHeading": "День недели",
        "faqNextOccurrence": "Когда следующий {name} в стране {country}?",
        "faqNextOccurrenceAnswer": "Следующий {name} в стране {country} — {date}.",
        "faqNextOccurrenceNone": "Следующий {name} в стране {country} ещё не объявлен.",
        "nextYearLink": "{name} в {year} году",
        "prevYearLink": "{name} в {year} году",
        "regionsHeading": "Регионы, где отмечается",
    },
    "ar": {
        "adjacentHeading": "هذه العطلة في السنوات الأخرى",
        "datesWeekdayHeading": "يوم الأسبوع",
        "faqNextOccurrence": "متى يكون {name} القادم في {country}؟",
        "faqNextOccurrenceAnswer": "يكون {name} القادم في {country} في {date}.",
        "faqNextOccurrenceNone": "لم يُعلن بعد عن {name} القادم في {country}.",
        "nextYearLink": "{name} في {year}",
        "prevYearLink": "{name} في {year}",
        "regionsHeading": "المناطق التي يُحتفل بها",
    },
}

ordered_hd_keys = ["adjacentHeading", "datesWeekdayHeading", "faqNextOccurrence",
                   "faqNextOccurrenceAnswer", "faqNextOccurrenceNone",
                   "nextYearLink", "prevYearLink", "regionsHeading"]

for fp in sorted(glob.glob("src/i18n/messages/*.json")):
    loc = os.path.basename(fp).replace(".json", "")
    with open(fp, encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=collections.OrderedDict)

    hd = data.get("holidayDetail", {})
    country = data.get("country", {})

    if "faqWhenNext" in hd:
        country["faqWhenNext"] = hd.pop("faqWhenNext")

    for k, v in COUNTRY_ADD[loc].items():
        country[k] = v

    for k in ordered_hd_keys:
        hd[k] = HD_ADD[loc][k]

    with open(fp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"{loc}: hd.faqWhenNext={'faqWhenNext' in hd} | c.faqWhenNext={'faqWhenNext' in country} | c.faqWhenNextAnswer={'faqWhenNextAnswer' in country} | hd new={sum(1 for k in ordered_hd_keys if k in hd)}/8")
