(() => {
  /* Latest ChatGPT preview compatibility layer. */
  const nativeSetTimeout = window.setTimeout.bind(window);
  const previewOpeningDelays = new Map([
    [1050, 180],
    [1450, 360],
    [1750, 500],
    [2350, 720],
  ]);

  window.setTimeout = (handler, delay, ...args) =>
    nativeSetTimeout(handler, previewOpeningDelays.get(delay) ?? delay, ...args);

  document.querySelector(".entry-note")?.remove();

  const alignLatestPreview = () => {
    document.querySelector(".entry-note")?.remove();

    const storyImage = document.querySelector(".story-card > img");
    if (storyImage) {
      storyImage.src = "assets/couple-art-front-approved-cropped.webp?v=20260912b";
      storyImage.alt = "Watercolour Christian wedding portrait of Paul Daniel and Joanne Biju";
    }

    const lightboxImage = document.querySelector("#lightbox img");
    if (lightboxImage) {
      lightboxImage.src = "assets/couple-art-front-approved.webp?v=20260912b";
    }

    const theme = document.querySelector('meta[name="theme-color"]');
    if (theme) theme.content = "#5f1728";
  };

  alignLatestPreview();

  const invitationScript = document.createElement("script");
  invitationScript.src = "script-original.js?v=20260912b";
  invitationScript.defer = false;
  document.body.appendChild(invitationScript);

  /* Ensure the scratch instruction never returns after the date is revealed. */
  const scratchObserver = new MutationObserver(() => {
    const card = document.getElementById("revealCard");
    if (!card?.classList.contains("revealed-celebration")) return;
    document.querySelector(".scratch-label")?.remove();
    const hint = document.querySelector(".scratch-hint");
    if (hint) hint.hidden = true;
  });

  const beginScratchWatch = () => {
    alignLatestPreview();
    const card = document.getElementById("revealCard");
    if (card) scratchObserver.observe(card, { attributes: true, attributeFilter: ["class"] });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", beginScratchWatch, { once: true });
  } else {
    beginScratchWatch();
  }
})();
