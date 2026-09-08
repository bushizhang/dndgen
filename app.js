// ============================================================
//  D&D CHARACTER ROLLER — APP LOGIC
//  Edit config.js to change categories, options, and weights.
// ============================================================

let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
let rollQueue = [];
let currentIdx = 0;
let results = [];
const renderedResults = new Map();
const collapsedGroups = new Set();
initRollQueue();

function setMainBtnLabel(text) {
  document.getElementById('mainBtn').innerHTML = `${text}<span class="hotkey">Space</span>`;
}

function initRollQueue() {
  const groupOrder = GROUPS.map(g => g.id);
  rollQueue = [...config].sort((a, b) => {
    const ai = groupOrder.indexOf(a.group ?? '');
    const bi = groupOrder.indexOf(b.group ?? '');
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

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

// A picked option can trigger one or more follow-up rolls (e.g. a class picks
// a subclass, and Cleric/Paladin also pick a deity). Inserts them into the
// queue right after insertIdx and returns how many were added.
function spawnFollowUps(cat, picked, insertIdx) {
  if (cat.isSub) return 0;

  const specs = [];
  if (picked.subOptions?.length > 0) {
    specs.push({ suffix: 'subclass', dice: cat.dice, note: '', options: picked.subOptions });
  }
  const deityTrigger = CLASS_DEITY_TRIGGERS[picked.value];
  if (cat.id === 'class' && deityTrigger) {
    specs.push({ suffix: 'deity', dice: deityTrigger.dice, note: deityTrigger.note, options: deityTrigger.options });
  }

  specs.forEach((spec, i) => {
    rollQueue.splice(insertIdx + i, 0, {
      label: picked.value + ' ' + spec.suffix,
      dice: spec.dice,
      note: spec.note,
      options: spec.options,
      isSub: true,
      group: cat.group
    });
  });

  return specs.length;
}

function rollOne() {
  if (currentIdx >= rollQueue.length) return;

  const cat = rollQueue[currentIdx];
  const picked = weightedRoll(cat.options);
  results.push({ cat: cat.label, value: picked.value, dice: cat.dice, note: cat.note, catIdx: currentIdx, group: cat.group });

  spawnFollowUps(cat, picked, currentIdx + 1);

  animateResult(cat, picked);
  currentIdx++;
  renderList();
  updateProgress();
  document.getElementById('rerollBtn').style.display = '';
  document.getElementById('resetBtn').style.display = '';

  if (currentIdx >= rollQueue.length) {
    setFinished();
  } else {
    setMainBtnLabel(`Roll ${rollQueue[currentIdx].label} →`);
  }
}

function rollAll() {
  initRollQueue();
  results = [];
  let i = 0;
  while (i < rollQueue.length) {
    const cat = rollQueue[i];
    const picked = weightedRoll(cat.options);
    results.push({ cat: cat.label, value: picked.value, dice: cat.dice, note: cat.note, catIdx: i, group: cat.group });
    spawnFollowUps(cat, picked, i + 1);
    i++;
  }
  currentIdx = rollQueue.length;
  document.getElementById('rerollBtn').style.display = 'none';
  document.getElementById('resetBtn').style.display = '';

  animateResult(rollQueue[rollQueue.length - 1], results[results.length - 1]);
  renderList();
  updateProgress();
  setFinished();
}

function rerollLast() {
  if (results.length === 0) return;

  const lastCatIdx = results[results.length - 1].catIdx;
  while (results.length > 0 && results[results.length - 1].catIdx === lastCatIdx) {
    results.pop();
  }

  // If sub-entries were queued after this position but not yet rolled, remove them
  // so the fresh roll can insert updated ones if needed
  while (rollQueue[lastCatIdx + 1]?.isSub) {
    rollQueue.splice(lastCatIdx + 1, 1);
  }

  currentIdx = lastCatIdx;
  const cat = rollQueue[currentIdx];
  const picked = weightedRoll(cat.options);
  results.push({ cat: cat.label, value: picked.value, dice: cat.dice, note: cat.note, catIdx: currentIdx, group: cat.group });

  spawnFollowUps(cat, picked, currentIdx + 1);

  currentIdx++;
  animateResult(cat, picked);
  renderList();
  updateProgress();

  if (currentIdx >= rollQueue.length) {
    setFinished();
  } else {
    document.getElementById('mainBtn').disabled = false;
    setMainBtnLabel(`Roll ${rollQueue[currentIdx].label} →`);
  }
}

// --- UI helpers ---

function animateResult(cat, picked) {
  document.getElementById('catLabel').textContent = cat.label;
  document.getElementById('resultSub').textContent = cat.note || '';
  document.getElementById('diceBadge').textContent = cat.dice;

  const val = document.getElementById('resultVal');
  val.classList.remove('spinning');
  void val.offsetWidth; // force reflow to restart animation
  val.classList.add('spinning');
  val.textContent = picked.value;
}

function renderList() {
  const list = document.getElementById('rollsList');
  list.innerHTML = '';
  let lastGroup = null;

  results.forEach((r, i) => {
    if (r.group && r.group !== lastGroup) {
      const groupDef = GROUPS.find(g => g.id === r.group);
      const label = groupDef ? groupDef.label : r.group;
      const collapsed = collapsedGroups.has(r.group);
      const groupId = r.group;

      const header = document.createElement('div');
      header.className = 'roll-group-header';
      header.innerHTML = `<span>${label}</span><span class="roll-group-toggle">${collapsed ? '▸' : '▾'}</span>`;
      header.onclick = () => {
        collapsedGroups.has(groupId) ? collapsedGroups.delete(groupId) : collapsedGroups.add(groupId);
        renderList();
      };
      list.appendChild(header);
      lastGroup = r.group;
    }

    if (collapsedGroups.has(r.group)) return;

    const prev = renderedResults.get(i);
    const isNew = !prev || prev.cat !== r.cat || prev.value !== r.value;

    const div = document.createElement('div');
    div.className = 'roll-item';
    div.innerHTML = `<span class="roll-item-cat">${r.cat}</span><span class="roll-item-val${isNew ? ' pop-in' : ''}">${r.value}</span>`;
    list.appendChild(div);

    renderedResults.set(i, { cat: r.cat, value: r.value });
  });

  for (const k of renderedResults.keys()) {
    if (k >= results.length) renderedResults.delete(k);
  }
}

function updateProgress() {
  const el = document.getElementById('progress');
  el.textContent = currentIdx > 0
    ? `${currentIdx} of ${rollQueue.length} rolled`
    : '';
}

function setFinished() {
  setMainBtnLabel('Done!');
  document.getElementById('mainBtn').disabled = true;
  document.getElementById('allBtn').style.display = 'none';
}

function resetRoller() {
  currentIdx = 0;
  results = [];
  renderedResults.clear();
  collapsedGroups.clear();
  initRollQueue();

  document.getElementById('catLabel').textContent = 'Ready to roll';
  document.getElementById('resultVal').textContent = '—';
  document.getElementById('resultSub').textContent = '';
  document.getElementById('diceBadge').textContent = '';
  document.getElementById('rollsList').innerHTML = '';
  setMainBtnLabel('Start rolling');
  document.getElementById('mainBtn').disabled = false;
  document.getElementById('allBtn').style.display = '';
  document.getElementById('rerollBtn').style.display = 'none';
  document.getElementById('resetBtn').style.display = 'none';
  document.getElementById('progress').textContent = '';
}

// --- Hotkeys ---

document.addEventListener('keydown', (e) => {
  const tag = document.activeElement?.tagName;
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
  if (document.getElementById('tab-roller').style.display === 'none') return;

  const mainBtn = document.getElementById('mainBtn');
  const allBtn = document.getElementById('allBtn');
  const rerollBtn = document.getElementById('rerollBtn');
  const resetBtn = document.getElementById('resetBtn');

  switch (e.code) {
    case 'Space':
    case 'Enter':
      e.preventDefault();
      if (!mainBtn.disabled) mainBtn.click();
      break;
    case 'KeyA':
      if (allBtn.style.display !== 'none') allBtn.click();
      break;
    case 'KeyR':
      if (rerollBtn.style.display !== 'none') rerollBtn.click();
      break;
    case 'KeyS':
      if (resetBtn.style.display !== 'none') resetBtn.click();
      break;
  }
});

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
    const group = card.querySelector('.config-group-select').value;
    const dice  = card.querySelector('.config-dice-input').value.trim();
    const note  = card.querySelector('.config-note-input').value.trim();
    const id    = label.toLowerCase().replace(/\s+/g, '_') || 'category';

    const options = [];
    for (const group of card.querySelectorAll('.config-option-group')) {
      const mainRow = group.querySelector('.config-option-row');
      const value   = mainRow.querySelector('.config-value-input').value.trim();
      const weight  = parseFloat(mainRow.querySelector('.config-weight-input').value) || 0;

      const subOptions = [];
      for (const subRow of group.querySelectorAll('.config-sub-option-row')) {
        const sv = subRow.querySelector('.config-value-input').value.trim();
        const sw = parseFloat(subRow.querySelector('.config-weight-input').value) || 0;
        if (sv) subOptions.push({ value: sv, weight: sw });
      }

      const opt = { value, weight };
      if (subOptions.length > 0) opt.subOptions = subOptions;
      if (value) options.push(opt);
    }

    if (label && options.length > 0) newConfig.push({ id, label, group, dice, note, options });
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

  const groupOrder = GROUPS.map(g => g.id);
  const sorted = [...cfg].sort((a, b) => {
    const ai = groupOrder.indexOf(a.group ?? '');
    const bi = groupOrder.indexOf(b.group ?? '');
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });

  let lastGroup = null;
  sorted.forEach(cat => {
    if (cat.group !== lastGroup) {
      const groupDef = GROUPS.find(g => g.id === cat.group);
      const header = document.createElement('div');
      header.className = 'config-group-header';
      header.textContent = groupDef ? groupDef.label : (cat.group || 'Other');
      container.appendChild(header);
      lastGroup = cat.group;
    }
    container.appendChild(buildCategoryCard(cat));
  });
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

  const groupSelect = document.createElement('select');
  groupSelect.className = 'config-group-select';
  GROUPS.forEach(g => {
    const opt = document.createElement('option');
    opt.value = g.id;
    opt.textContent = g.label;
    if (g.id === cat.group) opt.selected = true;
    groupSelect.appendChild(opt);
  });

  const removeBtn = document.createElement('button');
  removeBtn.className = 'config-remove-cat';
  removeBtn.textContent = 'Remove';
  removeBtn.onclick = () => card.remove();

  header.append(labelInput, groupSelect, diceInput, removeBtn);

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
  cat.options.forEach(opt => optionsList.appendChild(buildOptionGroup(opt, total)));

  optionsList.addEventListener('input', e => {
    if (e.target.closest('.config-sub-panel')) return;
    if (e.target.classList.contains('config-weight-input')) updateWeightBars(optionsList);
  });

  const addBtn = document.createElement('button');
  addBtn.className = 'config-add-option';
  addBtn.textContent = '+ Add option';
  addBtn.onclick = () => {
    optionsList.appendChild(buildOptionGroup({ value: '', weight: 1 }, 1));
    updateWeightBars(optionsList);
  };

  card.append(header, noteInput, colHeaders, optionsList, addBtn);
  return card;
}

function buildOptionGroup(opt, total) {
  const pct = total > 0 ? (opt.weight / total * 100) : 0;

  const group = document.createElement('div');
  group.className = 'config-option-group';

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

  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'config-toggle-sub';
  toggleBtn.title = 'Sub-options';

  const removeBtn = document.createElement('button');
  removeBtn.className = 'config-remove-option';
  removeBtn.textContent = '×';

  row.append(valueInput, weightInput, barWrap, toggleBtn, removeBtn);

  // Sub-options panel
  const subPanel = document.createElement('div');
  subPanel.className = 'config-sub-panel';
  const hasExisting = opt.subOptions && opt.subOptions.length > 0;
  subPanel.style.display = hasExisting ? '' : 'none';

  const subList = document.createElement('div');
  subList.className = 'config-sub-list';

  if (hasExisting) {
    const subTotal = opt.subOptions.reduce((s, o) => s + o.weight, 0);
    opt.subOptions.forEach(sub => subList.appendChild(buildSubOptionRow(sub, subTotal)));
  }

  subList.addEventListener('input', e => {
    if (e.target.classList.contains('config-weight-input')) updateSubWeightBars(subList);
  });

  const addSubBtn = document.createElement('button');
  addSubBtn.className = 'config-add-sub-option';
  addSubBtn.textContent = '+ Add sub-option';
  addSubBtn.onclick = () => {
    subList.appendChild(buildSubOptionRow({ value: '', weight: 1 }, 1));
    updateSubWeightBars(subList);
    syncToggleBtn(toggleBtn, subPanel, subList);
  };

  subPanel.append(subList, addSubBtn);
  group.append(row, subPanel);

  syncToggleBtn(toggleBtn, subPanel, subList);

  toggleBtn.onclick = () => {
    const isOpen = subPanel.style.display !== 'none';
    subPanel.style.display = isOpen ? 'none' : '';
    syncToggleBtn(toggleBtn, subPanel, subList);
  };

  removeBtn.onclick = () => {
    const list = group.parentElement;
    group.remove();
    if (list) updateWeightBars(list);
  };

  return group;
}

function buildSubOptionRow(sub, total) {
  const pct = total > 0 ? (sub.weight / total * 100) : 0;

  const row = document.createElement('div');
  row.className = 'config-sub-option-row';

  const valueInput = document.createElement('input');
  valueInput.className = 'config-value-input';
  valueInput.value = sub.value;
  valueInput.placeholder = 'Sub-option name';

  const weightInput = document.createElement('input');
  weightInput.className = 'config-weight-input';
  weightInput.type = 'number';
  weightInput.min = '0';
  weightInput.value = sub.weight;

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
    const subList  = row.parentElement;
    const subPanel = subList?.parentElement;
    const group    = subPanel?.parentElement;
    row.remove();
    if (subList) updateSubWeightBars(subList);
    if (group) syncToggleBtn(group.querySelector('.config-toggle-sub'), subPanel, subList);
  };

  row.append(valueInput, weightInput, barWrap, removeBtn);
  return row;
}

function syncToggleBtn(btn, subPanel, subList) {
  const count  = subList.querySelectorAll('.config-sub-option-row').length;
  const isOpen = subPanel.style.display !== 'none';
  btn.textContent = count > 0 ? (isOpen ? `▾ ${count}` : `▸ ${count}`) : (isOpen ? '▾' : '▸');
  btn.classList.toggle('has-sub', count > 0);
}

function updateWeightBars(optionsList) {
  const groups = optionsList.querySelectorAll('.config-option-group');
  let total = 0;
  groups.forEach(g => {
    total += parseFloat(g.querySelector('.config-option-row .config-weight-input').value) || 0;
  });
  groups.forEach(g => {
    const w   = parseFloat(g.querySelector('.config-option-row .config-weight-input').value) || 0;
    const pct = total > 0 ? (w / total * 100) : 0;
    g.querySelector('.config-option-row .config-weight-bar-fill').style.width = pct + '%';
  });
}

function updateSubWeightBars(subList) {
  const rows = subList.querySelectorAll('.config-sub-option-row');
  let total = 0;
  rows.forEach(r => total += parseFloat(r.querySelector('.config-weight-input').value) || 0);
  rows.forEach(r => {
    const w   = parseFloat(r.querySelector('.config-weight-input').value) || 0;
    const pct = total > 0 ? (w / total * 100) : 0;
    r.querySelector('.config-weight-bar-fill').style.width = pct + '%';
  });
}

function addCategory() {
  const container = document.getElementById('configUI');
  const newCat = { id: '', label: '', group: GROUPS[0].id, dice: 'd6', note: '', options: [{ value: '', weight: 1 }] };
  container.appendChild(buildCategoryCard(newCat));
}
