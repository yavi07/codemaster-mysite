export default function decorate(block) {
  const rows = [...block.children];
  block.innerHTML = '';

  const wall = document.createElement('div');
  wall.className = 'badge-wall';

  rows.forEach((row) => {
    const cols = row.children;
    const img = cols[0].querySelector('picture') || document.createElement('div');
    const text = cols[1].textContent.trim();

    // Extract badge key from text (assumes format: "React Badge  You Have Mastered React!")
    const [title, desc] = text.split('  ');
    const badgeId = title.toLowerCase().split(' ')[0]; // e.g., "react"

    const badge = document.createElement('div');
    badge.className = 'badge';

    if (localStorage.getItem(`badge-${badgeId}`) === 'earned') {
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
