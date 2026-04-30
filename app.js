// ============================================================
//  D&D CHARACTER ROLLER — APP LOGIC
//  Edit config.js to change categories, options, and weights.
// ============================================================

let config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
let rollQueue = config.slice();
let currentIdx = 0;
let results = [];

function initRollQueue() {
  rollQueue = config.slice();
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

function rollOne() {
  if (currentIdx >= rollQueue.length) return;

  const cat = rollQueue[currentIdx];
  const picked = weightedRoll(cat.options);
  results.push({ cat: cat.label, value: picked.value, dice: cat.dice, note: cat.note, catIdx: currentIdx });

  if (!cat.isSub && picked.subOptions?.length > 0) {
    rollQueue.splice(currentIdx + 1, 0, {
      label: picked.value + ' subclass',
      dice: cat.dice,
      note: '',
      options: picked.subOptions,
      isSub: true
    });
  }

  animateResult(cat, picked);
  currentIdx++;
  renderList();
  updateProgress();
  document.getElementById('rerollBtn').style.display = '';

  if (currentIdx >= rollQueue.length) {
    setFinished();
  } else {
    document.getElementById('mainBtn').textContent = `Roll ${rollQueue[currentIdx].label} →`;
  }
}

function rollAll() {
  initRollQueue();
  results = [];
  let i = 0;
  while (i < rollQueue.length) {
    const cat = rollQueue[i];
    const picked = weightedRoll(cat.options);
    results.push({ cat: cat.label, value: picked.value, dice: cat.dice, note: cat.note, catIdx: i });
    if (!cat.isSub && picked.subOptions?.length > 0) {
      rollQueue.splice(i + 1, 0, {
        label: picked.value + ' subclass',
        dice: cat.dice,
        note: '',
        options: picked.subOptions,
        isSub: true
      });
    }
    i++;
  }
  currentIdx = rollQueue.length;
  document.getElementById('rerollBtn').style.display = '';

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

  // If a sub-entry was queued after this position but not yet rolled, remove it
  // so the fresh roll can insert an updated one if needed
  if (rollQueue[lastCatIdx + 1]?.isSub) {
    rollQueue.splice(lastCatIdx + 1, 1);
  }

  currentIdx = lastCatIdx;
  const cat = rollQueue[currentIdx];
  const picked = weightedRoll(cat.options);
  results.push({ cat: cat.label, value: picked.value, dice: cat.dice, note: cat.note, catIdx: currentIdx });

  if (!cat.isSub && picked.subOptions?.length > 0) {
    rollQueue.splice(currentIdx + 1, 0, {
      label: picked.value + ' subclass',
      dice: cat.dice,
      note: '',
      options: picked.subOptions,
      isSub: true
    });
  }

  currentIdx++;
  animateResult(cat, picked);
  renderList();
  updateProgress();

  if (currentIdx >= rollQueue.length) {
    setFinished();
  } else {
    document.getElementById('mainBtn').disabled = false;
    document.getElementById('mainBtn').textContent = `Roll ${rollQueue[currentIdx].label} →`;
    document.getElementById('allBtn').style.display = 'none';
    document.getElementById('resetBtn').style.display = '';
  }
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

  // Remove excess nodes (reroll shrunk the results array)
  while (list.children.length > results.length) {
    list.removeChild(list.lastChild);
  }

  results.forEach((r, i) => {
    if (i < list.children.length) {
      // Node already exists — update text in place if it changed (reroll case)
      const node = list.children[i];
      const catSpan = node.querySelector('.roll-item-cat');
      const valSpan = node.querySelector('.roll-item-val');
      if (catSpan.textContent !== r.cat || valSpan.textContent !== r.value) {
        catSpan.textContent = r.cat;
        valSpan.textContent = r.value;
        node.classList.remove('pop-in');
        void node.offsetWidth;
        node.classList.add('pop-in');
      }
    } else {
      // New result — append with animation
      const div = document.createElement('div');
      div.className = 'roll-item pop-in';
      div.innerHTML = `<span class="roll-item-cat">${r.cat}</span><span class="roll-item-val">${r.value}</span>`;
      list.appendChild(div);
    }
  });
}

function updateProgress() {
  const el = document.getElementById('progress');
  el.textContent = currentIdx > 0
    ? `${currentIdx} of ${rollQueue.length} rolled`
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
  initRollQueue();

  document.getElementById('catLabel').textContent = 'Ready to roll';
  document.getElementById('resultVal').textContent = '—';
  document.getElementById('resultSub').textContent = '';
  document.getElementById('diceBadge').textContent = '';
  document.getElementById('rollsList').innerHTML = '';
  document.getElementById('mainBtn').textContent = 'Start rolling';
  document.getElementById('mainBtn').disabled = false;
  document.getElementById('allBtn').style.display = '';
  document.getElementById('rerollBtn').style.display = 'none';
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
  const newCat = { id: '', label: '', dice: 'd6', note: '', options: [{ value: '', weight: 1 }] };
  container.appendChild(buildCategoryCard(newCat));
}
