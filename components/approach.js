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
