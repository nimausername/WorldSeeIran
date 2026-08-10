import type { Locale } from "./config"

/**
 * Home page copy for a single locale.
 */
export type HomeDictionary = {
  readonly meta: {
    readonly title: string
    readonly description: string
  }
  readonly brand: string
  readonly brandSuffix: string
  readonly hero: {
    readonly headline: string
    readonly headlineWords: readonly string[]
    readonly lead: string
    readonly scrollHint: string
  }
  readonly whatHappened: {
    readonly title: string
    readonly paragraphs: readonly string[]
  }
  readonly whyHere: {
    readonly title: string
    readonly paragraphs: readonly string[]
  }
  readonly whatYouWillFind: {
    readonly title: string
    readonly lead: string
    readonly fallen: {
      readonly title: string
      readonly body: string
    }
    readonly oppressors: {
      readonly title: string
      readonly body: string
    }
  }
  readonly closing: {
    readonly title: string
    readonly body: string
    readonly vow: string
  }
  readonly localeSwitcher: {
    readonly label: string
  }
  readonly nav: {
    readonly home: string
    readonly language: string
    readonly javidnam: string
    readonly themeToLight: string
    readonly themeToDark: string
  }
  readonly credit: string
  readonly javidnam: {
    readonly meta: {
      readonly title: string
      readonly description: string
    }
    readonly title: string
    readonly lead: string
    readonly stats: {
      /** Template with `{count}` for the memorial headcount. */
      readonly peopleCount: string
      /** Template with `{date}` for the last data refresh. */
      readonly lastUpdated: string
    }
    readonly detail: {
      readonly close: string
      readonly age: string
      readonly place: string
      readonly date: string
      readonly unknown: string
    }
  }
}

const en: HomeDictionary = {
  meta: {
    title: "WorldSeeIran — Remember the fallen",
    description:
      "A memorial for those killed by the Islamic Republic of Iran during the latest uprising. The world must see Iran.",
  },
  brand: "WorldSeeIran",
  brandSuffix: ".org",
  hero: {
    headline: "They had names. They had lives. They were taken.",
    headlineWords: [
      "They had names.",
      "They had lives.",
      "They were taken.",
    ],
    lead: "This site exists so the world does not look away from the people killed by the Islamic Republic of Iran in the latest uprising — and so their memory is not reduced to a number.",
    scrollHint: "Read why we are here",
  },
  whatHappened: {
    title: "What happened",
    paragraphs: [
      "In late December 2025, protests erupted across Iran after a currency collapse, soaring inflation, and years of repression. What began as rage over living conditions became a nationwide uprising for dignity, freedom, and an end to the Islamic Republic.",
      "On 8–9 January 2026, security forces answered with a massacre. Across cities and towns, protesters and bystanders were shot — many in the head and torso. Communication blackouts tried to hide the scale of the killing. Thousands never came home.",
      "Official statements have admitted thousands of deaths. Independent monitors and families speak of a far greater loss. Behind every figure is a person: a student, a worker, a parent, a child — a life cut short by a regime that rules through fear.",
    ],
  },
  whyHere: {
    title: "Why this website",
    paragraphs: [
      "WorldSeeIran is not another feed of noise. It is a place of record and mourning. We name the fallen — the angels we lost — so they cannot be erased, rewritten, or forgotten.",
      "We also document the oppressors: those who ordered, enabled, and carried out this massacre. Memory without accountability is incomplete. Silence protects the killers.",
      "The previous version of this project grew too complex. Features multiplied until the heart of the work was lost. Here, the purpose is clear again: remember the dead, confront the guilty, and keep the truth visible to the world.",
    ],
  },
  whatYouWillFind: {
    title: "What you will find here",
    lead: "Two records, held side by side — so grief and justice stay connected.",
    fallen: {
      title: "The fallen",
      body: "A memorial list of those killed in the uprising: names, faces, and the fragments of life we have been able to gather. Each entry is a refusal to let them disappear.",
    },
    oppressors: {
      title: "The oppressors",
      body: "A record of those responsible for the massacre — the chain of command and the hands that pulled the triggers — so the world can see who caused this bloodshed.",
    },
  },
  closing: {
    title: "The world must see Iran",
    body: "If you are reading this from outside Iran, stay with us. Share these names. Refuse the regime’s lies. If you are reading from inside Iran, know that you are not alone — and that every life taken still matters.",
    vow: "We will not look away.",
  },
  localeSwitcher: {
    label: "Language",
  },
  nav: {
    home: "Home",
    language: "Language",
    javidnam: "Javidnam",
    themeToLight: "Switch to light mode",
    themeToDark: "Switch to dark mode",
  },
  credit: "by Nima Khabbazi",
  javidnam: {
    meta: {
      title: "WorldSeeIran — Javidnam",
      description:
        "An infinite memorial field of faces of those killed by the Islamic Republic of Iran.",
    },
    title: "Javidnam",
    lead: "Move through the field. Every face is a life that must not disappear.",
    stats: {
      peopleCount: "{count} people remembered",
      lastUpdated: "Last updated {date}",
    },
    detail: {
      close: "Close",
      age: "Age",
      place: "Place",
      date: "Date",
      unknown: "Unknown",
    },
  },
}

const de: HomeDictionary = {
  meta: {
    title: "WorldSeeIran — Den Gefallenen gedenken",
    description:
      "Eine Gedenkstätte für die vom Islamischen Regime Irans während des jüngsten Aufstands Getöteten. Die Welt muss Iran sehen.",
  },
  brand: "WorldSeeIran",
  brandSuffix: ".org",
  hero: {
    headline: "Sie hatten Namen. Sie hatten Leben. Sie wurden genommen.",
    headlineWords: [
      "Sie hatten Namen.",
      "Sie hatten Leben.",
      "Sie wurden genommen.",
    ],
    lead: "Diese Seite existiert, damit die Welt nicht wegschaut von den Menschen, die das Islamische Regime Irans im jüngsten Aufstand getötet hat — und damit ihre Erinnerung nicht zu einer Zahl verkommt.",
    scrollHint: "Warum wir hier sind",
  },
  whatHappened: {
    title: "Was geschehen ist",
    paragraphs: [
      "Ende Dezember 2025 brachen in Iran Proteste aus — nach einem Währungseinbruch, galoppierender Inflation und Jahren der Unterdrückung. Was als Wut über die Lebensbedingungen begann, wurde zu einem landesweiten Aufstand für Würde, Freiheit und ein Ende der Islamischen Republik.",
      "Am 8. und 9. Januar 2026 antworteten die Sicherheitskräfte mit einem Massaker. In Städten und Ortschaften wurden Demonstrierende und Unbeteiligte erschossen — viele in Kopf und Oberkörper. Kommunikationssperren sollten das Ausmaß des Tötens verbergen. Tausende kamen nie nach Hause.",
      "Offizielle Angaben sprechen von Tausenden Toten. Unabhängige Beobachter und Familien berichten von einem noch größeren Verlust. Hinter jeder Zahl steht ein Mensch: eine Studentin, ein Arbeiter, eine Mutter, ein Kind — ein Leben, beendet von einem Regime, das durch Angst herrscht.",
    ],
  },
  whyHere: {
    title: "Warum diese Website",
    paragraphs: [
      "WorldSeeIran ist kein weiterer Lärm im Netz. Es ist ein Ort der Dokumentation und der Trauer. Wir nennen die Gefallenen — die Engel, die wir verloren haben — damit sie nicht ausgelöscht, umgeschrieben oder vergessen werden.",
      "Wir dokumentieren auch die Unterdrücker: jene, die dieses Massaker befohlen, ermöglicht und ausgeführt haben. Erinnerung ohne Verantwortung ist unvollständig. Schweigen schützt die Täter.",
      "Die frühere Version dieses Projekts wurde zu komplex. Funktionen wucherten, bis der Kern verloren ging. Hier ist der Zweck wieder klar: den Toten gedenken, die Schuldigen benennen und die Wahrheit für die Welt sichtbar halten.",
    ],
  },
  whatYouWillFind: {
    title: "Was Sie hier finden",
    lead: "Zwei Verzeichnisse, nebeneinander — damit Trauer und Gerechtigkeit verbunden bleiben.",
    fallen: {
      title: "Die Gefallenen",
      body: "Eine Gedenkliste der im Aufstand Getöteten: Namen, Gesichter und die Lebensfragmente, die wir sammeln konnten. Jeder Eintrag ist eine Weigerung, sie verschwinden zu lassen.",
    },
    oppressors: {
      title: "Die Unterdrücker",
      body: "Ein Verzeichnis der Verantwortlichen für das Massaker — Befehlskette und Täter — damit die Welt sieht, wer dieses Blutvergießen verursacht hat.",
    },
  },
  closing: {
    title: "Die Welt muss Iran sehen",
    body: "Wenn Sie dies außerhalb Irans lesen: bleiben Sie bei uns. Teilen Sie diese Namen. Weisen Sie die Lügen des Regimes zurück. Wenn Sie dies in Iran lesen: Sie sind nicht allein — und jedes genommene Leben zählt weiterhin.",
    vow: "Wir schauen nicht weg.",
  },
  localeSwitcher: {
    label: "Sprache",
  },
  nav: {
    home: "Startseite",
    language: "Sprache",
    javidnam: "Javidnam",
    themeToLight: "Zum Hellmodus wechseln",
    themeToDark: "Zum Dunkelmodus wechseln",
  },
  credit: "von Nima Khabbazi",
  javidnam: {
    meta: {
      title: "WorldSeeIran — Javidnam",
      description:
        "Ein unendliches Gedenkfeld mit den Gesichtern der vom Islamischen Regime Irans Getöteten.",
    },
    title: "Javidnam",
    lead: "Beweg dich durch das Feld. Jedes Gesicht ist ein Leben, das nicht verschwinden darf.",
    stats: {
      peopleCount: "{count} Menschen im Gedenken",
      lastUpdated: "Zuletzt aktualisiert {date}",
    },
    detail: {
      close: "Schließen",
      age: "Alter",
      place: "Ort",
      date: "Datum",
      unknown: "Unbekannt",
    },
  },
}

const fa: HomeDictionary = {
  meta: {
    title: "WorldSeeIran — یادبود جان‌باختگان",
    description:
      "یادبود کسانی که جمهوری اسلامی ایران در آخرین خیزش کشت. جهان باید ایران را ببیند.",
  },
  brand: "WorldSeeIran",
  brandSuffix: ".org",
  hero: {
    headline: "نام داشتند. زندگی داشتند. از ما گرفته شدند.",
    headlineWords: ["نام داشتند.", "زندگی داشتند.", "از ما گرفته شدند."],
    lead: "این سایت هست تا جهان از کسانی که جمهوری اسلامی در آخرین خیزش کشت، چشم برندارد — و یادشان به یک عدد تقلیل پیدا نکند.",
    scrollHint: "چرا اینجا هستیم",
  },
  whatHappened: {
    title: "چه رخ داد",
    paragraphs: [
      "در پایان آذر و آغاز دی ۱۴۰۴، پس از سقوط ارزش پول، تورم کمرشکن و سال‌ها سرکوب، اعتراض‌ها در سراسر ایران شعله کشید. خشم از وضعیت زندگی به خیزشی سراسری برای کرامت، آزادی و پایان جمهوری اسلامی بدل شد.",
      "در ۱۸ و ۱۹ دی ۱۴۰۴ نیروهای امنیتی با کشتار پاسخ دادند. در شهرها و شهرستان‌ها معترضان و رهگذران هدف گلوله قرار گرفتند — بسیاری به سر و سینه. قطع ارتباطات می‌خواست ابعاد کشتار را پنهان کند. هزاران نفر هرگز به خانه بازنگشتند.",
      "بیانیه‌های رسمی از هزاران کشته سخن گفته‌اند. ناظران مستقل و خانواده‌ها از فاجعه‌ای بزرگ‌تر می‌گویند. پشت هر رقم یک انسان است: دانشجو، کارگر، پدر، مادر، کودک — جانی که رژیم وحشت کوتاه کرد.",
    ],
  },
  whyHere: {
    title: "چرا این وب‌سایت",
    paragraphs: [
      "WorldSeeIran هیاهوی دیگری در فضای مجازی نیست. اینجا جای ثبت و عزاداری است. ما جان‌باختگان را — فرشتگانی که از دست دادیم — با نام یاد می‌کنیم تا پاک نشوند، تحریف نشوند و فراموش نشوند.",
      "ما ستمگران را نیز ثبت می‌کنیم: کسانی که این کشتار را فرمان دادند، ممکن ساختند و اجرا کردند. یاد بدون پاسخ‌گویی ناقص است. سکوت قاتلان را حفظ می‌کند.",
      "نسخهٔ پیشین این پروژه بیش از حد پیچیده شد. امکانات زیاد شد تا اصل کار گم شد. اینجا دوباره هدف روشن است: یاد مردگان، رویارویی با مجرمان، و آشکار نگه‌داشتن حقیقت برای جهان.",
    ],
  },
  whatYouWillFind: {
    title: "اینجا چه می‌بینید",
    lead: "دو فهرست، کنار هم — تا سوگ و عدالت از هم جدا نشوند.",
    fallen: {
      title: "جان‌باختگان",
      body: "فهرست یادبود کسانی که در خیزش کشته شدند: نام‌ها، چهره‌ها و تکه‌هایی از زندگی که توانسته‌ایم گرد آوریم. هر نام، امتناع از محو شدن است.",
    },
    oppressors: {
      title: "ستمگران",
      body: "سندی از مسئولان این کشتار — زنجیرهٔ فرمان و دستانی که ماشه را کشیدند — تا جهان ببیند این خون را چه کسانی ریختند.",
    },
  },
  closing: {
    title: "جهان باید ایران را ببیند",
    body: "اگر بیرون از ایران می‌خوانید، با ما بمانید. این نام‌ها را پخش کنید. دروغ‌های رژیم را نپذیرید. اگر درون ایران می‌خوانید، بدانید تنها نیستید — و هر جانی که گرفته شد هنوز مهم است.",
    vow: "چشم برنمی‌گردانیم.",
  },
  localeSwitcher: {
    label: "زبان",
  },
  nav: {
    home: "خانه",
    language: "زبان",
    javidnam: "جاویدنام",
    themeToLight: "حالت روشن",
    themeToDark: "حالت تاریک",
  },
  credit: "اثر نیما خبازی",
  javidnam: {
    meta: {
      title: "WorldSeeIran — جاویدنام",
      description:
        "میدان بی‌پایان چهره‌های کسانی که جمهوری اسلامی ایران کشت.",
    },
    title: "جاویدنام",
    lead: "در میدان حرکت کنید. هر چهره، جانی است که نباید محو شود.",
    stats: {
      peopleCount: "{count} نفر در یادبود",
      lastUpdated: "آخرین به‌روزرسانی {date}",
    },
    detail: {
      close: "بستن",
      age: "سن",
      place: "مکان",
      date: "تاریخ",
      unknown: "نامشخص",
    },
  },
}

const dictionaries: Record<Locale, HomeDictionary> = {
  en,
  de,
  fa,
}

/**
 * Returns the home dictionary for a locale.
 */
export const getDictionary = (locale: Locale): HomeDictionary =>
  dictionaries[locale]
