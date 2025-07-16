document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['usage'], (result) => {
    const usage = result.usage || {};
    const report = document.getElementById('report');
    report.innerHTML = '';

    for (const site in usage) {
      const minutes = (usage[site] / 60).toFixed(2);
      const p = document.createElement('p');
      p.textContent = `${site} → ${minutes} mins`;
      report.appendChild(p);
    }
  });
});
