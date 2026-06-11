document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  const imagens = [
    { src: "./assets/produtos/Comic1.jpeg", alt: "Comic 1" },
    { src: "./assets/produtos/Comic2.jpeg", alt: "Comic 2" },
    { src: "./assets/produtos/Comic3.jpeg", alt: "Comic 3" },
    { src: "./assets/produtos/Comic4.jpeg", alt: "Comic 4" },
    { src: "./assets/produtos/Comic5.jpeg", alt: "Comic 5" },
    { src: "./assets/produtos/Comic6.jpeg", alt: "Comic 6" },
  ];

  const modal = document.createElement("div");
  modal.className =
    "fixed inset-0 z-[60] bg-zinc-900/95 backdrop-blur-md flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300";
  modal.innerHTML = `
    <button id="close-modal-img-btn" class="absolute top-4 md:top-6 right-4 md:right-6 text-zinc-400 hover:text-daimaoh transition-colors z-[70]">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    <button id="modal-prev-btn" class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 text-zinc-100 hover:text-daimaoh transition-colors p-3 bg-zinc-900/80 rounded-full hover:bg-zinc-800 z-[70] shadow-lg">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.75 19.5L8.25 12l7.5-7.5"></path></svg>
    </button>
    <button id="modal-next-btn" class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 text-zinc-100 hover:text-daimaoh transition-colors p-3 bg-zinc-900/80 rounded-full hover:bg-zinc-800 z-[70] shadow-lg">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.25 4.5l7.5 7.5-7.5 7.5"></path></svg>
    </button>
    <img src="" alt="" class="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl shadow-daimaoh/20 transform scale-95 transition-transform duration-300 relative z-50" />
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("img");
  const closeBtn = modal.querySelector("#close-modal-img-btn");
  const modalPrevBtn = modal.querySelector("#modal-prev-btn");
  const modalNextBtn = modal.querySelector("#modal-next-btn");

  let currentModalIndex = 0;

  const updateModalImage = (index) => {
    if (index < 0) index = imagens.length - 1;
    if (index >= imagens.length) index = 0;
    currentModalIndex = index;
    modalImg.src = imagens[currentModalIndex].src;
    modalImg.alt = imagens[currentModalIndex].alt;
  };

  modalPrevBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita que clique feche a janela
    updateModalImage(currentModalIndex - 1);
  });

  modalNextBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // Evita que clique feche a janela
    updateModalImage(currentModalIndex + 1);
  });

  // Adicionando suporte a Swipe (deslizar o dedo) na imagem do modal
  let modalStartX = 0;
  let modalEndX = 0;

  modalImg.addEventListener(
    "touchstart",
    (e) => {
      modalStartX = e.touches[0].clientX;
    },
    { passive: true },
  );

  modalImg.addEventListener(
    "touchmove",
    (e) => {
      modalEndX = e.touches[0].clientX;
    },
    { passive: true },
  );

  modalImg.addEventListener("touchend", () => {
    if (!modalStartX || !modalEndX) return;
    const diffX = modalStartX - modalEndX;
    if (diffX > 50)
      updateModalImage(currentModalIndex + 1); // Swipe Esquerda -> Próxima
    else if (diffX < -50) updateModalImage(currentModalIndex - 1); // Swipe Direita -> Anterior
    modalStartX = 0;
    modalEndX = 0;
  });

  const closeModal = () => {
    modal.classList.remove("opacity-100", "pointer-events-auto");
    modal.classList.add("opacity-0", "pointer-events-none");
    modalImg.classList.remove("scale-100");
    modalImg.classList.add("scale-95");
  };

  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Navegar e fechar modal de imagem com o teclado
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("pointer-events-none")) {
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowLeft") updateModalImage(currentModalIndex - 1);
      if (e.key === "ArrowRight") updateModalImage(currentModalIndex + 1);
    }
  });

  const realCount = imagens.length;
  const allImages = [...imagens, ...imagens, ...imagens];
  let currentIndex = realCount;
  let isTransitioning = false;

  allImages.forEach((img, idx) => {
    const slide = document.createElement("div");
    slide.className =
      "min-w-full sm:min-w-[50%] md:min-w-[33.333%] lg:min-w-[25%] p-2 flex-shrink-0";
    slide.innerHTML = `
      <div class="overflow-hidden rounded-lg">
        <img src="${img.src}" alt="${img.alt}" class="hover:scale-110 transition duration-500 object-cover h-64 w-full cursor-pointer" />
      </div>
    `;

    const imgElement = slide.querySelector("img");
    imgElement.addEventListener("click", () => {
      updateModalImage(idx % imagens.length);
      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");
      setTimeout(() => {
        modalImg.classList.remove("scale-95");
        modalImg.classList.add("scale-100");
      }, 50);
    });

    track.appendChild(slide);
  });

  const updateCarousel = (withTransition = true) => {
    if (!track.children.length) return;
    const slideWidth = track.children[0].getBoundingClientRect().width;

    if (withTransition) {
      track.style.transition = "transform 0.5s ease-in-out";
    } else {
      track.style.transition = "none";
    }

    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  };

  track.addEventListener("transitionend", () => {
    isTransitioning = false;
    if (currentIndex <= realCount - 1) {
      currentIndex += realCount;
      updateCarousel(false);
    } else if (currentIndex >= realCount * 2) {
      currentIndex -= realCount;
      updateCarousel(false);
    }
  });

  prevBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex--;
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex++;
    updateCarousel();
  });

  window.addEventListener("resize", () => {
    updateCarousel(false);
  });

  setTimeout(() => updateCarousel(false), 100);

  let startX = 0;
  let endX = 0;

  track.addEventListener(
    "touchstart",
    (e) => {
      startX = e.touches[0].clientX;
    },
    { passive: true },
  );

  track.addEventListener(
    "touchmove",
    (e) => {
      endX = e.touches[0].clientX;
    },
    { passive: true },
  );

  track.addEventListener("touchend", () => {
    if (!startX || !endX) return;
    const diffX = startX - endX;

    if (diffX > 50) {
      if (!isTransitioning) {
        isTransitioning = true;
        currentIndex++;
        updateCarousel();
      }
    } else if (diffX < -50) {
      if (!isTransitioning) {
        isTransitioning = true;
        currentIndex--;
        updateCarousel();
      }
    }
    startX = 0;
    endX = 0;
  });

  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = mobileMenu.querySelectorAll("a");

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
      mobileMenu.classList.toggle("flex");
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.add("hidden");
        mobileMenu.classList.remove("flex");
      });
    });
  }
});
