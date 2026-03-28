(function () {
  function getCurrentLang() {
    var path = window.location.pathname.replace(/\\/g, '/');
    if (path.indexOf('/en/') !== -1) return 'en';
    if (path.indexOf('/es/') !== -1) return 'es';
    return null;
  }

  window.switchLang = function (lang) {
    localStorage.setItem('preferred-lang', lang);
    var path = window.location.pathname.replace(/\\/g, '/');
    var newPath;
    if (path.indexOf('/en/') !== -1) {
      newPath = path.replace('/en/', '/' + lang + '/');
    } else if (path.indexOf('/es/') !== -1) {
      newPath = path.replace('/es/', '/' + lang + '/');
    } else {
      newPath = lang + '/index.html';
    }
    window.location.href = newPath;
  };

  document.addEventListener('DOMContentLoaded', function () {
    var lang = getCurrentLang();
    if (!lang) return;

    var switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.innerHTML =
      '<button onclick="switchLang(\'en\')" class="lang-btn' + (lang === 'en' ? ' active' : '') + '" aria-label="English">EN</button>' +
      '<span class="lang-sep">|</span>' +
      '<button onclick="switchLang(\'es\')" class="lang-btn' + (lang === 'es' ? ' active' : '') + '" aria-label="Español">ES</button>';

    var headerTop = document.querySelector('.header-top');
    if (headerTop) headerTop.appendChild(switcher);
  });
})();
