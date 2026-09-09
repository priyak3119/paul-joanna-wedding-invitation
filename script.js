const WEDDING_DATE = new Date("2026-12-29T11:00:00+05:30");
const entry = document.getElementById("entry"),
  main = document.getElementById("invitation"),
  musicButton = document.getElementById("musicButton"),
  musicPanel = document.getElementById("youtubeMusic"),
  musicPlayer = document.getElementById("youtubeMusicPlayer");
let musicPlaying = false;
function sendMusicCommand(command) {
  musicPlayer.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func: command, args: [] }),
    "https://www.youtube-nocookie.com",
  );
}
function setMusicState(playing) {
  musicPlaying = playing;
  sendMusicCommand(playing ? "playVideo" : "pauseVideo");
  musicButton.classList.toggle("playing", playing);
  musicButton.setAttribute(
    "aria-label",
    playing ? "Pause background music" : "Play background music",
  );
}
musicPlayer.addEventListener("load", () => {
  if (musicPlaying) sendMusicCommand("playVideo");
});
document
  .getElementById("openInvitation")
  .addEventListener("click", () => {
    main.hidden = false;
    document.body.classList.remove("locked");
    entry.classList.add("hidden");
    musicPanel.classList.add("visible");
    setTimeout(() => entry.remove(), 950);
    initScratch();
    observeSections();
    startCelebrationEffects();
    setMusicState(true);
  });
musicButton.addEventListener("click", () => {
  musicPanel.classList.add("visible");
  setMusicState(!musicPlaying);
});
const pad = (v, n = 2) => String(Math.max(0, v)).padStart(n, "0");
function updateCountdown() {
  const d = Math.max(0, WEDDING_DATE - Date.now());
  const values = {
    days: Math.floor(d / 86400000),
    hours: Math.floor(d / 3600000) % 24,
    minutes: Math.floor(d / 60000) % 60,
    seconds: Math.floor(d / 1000) % 60,
  };
  Object.entries(values).forEach(([id, value]) => {
    document.getElementById(id).textContent = pad(value, id === "days" ? 3 : 2);
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);
function initScratch() {
  const canvas = document.getElementById("scratchCanvas"),
    box = document.getElementById("revealCard"),
    burst = document.getElementById("revealBurst"),
    status = document.getElementById("revealStatus"),
    hint = document.querySelector(".scratch-hint"),
    prompt = box.querySelector(".scratch-label"),
    countdown = document.querySelector(".countdown"),
    ctx = canvas.getContext("2d");
  if (!ctx) return;
  const ratio = Math.max(1, devicePixelRatio || 1),
    rect = box.getBoundingClientRect();
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  ctx.scale(ratio, ratio);
  const gradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  gradient.addColorStop(0, "#260207");
  gradient.addColorStop(0.36, "#4b0812");
  gradient.addColorStop(0.66, "#66101c");
  gradient.addColorStop(1, "#240106");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, rect.width, rect.height);
  const sheen = ctx.createRadialGradient(
    rect.width * 0.56,
    rect.height * 0.42,
    0,
    rect.width * 0.56,
    rect.height * 0.42,
    rect.width * 0.62,
  );
  sheen.addColorStop(0, "#ffffff24");
  sheen.addColorStop(0.52, "#ffffff08");
  sheen.addColorStop(1, "#0000001f");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, rect.width, rect.height);
  ctx.fillStyle = "#f5d27b";
  for (let i = 0; i < 130; i++) {
    const x = (i * 73) % rect.width,
      y = (i * 47) % rect.height,
      size = 0.35 + (i % 4) * 0.22;
    ctx.globalAlpha = 0.08 + (i % 5) * 0.025;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "destination-out";
  let drawing = false,
    moves = 0,
    lastPoint = null,
    dateRevealed = false;
  const revealDate = () => {
    if (dateRevealed) return;
    dateRevealed = true;
    drawing = false;
    ctx.clearRect(0, 0, rect.width, rect.height);
    box.classList.add("scratched", "revealed-celebration");
    canvas.hidden = true;
    prompt?.remove();
    canvas.setAttribute("aria-disabled", "true");
    status.textContent = "Wedding date revealed: 29th December 2026";
    hint.textContent = "Our special day is revealed ✦";
    countdown.hidden = false;
    countdown.classList.add("countdown-celebration");
    const symbols = ["✦", "✧", "❀", "❁", "•", "♡"];
    for (let i = 0; i < 34; i++) {
      const particle = document.createElement("span"),
        angle = (Math.PI * 2 * i) / 34,
        distance = 75 + (i % 6) * 18;
      particle.textContent = symbols[i % symbols.length];
      particle.style.setProperty("--burst-x", `${Math.cos(angle) * distance}px`);
      particle.style.setProperty("--burst-y", `${Math.sin(angle) * distance}px`);
      particle.style.setProperty("--burst-spin", `${180 + (i % 5) * 90}deg`);
      particle.style.setProperty("--burst-delay", `${(i % 7) * 0.025}s`);
      particle.style.setProperty("--burst-size", `${0.72 + (i % 4) * 0.18}rem`);
      particle.style.setProperty(
        "--burst-color",
        i % 3 === 0 ? "#fff1dc" : i % 3 === 1 ? "#f2bc45" : "#8a1d2a",
      );
      burst.appendChild(particle);
    }
    setTimeout(() => burst.replaceChildren(), 2200);
  };
  const scratchedEnough = () => {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data,
      step = Math.max(8, Math.floor(ratio * 7)),
      stride = canvas.width * 4;
    let clear = 0,
      sampled = 0;
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        sampled++;
        if (pixels[y * stride + x * 4 + 3] < 35) clear++;
      }
    }
    return clear / sampled > 0.34;
  };
  const pointerPosition = (e) => {
    const bounds = canvas.getBoundingClientRect();
    return { x: e.clientX - bounds.left, y: e.clientY - bounds.top };
  };
  const scratch = (e) => {
    if (!drawing || dateRevealed) return;
    const point = pointerPosition(e);
    ctx.lineWidth = Math.min(54, Math.max(42, rect.width * 0.085));
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    if (lastPoint) ctx.moveTo(lastPoint.x, lastPoint.y);
    else ctx.moveTo(point.x, point.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPoint = point;
    moves++;
    box.classList.add("scratched");
    if ((moves % 7 === 0 && scratchedEnough()) || moves > 78) revealDate();
  };
  canvas.addEventListener("pointerdown", (e) => {
    if (dateRevealed) return;
    drawing = true;
    lastPoint = null;
    canvas.setPointerCapture(e.pointerId);
    scratch(e);
  });
  canvas.addEventListener("pointermove", scratch);
  canvas.addEventListener("pointerup", () => {
    drawing = false;
    lastPoint = null;
  });
  canvas.addEventListener("pointercancel", () => {
    drawing = false;
    lastPoint = null;
  });
  canvas.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      revealDate();
    }
  });
}
function observeSections() {
  const observer = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          observer.unobserve(e.target);
        }
      }),
    { threshold: 0.08 },
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}
function startCelebrationEffects() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const layer = document.getElementById("motionLayer"),
    symbols = ["❀", "✿", "❁", "•", "✦"];
  for (let i = 0; i < 36; i++) {
    const particle = document.createElement("span");
    particle.className = "opening-particle";
    particle.textContent = symbols[i % symbols.length];
    particle.style.setProperty("--x", `${(i * 29) % 100}%`);
    particle.style.setProperty("--delay", `${(i % 12) * 0.09}s`);
    particle.style.setProperty("--duration", `${3.8 + (i % 7) * 0.28}s`);
    particle.style.setProperty("--drift", `${-110 + (i % 9) * 28}px`);
    particle.style.setProperty("--spin", `${360 + (i % 5) * 140}deg`);
    particle.style.setProperty("--particle-size", `${0.8 + (i % 5) * 0.22}rem`);
    particle.style.setProperty(
      "--particle-color",
      i % 3 === 0 ? "#f7d7db" : i % 3 === 1 ? "#efb83e" : "#fff1dd",
    );
    layer.appendChild(particle);
    setTimeout(() => particle.remove(), 6800);
  }
  for (let i = 0; i < 28; i++) {
    const petal = document.createElement("span");
    petal.className = "falling-petal";
    petal.textContent = symbols[i % symbols.length];
    petal.style.setProperty("--x", `${(i * 37) % 100}%`);
    petal.style.setProperty("--delay", `${1.8 + (i % 12) * 0.42}s`);
    petal.style.setProperty("--duration", `${6 + (i % 6) * 0.72}s`);
    petal.style.setProperty("--drift", `${-50 + (i % 7) * 17}px`);
    layer.appendChild(petal);
  }
  for (let i = 0; i < 4; i++) {
    const butterfly = document.createElement("span");
    butterfly.className = `butterfly butterfly--${i + 1}`;
    butterfly.textContent = "🦋";
    layer.appendChild(butterfly);
  }
}
const lightbox = document.getElementById("lightbox"),
  lightboxImage = lightbox.querySelector("img");
document.querySelectorAll("[data-image]").forEach((button) =>
  button.addEventListener("click", () => {
    lightboxImage.src = button.dataset.image;
    lightbox.showModal();
  }),
);
lightbox
  .querySelector("button")
  .addEventListener("click", () => lightbox.close());
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});
const attendanceValue = document.getElementById("attendanceValue"),
  attendanceButtons = document.querySelectorAll("[data-attendance]"),
  rsvpPanels = document.querySelectorAll("[data-rsvp-panel]");
attendanceButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const selection = button.dataset.attendance;
    attendanceValue.value = selection;
    attendanceButtons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    rsvpPanels.forEach((panel) => {
      const selected = panel.dataset.rsvpPanel === selection;
      panel.hidden = !selected;
      panel.classList.toggle("is-active", selected);
      panel.querySelectorAll("input, select, textarea").forEach((field) => {
        field.disabled = !selected;
      });
    });
    const activePanel = document.querySelector(`[data-rsvp-panel="${selection}"]`);
    activePanel.querySelector("textarea, select")?.focus({ preventScroll: true });
  }),
);
const rsvpForm = document.getElementById("rsvpForm"),
  formStatus = document.getElementById("formStatus"),
  successDialog = document.getElementById("successDialog");
function selectAttendance(selection = "Attending") {
  document.querySelector(`[data-attendance="${selection}"]`)?.click();
}
rsvpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const form = new FormData(e.currentTarget),
    name = form.get("name"),
    attendance = form.get("attendance"),
    attending = attendance === "Attending",
    guests = attending ? form.get("guests") : "Not attending in person",
    events = attending
      ? form.getAll("event").join(", ") || "Not specified"
      : "Wishes online",
    message = attending
      ? form.get("message") || "With prayers and best wishes"
      : form.get("online_wish") || "Sending our prayers and warm wishes";
  const text = `Wedding RSVP%0AName: ${encodeURIComponent(name)}%0AResponse: ${encodeURIComponent(attendance)}%0AGuests: ${encodeURIComponent(guests)}%0AEvents: ${encodeURIComponent(events)}%0AMessage: ${encodeURIComponent(message)}`;
  window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  rsvpForm.reset();
  selectAttendance("Attending");
  formStatus.textContent = "Response submitted successfully.";
  successDialog.showModal();
});
document.getElementById("closeSuccess").addEventListener("click", () => {
  successDialog.close();
  rsvpForm.querySelector('[name="name"]').focus();
});
successDialog.addEventListener("click", (event) => {
  if (event.target === successDialog) successDialog.close();
});
