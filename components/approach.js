const devtaReferenceGrid = document.getElementById('devtaReferenceGrid');
if (devtaReferenceGrid) {
  (window.devagyaVastuDevtaGroups || []).forEach((group) => {
    const article = document.createElement('article');
    article.className = `devta-reference-group devta-reference-group-${group.id}`;
    const heading = document.createElement('h3');
    heading.textContent = group.label;
    const list = document.createElement('ul');
    group.devtas.forEach((name) => {
      const item = document.createElement('li');
      item.textContent = name;
      list.appendChild(item);
    });
    article.append(heading, list);
    devtaReferenceGrid.appendChild(article);
  });
}
