// RADBench project page. Template helpers (copyBibTeX, scrollToTop) come from the
// Academic Project Page Template. Numbers are from the IEEE IV 2026 camera-ready paper.

// Table IV: accuracy (%) on all 522 scenarios
const RESULTS = [
  { group: 'Closed-source', rows: [
    ['GPT-4.1', 53.26], ['o4-mini', 46.36], ['Gemini-2.5-Flash', 39.27],
    ['GPT-4.1-mini', 33.72], ['Sonnet-4', 21.07], ['GPT-4.1-nano', 20.69]
  ] },
  { group: 'Open-source', rows: [
    ['Qwen2.5-VL (72B)', 12.64], ['LLaVA-One-Vision (7B)', 8.62], ['LLaVA-One-Vision (72B)', 7.09],
    ['InternVL2 (8B)', 5.75], ['Qwen2.5-VL (7B)', 5.17]
  ] }
];

// ---------- Template helpers ----------
function copyBibTeX() {
  const code = document.getElementById('bibtex-code');
  const button = document.querySelector('.copy-bibtex-btn');
  const label = button.querySelector('.copy-text');
  const done = () => {
    button.classList.add('copied');
    label.textContent = 'Cop';
    setTimeout(() => { button.classList.remove('copied'); label.textContent = 'Copy'; }, 2000);
  };
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(code.textContent).then(done);
  } else {
    const ta = document.createElement('textarea');
    ta.value = code.textContent;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    done();
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('scroll', () => {
  const btn = document.querySelector('.scroll-to-top');
  if (btn) btn.classList.toggle('visible', window.pageYOffset > 300);
}, { passive: true });

// ---------- Results table ----------
function renderResults() {
  const max = 100;
  let body = '';
  RESULTS.forEach(g => {
    const best = Math.max(...g.rows.map(r => r[1]));
    body += `<tr class="group"><td colspan="2">${g.group}</td></tr>`;
    g.rows.forEach(([model, acc]) => {
      const open = g.group === 'Open-source' ? ' open' : '';
      body += `<tr><td class="left">${model}</td><td class="acc-cell"><div class="acc-bar">
        <div class="track"><div class="fill${open}" style="width:${(acc / max * 100).toFixed(1)}%"></div></div>
        <span class="v${acc === best ? ' best' : ''}">${acc.toFixed(2)}</span></div></td></tr>`;
    });
  });
  document.getElementById('resultsTable').innerHTML =
    `<thead><tr><th class="left">Model</th><th class="left">Accuracy (%)</th></tr></thead><tbody>${body}</tbody>`;
}

// ---------- Section nav highlighting ----------
function initSectionNav() {
  const links = [...document.querySelectorAll('.section-nav a')];
  const targets = links.map(a => document.querySelector(a.getAttribute('href')));
  const onScroll = () => {
    let active = -1;
    targets.forEach((t, i) => { if (t && t.getBoundingClientRect().top < 110) active = i; });
    links.forEach((a, i) => a.classList.toggle('active', i === active));
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

document.addEventListener('DOMContentLoaded', () => {
  renderResults();
  initSectionNav();
});
