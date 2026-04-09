const fs = require('fs');
let s = fs.readFileSync('client/src/SemanaCeroPage.css', 'utf8');

const regex = /\.scp-apoyo-filters\s*\{[\s\S]*?\.scp-apoyo-filter-btn\.active\s*\{[^}]*\}/;
s = s.replace(regex, `.scp-apoyo-select-wrap {
  position: relative;
  width: 100%;
  max-width: 400px;
}
.scp-apoyo-select {
  appearance: none;
  width: 100%;
  background: var(--scp-surface);
  border: 1px solid var(--scp-border-ui);
  border-radius: 99px;
  padding: 0.7rem 2.8rem 0.7rem 1.4rem;
  font-size: 0.95rem;
  color: var(--text-primary);
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  box-shadow: inset 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}
.scp-apoyo-select:focus {
  outline: none;
  border-color: var(--scp-accent);
  box-shadow: 0 0 0 3px var(--scp-accent-glow);
}
.scp-apoyo-select-ic {
  position: absolute;
  right: 1.2rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-secondary);
}`);

const regexLight = /\[data-theme='light'\]\s*\.scp-apoyo-filter-btn\s*\{[\s\S]*?\[data-theme='light'\]\s*\.scp-apoyo-filter-btn\.active\s*\{[^}]*\}/;
s = s.replace(regexLight, `[data-theme='light'] .scp-apoyo-select {
  background: #ffffff;
  color: #064e3b;
  border-color: rgba(4, 120, 87, 0.25);
}
[data-theme='light'] .scp-apoyo-select:focus {
  border-color: rgba(0, 153, 109, 0.6);
  box-shadow: 0 0 0 3px rgba(0, 153, 109, 0.15);
}`);

const regexMobile = /\.scp-apoyo-filters\s*\{[\s\S]*?\.scp-apoyo-filter-btn\s*\{[^}]*\}/;
s = s.replace(regexMobile, `.scp-apoyo-select-wrap {
    max-width: 100%;
  }
  .scp-apoyo-select {
    padding: 0.65rem 2.5rem 0.65rem 1.25rem;
    font-size: 0.9rem;
  }`);

fs.writeFileSync('client/src/SemanaCeroPage.css', s);
