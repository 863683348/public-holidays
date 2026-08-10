#!/usr/bin/env python3
"""T2-02 cleanup: inject blog chrome keys + homeAbout namespace into all 11 messages/*.json.
Keeps existing key order; appends new keys at logical positions. Temp script — not committed."""
import json, io, os

BASE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "i18n", "messages")

BLOG_KEYS = ["byAuthor", "categoryLabel", "shareTwitter", "shareLinkedIn", "shareFacebook",
             "faqHeading", "relatedArticles", "relatedCountryLink"]

HOMEA_KEYS = ["heading", "p1", "p2", "li1", "li2", "li3", "li4", "forTeamsLink", "forTeamsLinkLabel"]

T = {
  "en": {
    "blog": {
      "byAuthor": "By {author}",
      "categoryLabel": "Category: {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "Frequently Asked Questions",
      "relatedArticles": "Related Articles",
      "relatedCountryLink": "{name} Holidays →",
    },
    "homeAbout": {
      "heading": "About PubHoliday",
      "p1": "PubHoliday is a free, fast public-holiday calendar covering countries across every region. Whether you are planning time off, scheduling shipments, or simply checking what is closed this week, you can look up official public holidays, observances, and long weekends in seconds.",
      "p2": "Pick a country from the list above to see its full holiday calendar for the current and next year. We highlight long weekends so you can make the most of bridging days, and our world clock keeps you in sync with local time anywhere.",
      "li1": "Up-to-date official public holidays for {count} countries and regions.",
      "li2": "Long-weekend detection to help you plan extended breaks.",
      "li3": "Current-time world clock alongside each country's calendar.",
      "li4": "Subscribe to Pro for saved countries, personal holiday lists, and ICS exports.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "Looking for your team? Explore PubHoliday for Teams →",
    },
  },
  "zh": {
    "blog": {
      "byAuthor": "作者：{author}",
      "categoryLabel": "分类：{category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "常见问题",
      "relatedArticles": "相关文章",
      "relatedCountryLink": "{name} 假期 →",
    },
    "homeAbout": {
      "heading": "关于 PubHoliday",
      "p1": "PubHoliday 是一款免费、快速的公共假期日历，覆盖全球各个地区的国家。无论你是计划休假、安排发货，还是只想看看这周哪些地方放假，都能在几秒内查到官方公共假期、纪念日与长周末。",
      "p2": "从上方列表选择一个国家，即可查看它今年与明年的完整假期日历。我们会标出长周末，帮你充分利用调休日；世界时钟则让你随时与各地的当地时间保持同步。",
      "li1": "覆盖 {count} 个国家和地区的官方公共假期，数据实时更新。",
      "li2": "长周末检测，帮你规划更长的假期。",
      "li3": "各国日历旁附实时世界时钟。",
      "li4": "订阅 Pro 可收藏国家、创建个人假期清单并导出 ICS 日历。",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "想为团队安排假期？了解 PubHoliday for Teams →",
    },
  },
  "de": {
    "blog": {
      "byAuthor": "Von {author}",
      "categoryLabel": "Kategorie: {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "Häufig gestellte Fragen",
      "relatedArticles": "Verwandte Artikel",
      "relatedCountryLink": "{name} Feiertage →",
    },
    "homeAbout": {
      "heading": "Über PubHoliday",
      "p1": "PubHoliday ist ein kostenloser, schneller Feiertagskalender für Länder aus allen Regionen der Welt. Ob Sie freie Tage planen, Lieferungen terminieren oder nur prüfen möchten, was diese Woche geschlossen ist – offizielle Feiertage, Gedenktage und lange Wochenenden finden Sie in Sekunden.",
      "p2": "Wählen Sie oben ein Land aus, um seinen vollständigen Feiertagskalender für das aktuelle und nächste Jahr zu sehen. Wir heben lange Wochenenden hervor, damit Sie Brückentage optimal nutzen können, und unsere Weltuhr hält Sie überall mit der lokalen Zeit synchron.",
      "li1": "Aktuelle offizielle Feiertage für {count} Länder und Regionen.",
      "li2": "Erkennung langer Wochenenden für Ihre Planung.",
      "li3": "Weltuhr mit aktueller Zeit neben jedem Länderkalender.",
      "li4": "Abonnieren Sie Pro für gespeicherte Länder, persönliche Feiertagslisten und ICS-Exporte.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "Für Ihr Team? Entdecken Sie PubHoliday for Teams →",
    },
  },
  "es": {
    "blog": {
      "byAuthor": "Por {author}",
      "categoryLabel": "Categoría: {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "Preguntas frecuentes",
      "relatedArticles": "Artículos relacionados",
      "relatedCountryLink": "{name} Festivos →",
    },
    "homeAbout": {
      "heading": "Acerca de PubHoliday",
      "p1": "PubHoliday es un calendario gratuito y rápido de días festivos que cubre países de todas las regiones. Ya sea que planee días libres, programe envíos o simplemente consulte qué está cerrado esta semana, puede buscar días festivos oficiales, conmemoraciones y fines de semana largos en segundos.",
      "p2": "Elija un país de la lista para ver su calendario completo de días festivos del año actual y el próximo. Resaltamos los fines de semana largos para que aproveche los puentes, y nuestro reloj mundial lo mantiene sincronizado con la hora local de cualquier lugar.",
      "li1": "Días festivos oficiales actualizados para {count} países y regiones.",
      "li2": "Detección de fines de semana largos para planificar descansos.",
      "li3": "Reloj mundial con hora actual junto al calendario de cada país.",
      "li4": "Suscríbase a Pro para guardar países, listas de festivos personales y exportaciones ICS.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "¿Buscas opciones para tu equipo? Descubre PubHoliday for Teams →",
    },
  },
  "fr": {
    "blog": {
      "byAuthor": "Par {author}",
      "categoryLabel": "Catégorie : {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "Questions fréquentes",
      "relatedArticles": "Articles connexes",
      "relatedCountryLink": "{name} Jours fériés →",
    },
    "homeAbout": {
      "heading": "À propos de PubHoliday",
      "p1": "PubHoliday est un calendrier gratuit et rapide des jours fériés couvrant des pays de toutes les régions. Que vous planifiiez des congés, organisiez des expéditions ou vérifiiez simplement ce qui est fermé cette semaine, vous pouvez consulter les jours fériés officiels, les observances et les week-ends prolongés en quelques secondes.",
      "p2": "Choisissez un pays dans la liste pour voir son calendrier complet des jours fériés pour l'année en cours et l'année prochaine. Nous mettons en évidence les week-ends prolongés pour profiter des ponts, et notre horloge mondiale vous garde en phase avec l'heure locale partout.",
      "li1": "Jours fériés officiels à jour pour {count} pays et régions.",
      "li2": "Détection des week-ends prolongés pour planifier vos pauses.",
      "li3": "Horloge mondiale en temps réel à côté du calendrier de chaque pays.",
      "li4": "Abonnez-vous à Pro pour les pays enregistrés, les listes de congés personnelles et les exportations ICS.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "Vous cherchez pour votre équipe ? Découvrez PubHoliday for Teams →",
    },
  },
  "it": {
    "blog": {
      "byAuthor": "Di {author}",
      "categoryLabel": "Categoria: {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "Domande frequenti",
      "relatedArticles": "Articoli correlati",
      "relatedCountryLink": "{name} Festività →",
    },
    "homeAbout": {
      "heading": "Chi siamo – PubHoliday",
      "p1": "PubHoliday è un calendario gratuito e veloce dei giorni festivi che copre paesi di ogni regione. Che tu stia pianificando ferie, programmando spedizioni o semplicemente controllando cosa è chiuso questa settimana, puoi consultare festività ufficiali, ricorrenze e weekend lunghi in pochi secondi.",
      "p2": "Scegli un paese dall'elenco per vedere il calendario completo delle festività per l'anno in corso e il prossimo. Evidenziamo i weekend lunghi per sfruttare al meglio i ponti e il nostro orologio mondiale ti tiene allineato con l'ora locale ovunque.",
      "li1": "Festività ufficiali aggiornate per {count} paesi e regioni.",
      "li2": "Rilevamento dei weekend lunghi per pianificare pause prolungate.",
      "li3": "Orologio mondiale con ora corrente accanto al calendario di ogni paese.",
      "li4": "Abbonati a Pro per paesi salvati, elenchi di festività personali ed esportazioni ICS.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "Cerchi una soluzione per il tuo team? Scopri PubHoliday for Teams →",
    },
  },
  "ja": {
    "blog": {
      "byAuthor": "{author} 著",
      "categoryLabel": "カテゴリ：{category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "よくある質問",
      "relatedArticles": "関連記事",
      "relatedCountryLink": "{name} の祝日 →",
    },
    "homeAbout": {
      "heading": "PubHolidayについて",
      "p1": "PubHolidayは、あらゆる地域の国をカバーする無料で高速な祝日カレンダーです。休暇の計画、出荷のスケジュール、今週の休業確認など、公式の祝日・記念日・連休を数秒で調べられます。",
      "p2": "上のリストから国を選ぶと、今年と来年の完全な祝日カレンダーを確認できます。連休を強調表示して振替休日を最大限活用できるようにし、ワールドクロックでどこでも現地時間に合わせられます。",
      "li1": "{count} の国と地域の最新の公式祝日。",
      "li2": "長期休暇の計画に役立つ連休の検出。",
      "li3": "各国のカレンダーと併せて表示されるリアルタイムのワールドクロック。",
      "li4": "Proに登録すると、国を保存し、自分だけの祝日リストを作成し、ICSでエクスポートできます。",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "チーム向け？ PubHoliday for Teams を見る →",
    },
  },
  "ko": {
    "blog": {
      "byAuthor": "작성자: {author}",
      "categoryLabel": "카테고리: {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "자주 묻는 질문",
      "relatedArticles": "관련 기사",
      "relatedCountryLink": "{name} 공휴일 →",
    },
    "homeAbout": {
      "heading": "PubHoliday 소개",
      "p1": "PubHoliday는 전 세계 모든 지역의 국가를 아우르는 무료 공휴일 달력입니다. 휴가를 계획하거나, 배송 일정을 잡거나, 이번 주에 무엇이 쉬는지 확인하려는 경우에도 공식 공휴일, 기념일, 연휴를 몇 초 만에 찾아볼 수 있습니다.",
      "p2": "위 목록에서 국가를 선택하면 올해와 내년의 전체 공휴일 달력을 확인할 수 있습니다. 대체 휴일을 최대한 활용하도록 긴 주말을 강조하며, 세계 시계로 어디서나 현지 시간에 맞출 수 있습니다.",
      "li1": "{count}개 국가 및 지역의 최신 공식 공휴일.",
      "li2": "긴 휴가를 계획하는 데 도움이 되는 연휴 감지.",
      "li3": "각 국가 달력과 함께 제공되는 실시간 세계 시계.",
      "li4": "Pro를 구독하면 국가 저장, 개인 휴일 목록, ICS 내보내기를 이용할 수 있습니다.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "팀을 위한 서비스를 찾고 있나요? PubHoliday for Teams 보기 →",
    },
  },
  "pt": {
    "blog": {
      "byAuthor": "Por {author}",
      "categoryLabel": "Categoria: {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "Perguntas frequentes",
      "relatedArticles": "Artigos relacionados",
      "relatedCountryLink": "{name} Feriados →",
    },
    "homeAbout": {
      "heading": "Sobre o PubHoliday",
      "p1": "O PubHoliday é um calendário gratuito e rápido de feriados que cobre países de todas as regiões. Seja para planejar folgas, programar envios ou apenas verificar o que está fechado esta semana, você consulta feriados oficiais, datas comemorativas e fins de semana prolongados em segundos.",
      "p2": "Escolha um país na lista acima para ver o calendário completo de feriados do ano atual e do próximo. Destacamos fins de semana prolongados para você aproveitar os pontos facultativos, e nosso relógio mundial mantém você sincronizado com o horário local em qualquer lugar.",
      "li1": "Feriados oficiais atualizados para {count} países e regiões.",
      "li2": "Detecção de fins de semana prolongados para planejar pausas.",
      "li3": "Relógio mundial com hora atual ao lado do calendário de cada país.",
      "li4": "Assine o Pro para salvar países, listas de feriados pessoais e exportações ICS.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "Procurando para sua equipe? Conheça o PubHoliday for Teams →",
    },
  },
  "ru": {
    "blog": {
      "byAuthor": "Автор: {author}",
      "categoryLabel": "Категория: {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "Часто задаваемые вопросы",
      "relatedArticles": "Похожие статьи",
      "relatedCountryLink": "{name} Праздники →",
    },
    "homeAbout": {
      "heading": "О PubHoliday",
      "p1": "PubHoliday — это бесплатный и быстрый календарь государственных праздников, охватывающий страны всех регионов. Планируете ли вы отпуск, составляете график поставок или просто проверяете, что закрыто на этой неделе, вы найдёте официальные праздники, памятные даты и длинные выходные за считанные секунды.",
      "p2": "Выберите страну из списка выше, чтобы увидеть её полный календарь праздников на текущий и следующий год. Мы выделяем длинные выходные, чтобы вы могли использовать «мостовые» дни, а наши мировые часы помогут всегда быть в курсе местного времени.",
      "li1": "Актуальные официальные праздники для {count} стран и регионов.",
      "li2": "Определение длинных выходных для планирования отдыха.",
      "li3": "Мировые часы с текущим временем рядом с календарём каждой страны.",
      "li4": "Оформите Pro, чтобы сохранять страны, создавать личные списки праздников и экспортировать ICS.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "Ищете решение для команды? Узнайте о PubHoliday for Teams →",
    },
  },
  "ar": {
    "blog": {
      "byAuthor": "بقلم {author}",
      "categoryLabel": "التصنيف: {category}",
      "shareTwitter": "Twitter",
      "shareLinkedIn": "LinkedIn",
      "shareFacebook": "Facebook",
      "faqHeading": "الأسئلة الشائعة",
      "relatedArticles": "مقالات ذات صلة",
      "relatedCountryLink": "عطلات {name} ←",
    },
    "homeAbout": {
      "heading": "حول PubHoliday",
      "p1": "PubHoliday هو تقويم مجاني وسريع للعطلات الرسمية يغطي دولًا من جميع المناطق. سواء كنت تخطط لإجازة، أو تجدول الشحنات، أو تريد ببساطة معرفة ما هو مغلق هذا الأسبوع، يمكنك البحث عن العطلات الرسمية والمناسبات وعطلات نهاية الأسبوع الطويلة في ثوانٍ.",
      "p2": "اختر دولة من القائمة أعلاه لعرض تقويم العطلات الكامل لها للسنة الحالية والسنة القادمة. نسلط الضوء على عطلات نهاية الأسبوع الطويلة لتستفيد من أيام الجسر، كما تبقيك ساعتنا العالمية على اطلاع بالتوقيت المحلي في أي مكان.",
      "li1": "عطلات رسمية محدّثة لـ {count} دولة ومنطقة.",
      "li2": "كشف عطلات نهاية الأسبوع الطويلة للمساعدة في تخطيط إجازات أطول.",
      "li3": "ساعة عالمية بالتوقيت الحالي بجانب تقويم كل دولة.",
      "li4": "اشترك في Pro لحفظ الدول وإنشاء قوائم العطلات الشخصية وتصدير ICS.",
      "forTeamsLink": "/for-teams",
      "forTeamsLinkLabel": "تبحث عن خدمة لفريقك؟ اطّلع على PubHoliday for Teams ←",
    },
  },
}

def ordered_insert_after(d, anchor, key, value):
    out = {}
    inserted = False
    for k, v in d.items():
        out[k] = v
        if k == anchor and not inserted:
            out[key] = value
            inserted = True
    if not inserted:
        out[key] = value
    return out

def main():
    langs = sorted(T.keys())
    assert set(langs) == {"en","zh","ar","de","es","fr","it","ja","ko","pt","ru"}, langs
    for lang in langs:
        path = os.path.join(BASE, f"{lang}.json")
        with io.open(path, encoding="utf-8") as f:
            data = json.load(f)
        # blog namespace
        blog = dict(data.get("blog", {}))
        for key in BLOG_KEYS:
            if key not in blog:
                blog[key] = T[lang]["blog"][key]
        # keep blog insertion order stable: rebuild so new keys follow relatedCountries
        blog = ordered_insert_after(blog, "relatedCountries", "__marker__", "__marker__")
        # simpler: append missing keys at end in a fixed order
        blog_out = {}
        for k, v in blog.items():
            if k == "__marker__":
                continue
            blog_out[k] = v
        for key in BLOG_KEYS:
            if key not in blog_out:
                blog_out[key] = T[lang]["blog"][key]
        data["blog"] = blog_out
        # homeAbout namespace after home
        home_about = dict(T[lang]["homeAbout"])
        data = ordered_insert_after(data, "home", "homeAbout", home_about)
        # dump
        with io.open(path, "w", encoding="utf-8", newline="\n") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write("\n")
        print(f"OK {lang}: blog keys={len(blog_out)} homeAbout={len(home_about)}")

if __name__ == "__main__":
    main()
