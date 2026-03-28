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
    <button class="absolute top-6 right-6 text-zinc-400 hover:text-daimaoh transition-colors">
      <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
    </button>
    <img src="" alt="" class="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl shadow-daimaoh/20 transform scale-95 transition-transform duration-300" />
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector("img");
  const closeBtn = modal.querySelector("button");

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

  imagens.forEach((img) => {
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
      modalImg.src = img.src;
      modalImg.alt = img.alt;
      modal.classList.remove("opacity-0", "pointer-events-none");
      modal.classList.add("opacity-100", "pointer-events-auto");
      setTimeout(() => {
        modalImg.classList.remove("scale-95");
        modalImg.classList.add("scale-100");
      }, 50);
    });

    track.appendChild(slide);
  });

  let currentIndex = 0;

  const updateCarousel = () => {
    const slideWidth = track.children[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
  };

  const getMaxIndex = () => {
    const slideWidth = track.children[0].getBoundingClientRect().width;
    const itemsNaTela = Math.floor(
      track.parentElement.getBoundingClientRect().width / slideWidth,
    );
    return Math.max(0, imagens.length - itemsNaTela);
  };

  prevBtn.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = getMaxIndex();
    }
    updateCarousel();
  });

  nextBtn.addEventListener("click", () => {
    if (currentIndex < getMaxIndex()) {
      currentIndex++;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  });

  window.addEventListener("resize", () => {
    currentIndex = Math.min(currentIndex, getMaxIndex());
    updateCarousel();
  });

  setTimeout(updateCarousel, 100);
});
