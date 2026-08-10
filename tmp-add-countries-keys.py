import json, glob, os, collections

# New "countries" namespace keys per locale + home.viewAllCountries.
# Locales without a confident native copy fall back to English values; the
# script prints which locales used the English fallback for each key.
COUNTRIES_NS = {
    "en": {
        "metaTitle": "Public Holidays by Country — Complete A–Z List",
        "metaDescription": "Browse official public holidays by country. A–Z directory of {count} countries with holiday dates, long weekends and free calendar downloads.",
        "heading": "All countries",
        "intro": "Public holidays for {count} countries around the world, from A to Z. Pick a country to see its full holiday calendar.",
        "searchPlaceholder": "Search a country...",
        "noResults": "No countries found.",
        "popularGroup": "Popular",
        "otherGroup": "#",
        "indexLabel": "Jump to letter",
    },
    "zh": {
        "metaTitle": "各国公共假期大全 — A–Z 国家列表",
        "metaDescription": "按国家查看公共假期：收录 {count} 个国家的官方假期日期、长周末与免费日历，按字母 A–Z 浏览。",
        "heading": "全部国家",
        "intro": "收录全球 {count} 个国家的公共假期，按字母 A–Z 排列。选择国家查看完整假期日历。",
        "searchPlaceholder": "搜索国家…",
        "noResults": "未找到匹配的国家。",
        "popularGroup": "热门",
        "otherGroup": "#",
        "indexLabel": "跳转到字母",
    },
    "ja": {
        "metaTitle": "国別の祝日一覧 — 全{count}か国 A–Z",
        "metaDescription": "{count}か国の祝日を A–Z で検索。公式の祝日日程、連休、無料カレンダーを確認できます。",
        "heading": "すべての国",
        "intro": "世界の{count}か国の祝日を A–Z 順に掲載。国を選んで祝日カレンダーを確認できます。",
        "searchPlaceholder": "国を検索…",
        "noResults": "該当する国が見つかりません。",
        "popularGroup": "人気",
        "otherGroup": "#",
        "indexLabel": "文字へ移動",
    },
    "ko": {
        "metaTitle": "국가별 공휴일 — 전 {count}개국 A–Z",
        "metaDescription": "{count}개국의 공휴일을 A–Z로 둘러보세요. 공식 공휴일 날짜, 연휴, 무료 달력을 확인할 수 있습니다.",
        "heading": "전체 국가",
        "intro": "전 세계 {count}개국의 공휴일을 A–Z 순서로 제공합니다. 국가를 선택해 공휴일 달력을 확인하세요.",
        "searchPlaceholder": "국가 검색…",
        "noResults": "일치하는 국가가 없습니다.",
        "popularGroup": "인기",
        "otherGroup": "#",
        "indexLabel": "문자로 이동",
    },
    "es": {
        "metaTitle": "Festivos por país — directorio A–Z de {count} países",
        "metaDescription": "Consulta los días festivos por país. Directorio A–Z de {count} países con fechas oficiales, puentes y calendarios gratuitos.",
        "heading": "Todos los países",
        "intro": "Días festivos de {count} países del mundo, de la A a la Z. Elige un país para ver su calendario completo.",
        "searchPlaceholder": "Buscar un país...",
        "noResults": "No se encontraron países.",
        "popularGroup": "Populares",
        "otherGroup": "#",
        "indexLabel": "Ir a la letra",
    },
    "de": {
        "metaTitle": "Feiertage nach Ländern — A–Z Verzeichnis von {count} Ländern",
        "metaDescription": "Feiertage nach Land: A–Z Verzeichnis von {count} Ländern mit offiziellen Daten, Brückentagen und kostenlosen Kalendern.",
        "heading": "Alle Länder",
        "intro": "Feiertage für {count} Länder weltweit, von A bis Z. Wähle ein Land für den vollständigen Feiertagskalender.",
        "searchPlaceholder": "Land suchen...",
        "noResults": "Keine Länder gefunden.",
        "popularGroup": "Beliebt",
        "otherGroup": "#",
        "indexLabel": "Zum Buchstaben",
    },
    "fr": {
        "metaTitle": "Jours fériés par pays — répertoire A–Z de {count} pays",
        "metaDescription": "Consultez les jours fériés par pays. Répertoire A–Z de {count} pays avec dates officielles, ponts et calendriers gratuits.",
        "heading": "Tous les pays",
        "intro": "Jours fériés de {count} pays dans le monde, de A à Z. Choisissez un pays pour voir son calendrier complet.",
        "searchPlaceholder": "Rechercher un pays...",
        "noResults": "Aucun pays trouvé.",
        "popularGroup": "Populaires",
        "otherGroup": "#",
        "indexLabel": "Aller à la lettre",
    },
    "pt": {
        "metaTitle": "Feriados por país — diretório A–Z de {count} países",
        "metaDescription": "Veja os feriados por país. Diretório A–Z de {count} países com datas oficiais, pontes e calendários gratuitos.",
        "heading": "Todos os países",
        "intro": "Feriados de {count} países do mundo, de A a Z. Escolha um país para ver o calendário completo.",
        "searchPlaceholder": "Pesquisar um país...",
        "noResults": "Nenhum país encontrado.",
        "popularGroup": "Populares",
        "otherGroup": "#",
        "indexLabel": "Ir para a letra",
    },
    "it": {
        "metaTitle": "Festività per paese — elenco A–Z di {count} paesi",
        "metaDescription": "Consulta le festività per paese. Elenco A–Z di {count} paesi con date ufficiali, ponti e calendari gratuiti.",
        "heading": "Tutti i paesi",
        "intro": "Festività di {count} paesi nel mondo, dalla A alla Z. Scegli un paese per vedere il calendario completo.",
        "searchPlaceholder": "Cerca un paese...",
        "noResults": "Nessun paese trovato.",
        "popularGroup": "Popolari",
        "otherGroup": "#",
        "indexLabel": "Vai alla lettera",
    },
    "ru": {
        "metaTitle": "Праздники по странам — справочник A–Z, {count} стран",
        "metaDescription": "Праздники по странам: справочник A–Z из {count} стран с официальными датами, длинными выходными и бесплатными календарями.",
        "heading": "Все страны",
        "intro": "Праздники {count} стран мира от A до Z. Выберите страну, чтобы увидеть полный календарь.",
        "searchPlaceholder": "Поиск страны...",
        "noResults": "Страны не найдены.",
        "popularGroup": "Популярные",
        "otherGroup": "#",
        "indexLabel": "Перейти к букве",
    },
    "ar": {
        "metaTitle": "العطلات الرسمية حسب الدولة — دليل A–Z لـ {count} دولة",
        "metaDescription": "تصفح العطلات الرسمية حسب الدولة. دليل A–Z لـ {count} دولة مع التواريخ الرسمية وعطلات نهاية الأسبوع الطويلة وتقاويم مجانية.",
        "heading": "جميع الدول",
        "intro": "العطلات الرسمية لـ {count} دولة حول العالم، من A إلى Z. اختر دولة لعرض تقويم العطلات الكامل.",
        "searchPlaceholder": "ابحث عن دولة...",
        "noResults": "لم يتم العثور على دول.",
        "popularGroup": "الأكثر شعبية",
        "otherGroup": "#",
        "indexLabel": "الانتقال إلى الحرف",
    },
}

VIEW_ALL = {
    "en": "View all countries",
    "zh": "查看所有国家",
    "ja": "すべての国を見る",
    "ko": "모든 국가 보기",
    "es": "Ver todos los países",
    "de": "Alle Länder ansehen",
    "fr": "Voir tous les pays",
    "pt": "Ver todos os países",
    "it": "Vedi tutti i paesi",
    "ru": "Смотреть все страны",
    "ar": "عرض جميع الدول",
}

ORDERED_KEYS = [
    "metaTitle", "metaDescription", "heading", "intro",
    "searchPlaceholder", "noResults", "popularGroup", "otherGroup", "indexLabel",
]

EN_NS = COUNTRIES_NS["en"]
EN_VIEW = VIEW_ALL["en"]

for fp in sorted(glob.glob("src/i18n/messages/*.json")):
    loc = os.path.basename(fp).replace(".json", "")
    with open(fp, encoding="utf-8") as f:
        data = json.load(f, object_pairs_hook=collections.OrderedDict)

    data["home"]["viewAllCountries"] = VIEW_ALL.get(loc, EN_VIEW)

    ns = collections.OrderedDict()
    fallbacks = []
    for k in ORDERED_KEYS:
        val = COUNTRIES_NS.get(loc, {}).get(k)
        if val is None:
            val = EN_NS[k]
            fallbacks.append(k)
        ns[k] = val
    data["countries"] = ns

    with open(fp, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"{loc}: viewAllCountries={'viewAllCountries' in data['home']} | countries={len(ns)} keys | en-fallback={fallbacks if fallbacks else 'none'}")
