// https://covid19-brazil-api.now.sh/api/report/v1
let casosTotalEstado = [];
let casosTotalNumeros = 0;
let casosTotalMortes = 0;
let casosTotalCurados = 0;
let casosTotalSuspeitos = 0;
let numberFormat = null;
let casos = null;
let mortes = null;
let curados = null;
let suspeitos = null;
let resultados = null;

window.addEventListener('load', () => {
  casos = document.querySelector('#casos');
  mortes = document.querySelector('#mortes');
  curados = document.querySelector('#curados');
  suspeitos = document.querySelector('#suspeitos');
  resultados = document.querySelector('#resultados');
  getCasos();
  numberFormat = Intl.NumberFormat('pt-BR');
});

async function getCasos() {
  const res = await fetch('https://covid19-brazil-api.now.sh/api/report/v1');
  const json = await res.json();
  casosTotalEstado = json.data.map((estado) => {
    const {
      cases,
      datetime,
      deaths,
      refuses,
      state,
      suspects,
      uf,
      uid,
    } = estado;
    return {
      casos: cases,
      data: datetime,
      mortes: deaths,
      curados: refuses,
      estado: state,
      suspeitos: suspects,
      uf,
      uid,
    };
  });
  casosTotalNumeros = casosTotalEstado.reduce((acc, curr) => {
    return acc + curr.casos;
  }, 0);
  casos.textContent = formatNumber(casosTotalNumeros);
  casosTotalMortes = casosTotalEstado.reduce((acc, curr) => {
    return acc + curr.mortes;
  }, 0);
  mortes.textContent = formatNumber(casosTotalMortes);
  casosTotalCurados = casosTotalEstado.reduce((acc, curr) => {
    return acc + curr.curados;
  }, 0);
  curados.textContent = formatNumber(casosTotalCurados);
  casosTotalSuspeitos = casosTotalEstado.reduce((acc, curr) => {
    return acc + curr.suspeitos;
  }, 0);
  suspeitos.textContent = formatNumber(casosTotalSuspeitos);
  porEstado();
}

function porEstado() {
  let tableHTML = '<tr>';
  casosTotalEstado.forEach((estado) => {
    const estadoHTML = `
      <td>
        <img src="https://devarthurribeiro.github.io/covid19-brazil-api/static/flags/${estado.uf.toUpperCase()}.png" alt="${
      estado.uf
    }" width="22"> <span>${estado.uf.toUpperCase()}</span>
      </td>
      <td>
        <span>${formatNumber(estado.casos)} ⦀ ${formatNumber(
      (estado.casos * 100) / casosTotalNumeros
    )}%</span>
      </td>
      <td>
        <span>${formatNumber(estado.mortes)} ⦀ ${formatNumber(
      (estado.mortes * 100) / casosTotalMortes
    )}%</span>
      </td>
      <td>
        <span>${formatNumber(estado.curados)} ⦀ ${formatNumber(
      (estado.curados * 100) / casosTotalCurados
    )}%</span>
      </td>
      <td>
        <span>${formatNumber(estado.suspeitos)} ⦀ ${formatNumber(
      (estado.suspeitos * 100) / casosTotalSuspeitos
    )}%</span>
      </td>
    `;
    tableHTML += estadoHTML;
    tableHTML += '</tr>';
  });
  resultados.innerHTML = tableHTML;
}

function formatNumber(number) {
  return numberFormat.format(number);
}
