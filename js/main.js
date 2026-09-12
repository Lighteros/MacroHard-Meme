document.documentElement.classList.add("js");

const CA = "SOON";

const caButton = document.getElementById("copy-ca");
const caValue = document.getElementById("ca-value");
const caHint = document.getElementById("ca-hint");
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav-toggle");

if (caValue) {
  caValue.textContent = CA;
}

caButton?.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CA);
    caButton.classList.add("copied");
    if (caHint) caHint.textContent = "copied";
    window.setTimeout(() => {
      caButton.classList.remove("copied");
      if (caHint) caHint.textContent = "copy";
    }, 1400);
  } catch {
    if (caHint) caHint.textContent = "failed";
  }
});

toggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
});

document.querySelectorAll("#site-nav a").forEach((link) => {
  link.addEventListener("click", () => nav.classList.remove("open"));
});

const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);
reveals.forEach((node, index) => {
  node.style.animationDelay = `${(index % 4) * 0.08}s`;
  io.observe(node);
});

if (location.hash) {
  reveals.forEach((node) => node.classList.add("in"));
  const target = document.getElementById(location.hash.slice(1));
  target?.scrollIntoView();
}

window.setTimeout(() => {
  reveals.forEach((node) => node.classList.add("in"));
}, 1800);

const canvas = document.getElementById("ink-trail");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  const dots = [];
  const colors = ["#e24b3c", "#7cbc3d", "#f0c21a", "#3d8fd9"];
  let width = 0;
  let height = 0;

  const resize = () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  };

  resize();
  window.addEventListener("resize", resize);

  window.addEventListener("pointermove", (event) => {
    dots.push({
      x: event.clientX,
      y: event.clientY,
      life: 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 3 + Math.random() * 3,
    });
    if (dots.length > 80) dots.shift();
  });

  const tick = () => {
    ctx.clearRect(0, 0, width, height);
    for (let i = dots.length - 1; i >= 0; i -= 1) {
      const dot = dots[i];
      dot.life -= 0.02;
      if (dot.life <= 0) {
        dots.splice(i, 1);
        continue;
      }
      ctx.globalAlpha = dot.life * 0.45;
      ctx.fillStyle = dot.color;
      ctx.beginPath();
      ctx.arc(dot.x, dot.y, dot.size * dot.life, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  };

  tick();
}

document.querySelectorAll(".hero-title span").forEach((letter, index) => {
  letter.style.setProperty("--r", `${(index % 2 === 0 ? -3 : 3) + (index - 4) * 0.4}deg`);
});
