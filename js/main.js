(function () {
  'use strict';

  // Highlight the nav link for the section currently on screen
  var navLinks = document.querySelectorAll('.site-nav a');
  var sections = [];
  navLinks.forEach(function (link) {
    var section = document.querySelector(link.getAttribute('href'));
    if (section) sections.push({ link: link, section: section });
  });

  function updateActiveNav() {
    var current = sections[0];
    var marker = window.innerHeight * 0.35;
    sections.forEach(function (s) {
      if (s.section.getBoundingClientRect().top <= marker) current = s;
    });
    // At the very bottom, the footer counts as current even if it is short
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    sections.forEach(function (s) {
      s.link.classList.toggle('active', s === current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  window.addEventListener('resize', updateActiveNav);
  updateActiveNav();

  // Research tabs
  var tabs = document.querySelectorAll('.tabs [role="tab"]');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', selected);
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        panel.hidden = !selected;
        playVideos(panel, selected);
      });
    });
  });

  // Videos only load and play while they are visible, to save mobile data
  function playVideos(container, play) {
    container.querySelectorAll('video').forEach(function (v) {
      if (play) v.play().catch(function () {});
      else v.pause();
    });
  }

  // Paper pop-ups
  document.querySelectorAll('[data-dialog]').forEach(function (button) {
    button.addEventListener('click', function () {
      var dialog = document.getElementById(button.getAttribute('data-dialog'));
      dialog.showModal();
      playVideos(dialog, true);
      document.body.classList.add('dialog-open');
    });
  });

  document.querySelectorAll('.paper-dialog').forEach(function (dialog) {
    dialog.querySelector('.dialog-close').addEventListener('click', function () {
      dialog.close();
    });
    // Clicking the dark area outside the pop-up closes it
    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', function () {
      document.body.classList.remove('dialog-open');
      playVideos(dialog, false);
    });
  });

  // News: show the newest few items, with a button to reveal the rest
  var NEWS_SHOWN = 5;
  var newsList = document.querySelector('.news-list');
  var newsMore = document.querySelector('.news-more');
  if (newsList && newsMore) {
    var items = newsList.querySelectorAll('li');
    if (items.length > NEWS_SHOWN) {
      for (var i = NEWS_SHOWN; i < items.length; i++) items[i].classList.add('older');
      newsList.classList.add('collapsed');
      newsMore.hidden = false;
      newsMore.addEventListener('click', function () {
        newsList.classList.remove('collapsed');
        newsMore.hidden = true;
      });
    }
  }
})();
