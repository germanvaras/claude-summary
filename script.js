const SECTIONS = [
  'disclaimer',
  'setup','auth','modelo','tokens','modelos','sesiones',
  'claudemd','scopes','directorios',
  'skills','hooks','mcp','slash','permisos',
  'agente','cicd','worktrees',
  'glosario','cheatsheet','update','troubleshoot',
  'impl','quiz'
];

// Load all sections into the DOM, then init UI
Promise.all(
  SECTIONS.map(name =>
    fetch('sections/' + name + '.html')
      .then(r => r.text())
      .then(html => ({ name, html }))
  )
).then(results => {
  const main = document.getElementById('main-content');
  const noResults = document.getElementById('no-results');
  results.forEach(({ html }) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    main.insertBefore(tmp.firstElementChild, noResults);
  });
  initUI();
});

function initUI() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections  = document.querySelectorAll('.section');

  const defaultLink = document.querySelector('.nav-link[data-section="disclaimer"]');
  const defaultSec  = document.getElementById('section-disclaimer');

  // Show default section
  navLinks.forEach(l => l.classList.remove('active'));
  sections.forEach(s => s.classList.remove('active'));
  if (defaultLink) defaultLink.classList.add('active');
  if (defaultSec)  defaultSec.classList.add('active');

  // NAV
  navLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      link.classList.add('active');
      const sec = document.getElementById('section-' + link.dataset.section);
      if (sec) sec.classList.add('active');
      document.getElementById('search').value = '';
      document.getElementById('no-results').style.display = 'none';
    });
  });

  // SEARCH
  document.getElementById('search').addEventListener('input', function() {
    const q = this.value.trim().toLowerCase();
    if (!q) {
      navLinks.forEach(l => l.classList.remove('active'));
      sections.forEach(s => s.classList.remove('active'));
      if (defaultLink) defaultLink.classList.add('active');
      if (defaultSec)  defaultSec.classList.add('active');
      document.getElementById('no-results').style.display = 'none';
      return;
    }
    let any = false;
    navLinks.forEach(l => l.classList.remove('active'));
    sections.forEach(sec => {
      const match = sec.innerText.toLowerCase().includes(q);
      sec.classList.toggle('active', match);
      if (match) {
        any = true;
        const lnk = document.querySelector(`.nav-link[data-section="${sec.id.replace('section-','')}"]`);
        if (lnk) lnk.classList.add('active');
      }
    });
    document.getElementById('no-results').style.display = any ? 'none' : 'block';
  });

  // MOBILE NAV
  const menuToggle = document.getElementById('menu-toggle');
  const navEl      = document.getElementById('main-nav');
  const navOverlay = document.getElementById('nav-overlay');

  function openNav() {
    navEl.classList.add('open');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeNav() {
    navEl.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle) menuToggle.addEventListener('click', () => {
    navEl.classList.contains('open') ? closeNav() : openNav();
  });
  if (navOverlay) navOverlay.addEventListener('click', closeNav);

  navLinks.forEach(link => {
    link.addEventListener('click', () => { if (window.innerWidth <= 768) closeNav(); });
  });

  // TROUBLESHOOTING ACCORDION
  window.toggleTrouble = function(header) {
    const body = header.nextElementSibling;
    const isOpen = header.classList.contains('open');
    header.classList.toggle('open', !isOpen);
    body.classList.toggle('open', !isOpen);
  };

  // QUIZ
  let answered = {};

  document.querySelectorAll('.quiz-option').forEach(opt => {
    opt.addEventListener('click', function() {
      const q = this.closest('.quiz-q');
      const idx = [...document.querySelectorAll('.quiz-q')].indexOf(q);
      if (answered[idx] !== undefined) return;
      answered[idx] = this.dataset.val;
      q.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));
      this.classList.add('selected');
    });
  });

  window.submitQuiz = function() {
    const qs = document.querySelectorAll('.quiz-q');
    let score = 0;
    qs.forEach((q, i) => {
      const correct = q.dataset.correct;
      const chosen  = answered[i];
      q.querySelectorAll('.quiz-option').forEach(o => o.classList.add('disabled'));
      q.querySelectorAll('.quiz-option').forEach(o => {
        if (o.dataset.val === correct) o.classList.add('correct');
        else if (o.dataset.val === chosen && chosen !== correct) o.classList.add('wrong');
      });
      const fb = q.querySelector('.quiz-feedback');
      fb.classList.add('show');
      if (chosen === correct) {
        score++;
        fb.classList.add('ok');
        fb.textContent = '✅ Correcto.';
      } else if (chosen) {
        fb.classList.add('bad');
        const correctText = q.querySelector(`[data-val="${correct}"]`).textContent;
        fb.textContent = `❌ Incorrecto. La respuesta era: ${correctText}`;
      } else {
        fb.classList.add('bad');
        fb.textContent = '⏭️ Sin responder.';
      }
    });

    document.getElementById('quiz-submit').style.display = 'none';
    const result = document.getElementById('quiz-result');
    result.classList.add('show');
    const total = qs.length;
    document.getElementById('result-score').textContent = `${score} / ${total}`;

    const pct = score / total;
    const verdicts = [
      { min: 1.0,  emoji: '🏆', verdict: '¡Perfecto! Sos un crack.', msg: 'Memorizaste la documentación o sos un genio. De cualquier forma, impresionante. Podés cerrar esta página y empezar a cobrar como experto en Claude Code.' },
      { min: 0.82, emoji: '🎉', verdict: '¡Muy bien! Sabés lo que hacés.', msg: 'Claramente leíste la documentación con atención. Solo fallaste en los detalles más sutiles — ese 18% que separa a los que usan Claude Code de los que lo entienden de verdad.' },
      { min: 0.65, emoji: '😅', verdict: 'Pasable. Apenas.', msg: 'Sabés lo básico pero los detalles se te escapan. La documentación sigue disponible — no te va a morder si la leés de nuevo. De hecho, te lo recomendamos fuertemente.' },
      { min: 0.47, emoji: '🤔', verdict: 'Mmm. ¿Leíste algo?', msg: 'Hay señales de que algo llegó. Unas chispas. Lamentablemente no fue suficiente. La buena noticia es que la documentación no va a ningún lado y tiene una función de búsqueda muy cómoda.' },
      { min: 0.29, emoji: '😬', verdict: 'Esto fue... un intento.', msg: 'No podemos decir que no te esforzaste porque no sabemos si lo hiciste. Lo que sí sabemos es que el resultado habla por sí solo. Hay una sección entera de troubleshooting que quizás te sea útil. Para la vida en general.' },
      { min: 0,    emoji: '💀', verdict: 'Eso fue doloroso de presenciar.', msg: 'Sinceramente no sabemos cómo llegaste hasta acá. ¿Abriste la documentación o solo le diste clic al Quiz directamente? No te juzgamos. Bueno, un poco sí. Volvé a empezar desde Instalación, tomá notas.' }
    ];

    const v = verdicts.find(x => pct >= x.min);
    document.getElementById('result-emoji').textContent = v.emoji;
    document.getElementById('result-verdict').textContent = v.verdict;
    document.getElementById('result-msg').textContent = v.msg;
    result.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  window.restartQuiz = function() {
    answered = {};
    document.querySelectorAll('.quiz-option').forEach(o => {
      o.classList.remove('selected','correct','wrong','disabled');
    });
    document.querySelectorAll('.quiz-feedback').forEach(f => {
      f.classList.remove('show','ok','bad');
      f.textContent = '';
    });
    document.getElementById('quiz-result').classList.remove('show');
    document.getElementById('quiz-submit').style.display = '';
    document.getElementById('quiz-wrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
}
