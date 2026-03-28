document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carousel-track");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  const imagens = [
    {
      src: "./assets/produtos/Comic1.jpeg",
      alt: "Comic 1",
    },
    {
      src: "./assets/produtos/Comic2.jpeg",
      alt: "Comic 2",
    },
    {
      src: "./assets/produtos/Comic3.jpeg",
      alt: "Comic 3",
    },
    {
      src: "./assets/produtos/Comic4.jpeg",
      alt: "Comic 4",
    },
    {
      src: "./assets/produtos/Comic5.jpeg",
      alt: "Comic 5",
    },
    {
      src: "./assets/produtos/Comic6.jpeg",
      alt: "Comic 6",
    },
  ];

  imagens.forEach((img) => {
    const slide = document.createElement("div");
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

  window.addEventListener("resize", () => {
    currentIndex = 0;
    updateCarousel();
  });

  setTimeout(updateCarousel, 100);
});
