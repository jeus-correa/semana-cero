const fs = require('fs');
let s = fs.readFileSync('client/src/SemanaCeroPage.css', 'utf8');

// Replace standard select wrap back to horizontal scroll filter btn
const selectRegex = /\.scp-apoyo-select-wrap\s*\{[\s\S]*?\.scp-apoyo-select-ic\s*\{[^}]*\}/;
const newBtnCss = `.scp-apoyo-filters {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}
.scp-apoyo-filters::-webkit-scrollbar {
  display: none;
}

.scp-apoyo-filter-btn {
  background: var(--scp-surface);
  border: 1px solid var(--scp-border-ui);
  color: var(--text-secondary);
  padding: 0.6rem 1.4rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s ease;
  flex-shrink: 0;
  white-space: nowrap;
}

.scp-apoyo-filter-btn:hover {
  border-color: var(--scp-accent);
  color: var(--text-primary);
  background: var(--scp-surface-hover);
}

.scp-apoyo-filter-btn.active {
  background: var(--scp-accent);
  color: #fff;
  border-color: var(--scp-accent-bright);
  box-shadow: 0 4px 14px var(--scp-accent-glow);
}`;
s = s.replace(selectRegex, newBtnCss);

// Replace light theme select back to light theme btn
const selectLightRegex = /\[data-theme='light'\]\s*\.scp-apoyo-select\s*\{[\s\S]*?\[data-theme='light'\]\s*\.scp-apoyo-select:focus\s*\{[^}]*\}/;
const newLightBtnCss = `[data-theme='light'] .scp-apoyo-filter-btn {
  background: #ffffff;
  color: #064e3b;
  border-color: rgba(4, 120, 87, 0.2);
}

[data-theme='light'] .scp-apoyo-filter-btn:hover {
  background: rgba(218, 243, 232, 0.8);
  border-color: var(--scp-accent);
}

[data-theme='light'] .scp-apoyo-filter-btn.active {
  background: var(--scp-accent);
  color: #fff !important;
  border-color: var(--scp-accent);
  box-shadow: 0 4px 15px rgba(0, 153, 109, 0.25);
}`;
s = s.replace(selectLightRegex, newLightBtnCss);

// Replace mobile media query select back to btn
const selectMobileRegex = /\.scp-apoyo-select-wrap\s*\{[\s\S]*?\.scp-apoyo-select\s*\{[^}]*\}/;
const newMobileBtnCss = `.scp-apoyo-filters {
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }
  .scp-apoyo-filter-btn {
    padding: 0.55rem 1rem;
    font-size: 0.8rem;
  }`;
s = s.replace(selectMobileRegex, newMobileBtnCss);

fs.writeFileSync('client/src/SemanaCeroPage.css', s);
