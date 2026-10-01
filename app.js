// Painel Estratégico de Protocolados - DPE/PA Belém

// 1. Controle de Navegação por Abas
function switchTab(tabId) {
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
  
  const activeBtn = Array.from(document.querySelectorAll('.tab-btn')).find(b => {
    const attr = b.getAttribute('onclick');
    return attr && attr.includes(tabId);
  });
  if (activeBtn) activeBtn.classList.add('active');
  
  const targetPanel = document.getElementById(tabId);
  if (targetPanel) targetPanel.classList.add('active');
}

// 2. Renderização do Núcleo de Família (Servidores)
function renderFamiliaServidores() {
  const famData = DADOS_PROTOCOLADOS.filter(d => d.nucleo === 'Núcleo de Família / NAEFA');
  const counts = {};
  famData.forEach(d => {
    counts[d.assessor] = (counts[d.assessor] || 0) + 1;
  });

  const sorted = Object.entries(counts).sort((a,b) => b[1] - a[1]);
  const tbody = document.getElementById('tbody-familia-servidores');
  if (!tbody) return;
  tbody.innerHTML = '';

  sorted.forEach(([name, count], idx) => {
    const pct = ((count / famData.length) * 100).toFixed(1);
    const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-default';
    tbody.innerHTML += `
      <tr>
        <td><span class="badge-rank ${rankClass}">${idx + 1}</span></td>
        <td><strong>${name}</strong></td>
        <td><strong style="color: #60A5FA;">${count}</strong></td>
        <td>${pct}%</td>
        <td style="width: 200px;">
          <div class="bar-wrapper">
            <div class="bar-bg"><div class="bar-fill" style="width: ${pct}%; background: var(--familia);"></div></div>
          </div>
        </td>
      </tr>
    `;
  });
}

// 3. Renderização do Ranking Geral de Belém & Núcleos
function renderGeralData() {
  // A. Núcleos
  const nucleoMap = {};
  DADOS_PROTOCOLADOS.forEach(d => {
    if (!nucleoMap[d.nucleo]) {
      nucleoMap[d.nucleo] = { total: 0, familia: 0, civel: 0, crim: 0, servidores: new Set() };
    }
    nucleoMap[d.nucleo].total++;
    nucleoMap[d.nucleo].servidores.add(d.assessor);
    if (d.materia === 'FAMÍLIA') nucleoMap[d.nucleo].familia++;
    else if (d.materia === 'CÍVEL') nucleoMap[d.nucleo].civel++;
    else nucleoMap[d.nucleo].crim++;
  });

  const sortedNucleos = Object.entries(nucleoMap).sort((a,b) => b[1].total - a[1].total);
  const tbodyN = document.getElementById('tbody-nucleos');
  if (tbodyN) {
    tbodyN.innerHTML = '';
    sortedNucleos.forEach(([name, obj], idx) => {
      const servCount = obj.servidores.size;
      const avg = (obj.total / servCount).toFixed(1);
      const isNies = name.includes('NIES');
      const badgeHighlight = isNies ? 'style="background: rgba(99, 102, 241, 0.15); border-left: 4px solid var(--primary-light);"' : '';
      
      tbodyN.innerHTML += `
        <tr ${badgeHighlight}>
          <td><strong>${idx + 1}</strong></td>
          <td><strong>${name}</strong> ${isNies ? '<span class="badge badge-civel">Destaque</span>' : ''}</td>
          <td><strong style="font-size: 15px; color: #60A5FA;">${obj.total}</strong></td>
          <td>${servCount}</td>
          <td><strong style="color: ${isNies ? '#34D399' : '#FFFFFF'};">${avg}</strong></td>
          <td><span class="badge badge-familia">${obj.familia}</span></td>
          <td><span class="badge badge-civel">${obj.civel}</span></td>
          <td style="width: 180px;">
            <div class="bar-wrapper">
              <div class="bar-bg"><div class="bar-fill" style="width: ${(obj.total / 194 * 100)}%;"></div></div>
            </div>
          </td>
        </tr>
      `;
    });
  }

  // B. Servidores
  const sMap = {};
  DADOS_PROTOCOLADOS.forEach(d => {
    if (!sMap[d.assessor]) {
      sMap[d.assessor] = { count: 0, nucleos: new Set() };
    }
    sMap[d.assessor].count++;
    sMap[d.assessor].nucleos.add(d.nucleo);
  });

  const sortedS = Object.entries(sMap).sort((a,b) => b[1].count - a[1].count);
  window.ALL_SERVIDORES = sortedS;
  renderServidoresTable(sortedS);
}

function renderServidoresTable(list) {
  const tbody = document.getElementById('tbody-geral-servidores');
  if (!tbody) return;
  tbody.innerHTML = '';
  list.forEach(([name, obj], idx) => {
    const rankClass = idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'rank-default';
    const isNies = Array.from(obj.nucleos).some(n => n.includes('NIES'));
    const niesTag = isNies ? '<span class="badge badge-civel" style="margin-left: 6px;">NIES</span>' : '';
    const pct = ((obj.count / DADOS_PROTOCOLADOS.length) * 100).toFixed(1);

    tbody.innerHTML += `
      <tr>
        <td><span class="badge-rank ${rankClass}">${idx + 1}</span></td>
        <td><strong>${name}</strong> ${niesTag}</td>
        <td style="color: var(--text-muted); font-size: 12.5px;">${Array.from(obj.nucleos).join(', ')}</td>
        <td><strong style="color: #60A5FA; font-size: 15px;">${obj.count}</strong></td>
        <td>${pct}%</td>
        <td style="width: 180px;">
          <div class="bar-wrapper">
            <div class="bar-bg"><div class="bar-fill" style="width: ${(obj.count / 120 * 100)}%; background: ${isNies ? 'var(--primary-light)' : 'var(--primary)'};"></div></div>
          </div>
        </td>
      </tr>
    `;
  });
}

function filterServidores() {
  const q = document.getElementById('searchServidor').value.toLowerCase();
  const filtered = window.ALL_SERVIDORES.filter(([name, obj]) => {
    return name.toLowerCase().includes(q) || Array.from(obj.nucleos).some(n => n.toLowerCase().includes(q));
  });
  renderServidoresTable(filtered);
}

// 4. Comparador Interativo Dinâmico
function setupComparador() {
  const select = document.getElementById('compareSelect');
  if (!select) return;
  select.innerHTML = '';
  
  const nucleos = [...new Set(DADOS_PROTOCOLADOS.map(d => d.nucleo))].filter(n => !n.includes('NIES'));
  nucleos.forEach(n => {
    const opt = document.createElement('option');
    opt.value = n;
    opt.textContent = n;
    select.appendChild(opt);
  });

  updateComparison();
}

function updateComparison() {
  const select = document.getElementById('compareSelect');
  if (!select) return;
  const selected = select.value;
  const tData = DADOS_PROTOCOLADOS.filter(d => d.nucleo === selected);
  
  const total = tData.length;
  const servidores = [...new Set(tData.map(d => d.assessor))];
  const servCount = servidores.length;
  const avg = servCount > 0 ? (total / servCount).toFixed(1) : 0;
  
  const famCount = tData.filter(d => d.materia === 'FAMÍLIA').length;
  const civCount = tData.filter(d => d.materia === 'CÍVEL').length;
  const crimCount = tData.filter(d => d.materia === 'CRIMINAL').length;

  const actMap = {};
  tData.forEach(d => actMap[d.acao] = (actMap[d.acao] || 0) + 1);
  const topActions = Object.entries(actMap).sort((a,b) => b[1] - a[1]).slice(0, 5);

  const sMap = {};
  tData.forEach(d => sMap[d.assessor] = (sMap[d.assessor] || 0) + 1);
  const topServers = Object.entries(sMap).sort((a,b) => b[1] - a[1]).slice(0, 4);

  const targetCard = document.getElementById('targetCompareCard');
  if (targetCard) {
    targetCard.innerHTML = `
      <span class="side-badge target-badge">Núcleo Comparado</span>
      <h2 style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin-bottom: 4px;">${selected}</h2>
      <p style="color: var(--text-muted); font-size: 13px; margin-bottom: 20px;">Dados consolidados de setembro/2026</p>

      <div class="grid-kpis" style="grid-template-columns: 1fr 1fr; margin-bottom: 16px;">
        <div class="card-kpi" style="padding: 14px;">
          <div class="kpi-label">Total Ações</div>
          <div class="kpi-value" style="font-size: 24px;">${total}</div>
        </div>
        <div class="card-kpi" style="padding: 14px;">
          <div class="kpi-label">Servidores</div>
          <div class="kpi-value" style="font-size: 24px;">${servCount}</div>
        </div>
        <div class="card-kpi" style="padding: 14px;">
          <div class="kpi-label">Média p/ Servidor</div>
          <div class="kpi-value" style="font-size: 24px; color: var(--warning);">${avg}</div>
        </div>
        <div class="card-kpi" style="padding: 14px;">
          <div class="kpi-label">Divisão Matéria</div>
          <div style="font-size: 13px; font-weight: 700; margin-top: 6px;">
            <span style="color: var(--familia);">${famCount} Família</span><br>
            <span style="color: var(--civel);">${civCount} Cível</span>
            ${crimCount > 0 ? `<br><span style="color: var(--crim);">${crimCount} Criminal</span>` : ''}
          </div>
        </div>
      </div>

      <div style="font-size: 14px; font-weight: 700; margin: 16px 0 8px; color: #FFFFFF;">Principais Servidores:</div>
      <div style="font-size: 13px; line-height: 1.8; color: var(--text-muted); margin-bottom: 14px;">
        ${topServers.map(([s, c]) => `• <strong>${s}:</strong> ${c} protocolados`).join('<br>')}
      </div>

      <div style="font-size: 14px; font-weight: 700; margin: 16px 0 8px; color: #FFFFFF;">Top Ações Deste Núcleo:</div>
      <div style="font-size: 13px; line-height: 1.8; color: var(--text-muted);">
        ${topActions.map(([a, c]) => `• <strong>${c}x</strong> ${a}`).join('<br>')}
      </div>
    `;
  }

  const niesAvg = 24.3;
  const targetAvgNum = parseFloat(avg);
  const ratio = targetAvgNum > 0 ? (niesAvg / targetAvgNum).toFixed(1) : 'N/A';
  
  let diffHtml = `
    <p>• <strong>Produtividade Média por Servidor:</strong> No <strong>NIES</strong>, a média é de <span class="diff-highlight">24,3 protocolados por assessor</span>, enquanto no <strong>${selected}</strong> a média é de <span class="diff-highlight">${avg} protocolados por servidor</span>. `;
  
  if (targetAvgNum < niesAvg) {
    diffHtml += `A produtividade média do NIES é <strong>${ratio}x maior</strong>.</p>`;
  } else {
    diffHtml += `O volume médio é equilibrado.</p>`;
  }

  diffHtml += `<p style="margin-top: 8px;">• <strong>Equilíbrio de Matérias:</strong> O NIES possui perfil balanceado entre matéria de Família (<strong>49,3%</strong>) e Cível (<strong>50,7%</strong>, com Interdição no Cível). Já o <strong>${selected}</strong> possui foco predominante em <strong>${famCount > civCount ? 'Família (' + ((famCount/total)*100).toFixed(1) + '%)' : 'Cível (' + ((civCount/total)*100).toFixed(1) + '%)'}</strong>.</p>`;

  const diffContainer = document.getElementById('diffTextContainer');
  if (diffContainer) diffContainer.innerHTML = diffHtml;
}

// 5. Consulta de Processos e Paginação
let currentPage = 1;
const pageSize = 15;
let filteredList = typeof DADOS_PROTOCOLADOS !== 'undefined' ? DADOS_PROTOCOLADOS : [];

function renderProcessos() {
  const tbody = document.getElementById('tbody-processos');
  if (!tbody) return;
  tbody.innerHTML = '';
  
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pageSlice = filteredList.slice(start, end);

  pageSlice.forEach(d => {
    const matBadge = d.materia === 'FAMÍLIA' ? 'badge-familia' : d.materia === 'CÍVEL' ? 'badge-civel' : 'badge-crim';
    tbody.innerHTML += `
      <tr>
        <td style="font-size: 12px; color: var(--text-light); white-space: nowrap;">${d.data.substring(0, 10)}</td>
        <td style="font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: #93C5FD;">${d.processo}</td>
        <td style="font-size: 12.5px;">${d.defensoria}</td>
        <td style="font-size: 13px;"><strong>${d.acao}</strong></td>
        <td><span class="badge ${matBadge}">${d.materia}</span></td>
        <td><strong>${d.assessor}</strong></td>
        <td style="font-size: 12px; color: var(--text-muted);">${d.defensor}</td>
      </tr>
    `;
  });

  const countSpan = document.getElementById('processosCount');
  if (countSpan) {
    countSpan.textContent = `Exibindo ${start + 1} a ${Math.min(end, filteredList.length)} de ${filteredList.length} processos`;
  }
  const pageInd = document.getElementById('pageIndicator');
  if (pageInd) {
    pageInd.textContent = `${currentPage} / ${Math.max(1, Math.ceil(filteredList.length / pageSize))}`;
  }
}

function filterProcessos() {
  const q = document.getElementById('searchProcessos').value.toLowerCase();
  const mat = document.getElementById('filterMateria').value;

  filteredList = DADOS_PROTOCOLADOS.filter(d => {
    const matchesText = d.processo.toLowerCase().includes(q) ||
                        d.assessor.toLowerCase().includes(q) ||
                        d.acao.toLowerCase().includes(q) ||
                        d.defensoria.toLowerCase().includes(q) ||
                        d.defensor.toLowerCase().includes(q);
    const matchesMat = !mat || d.materia === mat;
    return matchesText && matchesMat;
  });

  currentPage = 1;
  renderProcessos();
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderProcessos();
  }
}

function nextPage() {
  if (currentPage * pageSize < filteredList.length) {
    currentPage++;
    renderProcessos();
  }
}

// Inicialização
window.addEventListener('DOMContentLoaded', () => {
  renderFamiliaServidores();
  renderGeralData();
  setupComparador();
  renderProcessos();
});
