'use strict';

const dom = {
  create(content, klasse, parent, type) {
    const newEl = document.createElement(type);
    newEl.innerHTML = content;
    newEl.className = klasse;
    parent.append(newEl);

    return newEl;
  },
  $(selector) {
    return document.querySelector(selector);
  },
  $$(selector) {
    return Array.from(document.querySelectorAll(selector));
  },
}