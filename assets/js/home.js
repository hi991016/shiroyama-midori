const breakpoints = window.matchMedia("(max-width: 1023px)");

// ===== init =====
const homepage = () => {
  // #
  ScrollTrigger.clearScrollMemory("manual");
  ScrollTrigger.refresh();
  // # init loading
  initLoading();
};

// ===== lenis =====
if (!breakpoints.matches) {
  window.lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
}

// ===== init loading =====
const preventScroll = (e) => e.preventDefault();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initLoading = async () => {
  if (sessionStorage.getItem("opening-displayed") === "true") {
    document.querySelector("[data-loading]").remove();
    swiperFv.autoplay.start();
    window.lenis.start();
  } else {
    // # Block scroll events
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });
    window.lenis.stop();

    // # step 1 -- fadein logo
    await delay(300);
    document.querySelector("[data-loading-logo]").classList.add("--show");

    // # step 2 -- fadeout background
    await delay(1500);
    document.querySelector("[data-loading]").classList.add("--done");

    // # Unblock scroll events
    window.removeEventListener("wheel", preventScroll);
    window.removeEventListener("touchmove", preventScroll);
    window.removeEventListener("scroll", preventScroll);
    window.lenis.start();

    // # play swiper fv
    swiperFv.autoplay.start();

    // # set sessionStorage
    sessionStorage.setItem("opening-displayed", !0);
  }
};

// ===== init header =====
const handleHeaderNavbar = () => {
  const scrollY = window.scrollY;
  const navbar = document.querySelector("[data-header-navbar]");
  const hSize =
    document.querySelector("[data-offset-top]")?.getBoundingClientRect().top +
    scrollY;

  navbar.classList.toggle("--black", scrollY > hSize);
};

"pageshow scroll".split(" ").forEach((evt) => {
  window.addEventListener(evt, handleHeaderNavbar);
});

// ===== fv =====
const swiperFv = new Swiper("[data-fv-swiper]", {
  effect: "fade",
  speed: 2500,
  allowTouchMove: false,
  draggable: false,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
  on: {
    init: function () {
      this.autoplay.stop();
    },
  },
});

// # scrollTrigger fv-content
gsap.registerPlugin(ScrollTrigger);
const handleFvContent = () => {
  const fv = document.querySelector("[data-fv]");
  const fvContent = document.querySelector("[data-fv-content]");
  ScrollTrigger.getById("fvContent")?.kill();
  if (breakpoints.matches || !fv || !fvContent) return;

  gsap.to(fvContent, {
    y: "-50%",
    ease: "none",
    scrollTrigger: {
      id: "fvContent",
      trigger: fv,
      start: "top top",
      end: () => `+=${fv.offsetHeight}`,
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        fvContent.style.opacity = self.progress < 0.3 ? 0 : 1;
      },
      markers: false,
    },
  });

  // refactor refresh
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
};

// resize smooth
let resizeTimeout;
const optimizedResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    requestAnimationFrame(handleFvContent);
  }, 200);
};

// use ResizeObserver wuth root margin
const resizeObserver = new ResizeObserver(optimizedResize);
resizeObserver.observe(document.documentElement, {
  box: "content-box",
});

// init
"load pageshow".split(" ").forEach((evt) => {
  window.addEventListener(evt, handleFvContent);
});

// # scroll overlay swiper
const handleFvOverlay = () => {
  const [overlay, content] = [
    document.querySelector("[data-fv-overlay]"),
    document.querySelector("[data-fv-content]"),
  ];
  if (breakpoints.matches) return;
  let cal = content.getBoundingClientRect().top + window.scrollY;
  let value = window.scrollY / cal;
  overlay.style.opacity = Math.min(Math.max(value, 0), 0.8);
};

"pageshow scroll".split(" ").forEach((evt) => {
  window.addEventListener(evt, handleFvOverlay);
});

// ===== about =====
const aboutSwiper = new Swiper("[data-about-swiper]", {
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  speed: 1000,
  breakpoints: {
    0: {
      slidesPerView: 1.231,
      spaceBetween: 20,
      allowTouchMove: true,
      draggable: true,
    },
    1024: {
      // slidesPerView: 2.205,
      slidesPerView: "auto",
      spaceBetween: 30,
      allowTouchMove: false,
      draggable: false,
    },
  },
});

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", homepage);
