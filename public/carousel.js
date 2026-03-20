document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // Centralizamos os dados no JS para deixar o HTML limpo
  const imagens = [
    {
      src: "https://images.unsplash.com/photo-1534802046520-4f27db7f3ae5?auto=format&fit=crop&w=400&q=80",
      alt: "Comic 1",
    },
    {
      src: "https://images.unsplash.com/photo-1588497859490-85d1c17defcb?auto=format&fit=crop&w=400&q=80",
      alt: "Comic 2",
    },
    {
      src: "https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?auto=format&fit=crop&w=400&q=80",
      alt: "Comic 3",
    },
    {
      src: "https://images.unsplash.com/photo-1578306899566-f56f4327735d?auto=format&fit=crop&w=400&q=80",
      alt: "Comic 4",
    },
    {
      src: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=400&q=80",
      alt: "Comic 5",
    },
    {
      src: "https://images.unsplash.com/photo-1608889175123-8ee362201f81?auto=format&fit=crop&w=400&q=80",
      alt: "Comic 6",
    },
  ];

  // Injeta as imagens dinamicamente no DOM
  imagens.forEach((img) => {
    const slide = document.createElement("div");
    // Classes Tailwind para responsividade (1 slide mobile, 2 sm, 3 md, 4 lg)
    slide.className =
      "min-w-full sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] p-2 flex-shrink-0";
    slide.innerHTML = `
      <div class="overflow-hidden rounded-lg">
        <img src="${img.src}" alt="${img.alt}" class="hover:scale-110 transition duration-500 object-cover h-64 w-full cursor-pointer" />
      </div>
    `;
    track.appendChild(slide);
  });

  let currentIndex = 0;

  const updateCarousel = () => {
    const slideWidth = track.children[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;

    // Desabilita botões nos extremos baseando-se em quantos itens cabem na tela atual
    const itemsNaTela = Math.floor(
      track.parentElement.getBoundingClientRect().width / slideWidth,
    );
    const maxIndex = Math.max(0, imagens.length - itemsNaTela);

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  };

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener("click", () => {
    const slideWidth = track.children[0].getBoundingClientRect().width;
    const itemsNaTela = Math.floor(
      track.parentElement.getBoundingClientRect().width / slideWidth,
    );
    const maxIndex = Math.max(0, imagens.length - itemsNaTela);

    if (currentIndex < maxIndex) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Recalcula tamanhos e volta ao início se a janela for redimensionada para evitar bugs de layout
  window.addEventListener("resize", () => {
    currentIndex = 0;
    updateCarousel();
  });

  // Garante que a largura inicial seja calculada logo após renderizar
  setTimeout(updateCarousel, 100);
});
