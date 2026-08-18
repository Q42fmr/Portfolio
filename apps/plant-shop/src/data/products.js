// Каталог «Verde». Кожен товар має інлайн-SVG ілюстрацію:
// стилізований силует рослини у горщику, viewBox 0 0 200 200, 2–4 кольори.

export const CATEGORIES = [
  { id: "all", label: "Усі" },
  { id: "large", label: "Великі рослини" },
  { id: "succulent", label: "Сукуленти" },
  { id: "flowering", label: "Квітучі" },
  { id: "accessory", label: "Аксесуари" },
];

export const CATEGORY_LABELS = {
  large: "Великі рослини",
  succulent: "Сукуленти",
  flowering: "Квітучі",
  accessory: "Аксесуари",
};

export const PRODUCTS = [
  {
    id: "monstera",
    name: "Монстера Деліціоза",
    price: 899,
    category: "large",
    description:
      "Ефектна тропічна рослина з великим різьбленим листям, що миттєво оживляє інтерʼєр. У кімнатних умовах виростає до двох метрів.",
    care: "Яскраве розсіяне світло без прямого сонця. Полив раз на 5–7 днів, коли верхній шар ґрунту підсохне. Любить обприскування та опору для росту.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#e3efd8"/><g fill="none" stroke="#1e7a41" stroke-width="5" stroke-linecap="round"><path d="M100 144 C 97 118 87 102 72 88"/><path d="M100 144 C 103 116 114 98 130 84"/><path d="M100 144 C 100 120 100 106 100 92"/></g><path d="M72 88 C 42 90 26 60 40 34 C 72 26 96 52 90 84 C 85 93 78 93 72 88 Z" fill="#35a35f"/><path d="M130 84 C 160 84 176 52 160 28 C 128 22 106 50 112 80 C 117 89 124 89 130 84 Z" fill="#1e7a41"/><path d="M100 92 C 82 76 84 52 100 38 C 116 52 118 76 100 92 Z" fill="#35a35f"/><g fill="none" stroke="#e3efd8" stroke-width="6" stroke-linecap="round"><path d="M48 42 L 70 62"/><path d="M42 58 L 64 74"/><path d="M152 36 L 130 56"/><path d="M158 52 L 136 68"/></g><path d="M62 136 h76 v12 h-7 l-8 34 h-46 l-8 -34 h-7 z" fill="#c2703d"/></svg>`,
  },
  {
    id: "ficus-lyrata",
    name: "Фікус Лірата",
    price: 749,
    category: "large",
    description:
      "Скульптурне деревце з великим глянцевим листям у формі скрипки — улюбленець дизайнерів інтерʼєру.",
    care: "Потребує багато розсіяного світла. Поливайте помірно раз на тиждень, не допускаючи застою води. Не любить переставлянь і протягів.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#ece5d3"/><path d="M100 142 L100 40" stroke="#8a5a33" stroke-width="6" stroke-linecap="round" fill="none"/><ellipse cx="68" cy="58" rx="25" ry="15" transform="rotate(-26 68 58)" fill="#26794a"/><ellipse cx="132" cy="50" rx="25" ry="15" transform="rotate(22 132 50)" fill="#3f9e63"/><ellipse cx="64" cy="94" rx="23" ry="14" transform="rotate(-18 64 94)" fill="#3f9e63"/><ellipse cx="136" cy="88" rx="23" ry="14" transform="rotate(16 136 88)" fill="#26794a"/><ellipse cx="70" cy="126" rx="20" ry="12" transform="rotate(-14 70 126)" fill="#26794a"/><ellipse cx="130" cy="122" rx="20" ry="12" transform="rotate(12 130 122)" fill="#3f9e63"/><ellipse cx="100" cy="32" rx="14" ry="18" fill="#26794a"/><path d="M64 140 h72 v12 h-7 l-7 32 h-44 l-7 -32 h-7 z" fill="#8a5a33"/></svg>`,
  },
  {
    id: "strelitzia",
    name: "Стреліція",
    price: 1299,
    category: "large",
    description:
      "«Райський птах» із розкішним віялоподібним листям. У гарних умовах дарує екзотичні помаранчеві квіти.",
    care: "Найсвітліше місце в домі — кілька годин прямого сонця не зашкодять. Полив рясний улітку та стриманий узимку. У сезон росту підживлюйте раз на два тижні.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#e5efdc"/><path d="M86 140 C 62 112 58 68 78 40 C 96 64 98 110 92 140 Z" fill="#256e42"/><path d="M108 140 C 104 112 106 70 124 46 C 138 74 132 116 114 140 Z" fill="#256e42"/><path d="M102 140 C 104 112 112 82 134 62" stroke="#256e42" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M134 62 L 170 70 L 140 78 Z" fill="#256e42"/><g fill="#ef8354"><path d="M134 62 L 118 34 L 136 56 Z"/><path d="M136 60 L 140 30 L 144 58 Z"/><path d="M138 60 L 162 40 L 146 62 Z"/></g><path d="M66 138 h68 v12 h-6 l-7 32 h-42 l-7 -32 h-6 z" fill="#41503f"/></svg>`,
  },
  {
    id: "sansevieria",
    name: "Сансевієрія",
    price: 349,
    category: "succulent",
    description:
      "Невибаглива рослина з мечоподібним листям, що очищує повітря. Ідеальна для початківців і забудькуватих.",
    care: "Витримує і тінь, і яскраве світло. Полив раз на 2–3 тижні, взимку ще рідше. Єдиний її ворог — перелив.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#eaf2df"/><g fill="#2c8c52"><path d="M86 138 C 82 104 74 74 60 50 C 80 62 92 102 94 138 Z"/><path d="M98 138 C 97 96 98 62 102 34 C 110 64 108 104 106 138 Z"/><path d="M112 138 C 116 106 126 78 142 58 C 134 92 124 116 120 138 Z"/><path d="M74 138 C 72 118 66 100 56 86 C 70 94 78 118 80 138 Z"/><path d="M124 138 C 128 122 136 108 148 98 C 140 116 132 128 128 138 Z"/></g><g fill="none" stroke="#ddc14e" stroke-width="3"><path d="M60 50 C 74 74 82 104 86 138"/><path d="M102 34 C 98 62 97 96 98 138"/><path d="M142 58 C 126 78 116 106 112 138"/></g><path d="M64 138 h72 v12 h-6 l-6 30 h-48 l-6 -30 h-6 z" fill="#6f7d6e"/></svg>`,
  },
  {
    id: "echeveria",
    name: "Ехеверія",
    price: 199,
    category: "succulent",
    description:
      "Мініатюрна «камʼяна троянда» зі щільною розеткою мʼясистого листя ніжного відтінку.",
    care: "Максимум сонця — південне підвіконня ідеальне. Поливайте раз на два тижні під корінь, не намочуючи розетку. Взимку тримайте майже сухою.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#edf3e6"/><g fill="#5cb08e"><ellipse cx="100" cy="59" rx="11" ry="25"/><ellipse cx="100" cy="59" rx="11" ry="25" transform="rotate(45 100 84)"/><ellipse cx="100" cy="59" rx="11" ry="25" transform="rotate(90 100 84)"/><ellipse cx="100" cy="59" rx="11" ry="25" transform="rotate(135 100 84)"/><ellipse cx="100" cy="59" rx="11" ry="25" transform="rotate(180 100 84)"/><ellipse cx="100" cy="59" rx="11" ry="25" transform="rotate(225 100 84)"/><ellipse cx="100" cy="59" rx="11" ry="25" transform="rotate(270 100 84)"/><ellipse cx="100" cy="59" rx="11" ry="25" transform="rotate(315 100 84)"/></g><g fill="#2e7d5b"><ellipse cx="100" cy="66" rx="9" ry="18" transform="rotate(30 100 84)"/><ellipse cx="100" cy="66" rx="9" ry="18" transform="rotate(102 100 84)"/><ellipse cx="100" cy="66" rx="9" ry="18" transform="rotate(174 100 84)"/><ellipse cx="100" cy="66" rx="9" ry="18" transform="rotate(246 100 84)"/><ellipse cx="100" cy="66" rx="9" ry="18" transform="rotate(318 100 84)"/></g><circle cx="100" cy="84" r="9" fill="#5cb08e"/><path d="M62 126 h76 v10 h-6 c0 20 -14 34 -32 34 s-32 -14 -32 -34 h-6 z" fill="#b9825a"/></svg>`,
  },
  {
    id: "haworthia",
    name: "Хавортія",
    price: 179,
    category: "succulent",
    description:
      "Компактний смугастий сукулент, схожий на мініатюрне алое. Займає мінімум місця — ідеальний для робочого столу.",
    care: "Яскраве розсіяне світло без палючого сонця. Полив раз на два тижні влітку і раз на місяць узимку. Ґрунт має повністю просихати.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#e7efdf"/><g fill="#1e5e3f"><path d="M97 136 C 90 112 80 88 64 70 C 74 72 90 96 100 134 Z"/><path d="M99 136 C 96 104 94 74 88 48 C 98 60 104 100 104 136 Z"/><path d="M104 136 C 108 106 116 80 130 60 C 128 84 116 112 110 138 Z"/><path d="M94 136 C 84 122 70 110 54 104 C 66 104 86 116 96 138 Z"/><path d="M108 138 C 120 124 134 116 148 114 C 136 122 118 132 112 140 Z"/></g><g fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round"><path d="M84 84 L 92 88"/><path d="M76 72 L 84 76"/><path d="M92 72 L 98 74"/><path d="M90 56 L 96 58"/><path d="M116 84 L 122 80"/><path d="M122 72 L 128 68"/><path d="M72 112 L 78 114"/><path d="M126 122 L 132 120"/></g><path d="M70 136 h60 v10 h-5 l-6 28 h-38 l-6 -28 h-5 z" fill="#c2703d"/></svg>`,
  },
  {
    id: "opuntia",
    name: "Кактус Опунція",
    price: 229,
    category: "succulent",
    description:
      "Харизматичний кактус із пласкими «вушками», що легко галузиться. Навесні може порадувати яскравим цвітінням.",
    care: "Сонячне місце цілий рік. Полив раз на 2–3 тижні влітку, взимку — раз на місяць. Пересаджуйте в рукавицях: колючки непомітні, але чіпкі.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#f2e8d2"/><ellipse cx="100" cy="104" rx="26" ry="34" fill="#3fa066"/><ellipse cx="70" cy="76" rx="16" ry="21" transform="rotate(-28 70 76)" fill="#3fa066"/><ellipse cx="130" cy="70" rx="14" ry="19" transform="rotate(24 130 70)" fill="#3fa066"/><g fill="#e06e8f"><circle cx="138" cy="50" r="6"/><circle cx="128" cy="46" r="6"/><circle cx="134" cy="40" r="6"/><circle cx="142" cy="42" r="5"/><circle cx="134" cy="46" r="4"/></g><g fill="#f2e8d2"><circle cx="92" cy="92" r="2.4"/><circle cx="108" cy="98" r="2.4"/><circle cx="98" cy="116" r="2.4"/><circle cx="112" cy="122" r="2.4"/><circle cx="88" cy="112" r="2.4"/><circle cx="66" cy="72" r="2.2"/><circle cx="76" cy="84" r="2.2"/><circle cx="128" cy="66" r="2.2"/><circle cx="134" cy="78" r="2.2"/></g><path d="M68 138 h64 v12 h-6 l-6 30 h-40 l-6 -30 h-6 z" fill="#b0603a"/></svg>`,
  },
  {
    id: "spathiphyllum",
    name: "Спатифілум",
    price: 429,
    category: "flowering",
    description:
      "«Жіноче щастя» з білосніжними вітрилами квітів і глянцевим листям. Цвіте кілька разів на рік.",
    care: "Півтінь або розсіяне світло. Полив двічі на тиждень, листя вдячне за обприскування. Опущене листя — сигнал про спрагу: після поливу відновлюється за годину.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#e2eee2"/><g fill="#1d5c40"><path d="M96 140 C 74 124 60 100 64 72 C 88 86 98 114 100 140 Z"/><path d="M106 140 C 128 122 138 96 132 68 C 110 84 104 112 102 140 Z"/><path d="M100 140 C 88 116 88 88 100 66 C 112 88 112 116 100 140 Z"/></g><path d="M104 108 C 106 84 110 68 122 54" stroke="#1d5c40" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M122 54 C 108 42 110 22 124 14 C 140 22 140 44 126 56 C 124 58 123 57 122 54 Z" fill="#ffffff"/><ellipse cx="124" cy="36" rx="4" ry="11" fill="#e9c46a"/><path d="M84 112 C 82 94 78 82 68 72" stroke="#1d5c40" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M68 72 C 58 62 60 46 70 40 C 82 46 82 62 74 72 C 72 75 70 74 68 72 Z" fill="#ffffff"/><ellipse cx="71" cy="56" rx="3" ry="8" fill="#e9c46a"/><path d="M66 138 h68 v12 h-6 l-7 30 h-42 l-7 -30 h-6 z" fill="#1d5c40"/></svg>`,
  },
  {
    id: "anthurium",
    name: "Антуріум",
    price: 599,
    category: "flowering",
    description:
      "Яскраві лаковані квіти-серця тримаються до двох місяців. Символ гостинності й пристрасті.",
    care: "Тепле місце з розсіяним світлом, без протягів. Поливайте мʼякою водою раз на 4–5 днів. Висока вологість повітря — запорука пишного цвітіння.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#f2e3da"/><g fill="#24734a"><path d="M96 140 C 76 122 66 98 72 72 C 92 86 100 114 100 140 Z"/><path d="M106 140 C 124 124 134 100 128 74 C 110 88 102 114 102 140 Z"/></g><path d="M92 118 C 88 96 84 82 72 68" stroke="#24734a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M110 116 C 114 96 120 80 134 68" stroke="#24734a" stroke-width="4" fill="none" stroke-linecap="round"/><g transform="rotate(-10 72 58)"><circle cx="64" cy="52" r="11" fill="#d94f4f"/><circle cx="82" cy="52" r="11" fill="#d94f4f"/><path d="M54 58 L 73 82 L 92 58 Z" fill="#d94f4f"/></g><path d="M76 46 L 80 28" stroke="#f0c04c" stroke-width="5" stroke-linecap="round"/><g transform="rotate(12 134 52)"><circle cx="127" cy="48" r="9" fill="#d94f4f"/><circle cx="142" cy="48" r="9" fill="#d94f4f"/><path d="M119 53 L 134 72 L 150 53 Z" fill="#d94f4f"/></g><path d="M136 42 L 141 26" stroke="#f0c04c" stroke-width="4" stroke-linecap="round"/><path d="M68 140 h64 v12 h-6 l-6 30 h-40 l-6 -30 h-6 z" fill="#24734a"/></svg>`,
  },
  {
    id: "phalaenopsis",
    name: "Орхідея Фаленопсис",
    price: 699,
    category: "flowering",
    description:
      "Елегантна орхідея-«метелик», що квітне до пів року поспіль. Класичний подарунок, який не набридає.",
    care: "Розсіяне світло східного вікна. Полив методом занурення раз на 7–10 днів, коли коріння посвітлішає. Після цвітіння зріжте квітконос над третьою брунькою.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#efe9f3"/><path d="M92 144 C 88 114 96 78 122 56" stroke="#3a7d52" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="76" cy="142" rx="26" ry="11" transform="rotate(-12 76 142)" fill="#3a7d52"/><ellipse cx="120" cy="144" rx="24" ry="10" transform="rotate(10 120 144)" fill="#3a7d52"/><g fill="#b45fc9"><circle cx="122" cy="47" r="7"/><circle cx="113" cy="53" r="7"/><circle cx="117" cy="63" r="7"/><circle cx="127" cy="63" r="7"/><circle cx="131" cy="53" r="7"/></g><circle cx="122" cy="56" r="4.5" fill="#ffffff"/><g fill="#b45fc9"><circle cx="104" cy="69" r="7"/><circle cx="95" cy="75" r="7"/><circle cx="99" cy="85" r="7"/><circle cx="109" cy="85" r="7"/><circle cx="113" cy="75" r="7"/></g><circle cx="104" cy="78" r="4.5" fill="#ffffff"/><g fill="#b45fc9"><circle cx="94" cy="94" r="6"/><circle cx="86" cy="99" r="6"/><circle cx="89" cy="108" r="6"/><circle cx="99" cy="108" r="6"/><circle cx="102" cy="99" r="6"/></g><circle cx="94" cy="102" r="4" fill="#ffffff"/><circle cx="134" cy="46" r="5" fill="#b45fc9"/><path d="M70 150 h60 v10 h-5 l-5 24 h-40 l-5 -24 h-5 z" fill="#ffffff"/></svg>`,
  },
  {
    id: "ceramic-planter",
    name: "Кашпо керамічне",
    price: 299,
    category: "accessory",
    description:
      "Кашпо ручної роботи з теплим матовим покриттям і дренажним отвором. Діаметр 18 см — пасує більшості середніх рослин.",
    care: "Протирайте вологою серветкою без абразивів. Використовуйте піддон, щоб зайва вода не пошкодила меблі. Морозостійке — підходить і для тераси.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#eef0e2"/><ellipse cx="100" cy="162" rx="44" ry="7" fill="#9aa88f"/><path d="M56 54 h88 v16 h-8 l-10 88 h-52 l-10 -88 h-8 z" fill="#c2703d"/><path d="M76 96 l8 -10 8 10 8 -10 8 10 8 -10 8 10" stroke="#f6ead8" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g fill="#f6ead8"><circle cx="84" cy="116" r="3"/><circle cx="100" cy="116" r="3"/><circle cx="116" cy="116" r="3"/></g></svg>`,
  },
  {
    id: "care-kit",
    name: "Набір для догляду",
    price: 399,
    category: "accessory",
    description:
      "Усе необхідне в одному наборі: лійка, обприскувач і секатор. Гарне пакування — готовий подарунок для любителя рослин.",
    care: "Після використання протирайте інструменти насухо. Зберігайте в сухому місці. Секатор змащуйте краплею олії раз на кілька місяців.",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="86" fill="#e7efdd"/><rect x="46" y="96" width="54" height="42" rx="9" fill="#2e8b57"/><path d="M48 104 L 22 82 L 30 116 Z" fill="#2e8b57"/><path d="M58 96 C 62 76 86 76 90 96" stroke="#2e8b57" stroke-width="6" fill="none"/><rect x="120" y="102" width="32" height="36" rx="7" fill="#7a887b"/><rect x="127" y="84" width="14" height="20" rx="3" fill="#7a887b"/><path d="M141 84 L 158 88 L 152 98 L 141 96 Z" fill="#c2703d"/><path d="M70 168 L 104 150" stroke="#7a887b" stroke-width="5" stroke-linecap="round"/><path d="M70 150 L 104 168" stroke="#7a887b" stroke-width="5" stroke-linecap="round"/><circle cx="87" cy="159" r="3" fill="#e7efdd"/><path d="M104 150 L 122 142" stroke="#c2703d" stroke-width="7" stroke-linecap="round"/><path d="M104 168 L 122 176" stroke="#c2703d" stroke-width="7" stroke-linecap="round"/></svg>`,
  },
];
