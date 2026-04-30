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
    renderConfigUI(config);
  }
}

// --- Config editing ---

function saveConfig() {
  const err = document.getElementById('editError');
  err.textContent = '';

  const cards = document.querySelectorAll('.config-card');
  const newConfig = [];

  for (const card of cards) {
    const label = card.querySelector('.config-label-input').value.trim();
    const dice  = card.querySelector('.config-dice-input').value.trim();
    const note  = card.querySelector('.config-note-input').value.trim();
    const id    = label.toLowerCase().replace(/\s+/g, '_') || 'category';

    const options = [];
    for (const row of card.querySelectorAll('.config-option-row')) {
      const value  = row.querySelector('.config-value-input').value.trim();
      const weight = parseFloat(row.querySelector('.config-weight-input').value) || 0;
      if (value) options.push({ value, weight });
    }

    if (label && options.length > 0) newConfig.push({ id, label, dice, note, options });
  }

  if (newConfig.length === 0) {
    err.textContent = 'Add at least one category with one option.';
    return;
  }

  config = newConfig;
  resetRoller();
  showTab('roller');
}

function resetConfig() {
  config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  renderConfigUI(config);
  document.getElementById('editError').textContent = '';
}

// --- Config UI builder ---

function renderConfigUI(cfg) {
  const container = document.getElementById('configUI');
  container.innerHTML = '';
  cfg.forEach(cat => container.appendChild(buildCategoryCard(cat)));
}

function buildCategoryCard(cat) {
  const card = document.createElement('div');
  card.className = 'config-card';

  const header = document.createElement('div');
  header.className = 'config-card-header';

  const labelInput = document.createElement('input');
  labelInput.className = 'config-label-input';
  labelInput.value = cat.label;
  labelInput.placeholder = 'Category name';

  const diceInput = document.createElement('input');
  diceInput.className = 'config-dice-input';
  diceInput.value = cat.dice;
  diceInput.placeholder = 'd6';

  const removeBtn = document.createElement('button');
  removeBtn.className = 'config-remove-cat';
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => card.remove();

  header.append(labelInput, diceInput, removeBtn);

  const noteInput = document.createElement('input');
  noteInput.className = 'config-note-input';
  noteInput.value = cat.note || '';
  noteInput.placeholder = 'Short description…';

  const colHeaders = document.createElement('div');
  colHeaders.className = 'config-option-headers';
  colHeaders.innerHTML = '<span>Option</span><span>Weight</span><span>Probability</span>';

  const optionsList = document.createElement('div');
  optionsList.className = 'config-options-list';

  const total = cat.options.reduce((s, o) => s + o.weight, 0);
  cat.options.forEach(opt => optionsList.appendChild(buildOptionRow(opt, total)));

  optionsList.addEventListener('input', e => {
    if (e.target.classList.contains('config-weight-input')) updateWeightBars(optionsList);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'config-add-option';
  addBtn.textContent = '+ Add option';
  addBtn.onclick = () => {
    optionsList.appendChild(buildOptionRow({ value: '', weight: 1 }, 1));
    updateWeightBars(optionsList);
  };

  card.append(header, noteInput, colHeaders, optionsList, addBtn);
  return card;
}

function buildOptionRow(opt, total) {
  const pct = total > 0 ? (opt.weight / total * 100) : 0;

  const row = document.createElement('div');
  row.className = 'config-option-row';

  const valueInput = document.createElement('input');
  valueInput.className = 'config-value-input';
  valueInput.value = opt.value;
  valueInput.placeholder = 'Option name';

  const weightInput = document.createElement('input');
  weightInput.className = 'config-weight-input';
  weightInput.type = 'number';
  weightInput.min = '0';
  weightInput.value = opt.weight;

  const barWrap = document.createElement('div');
  barWrap.className = 'config-weight-bar-wrap';
  const barFill = document.createElement('div');
  barFill.className = 'config-weight-bar-fill';
  barFill.style.width = pct + '%';
  barWrap.appendChild(barFill);

  const removeBtn = document.createElement('button');
  removeBtn.className = 'config-remove-option';
  removeBtn.textContent = '×';
  removeBtn.onclick = () => {
    const list = row.parentElement;
    row.remove();
    if (list) updateWeightBars(list);
  };

  row.append(valueInput, weightInput, barWrap, removeBtn);
  return row;
}

function updateWeightBars(optionsList) {
  const rows = optionsList.querySelectorAll('.config-option-row');
  let total = 0;
  rows.forEach(row => {
    total += parseFloat(row.querySelector('.config-weight-input').value) || 0;
  });
  rows.forEach(row => {
    const w = parseFloat(row.querySelector('.config-weight-input').value) || 0;
    const pct = total > 0 ? (w / total * 100) : 0;
    row.querySelector('.config-weight-bar-fill').style.width = pct + '%';
  });
}

function addCategory() {
  const container = document.getElementById('configUI');
  const newCat = { id: '', label: '', dice: 'd6', note: '', options: [{ value: '', weight: 1 }] };
  container.appendChild(buildCategoryCard(newCat));
}
