const URL_DA_PLANILHA =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSlVUTyc7RPtJ6HEutXK0zS6bSGTdZCs83fAFjrzw6K6gCE3J5N0q4oegDzpRdkeLHQrvrXTG5FTPU_/pub?output=tsv";

const NUMERO_WHATSAPP = "5521979214996"; // Substitua pelo seu número (DDI + DDD + Número)

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

function abrirModalCompra(produto) {
  const nome = produto[0];
  const linkShopee = produto[4]; // Assumindo que a coluna E da planilha (índice 4) é o link da Shopee

  document.getElementById("modal-title").innerText = nome;
  const modalButtons = document.getElementById("modal-buttons");
  modalButtons.innerHTML = "";

  // Adiciona botão da Shopee apenas se o link existir e não for vazio
  if (linkShopee && linkShopee.trim() !== "") {
    modalButtons.innerHTML += `
      <a href="${linkShopee.trim()}" target="_blank" rel="noopener noreferrer" class="w-full bg-[#ee4d2d] text-white py-3 px-4 rounded-lg font-bold hover:bg-[#d74529] transition-colors flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6V4a4 4 0 0 0-8 0v2H3v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6h-5zM10 4a2 2 0 0 1 4 0v2h-4V4zm8 16H6V8h2v2a1 1 0 1 0 2 0V8h4v2a1 1 0 1 0 2 0V8h2v12z"/></svg>
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
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.61c-1.6 0-3.17-.43-4.54-1.24l-5.06 1.33 1.35-4.93c-.89-1.42-1.36-3.06-1.36-4.75 0-4.98 4.06-9.03 9.05-9.03 4.98 0 9.04 4.05 9.04 9.03 0 4.97-4.06 9.03-9.04 9.03zm4.97-6.2c-.27-.14-1.61-.79-1.86-.88-.25-.09-.43-.14-.61.14-.18.27-.7 .88-.86 1.06-.16.18-.32.21-.59.07-1.16-.54-2.27-1.28-3.08-2.23-.22-.27-.03-.41.1-.55.13-.13.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.02-.22-.53-.44-.46-.61-.47-.16-.01-.35-.01-.54-.01-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.11 2.82.14.18 1.92 2.93 4.65 4.11 1.62.7 2.14.75 2.94.63.8-.12 1.61-.66 1.84-1.3.23-.64.23-1.19.16-1.3-.07-.12-.25-.18-.52-.32z"/></svg>
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

    renderizarCatalogo(todosProdutos);
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
    .map(
      (colunas, index) => `
        <div class="bg-zinc-800/50 p-5 rounded-xl border border-zinc-700/50 hover:border-daimaoh/50 transition-all duration-300 hover:-translate-y-1 flex flex-col group">
          <img src="${
            colunas[3] || "https://via.placeholder.com/280x180?text=Sem+Imagem"
          }" alt="Foto do produto" class="w-full h-56 object-cover rounded-lg mb-4 group-hover:opacity-90 transition-opacity cursor-pointer imagem-produto">
          <h3 class="text-xl font-bold text-zinc-100 mb-2">${colunas[0]}</h3>
          <p class="text-zinc-400 text-sm mb-4 flex-grow">${colunas[1]}</p>
          <div class="text-daimaoh font-bold text-xl mt-auto mb-4">${colunas[2]}</div>
          <button data-index="${index}" class="comprar-btn w-full bg-daimaoh text-zinc-900 py-2.5 rounded-lg font-bold hover:bg-daimaoh-hover transition-colors flex items-center justify-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Comprar
          </button>
        </div>
      `,
    )
    .join("");

  document.getElementById("catalog").innerHTML =
    htmlProdutos ||
    '<p class="text-zinc-400 text-center w-full col-span-full py-10 text-lg">Nenhum produto encontrado com esse nome.</p>';

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
}

function filtrarCatalogo() {
  const termoBusca = document
    .getElementById("search-input")
    .value.toLowerCase();
  const produtosFiltrados = todosProdutos.filter((colunas) =>
    colunas[0].toLowerCase().includes(termoBusca),
  );
  renderizarCatalogo(produtosFiltrados);
}

document
  .getElementById("search-btn")
  ?.addEventListener("click", filtrarCatalogo);
document
  .getElementById("search-input")
  ?.addEventListener("input", filtrarCatalogo);

carregarDados();
