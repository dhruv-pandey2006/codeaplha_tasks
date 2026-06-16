const display = document.querySelector('.display');
const buttons = Array.from(document.querySelectorAll('.btn'));

let input = '';

function sanitize(expr) {
  return expr.replace(/×/g, '*').replace(/÷/g, '/');
}

function safeEval(expr) {
  const s = sanitize(expr);
  if (!/^[0-9+\-*/.() %]+$/.test(s)) return null;
  try {
    // eslint-disable-next-line no-new-func
    const result = Function('return (' + s + ')')();
    if (result === Infinity || result === -Infinity || Number.isNaN(result)) return null;
    return result;
  } catch (e) {
    return null;
  }
}

function updateDisplay() {
  const hasOperator = /[+\-×÷*/]/.test(input);
  let main = input || '0';
  if (hasOperator) {
    const parts = input.split(/([+\-×÷*/])/);
    main = parts[parts.length - 1] || '0';
  }
  let previewHtml = '';
  const endsWithOperator = /[+\-×÷*/]$/.test(input);
  if (hasOperator && !endsWithOperator) {
    const preview = safeEval(input);
    if (preview !== null) previewHtml = `<span class="preview"> = ${preview}</span>`;
  }
  display.innerHTML = `<span class="current">${main}</span>` + previewHtml;
}
function appendValue(val) {
  if (val === '.' ) {
    const last = input.split(/[-+×÷*/]/).pop();
    if (last.includes('.')) return;
  }
  if (/[-+×÷*/]$/.test(input) && /[-+×÷*/]/.test(val)) {
    input = input.slice(0, -1) + val;
  } else {
    input += val;
  }
  updateDisplay();
}
function clearAll() {
  input = '';
  updateDisplay();
}

function backspace() {
  input = input.slice(0, -1);
  updateDisplay();
}

function evaluateNow() {
  const result = safeEval(input);
  if (result === null) return;
  input = String(result);
  updateDisplay();
}
// Attach button handlers
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    // prefer explicit data attributes
    const dataVal = btn.dataset.value;
    const action = btn.dataset.action;
    let val = dataVal ?? null;
    if (!val && action) {
      if (action === 'clear') return clearAll();
      if (action === 'equals') return evaluateNow();
      if (action === 'divide') val = '÷';
      if (action === 'multiply') val = '×';
      if (action === 'add') val = '+';
      if (action === 'subtract') val = '-';
    }
    // fallback to button text
    if (!val) val = btn.textContent.trim();

    if (val === '⌫' || val === 'Back') return backspace();
    appendValue(val);
  });
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  const k = e.key;
  if ((/^[0-9]$/).test(k)) { appendValue(k); return; }
  if (k === '.') { appendValue('.'); return; }
  if (k === 'Enter') { evaluateNow(); return; }
  if (k === 'Backspace') { backspace(); return; }
  if (k === 'Escape') { clearAll(); return; }
  if (k === '+' || k === '-') { appendValue(k); return; }
  if (k === '*') { appendValue('×'); return; }
  if (k === '/') { appendValue('÷'); return; }
});

updateDisplay();
