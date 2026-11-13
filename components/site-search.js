const siteSearchForm = document.querySelector('[data-site-search]');
if (siteSearchForm) {
  const searchInput = siteSearchForm.querySelector('input[name="q"]');
  const searchStatus = document.getElementById('insightsSearchStatus');
  const resultCards = Array.from(document.querySelectorAll('.insights-grid .insight-card'));
  const query = new URLSearchParams(window.location.search).get('q') || '';
  searchInput.value = query;

  const renderResults = () => {
    const term = searchInput.value.trim().toLocaleLowerCase();
    let visibleCount = 0;
    resultCards.forEach((card) => {
      const matches = !term || card.textContent.toLocaleLowerCase().includes(term);
      card.hidden = !matches;
      if (matches) visibleCount += 1;
    });
    searchStatus.textContent = term
      ? `${visibleCount} ${visibleCount === 1 ? 'insight theme' : 'insight themes'} match “${searchInput.value.trim()}”.`
      : `${visibleCount} insight themes available.`;
  };

  siteSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const parameters = new URLSearchParams();
    const term = searchInput.value.trim();
    if (term) parameters.set('q', term);
    window.location.assign(`${siteSearchForm.action}${parameters.toString() ? `?${parameters.toString()}` : ''}`);
  });
  renderResults();
}
