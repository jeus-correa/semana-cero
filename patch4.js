const fs = require('fs');
let s = fs.readFileSync('client/src/SemanaCeroPage.css', 'utf8');

const cssToAdd = `
.scp-apoyo-pdf-text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  flex: 1;
}

.scp-apoyo-cat-badge {
  display: inline-block;
  margin-top: 0.2rem;
  padding: 0.3rem 0.65rem;
  background: var(--scp-bg);
  border: 1px solid var(--scp-border-ui);
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  width: fit-content;
}

[data-theme='light'] .scp-apoyo-cat-badge {
  background: rgba(4, 120, 87, 0.06);
  border-color: rgba(4, 120, 87, 0.15);
  color: #056a42;
}
`;

fs.writeFileSync('client/src/SemanaCeroPage.css', s + '\n' + cssToAdd);
