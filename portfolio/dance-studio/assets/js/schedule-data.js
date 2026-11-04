/* Flow — студія танцю: дані розкладу та довідкові константи. */
"use strict";

const DAY_NAMES = ["Понеділок", "Вівторок", "Середа", "Четвер", "Пʼятниця", "Субота", "Неділя"];
const DAY_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"];

const STYLE_COLORS = {
  "Hip-Hop": "#ec4899",
  "Contemporary": "#8b5cf6",
  "High Heels": "#f472b6",
  "Breaking": "#d946ef",
  "Kids 6–10": "#e2e8f0",
};

const SCHEDULE = [
  { day: 1, time: "18:00", style: "Hip-Hop", level: "Початківці", trainer: "Даша Коваль" },
  { day: 1, time: "19:30", style: "Contemporary", level: "Всі рівні", trainer: "Соломія Ткач" },
  { day: 1, time: "21:00", style: "High Heels", level: "Продовжуючі", trainer: "Ліля Романюк" },
  { day: 2, time: "17:00", style: "Kids 6–10", level: "Початківці", trainer: "Даша Коваль" },
  { day: 2, time: "19:00", style: "Breaking", level: "Початківці", trainer: "Артем Білий" },
  { day: 2, time: "20:30", style: "Hip-Hop", level: "Продовжуючі", trainer: "Даша Коваль" },
  { day: 3, time: "18:00", style: "Contemporary", level: "Початківці", trainer: "Соломія Ткач" },
  { day: 3, time: "19:30", style: "High Heels", level: "Початківці", trainer: "Ліля Романюк" },
  { day: 3, time: "21:00", style: "Hip-Hop", level: "Всі рівні", trainer: "Даша Коваль" },
  { day: 4, time: "17:00", style: "Kids 6–10", level: "Всі рівні", trainer: "Соломія Ткач" },
  { day: 4, time: "19:00", style: "Breaking", level: "Продовжуючі", trainer: "Артем Білий" },
  { day: 4, time: "20:30", style: "Contemporary", level: "Продовжуючі", trainer: "Соломія Ткач" },
  { day: 5, time: "18:00", style: "Hip-Hop", level: "Початківці", trainer: "Даша Коваль" },
  { day: 5, time: "19:30", style: "Breaking", level: "Всі рівні", trainer: "Артем Білий" },
  { day: 5, time: "21:00", style: "High Heels", level: "Продовжуючі", trainer: "Ліля Романюк" },
  { day: 6, time: "11:00", style: "Kids 6–10", level: "Початківці", trainer: "Даша Коваль" },
  { day: 6, time: "12:30", style: "Hip-Hop", level: "Всі рівні", trainer: "Даша Коваль" },
  { day: 6, time: "14:00", style: "Contemporary", level: "Всі рівні", trainer: "Соломія Ткач" },
  { day: 6, time: "15:30", style: "High Heels", level: "Початківці", trainer: "Ліля Романюк" },
  { day: 7, time: "12:00", style: "Breaking", level: "Початківці", trainer: "Артем Білий" },
  { day: 7, time: "13:30", style: "Contemporary", level: "Продовжуючі", trainer: "Соломія Ткач" },
];

const PHONE_RE = /^\+?[\d\s()-]{10,}$/;
