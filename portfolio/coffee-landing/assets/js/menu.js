/* KAVA Roasters — дані меню (використовуються на index.html та menu.html) */
"use strict";

window.KAVA_MENU = {
  coffee: {
    label: "Кава",
    items: [
      { name: "Еспресо", desc: "подвійний шот, зерно тижня", price: "65\u00A0₴" },
      { name: "Капучино", desc: "класична пінка, фермерське молоко", price: "85\u00A0₴", img: "assets/img/latte-art-leaf.jpg", alt: "Капучино з візерунком-листком на молочній пінці" },
      { name: "Фільтр", desc: "V60 або батч-брю — запитайте бариста", price: "75\u00A0₴", img: "assets/img/pour-over-window-light.jpg", alt: "Заварювання фільтр-кави методом пуровер біля вікна" },
      { name: "Флет вайт", desc: "два шоти еспресо, оксамитове молоко", price: "90\u00A0₴", img: "assets/img/latte-art-rosetta-red.jpg", alt: "Флет вайт із візерунком розетта у червоній чашці" },
      { name: "Раф", desc: "вершковий, з мадагаскарською ваніллю", price: "95\u00A0₴" }
    ]
  },
  desserts: {
    label: "Десерти",
    items: [
      { name: "Чізкейк", desc: "нью-йорк на пісочній основі", price: "120\u00A0₴", img: "assets/img/dessert-cheesecake.jpg", alt: "Скибка полуничного чізкейку на тарілці" },
      { name: "Круасан", desc: "на вершковому маслі, випікаємо зранку", price: "75\u00A0₴", img: "assets/img/dessert-croissant.jpg", alt: "Свіжий круасан у руці" },
      { name: "Тірамісу", desc: "з еспресо власного обсмаження", price: "130\u00A0₴", img: "assets/img/dessert-tiramisu.jpg", alt: "Порція тірамісу на тарілці" }
    ]
  },
  beans: {
    label: "Зерно на вагу",
    items: [
      { name: "Ефіопія", desc: "Їргачеффе · жасмин, бергамот, цитрус", price: "420\u00A0₴", unit: "250\u00A0г", img: "assets/img/beans-green-closeup.jpg", alt: "Необсмажені зелені кавові зерна великим планом" },
      { name: "Колумбія", desc: "Уїла · карамель, какао, червоне яблуко", price: "390\u00A0₴", unit: "250\u00A0г", img: "assets/img/beans-scale-closeup.jpg", alt: "Обсмажені кавові зерна на кухонних вагах" },
      { name: "Бленд дому", desc: "для еспресо та молочних напоїв", price: "350\u00A0₴", unit: "250\u00A0г", img: "assets/img/beans-bags-roastery.jpg", alt: "Мішки з кавовими зернами на складі обсмажувальні" }
    ]
  }
};

/** Шість позицій з фото для блоку «Сьогодні на барі» на головній. */
window.KAVA_FEATURED = [
  { cat: "coffee", name: "Капучино" },
  { cat: "coffee", name: "Флет вайт" },
  { cat: "coffee", name: "Фільтр" },
  { cat: "desserts", name: "Чізкейк" },
  { cat: "desserts", name: "Круасан" },
  { cat: "desserts", name: "Тірамісу" }
];
