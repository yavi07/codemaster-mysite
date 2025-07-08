export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const wall = document.createElement('div');
  wall.className = 'badge-wall';

  rows.forEach((row) => {
    const cols = row.children;
    const img = cols[0].querySelector('picture') || document.createElement('div');
    const text = cols[1].textContent.trim();

    const [title, desc] = text.split('  ');

    // ✅ Use alt text as badge ID, fallback to first word of title
    const imgEl = img.querySelector('img');
    const alt = imgEl?.getAttribute('alt') || '';
    const match = alt.match(/badge:(\w+)/i);
    const badgeId = match ? match[1].toLowerCase() : title?.toLowerCase().split(' ')[0];

    const badge = document.createElement('div');
    badge.className = 'badge';

    if (sessionStorage.getItem(`badge-${badgeId}`) === 'earned') {
      badge.classList.add('earned');
    }

    badge.innerHTML = `
      <div class="badge-image">${img.outerHTML}</div>
      <div class="badge-text">
        <div class="badge-title">${title}</div>
        <div class="badge-desc">${desc}</div>
      </div>
    `;

    wall.appendChild(badge);
  });

  block.appendChild(wall);
}
