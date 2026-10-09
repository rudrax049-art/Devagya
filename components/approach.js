const nodeGrid = document.querySelector('.node-grid');
if (nodeGrid) {
  for (let index = 0; index < 45; index += 1) {
    const node = document.createElement('span');
    node.className = 'node';
    node.textContent = String(index + 1).padStart(2, '0');
    node.title = `Classical 45-zone grid reference ${index + 1}`;
    node.setAttribute('aria-label', `Classical 45-zone grid reference ${index + 1}`);
    nodeGrid.appendChild(node);
  }
}

const beforeButton = document.getElementById('beforeButton');
const afterButton = document.getElementById('afterButton');
const floorPlan = document.getElementById('floorPlan');
const planCaption = document.getElementById('planCaption');

function setPlanView(showOptimizedPlan) {
  if (!floorPlan || !beforeButton || !afterButton || !planCaption) return;
  floorPlan.classList.toggle('is-after', showOptimizedPlan);
  floorPlan.classList.toggle('is-before', !showOptimizedPlan);
  floorPlan.setAttribute('aria-label', showOptimizedPlan
    ? 'After plan illustration with a clearer entry sequence and circulation'
    : 'Before plan illustration with constrained entrance circulation');
  beforeButton.setAttribute('aria-pressed', String(!showOptimizedPlan));
  afterButton.setAttribute('aria-pressed', String(showOptimizedPlan));
  planCaption.textContent = showOptimizedPlan
    ? 'After: a light-touch boundary and furniture adjustment creates a clearer arrival zone and less interrupted route through the shared space.'
    : 'Before: the entry opens directly into a busy circulation path, creating a tight turn and reducing clear arrival space.';
}

if (beforeButton) beforeButton.addEventListener('click', () => setPlanView(false));
if (afterButton) afterButton.addEventListener('click', () => setPlanView(true));
