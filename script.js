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
    const card = document.getElementById("revealCard");
    if (card) scratchObserver.observe(card, { attributes: true, attributeFilter: ["class"] });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", beginScratchWatch, { once: true });
  } else {
    beginScratchWatch();
  }
})();
