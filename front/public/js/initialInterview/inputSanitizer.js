// ----------------------------------------------------------------------------
// --------------------------- GLOBAL INPUT SANITIZER --------------------------
// Applies to every text input/textarea across the whole initial interview
// (all phases/sections, including rows added dynamically): strips emojis and
// invisible characters, enforces the field's declared maxlength, and trims
// values left as only whitespace. Also clamps ".schooling-years" number
// inputs to the 0-30 range.

(function () {
  const CONTROL_CHARS = '\\u0000-\\u001F\\u007F-\\u009F';
  const INVISIBLE_CHARS = '\\u200B-\\u200F\\u202A-\\u202E\\u2060\\uFEFF';
  const INVISIBLE_RE = new RegExp(`[${CONTROL_CHARS}${INVISIBLE_CHARS}]`, 'gu');
  const EMOJI_RE = /\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Regional_Indicator}|\u{1F3FB}|\u{1F3FC}|\u{1F3FD}|\u{1F3FE}|\u{1F3FF}|\u{FE0F}|\u{20E3}|\u{200D}/gu;

  const SCHOOLING_MAX = 30;

  // Date pickers (flatpickr) manage their own input value; leave them alone
  function isSanitizableText (el) {
    if (el.tagName === 'TEXTAREA') return true;
    return el.tagName === 'INPUT' && el.type === 'text' && !el._flatpickr;
  }

  function sanitizeText (el) {
    const limit = el.maxLength > 0 ? el.maxLength : null;
    let { value } = el;

    value = value.replace(EMOJI_RE, '').replace(INVISIBLE_RE, '');
    if (limit) value = value.slice(0, limit);

    if (value !== el.value) el.value = value;
  }

  function clampSchoolingYears (el) {
    if (el.value === '') return;

    const num = Number(el.value);
    if (isNaN(num)) return;

    if (num > SCHOOLING_MAX) el.value = SCHOOLING_MAX;
  }

  document.addEventListener('input', (e) => {
    const el = e.target;

    if (isSanitizableText(el)) sanitizeText(el);
    else if (el.matches('input[type="number"].schooling-years')) clampSchoolingYears(el);
  });

  // A field full of spaces looks "filled" but is effectively empty
  document.addEventListener('blur', (e) => {
    const el = e.target;
    if (!isSanitizableText(el)) return;

    const trimmed = el.value.trim();
    if (trimmed !== el.value) el.value = trimmed;
  }, true);
})();
