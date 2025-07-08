// ===== init =====
const homepage = () => {
  // # init loading
  initLoading();
};

// ===== init loading =====
const preventScroll = (e) => e.preventDefault();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initLoading = async () => {
  if (sessionStorage.getItem("opening-displayed") === "true") {
    document.querySelector("[data-loading]").remove();
    // swiperFv.autoplay.start();
  } else {
    // # Block scroll events
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });
    window.addEventListener("scroll", preventScroll, { passive: false });

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

    // # play swiper fv
    // swiperFv.autoplay.start();

    // # set sessionStorage
    sessionStorage.setItem("opening-displayed", !0);
  }
};

// ===== scroll logo shrink =====
const handleHeaderLogo = function () {
  const headerLogo = document.querySelector("[data-header-logo]");
  const scrollPosition = window.scrollY || document.documentElement.scrollTop;
  if (!headerLogo || isMobile.matches) return;

  headerLogo.classList.toggle("--shrink", scrollPosition > 80);
};
window.addEventListener("scroll", handleHeaderLogo);

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

// ### ===== DOMCONTENTLOADED ===== ###
window.addEventListener("DOMContentLoaded", homepage);
