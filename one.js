import gsap from "https://esm.sh/gsap";
document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".container");
  const menuToggle = document.querySelector(".menu-toggle");
  const menuOverlay = document.querySelector(".menu-overlay");
  const menuContent = document.querySelector(".menu-content");
  const menuPreviewImg = document.querySelector(".menu-preview-img");
  const menuLinks = document.querySelectorAll(".link a");

  let isOpen = false;
  let isAnimating = false;

  menuToggle.addEventListener("click", () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  function cleanupPreviewImages() {
    const previewImages = menuPreviewImg.querySelectorAll("img");
    if (previewImages.length > 3) {
      for (let i = 0; i < previewImages.length - 3; i++) {
        menuPreviewImg.removeChild(previewImages[i]);
      }
    }
  }

  function resetPreviewImage() {
    menuPreviewImg.innerHTML = "";
    const defaultPreviewImg = document.createElement("img");
    defaultPreviewImg.src =
      "https://plus.unsplash.com/premium_photo-1747769554829-509fc9395e53?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
    menuPreviewImg.appendChild(defaultPreviewImg);
  }

  function animateMenuToggle(isOpening) {
    const open = document.querySelector("#menu-open");
    const close = document.querySelector("#menu-close");

    gsap.to(isOpening ? open : close, {
      x: isOpening ? -5 : 5,
      y: isOpening ? -10 : 10,
      rotation: isOpening ? -5 : 5,
      opacity: 0,
      delay: 0.25,
      duration: 0.5,
      ease: "power2.out"
    });

    gsap.to(isOpening ? close : open, {
      x: 0,
      y: 0,
      rotation: 0,
      opacity: 1,
      delay: 0.5,
      duration: 0.5,
      ease: "power2.out"
    });
  }

  function openMenu() {
    if (isAnimating || isOpen) return;
    isAnimating = true;

    gsap.to(container, {
      rotation: 10,
      x: 300,
      y: 450,
      scale: 1.5,
      duration: 1.25,
      ease: "power4.inOut"
    });

    animateMenuToggle(true);

    gsap.to(menuContent, {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      opacity: 1,
      duration: 1.25,
      ease: "power4.inOut"
    });

    gsap.to([".link a", ".social a"], {
      y: "0%",
      opacity: 1,
      duration: 1,
      delay: 0.75,
      stagger: 0.1,
      ease: "power3.out"
    });

    gsap.to(menuOverlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 175%, 0% 100%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        isOpen = true;
        isAnimating = false;
      }
    });
  }

  function closeMenu() {
    if (isAnimating || !isOpen) return;
    isAnimating = true;

    gsap.to(container, {
      rotation: 0,
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.25,
      ease: "power4.inOut"
    });

    animateMenuToggle(false);

    gsap.to(menuContent, {
      rotation: -15,
      x: -100,
      y: -100,
      scale: 1.5,
      opacity: 0.25,
      duration: 1.25,
      ease: "power4.inOut"
    });

    gsap.to(menuOverlay, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
      duration: 1.25,
      ease: "power4.inOut",
      onComplete: () => {
        isOpen = false;
        isAnimating = false;
        gsap.set([".link a", ".social a"], { y: "120%" });
        resetPreviewImage();
      }
    });
  }

  menuLinks.forEach((link) => {
    link.addEventListener("mouseover", () => {
      if (!isOpen || isAnimating) return;

      const imgSrc = link.getAttribute("data-img");
      if (!imgSrc) return;

      const previewImages = menuPreviewImg.querySelectorAll("img");
      if (
        previewImages.length > 0 &&
        previewImages[previewImages.length - 1].src.endsWith(imgSrc)
      ) {
        return;
      }

      const newPreviewImg = document.createElement("img");
      newPreviewImg.src = imgSrc;
      newPreviewImg.style.opacity = "0";
      newPreviewImg.style.transform = "scale(1.25) rotate(10deg)";

      menuPreviewImg.appendChild(newPreviewImg);
      cleanupPreviewImages();

      gsap.to(newPreviewImg, {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.75,
        ease: "power2.out"
      });
    });
  });

  // Initial states for animations
  gsap.set("#menu-close", {
    opacity: 0,
    transform: "translateX(-5px) translateY(10px) rotate(5deg)"
  });
  gsap.set([".link a", ".social a"], {
    transform: "translateY(120%)",
    opacity: 0.25
  });
  gsap.set(menuContent, {
    transform:
      "translateX(-100px) translateY(-100px) scale(1.5) rotate(-15deg)",
    opacity: 0.25
  });
  gsap.set(menuOverlay, {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
  });
});
