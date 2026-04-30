// ============================================================
//  D&D CHARACTER ROLLER — APP LOGIC
//  Edit config.js to change categories, options, and weights.
// ============================================================

let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
let currentIdx = 0;
let results = [];

// --- Rolling ---

function weightedRoll(options) {
  const total = options.reduce((sum, o) => sum + o.weight, 0);
  let r = Math.random() * total;
  for (const o of options) {
    r -= o.weight;
    if (r <= 0) return o;
  }
  return options[options.length - 1];
}

function rollOne() {
  if (currentIdx >= config.length) return;

  const cat = config[currentIdx];
  const picked = weightedRoll(cat.options);
  results.push({ cat: cat.label, value: picked.value, dice: cat.dice, note: cat.note });

  animateResult(cat, picked);
  currentIdx++;
  renderList();
  updateProgress();

  if (currentIdx >= config.length) {
    setFinished();
  } else {
    document.getElementById('mainBtn').textContent = `Roll ${config[currentIdx].label} →`;
  }
}

function rollAll() {
  results = config.map(cat => {
    const picked = weightedRoll(cat.options);
    return { cat: cat.label, value: picked.value, dice: cat.dice, note: cat.note };
  });
  currentIdx = config.length;

  const last = results[results.length - 1];
  animateResult(config[config.length - 1], { value: last.value });
  renderList();
  updateProgress();
  setFinished();
}

// --- UI helpers ---

function animateResult(cat, picked) {
  const area = document.getElementById('rollArea');
  area.classList.remove('spinning');
  void area.offsetWidth; // force reflow to restart animation
  area.classList.add('spinning');

  document.getElementById('catLabel').textContent = cat.label;
  document.getElementById('resultVal').textContent = picked.value;
  document.getElementById('resultSub').textContent = cat.note || '';
  document.getElementById('diceBadge').textContent = cat.dice;
}

function renderList() {
  const list = document.getElementById('rollsList');
  list.innerHTML = results.map(r => `
    <div class="roll-item">
      <span class="roll-item-cat">${r.cat}</span>
      <span class="roll-item-val">${r.value}</span>
    </div>
  `).join('');
}

function updateProgress() {
  const el = document.getElementById('progress');
  el.textContent = currentIdx > 0
    ? `${currentIdx} of ${config.length} rolled`
    : '';
}

function setFinished() {
  document.getElementById('mainBtn').textContent = 'Done!';
  document.getElementById('mainBtn').disabled = true;
  document.getElementById('allBtn').style.display = 'none';
  document.getElementById('resetBtn').style.display = '';
}

function resetRoller() {
  currentIdx = 0;
  results = [];

  document.getElementById('catLabel').textContent = 'Ready to roll';
  document.getElementById('resultVal').textContent = '—';
  document.getElementById('resultSub').textContent = '';
  document.getElementById('diceBadge').textContent = '';
  document.getElementById('rollsList').innerHTML = '';
  document.getElementById('mainBtn').textContent = 'Start rolling';
  document.getElementById('mainBtn').disabled = false;
  document.getElementById('allBtn').style.display = '';
  document.getElementById('resetBtn').style.display = 'none';
  document.getElementById('progress').textContent = '';
}

// --- Tabs ---

function showTab(tab) {
  document.getElementById('tab-roller').style.display = tab === 'roller' ? '' : 'none';
  document.getElementById('tab-config').style.display = tab === 'config' ? '' : 'none';

  document.querySelectorAll('.tab').forEach((t, i) => {
    const isActive = (i === 0 && tab === 'roller') || (i === 1 && tab === 'config');
    t.classList.toggle('active', isActive);
  });

  if (tab === 'config') {
    document.getElementById('configEditor').value = JSON.stringify(config, null, 2);
  }
}

// --- Config editing ---

function saveConfig() {
  const err = document.getElementById('editError');
  try {
    const parsed = JSON.parse(document.getElementById('configEditor').value);
    config = parsed;
    err.textContent = '';
    resetRoller();
    showTab('roller');
  } catch (e) {
    err.textContent = 'Invalid JSON: ' + e.message;
  }
}

function resetConfig() {
  config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  document.getElementById('configEditor').value = JSON.stringify(config, null, 2);
  document.getElementById('editError').textContent = '';
}
