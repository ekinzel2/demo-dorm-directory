async function loadDorms() {
  const res = await fetch('example-data.json');
  const json = await res.json();
  const headers = json.data.dorms.headers;
  const rows = json.data.dorms.rows;

  const dorms = rows.map(r => {
    const obj = {};
    headers.forEach((h, i) => (obj[h] = r[i]));
    return obj;
  });

  return dorms;
}

function renderGrid(dorms) {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  dorms.forEach(d => {
    const card = document.createElement('div');
    card.className = 'bg-white p-4 rounded shadow';
    card.innerHTML = `
      <h2 class="font-semibold text-lg">${d.Name}</h2>
      <div class="text-sm text-gray-600">${d.Quad} • ${d.Sex}</div>
      <div class="mt-2 text-sm">
        <div><strong>Capacity:</strong> ${d.Capacity}</div>
        <div><strong>Colors:</strong> ${d.Colors}</div>
        <div><strong>Mascot:</strong> ${d.Mascot}</div>
        ${d.Notes ? `<div class="text-xs text-gray-500 mt-1">${d.Notes}</div>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });
}

function setupFilters(dorms) {
  const sexSelect = document.getElementById('sexFilter');
  const quadSelect = document.getElementById('quadFilter');
  const searchInput = document.getElementById('search');
  const clearBtn = document.getElementById('clear');

  const sexes = Array.from(new Set(dorms.map(d => d.Sex))).sort();
  sexes.forEach(s => {
    const o = document.createElement('option'); o.value = s; o.textContent = s; sexSelect.appendChild(o);
  });

  const quads = Array.from(new Set(dorms.map(d => d.Quad))).sort();
  quads.forEach(q => {
    const o = document.createElement('option'); o.value = q; o.textContent = q; quadSelect.appendChild(o);
  });

  function apply() {
    const q = quadSelect.value;
    const s = sexSelect.value;
    const term = searchInput.value.trim().toLowerCase();

    const filtered = dorms.filter(d => {
      if (s !== 'All' && d.Sex !== s) return false;
      if (q !== 'All' && d.Quad !== q) return false;
      if (term && !d.Name.toLowerCase().includes(term)) return false;
      return true;
    });
    renderGrid(filtered);
  }

  sexSelect.addEventListener('change', apply);
  quadSelect.addEventListener('change', apply);
  searchInput.addEventListener('input', apply);
  clearBtn.addEventListener('click', () => {
    sexSelect.value = 'All';
    quadSelect.value = 'All';
    searchInput.value = '';
    renderGrid(dorms);
  });
}

async function init() {
  const dorms = await loadDorms();
  setupFilters(dorms);
  renderGrid(dorms);
}

init().catch(err => console.error(err));
