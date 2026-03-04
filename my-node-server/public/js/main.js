document.addEventListener("DOMContentLoaded", () => {
  // Highlight the active nav link based on the current page
  const currentPath = window.location.pathname;
  document.querySelectorAll("nav a").forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  console.log(`Page loaded: ${document.title}`);
});
