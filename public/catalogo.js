const URL_DA_PLANILHA =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlVUTyc7RPtJ6HEutXK0zS6bSGTdZCs83fAFjrzw6K6gCE3J5N0q4oegDzpRdkeLHQrvrXTG5FTPU_/pub?output=tsv";

const NUMERO_WHATSAPP = "5521979214996"; // Substitua pelo seu número (DDI + DDD + Número)

// Função para higienizar dados e prevenir Cross-Site Scripting (XSS)
function escapeHTML(str) {
  if (!str) return "";
  return str
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Função para padronizar os textos (remove espaços extras e capitaliza a primeira letra)
function padronizarTexto(str) {
  if (!str) return "";
  const limpo = str.trim();
  if (!limpo) return "";
  return limpo.charAt(0).toUpperCase() + limpo.slice(1);
}

// Função para checar se o produto está esgotado baseado na Coluna H (Quantidade)
function checarEsgotado(valor) {
  if (valor === undefined || valor === null) return true;
  const limpo = valor.toString().trim();
  if (limpo === "") return true;
  const numero = parseFloat(limpo.replace(",", "."));
  return !isNaN(numero) && numero === 0;
}

// --- Configuração do Modal de Compra ---
const modalCompra = document.createElement("div");
modalCompra.className =
  "fixed inset-0 z-[60] bg-zinc-900/95 backdrop-blur-md hidden items-center justify-center opacity-0 transition-opacity duration-300";
modalCompra.innerHTML = `
  <div class="bg-zinc-800 border border-zinc-700 p-8 rounded-xl max-w-sm w-full mx-4 relative transform scale-95 transition-transform duration-300 flex flex-col items-center text-center" id="modal-content">
    <button id="close-modal-btn" class="absolute top-4 right-4 text-zinc-400 hover:text-daimaoh transition-colors">
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    <h3 class="text-2xl font-bold text-zinc-100 mb-2" id="modal-title"></h3>
    <p class="text-zinc-400 mb-6 text-sm">Escolha por onde deseja finalizar sua compra:</p>
    <div class="w-full flex flex-col gap-3" id="modal-buttons"></div>
  </div>
`;
document.body.appendChild(modalCompra);

const modalImagem = document.createElement("div");
modalImagem.className =
  "fixed inset-0 z-[70] bg-zinc-900/95 backdrop-blur-md hidden items-center justify-center opacity-0 transition-opacity duration-300";
modalImagem.innerHTML = `
  <button id="close-imagem-modal-btn" class="absolute top-6 right-6 text-zinc-400 hover:text-daimaoh transition-colors">
    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
  </button>
  <img src="" alt="Imagem do Produto em destaque" class="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl shadow-daimaoh/20 transform scale-95 transition-transform duration-300" id="modal-imagem-src" />
`;
document.body.appendChild(modalImagem);

const modalImagemSrc = document.getElementById("modal-imagem-src");
const closeImagemModalBtn = document.getElementById("close-imagem-modal-btn");

const fecharModalImagem = () => {
  modalImagem.classList.remove("opacity-100");
  modalImagem.classList.add("opacity-0");
  modalImagemSrc.classList.remove("scale-100");
  modalImagemSrc.classList.add("scale-95");
  setTimeout(() => {
    modalImagem.classList.remove("flex");
    modalImagem.classList.add("hidden");
  }, 300);
};

closeImagemModalBtn.addEventListener("click", fecharModalImagem);
modalImagem.addEventListener("click", (e) => {
  if (e.target === modalImagem) fecharModalImagem();
});

function abrirModalImagem(src) {
  modalImagemSrc.src = src;
  modalImagem.classList.remove("hidden");
  modalImagem.classList.add("flex");
  setTimeout(() => {
    modalImagem.classList.remove("opacity-0");
    modalImagem.classList.add("opacity-100");
    modalImagemSrc.classList.remove("scale-95");
    modalImagemSrc.classList.add("scale-100");
  }, 10);
}

const closeModalBtn = document.getElementById("close-modal-btn");
const modalContent = document.getElementById("modal-content");

const fecharModal = () => {
  modalCompra.classList.remove("opacity-100");
  modalCompra.classList.add("opacity-0");
  modalContent.classList.remove("scale-100");
  modalContent.classList.add("scale-95");
  setTimeout(() => {
    modalCompra.classList.remove("flex");
    modalCompra.classList.add("hidden");
  }, 300);
};

closeModalBtn.addEventListener("click", fecharModal);
modalCompra.addEventListener("click", (e) => {
  if (e.target === modalCompra) fecharModal();
});

// Fechar modals com a tecla ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (!modalCompra.classList.contains("hidden")) fecharModal();
    if (!modalImagem.classList.contains("hidden")) fecharModalImagem();
  }
});

function abrirModalCompra(produto) {
  const nome = produto[0];
  const linkShopee = produto[6]; // Agora a coluna G da planilha (índice 6) é o link da Shopee

  document.getElementById("modal-title").innerText = nome;
  const modalButtons = document.getElementById("modal-buttons");
  modalButtons.innerHTML = "";

  // Valida se o link começa com http ou https para prevenir injeção de scripts (javascript:)
  const linkSeguro =
    linkShopee &&
    linkShopee.trim() !== "" &&
    (linkShopee.trim().startsWith("http://") ||
      linkShopee.trim().startsWith("https://"));

  if (linkSeguro) {
    modalButtons.innerHTML += `
      <a href="${linkShopee.trim()}" target="_blank" rel="noopener noreferrer" class="w-full bg-[#ee4d2d] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#d74529] transition-colors flex items-center justify-center gap-2">
        Comprar na Shopee
      </a>
    `;
  }

  // O botão do WhatsApp sempre é gerado com a mensagem customizada
  const textoWa = encodeURIComponent(
    `Olá, tenho interesse no produto: ${nome}`,
  );
  const linkWa = `https://wa.me/${NUMERO_WHATSAPP}?text=${textoWa}`;

  modalButtons.innerHTML += `
    <a href="${linkWa}" target="_blank" rel="noopener noreferrer" class="w-full bg-[#25D366] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#128C7E] transition-colors flex items-center justify-center gap-2">
      Comprar no WhatsApp
    </a>
  `;

  modalCompra.classList.remove("hidden");
  modalCompra.classList.add("flex");
  setTimeout(() => {
    modalCompra.classList.remove("opacity-0");
    modalCompra.classList.add("opacity-100");
    modalContent.classList.remove("scale-95");
    modalContent.classList.add("scale-100");
  }, 10);
}
// --- Fim Configuração do Modal ---

let todosProdutos = [];
let produtosFiltradosGlobais = [];
let paginaAtual = 1;
const ITENS_POR_PAGINA = 12;

async function carregarDados() {
  const statusDiv = document.getElementById("status");

  if (URL_DA_PLANILHA === "COLE_SEU_LINK_AQUI") {
    statusDiv.innerText =
      "Erro ao carregar catálogo! Entre em contato com o suporte!";
    return;
  }

  statusDiv.innerText = "Carregando... 🦸";

  try {
    const resposta = await fetch(URL_DA_PLANILHA);
    const textoTsv = await resposta.text();

    const linhas = textoTsv.split("\n").map((linha) => linha.split("\t"));
    linhas.shift();

    todosProdutos = linhas.filter(
      (colunas) => colunas.length > 1 && colunas[0].trim() !== "",
    );

    // Ordena para que os esgotados (Coluna H/Índice 7 == 0 ou vazio) vão para o final
    todosProdutos.sort((a, b) => {
      const aEsgotado = checarEsgotado(a[7]);
      const bEsgotado = checarEsgotado(b[7]);
      if (aEsgotado && !bEsgotado) return 1;
      if (!aEsgotado && bEsgotado) return -1;
      return 0; // Mantém a ordem original para os demais
    });

    produtosFiltradosGlobais = [...todosProdutos];

    preencherFiltroGrupos();
    preencherFiltroEditoras();
    renderizarPagina();
    statusDiv.style.display = "none";

    const searchContainer = document.getElementById("search-container");
    if (searchContainer) {
      searchContainer.classList.remove("hidden");
      searchContainer.classList.add("flex");
    }
  } catch (erro) {
    statusDiv.innerText =
      "Erro ao carregar dados! Entre em contato com o suporte!";
    console.error(erro);
  }
}

function renderizarCatalogo(produtos) {
  const htmlProdutos = produtos
    .map((colunas, index) => {
      const nome = escapeHTML(colunas[0]?.trim() || "");
      const status = escapeHTML(padronizarTexto(colunas[1]));
      const grupo = escapeHTML(padronizarTexto(colunas[2]));
      const marca = escapeHTML(padronizarTexto(colunas[3]));
      const preco = escapeHTML(colunas[4]?.trim() || "");
      const imagemRaw = colunas[5] ? colunas[5].trim() : "";
      const imagem =
        imagemRaw.startsWith("http://") || imagemRaw.startsWith("https://")
          ? escapeHTML(imagemRaw)
          : "https://via.placeholder.com/280x180?text=Sem+Imagem";

      // Lógica de Esgotado (Coluna H = índice 7)
      const esgotado = checarEsgotado(colunas[7]);

      // Ajustes visuais baseados no estoque
      const cardClasses = esgotado
        ? "bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/50 flex flex-col"
        : "bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/50 hover:border-daimaoh/50 transition-all duration-300 hover:-translate-y-1 flex flex-col group";

      const imgClasses = esgotado
        ? "w-full h-56 object-cover rounded-lg cursor-pointer imagem-produto"
        : "w-full h-56 object-cover rounded-lg group-hover:opacity-90 transition-opacity cursor-pointer imagem-produto";

      const imgStyles = esgotado
        ? `style="filter: grayscale(100%) brightness(40%);"`
        : "";

      const imagemOverlay = esgotado
        ? `<div class="absolute inset-0 bg-zinc-900/80 rounded-lg flex items-center justify-center pointer-events-none"><span class="text-zinc-100 font-extrabold uppercase tracking-widest text-2xl -rotate-12 drop-shadow-lg">Esgotado</span></div>`
        : "";

      const btnHtml = esgotado
        ? `<button disabled class="w-full bg-zinc-800 border border-zinc-700 text-zinc-500 py-2.5 rounded-lg font-bold cursor-not-allowed">Esgotado</button>`
        : `<button data-index="${index}" class="comprar-btn w-full bg-daimaoh text-zinc-900 py-2.5 rounded-lg font-bold hover:bg-daimaoh-hover transition-colors flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
              Comprar
            </button>`;

      return `
          <div class="${cardClasses}">
            <div class="relative mb-4">
              <img src="${imagem}" onerror="this.src='https://via.placeholder.com/280x180?text=Sem+Imagem'" alt="Foto do produto" class="${imgClasses}" ${imgStyles}>
              ${imagemOverlay}
            </div>
            <div class="flex flex-wrap gap-2 mb-2">
              ${grupo ? `<span class="text-xs font-medium bg-zinc-700/50 text-zinc-300 px-2 py-1 rounded">${grupo}</span>` : ""}
              ${marca ? `<span class="text-xs font-medium bg-zinc-700/50 text-zinc-300 px-2 py-1 rounded">${marca}</span>` : ""}
              ${status ? `<span class="text-xs font-medium bg-zinc-700/50 text-zinc-300 px-2 py-1 rounded">${status}</span>` : ""}
            </div>
            <h3 class="text-xl font-bold text-zinc-100 mb-4 flex-grow">${nome}</h3>
            <div class="text-daimaoh font-bold text-xl mt-auto mb-4">${preco}</div>
            ${btnHtml}
          </div>
        `;
    })
    .join("");

  document.getElementById("catalog").innerHTML =
    htmlProdutos ||
    `<div class="col-span-full flex flex-col items-center justify-center py-10 text-center">
      <p class="text-zinc-400 text-lg mb-4">Nenhum produto encontrado com esses filtros.</p>
      <button id="clear-filters-btn" class="text-daimaoh hover:text-zinc-900 border border-daimaoh hover:bg-daimaoh px-6 py-2 rounded-lg font-bold transition-colors">Limpar Filtros</button>
    </div>`;

  // Adicionando o evento de clique nos novos botões gerados
  document.querySelectorAll(".comprar-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const idx = e.currentTarget.getAttribute("data-index");
      abrirModalCompra(produtos[idx]);
    });
  });

  document.querySelectorAll(".imagem-produto").forEach((img) => {
    img.addEventListener("click", (e) => {
      if (!e.currentTarget.src.includes("via.placeholder.com")) {
        abrirModalImagem(e.currentTarget.src);
      }
    });
  });

  // Adicionando o evento de clique no botão de limpar filtros (caso exista)
  const clearBtn = document.getElementById("clear-filters-btn");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (document.getElementById("search-input"))
        document.getElementById("search-input").value = "";
      if (document.getElementById("group-filter"))
        document.getElementById("group-filter").value = "";
      preencherFiltroEditoras("");
      if (document.getElementById("brand-filter"))
        document.getElementById("brand-filter").value = "";
      filtrarCatalogo();
    });
  }
}

function renderizarPagina() {
  const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const fim = inicio + ITENS_POR_PAGINA;
  const produtosPagina = produtosFiltradosGlobais.slice(inicio, fim);

  renderizarCatalogo(produtosPagina);
  renderizarPaginacao();
}

function renderizarPaginacao() {
  const paginationContainer = document.getElementById("pagination-container");
  if (!paginationContainer) return;

  const totalPaginas = Math.ceil(
    produtosFiltradosGlobais.length / ITENS_POR_PAGINA,
  );

  if (totalPaginas <= 1) {
    paginationContainer.innerHTML = "";
    return;
  }

  let html = `<button class="px-4 py-2 rounded-lg font-bold transition-colors text-sm ${paginaAtual === 1 ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-zinc-800" : "bg-zinc-800 border border-zinc-700/50 text-zinc-100 hover:bg-daimaoh hover:text-zinc-900 hover:border-daimaoh"}" data-page="${paginaAtual - 1}" ${paginaAtual === 1 ? "disabled" : ""}>Anterior</button>`;

  for (let i = 1; i <= totalPaginas; i++) {
    if (i === paginaAtual) {
      html += `<button class="w-10 h-10 rounded-lg font-bold bg-daimaoh text-zinc-900 transition-colors text-sm" data-page="${i}">${i}</button>`;
    } else {
      html += `<button class="w-10 h-10 rounded-lg font-bold bg-zinc-800 border border-zinc-700/50 text-zinc-100 hover:bg-daimaoh hover:text-zinc-900 hover:border-daimaoh transition-colors text-sm" data-page="${i}">${i}</button>`;
    }
  }

  html += `<button class="px-4 py-2 rounded-lg font-bold transition-colors text-sm ${paginaAtual === totalPaginas ? "bg-zinc-800/50 text-zinc-600 cursor-not-allowed border border-zinc-800" : "bg-zinc-800 border border-zinc-700/50 text-zinc-100 hover:bg-daimaoh hover:text-zinc-900 hover:border-daimaoh"}" data-page="${paginaAtual + 1}" ${paginaAtual === totalPaginas ? "disabled" : ""}>Próxima</button>`;

  paginationContainer.innerHTML = html;

  paginationContainer
    .querySelectorAll("button:not([disabled])")
    .forEach((btn) => {
      btn.addEventListener("click", (e) => {
        paginaAtual = parseInt(e.currentTarget.getAttribute("data-page"));
        renderizarPagina();

        // Rola a tela de volta suavemente até a pesquisa do catálogo
        const catalogTop =
          document.getElementById("search-container").offsetTop;
        window.scrollTo({ top: catalogTop - 100, behavior: "smooth" });
      });
    });
}

function preencherFiltroGrupos() {
  const select = document.getElementById("group-filter");
  if (!select) return;

  const grupos = [
    ...new Set(todosProdutos.map((p) => padronizarTexto(p[2]) || "Outros")),
  ]
    .filter(Boolean)
    .sort();

  grupos.forEach((grupo) => {
    const option = document.createElement("option");
    option.value = grupo;
    option.textContent = grupo;
    select.appendChild(option);
  });
}

function preencherFiltroEditoras(grupoFiltrado = "") {
  const select = document.getElementById("brand-filter");
  if (!select) return;

  const valorAnterior = select.value;
  select.innerHTML = '<option value="">Todas as editoras</option>';

  const produtosParaFiltrar = grupoFiltrado
    ? todosProdutos.filter(
        (p) => (padronizarTexto(p[2]) || "Outros") === grupoFiltrado,
      )
    : todosProdutos;

  const editoras = [
    ...new Set(
      produtosParaFiltrar.map((p) => padronizarTexto(p[3]) || "Outras"),
    ),
  ]
    .filter(Boolean)
    .sort();

  editoras.forEach((editora) => {
    const option = document.createElement("option");
    option.value = editora;
    option.textContent = editora;
    select.appendChild(option);
  });

  if (editoras.includes(valorAnterior)) {
    select.value = valorAnterior;
  }
}

function filtrarCatalogo() {
  const termoBusca = document
    .getElementById("search-input")
    .value.toLowerCase();
  const grupoSelecionado = document.getElementById("group-filter")?.value || "";
  const editoraSelecionada =
    document.getElementById("brand-filter")?.value || "";

  produtosFiltradosGlobais = todosProdutos.filter((colunas) => {
    const nome = colunas[0]?.trim() || "";
    const status = padronizarTexto(colunas[1]);
    const grupo = padronizarTexto(colunas[2]);
    const marca = padronizarTexto(colunas[3]);

    const matchBusca =
      nome.toLowerCase().includes(termoBusca) ||
      status.toLowerCase().includes(termoBusca) ||
      grupo.toLowerCase().includes(termoBusca) ||
      marca.toLowerCase().includes(termoBusca);

    const matchGrupo =
      grupoSelecionado === "" ||
      (padronizarTexto(colunas[2]) || "Outros") === grupoSelecionado;
    const matchMarca =
      editoraSelecionada === "" ||
      (padronizarTexto(colunas[3]) || "Outras") === editoraSelecionada;

    return matchBusca && matchGrupo && matchMarca;
  });
  paginaAtual = 1;
  renderizarPagina();
}

document
  .getElementById("search-btn")
  ?.addEventListener("click", filtrarCatalogo);
document
  .getElementById("search-input")
  ?.addEventListener("input", filtrarCatalogo);
document.getElementById("group-filter")?.addEventListener("change", (e) => {
  preencherFiltroEditoras(e.target.value);
  filtrarCatalogo();
});
document
  .getElementById("brand-filter")
  ?.addEventListener("change", filtrarCatalogo);

carregarDados();
