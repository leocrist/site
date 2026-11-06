// Tiny HTML-string helpers. `html` escapes interpolations; nest with `html` or wrap with `raw`.

class Raw {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}

export const raw = (s) => new Raw(String(s ?? ''));

export const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

const fmt = (v) => {
  if (v == null || v === false || v === true) return '';
  if (v instanceof Raw) return v.s;
  if (Array.isArray(v)) return v.map(fmt).join('');
  return esc(v);
};

// Booleans vanish in text (so `${cond && html`…`}` works) but print as "true"/"false" inside an attribute value (aria-pressed="${on}").
export const html = (strings, ...vals) =>
  raw(strings.reduce((out, s, i) => {
    if (i >= vals.length) return out + s;
    const v = vals[i];
    return out + s + (typeof v === 'boolean' && /=["']$/.test(s) ? String(v) : fmt(v));
  }, ''));

/** Normalise doc copy for display: dashes used as pauses become commas, whitespace collapses. */
export const txt = (s) =>
  String(s ?? '')
    .replace(/\s+[—–]\s+/g, ', ')
    .replace(/[—–]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();

export const icon = (name, label) =>
  label
    ? html`<i class="ph-light ph-${name}" role="img" aria-label="${label}"></i>`
    : html`<i class="ph-light ph-${name}" aria-hidden="true"></i>`;
