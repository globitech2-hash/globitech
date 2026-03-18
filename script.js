/* ============================================
   GLOBITECH — Portfolio Interactions
   Owhe Oghale
   ============================================ */

(function () {
  "use strict";

  /* --- DOM References --- */
  const header = document.querySelector(".header");
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav a");
  const revealElements = document.querySelectorAll(".reveal");
  const gridCanvas = document.getElementById("gridCanvas");

  /* --- Header Shrink on Scroll --- */
  let lastScrollY = 0;
  let ticking = false;

  function onScroll() {
    lastScrollY = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }

  function updateHeader() {
    if (lastScrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
    ticking = false;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* --- Mobile Navigation --- */
  function toggleMobileNav() {
    navToggle.classList.toggle("active");
    mobileNav.classList.toggle("open");
    document.body.style.overflow = mobileNav.classList.contains("open")
      ? "hidden"
      : "";
  }

  navToggle.addEventListener("click", toggleMobileNav);

  mobileNavLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      navToggle.classList.remove("active");
      mobileNav.classList.remove("open");
      document.body.style.overflow = "";
    });
  });

  /* --- Smooth Scroll for Anchor Links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      var targetId = this.getAttribute("href");
      if (targetId === "#") return;
      var target = document.querySelector(targetId);
      if (target) {
        var headerOffset = 80;
        var elementPosition =
          target.getBoundingClientRect().top + window.scrollY;
        var offsetPosition = elementPosition - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  /* --- Scroll Reveal --- */
  function initReveal() {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      },
    );

    revealElements.forEach(function (el) {
      observer.observe(el);
    });
  }

  initReveal();

  /* --- Animated Grid Canvas --- */
  function initGridCanvas() {
    if (!gridCanvas) return;

    var ctx = gridCanvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var width, height, cols, rows;
    var cellSize = 40;
    var mouse = { x: -1000, y: -1000 };
    var animationId;

    function resize() {
      var rect = gridCanvas.parentElement.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      gridCanvas.width = width * dpr;
      gridCanvas.height = height * dpr;
      gridCanvas.style.width = width + "px";
      gridCanvas.style.height = height + "px";
      ctx.scale(dpr, dpr);
      cols = Math.ceil(width / cellSize) + 1;
      rows = Math.ceil(height / cellSize) + 1;
    }

    resize();

    var parentEl = gridCanvas.parentElement;
    parentEl.addEventListener("mousemove", function (e) {
      var rect = parentEl.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    parentEl.addEventListener("mouseleave", function () {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    var time = 0;

    function draw() {
      ctx.clearRect(0, 0, width, height);
      time += 0.003;

      for (var i = 0; i <= cols; i++) {
        for (var j = 0; j <= rows; j++) {
          var x = i * cellSize;
          var y = j * cellSize;

          var dx = mouse.x - x;
          var dy = mouse.y - y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var maxDist = 150;
          var influence = Math.max(0, 1 - dist / maxDist);

          var wave = Math.sin(time + i * 0.3 + j * 0.2) * 0.3 + 0.3;
          var alpha = 0.04 + wave * 0.03 + influence * 0.25;

          var radius = 1 + influence * 2;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(79, 140, 255, " + alpha + ")";
          ctx.fill();

          /* Draw connecting lines near mouse */
          if (influence > 0.1) {
            if (i < cols) {
              var nx = (i + 1) * cellSize;
              var ny = j * cellSize;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(nx, ny);
              ctx.strokeStyle = "rgba(79, 140, 255, " + influence * 0.12 + ")";
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
            if (j < rows) {
              var nx2 = i * cellSize;
              var ny2 = (j + 1) * cellSize;
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(nx2, ny2);
              ctx.strokeStyle = "rgba(79, 140, 255, " + influence * 0.12 + ")";
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    draw();

    var resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function () {
        cancelAnimationFrame(animationId);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        resize();
        draw();
      }, 200);
    });
  }

  initGridCanvas();

  /* --- Form Interaction --- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = contactForm.querySelector(".btn-submit");
      var originalText = btn.innerHTML;
      btn.innerHTML = "<span>Message Sent</span>";
      btn.style.background = "#22c55e";
      setTimeout(function () {
        btn.innerHTML = originalText;
        btn.style.background = "";
        contactForm.reset();
      }, 2500);
    });
  }

  /* --- Current Year --- */
  var yearEl = document.getElementById("currentYear");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
