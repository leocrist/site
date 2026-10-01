// Form rules taken from the "Ready to Apply Form" table (Career Detail Layout.md)
// and the Contact notes in Website Structure.md.

export const MSG = {
  required: 'This field is required',
  url: 'Please provide the correct URL',
  pdf: 'Only PDF file is accepted',
  email: 'Enter an email like name@company.com',
  tech: 'Pick at least one technology',
};

const blank = (v) => v == null || (typeof v === 'string' && !v.trim());
const LINKEDIN = /^https?:\/\/([a-z]{2,3}\.)?linkedin\.com\/.+/i;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateApply(v = {}) {
  const e = {};
  for (const k of ['firstName', 'lastName', 'email', 'location']) if (blank(v[k])) e[k] = MSG.required;
  if (!blank(v.linkedin) && !LINKEDIN.test(v.linkedin.trim())) e.linkedin = MSG.url;
  if (!v.resume || !v.resume.name) e.resume = MSG.required;
  else if (!(v.resume.type === 'application/pdf' || /\.pdf$/i.test(v.resume.name))) e.resume = MSG.pdf;
  if (v.aiAck !== 'yes' && v.aiAck !== 'no') e.aiAck = MSG.required;
  if (blank(v.gender)) e.gender = MSG.required;
  return e;
}

export function validateContactStep(step, v = {}) {
  const e = {};
  if (step === 1 && blank(v.need)) e.need = MSG.required;
  if (step === 2) {
    if (blank(v.teamSize)) e.teamSize = MSG.required;
    if (!Array.isArray(v.tech) || v.tech.length === 0) e.tech = MSG.tech;
  }
  if (step === 3) {
    for (const k of ['name', 'email', 'company']) if (blank(v[k])) e[k] = MSG.required;
    if (!e.email && !EMAIL.test(v.email.trim())) e.email = MSG.email;
  }
  return e;
}
