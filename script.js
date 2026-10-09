gsap.registerPlugin(ScrollTrigger);

/* ============ CONFIG: edit these ============ */
// Google Drive videos. For each file: Share -> "Anyone with the link" -> Viewer.
// The ID is the part between /d/ and /view in the share link:
// https://drive.google.com/file/d/THIS_PART_IS_THE_ID/view
//https://drive.google.com/file/d/19xNiRud7xkIAJ16A02t_9ozSRF4j7wP7/view?usp=drivesdk
//https://drive.google.com/file/d/1EJZPsMMmkEw4W-53cl7G_Awfhj1Vn3oE/view?usp=drivesdk
//https://drive.google.com/file/d/1PODJhR3xg5ZvEnK1zEv8ueOsFHLSFcMR/view?usp=drivesdk
//https://drive.google.com/file/d/1GF1X5zKI9eTeCn5zqHNg4mYK8vDUL6TC/view?usp=drivesdk
const VIDEOS = [
  { title: "Open fields", description: "An AI generated video about the journey from the farms  to the human ", id: "19xNiRud7xkIAJ16A02t_9ozSRF4j7wP7" },
  { title: "Check Bounce", description: "An AI generated video that explains the law about check bouncing", id: "1EJZPsMMmkEw4W-53cl7G_Awfhj1Vn3oE" },
  { title: "Police Arrest", description: "An AI generated video that explains the law about the police arrest", id: "1PODJhR3xg5ZvEnK1zEv8ueOsFHLSFcMR" },
  { title: "Complaint vs FIR", description: "An Ai generated video that tells the difference between FIR and complaint ", id: "1GF1X5zKI9eTeCn5zqHNg4mYK8vDUL6TC" },
];
const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID"; // create yours at formspree.io
const CONTACT_EMAIL = "YOUR_EMAIL@gmail.com";
/* ============================================= */

// Scroll progress bar (click to jump)
const indicator = document.getElementById("scroll-indicator");
const scrollBar = document.getElementById("scroll-bar");
let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      indicator.style.height = `${(window.scrollY / docHeight) * 100}%`;
      ticking = false;
    });
    ticking = true;
  }
});
scrollBar.addEventListener("click", (e) => {
  const rect = scrollBar.getBoundingClientRect();
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  window.scrollTo({ top: ((e.clientY - rect.top) / rect.height) * docHeight, behavior: "smooth" });
});

// Loader
const letters = document.querySelectorAll(".loading-text span");
const tl = gsap.timeline({
  onComplete: () => {
    gsap.to("#loading", { opacity: 0, duration: 1, delay: 0.3, onComplete: () => (document.getElementById("loading").style.display = "none") });
  },
});
tl.to(letters, { opacity: 1, duration: 0.4, stagger: 0.15 });
tl.to(letters, { color: "#1DCD9F", duration: 0.3, stagger: 0.1 }, "-=0.4");

// Particles (hero + projects)
const particleConfig = (count) => ({
  particles: {
    number: { value: count },
    color: { value: "#1DCD9F" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 150, color: "#1DCD9F", opacity: 0.3, width: 1 },
    move: { enable: true, speed: 2, direction: "none", out_mode: "out" },
  },
  interactivity: {
    detect_on: "canvas",
    events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
    modes: { grab: { distance: 140, line_linked: { opacity: 1 } }, push: { particles_nb: 4 } },
  },
  retina_detect: true,
});
particlesJS("particles-hero", particleConfig(70));
particlesJS("particles-projects", particleConfig(40));

// Scroll reveals
gsap.utils.toArray(".journey-card").forEach((card) => {
  gsap.from(card, { opacity: 0, y: 80, duration: 0.5, ease: "power3.out",
    scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" } });
});
gsap.from("#about-img", { opacity: 0, x: -100, duration: 0.5, ease: "power3.out",
  scrollTrigger: { trigger: "#about-img", start: "top 80%", toggleActions: "play none none reset" } });
gsap.from("#about-text", { opacity: 0, y: 50, duration: 0.5, delay: 0.2, ease: "power3.out",
  scrollTrigger: { trigger: "#about-text", start: "top 80%", toggleActions: "play none none reset" } });
gsap.utils.toArray(".reveal-section").forEach((el) => {
  gsap.from(el, { opacity: 0, y: 60, duration: 1,
    scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reset" } });
});
gsap.utils.toArray(".project-card").forEach((card) => {
  gsap.from(card, { opacity: 0, y: 60, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reset" } });
});

// Videos from Google Drive
const videoGrid = document.getElementById("video-grid");
VIDEOS.forEach((v) => {
  const ready = v.id && !v.id.startsWith("YOUR_");
  const card = document.createElement("article");
  card.className = "video-card";
  card.innerHTML = `
    <div class="video-frame">
      ${ready
        ? `<iframe src="https://drive.google.com/file/d/${v.id}/preview" title="${v.title}" loading="lazy" allow="autoplay; fullscreen" allowfullscreen></iframe>`
        : `<div class="video-placeholder">Add your Google Drive file ID in script.js</div>`}
    </div>
    <div class="p-5">
      <h3 class="text-xl font-semibold text-[#1DCD9F] mb-1">${v.title}</h3>
      <p class="text-gray-400 text-sm">${v.description}</p>
    </div>`;
  videoGrid.appendChild(card);
  gsap.from(card, { opacity: 0, y: 50, duration: 0.8, ease: "power3.out",
    scrollTrigger: { trigger: card, start: "top 88%", toggleActions: "play none none reset" } });
});

// Contact form
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const submitLoading = document.getElementById("submitLoading");
  const formMessage = document.getElementById("formMessage");
  const messageText = document.getElementById("messageText");
  const messageInput = document.getElementById("message");

  function checkMessage(text) {
    const errors = [];
    const clean = text.trim().replace(/\s+/g, " ");
    const words = clean.split(" ").filter(Boolean);
    if (clean.length < 10) errors.push("Message must be at least 10 characters long");
    if (words.length < 3) errors.push("Message must contain at least 3 words");
    if (/(.)\1{4,}/.test(clean)) errors.push("Message contains too many repeated characters");
    const counts = {};
    words.forEach((w) => { const c = w.toLowerCase().replace(/[^\w]/g, ""); if (c.length > 2) counts[c] = (counts[c] || 0) + 1; });
    if (Object.values(counts).some((n) => n > 2)) errors.push("Message contains too many repeated words");
    if ([/asdfgh/i, /qwerty/i, /zxcvbn/i, /123456/i, /abcdef/i, /[!@#$%^&*]{3,}/].some((p) => p.test(clean))) errors.push("Message contains random character sequences");
    if (words.filter((w) => w.length >= 3).length < 2) errors.push("Message must contain meaningful words (3+ characters)");
    return { isValid: errors.length === 0, errors };
  }

  function showMessage(html, type) {
    messageText.innerHTML = html;
    formMessage.className = `mt-4 p-4 rounded-lg ${type === "success" ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`;
    setTimeout(() => formMessage.classList.add("hidden"), 8000);
  }

  function setLoading(on) {
    submitBtn.disabled = on;
    submitText.classList.toggle("hidden", on);
    submitLoading.classList.toggle("hidden", !on);
  }

  let timer;
  messageInput.addEventListener("input", function () {
    clearTimeout(timer);
    timer = setTimeout(() => {
      this.parentElement.querySelectorAll(".validation-error, .validation-success").forEach((n) => n.remove());
      this.classList.remove("border-red-500", "border-green-500");
      if (!this.value.trim()) return;
      const result = checkMessage(this.value);
      const note = document.createElement("div");
      note.className = result.isValid ? "validation-success text-green-600" : "validation-error text-red-500";
      note.innerHTML = result.isValid ? "Message looks good!" : result.errors.join("<br>");
      this.classList.add(result.isValid ? "border-green-500" : "border-red-500");
      this.parentElement.appendChild(note);
      setTimeout(() => note.remove(), 2500);
    }, 500);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const check = checkMessage(fd.get("message"));
    if (!check.isValid) return showMessage(`Please fix the following:<br>${check.errors.join("<br>")}`, "error");

    const data = Object.fromEntries(["firstName", "lastName", "email", "subject", "message"].map((k) => [k, fd.get(k)]));
    setLoading(true);
    try {
      const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed");
      showMessage("Thank you! Your message has been sent. I'll get back to you soon!", "success");
      form.reset();
    } catch {
      const body = encodeURIComponent(`Name: ${data.firstName} ${data.lastName}\nEmail: ${data.email}\n\n${data.message}`);
      const link = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Portfolio Contact: " + data.subject)}&body=${body}`;
      showMessage(`Form submission failed. <a href="${link}" class="underline">Click here to email me directly</a> or try again later.`, "error");
    } finally {
      setLoading(false);
    }
  });
});

// Back to top
const backToTop = document.getElementById("backToTop");
window.addEventListener("scroll", () => backToTop.classList.toggle("show", window.scrollY > 300));
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));