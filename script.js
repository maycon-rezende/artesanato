(function () {
  "use strict";

  // ======= ABERTURA DA HOME =======
  var siteIntro = document.getElementById("siteIntro");
  var introEnter = document.getElementById("introEnter");
  var introSkip = document.getElementById("introSkip");
  function closeIntro() {
    if (!siteIntro || siteIntro.classList.contains("is-leaving")) return;
    siteIntro.classList.add("is-leaving");
    document.body.classList.remove("intro-active");
    document.body.classList.add("home-ready");
    startMusic();
    setMusicUI(true);
    setTimeout(function () { siteIntro.hidden = true; }, 900);
  }
  if (siteIntro) {
    document.body.classList.add("intro-active");
    if (introEnter) introEnter.addEventListener("click", closeIntro);
    if (introSkip) introSkip.addEventListener("click", closeIntro);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !siteIntro.hidden) closeIntro();
    });
  }

  // ======= PROFUNDIDADE ARTESANAL NO HERO =======
  var hero = document.querySelector(".hero");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (hero && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    var parallaxItems = hero.querySelectorAll("[data-depth]");
    var framePending = false;
    var pointerX = 0;
    var pointerY = 0;
    function paintHeroMotion() {
      hero.style.setProperty("--mouse-x", ((pointerX + 1) * 50) + "%");
      hero.style.setProperty("--mouse-y", ((pointerY + 1) * 50) + "%");
      parallaxItems.forEach(function (item) {
        var depth = Number(item.dataset.depth) || 10;
        item.style.setProperty("--shift-x", (pointerX * depth) + "px");
        item.style.setProperty("--shift-y", (pointerY * depth) + "px");
      });
      framePending = false;
    }
    hero.addEventListener("pointermove", function (e) {
      var rect = hero.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width - .5) * 2;
      pointerY = ((e.clientY - rect.top) / rect.height - .5) * 2;
      if (!framePending) { framePending = true; requestAnimationFrame(paintHeroMotion); }
    });
    hero.addEventListener("pointerleave", function () {
      pointerX = 0; pointerY = 0;
      if (!framePending) { framePending = true; requestAnimationFrame(paintHeroMotion); }
    });
  }

  // ======= CURSOR-AGULHA NA HOME =======
  var needleCursor = document.getElementById("needleCursor");
  if (!needleCursor) {
    needleCursor = document.createElement("div");
    needleCursor.className = "needle-cursor";
    needleCursor.id = "needleCursor";
    needleCursor.setAttribute("aria-hidden", "true");
    needleCursor.innerHTML = '<svg viewBox="0 0 72 72"><path class="needle-thread" d="M8 61 C18 45 24 64 37 50 C46 40 45 28 51 18"/><path class="needle-body" d="M50 21 L62 7"/><ellipse class="needle-eye" cx="63" cy="6" rx="3.8" ry="2.2" transform="rotate(-45 63 6)"/></svg>';
    document.body.appendChild(needleCursor);
  }
  if (needleCursor && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    document.body.classList.add("has-needle-cursor");
    var needleX = window.innerWidth / 2;
    var needleY = window.innerHeight / 2;
    var targetNeedleX = needleX;
    var targetNeedleY = needleY;
    var needleRunning = false;
    function animateNeedle() {
      needleX += (targetNeedleX - needleX) * .24;
      needleY += (targetNeedleY - needleY) * .24;
      needleCursor.style.transform = "translate3d(" + needleX + "px," + needleY + "px,0)";
      if (Math.abs(targetNeedleX - needleX) > .1 || Math.abs(targetNeedleY - needleY) > .1) {
        requestAnimationFrame(animateNeedle);
      } else {
        needleRunning = false;
      }
    }
    document.addEventListener("pointermove", function (e) {
      targetNeedleX = e.clientX;
      targetNeedleY = e.clientY;
      needleCursor.classList.add("is-visible");
      if (!needleRunning) { needleRunning = true; requestAnimationFrame(animateNeedle); }
    });
    document.addEventListener("pointerover", function (e) {
      needleCursor.classList.toggle("is-hovering", Boolean(e.target.closest("a, button, input, textarea, select, [role='button']")));
    });
    document.documentElement.addEventListener("mouseleave", function () {
      needleCursor.classList.remove("is-visible");
    });
  }

  // ======= NOME COSTURADO LETRA POR LETRA NA INTRO =======
  var stitchedTitle = document.getElementById("introTitle");
  if (stitchedTitle) {
    var stitchIndex = 0;
    function stitchTextNode(node, container) {
      Array.prototype.forEach.call(node.childNodes, function (child) {
        if (child.nodeType === 3) {
          var fragment = document.createDocumentFragment();
          Array.prototype.forEach.call(child.nodeValue, function (character) {
            var letter = document.createElement("span");
            letter.className = "stitched-letter" + (character === " " ? " stitched-space" : "");
            letter.textContent = character === " " ? "\u00a0" : character;
            letter.style.setProperty("--stitch-delay", (.55 + stitchIndex * .24) + "s");
            fragment.appendChild(letter);
            stitchIndex++;
          });
          container.replaceChild(fragment, child);
        } else if (child.nodeType === 1) {
          stitchTextNode(child, child);
        }
      });
    }
    stitchTextNode(stitchedTitle, stitchedTitle);
    stitchedTitle.classList.add("is-being-stitched");
  }

  // ======= CONFIG =======
  var WHATSAPP_NUMBER = "5515996653654"; // protótipo — trocar pelo número definitivo da Emily

  function buildWhatsappLink(message) {
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  }

  // ======= PRODUTOS =======
  var products = [
    { id: "coringa", title: "Ilustração \u201cCoringa\u201d", desc: "Retrato autoral em lápis de cor, papel canson.", price: 190, category: "desenho", img: "images/coringa.jpg" },
    { id: "feiticeira", title: "Feiticeira Escarlate", desc: "Retrato colorido de personagem, lápis de cor.", price: 180, category: "desenho", img: "images/feiticeira-escarlate.jpg" },
    { id: "starfire", title: "Starfire", desc: "Ilustração colorida estilo comic, canetas de nanquim coloridas.", price: 170, category: "desenho", img: "images/starfire.jpg" },
    { id: "gaviao", title: "Gavião Negra", desc: "Ilustração aquarelada de personagem, estilo comic.", price: 160, category: "desenho", img: "images/gaviao-negra.jpg" },
    { id: "garden-wall", title: "Cena \u201cOver the Garden Wall\u201d", desc: "Ilustração narrativa colorida, nanquim e marcador.", price: 200, category: "desenho", img: "images/garden-wall.jpg" },
    { id: "santa-muerte", title: "Santa Muerte", desc: "Desenho autoral em nanquim, tracejado fino.", price: 140, category: "desenho", img: "images/santa-muerte.jpg" },
    { id: "mika", title: "Model Sheet de personagem", desc: "Design de personagem completo: turnaround + expressões.", price: 130, category: "desenho", img: "images/mika-modelsheet.jpg" },
    { id: "banguela", title: "Amigurumi Banguela", desc: "Dragão de crochê, com asas e detalhes bordados.", price: 130, category: "amigurumi", img: "images/banguela.jpg" },
    { id: "flor", title: "Amigurumi Florzinha", desc: "Personagem-flor de crochê, peça exclusiva.", price: 75, category: "amigurumi", img: "images/flor-amigurumi.jpg" },
    { id: "jesus", title: "Amigurumi Jesus", desc: "Boneco de crochê com detalhes em sandália e cordão.", price: 110, category: "amigurumi", img: "images/jesus-amigurumi.jpg" },
    { id: "naruto-pirata", title: "Dupla Naruto &amp; Pirata", desc: "Par de amigurumis temáticos, vendidos juntos.", price: 95, category: "amigurumi", img: "images/naruto-pirata.jpg" },
    { id: "deadpool", title: "Amigurumi Deadpool", desc: "Boneco de crochê com katanas e cinto de acessórios.", price: 140, category: "amigurumi", img: "images/deadpool.jpg" },
    { id: "minion", title: "Amigurumi Minion", desc: "Mini amigurumi, ótimo para chaveiro ou enfeite.", price: 55, category: "amigurumi", img: "images/minion.jpg" },
    { id: "maca", title: "Escultura Maçã (massinha)", desc: "Miniatura esculpida e pintada à mão.", price: 55, category: "escultura", img: "images/maca-massa.jpg" },
    { id: "totoro", title: "Escultura Totoro (argila)", desc: "Peça em argila modelada à mão, pronta para pintura.", price: 95, category: "escultura", img: "images/totoro-argila.jpg" },
    { id: "kirby", title: "Chaveiro Kirby", desc: "Chaveiro acrílico ilustrado, pintado à mão.", price: 28, category: "chaveiro", img: "images/kirby-chaveiro.jpg" },
    { id: "creeper", title: "Chaveiro Creeper", desc: "Chaveiro de crochê, detalhes em feltro.", price: 38, category: "chaveiro", img: "images/creeper-chaveiro.jpg" }
  ];

  var categoryLabel = { desenho: "Desenho", amigurumi: "Amigurumi", escultura: "Escultura", chaveiro: "Chaveiro" };

  function formatPrice(v) { return "R$ " + v.toFixed(2).replace(".", ","); }

  function whatsappMessageFor(product) {
    return "Olá, Emily! Vim pelo site e quero encomendar: " + product.title.replace(/&amp;/g, "&") +
      " (" + formatPrice(product.price) + "). Pode me passar mais detalhes?";
  }

  // ======= RENDER GRID (loja completa em galeria.html, ou vitrine em destaque na home) =======
  function cardHTML(p) {
    var link = buildWhatsappLink(whatsappMessageFor(p));
    var obraHref = "obras/" + p.id + ".html";
    return (
      '<article class="product-card reveal" data-category="' + p.category + '" data-whats="' + link + '">' +
        '<a class="product-photo" href="' + obraHref + '" aria-label="Ver ' + p.title + '">' +
          '<span class="product-tape tape-' + p.category + '">' + categoryLabel[p.category] + '</span>' +
          '<button class="heart-btn heart-btn-card" data-id="' + p.id + '" aria-label="Favoritar" aria-pressed="false">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s-7.5-4.6-10-9.3C.5 8 2.3 4.5 6 4c2.1-.3 3.9.7 6 3 2.1-2.3 3.9-3.3 6-3 3.7.5 5.5 4 4 7.7C19.5 16.4 12 21 12 21z"/></svg>' +
          '</button>' +
          '<img src="' + p.img + '" alt="' + p.title + ', arte feita à mão por Emily" loading="lazy">' +
        '</a>' +
        '<div class="product-body">' +
          '<a class="product-title" href="' + obraHref + '">' + p.title + '</a>' +
          '<p class="product-desc">' + p.desc + '</p>' +
          '<div class="product-footer">' +
            '<span class="product-price"><small>a partir de</small><span class="price-amount">' + formatPrice(p.price) + '</span></span>' +
            '<span class="product-cta">Pedir no zap →</span>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function wireGridInteractions(gridEl) {
    gridEl.addEventListener("click", function (e) {
      var heart = e.target.closest(".heart-btn");
      if (heart) {
        e.preventDefault();
        e.stopPropagation();
        toggleFavAnimated(heart);
        return;
      }
      var trigger = e.target.closest(".product-cta");
      if (trigger) {
        e.preventDefault();
        var card = e.target.closest(".product-card");
        celebrateAt(e.clientX, e.clientY);
        window.open(card.dataset.whats, "_blank", "noopener");
        return;
      }
      // foto e título seguem seus links para a página da obra.
    });
  }

  // loja completa (galeria.html) — com filtros
  var grid = document.getElementById("productGrid");
  if (grid) {
    grid.innerHTML = products.map(cardHTML).join("");
    wireGridInteractions(grid);

    // ======= FILTROS =======
    var filterBtns = document.querySelectorAll(".filter-btn");
    function applyFilter(filter) {
      filterBtns.forEach(function (b) { b.classList.toggle("is-active", b.dataset.filter === filter); });
      document.querySelectorAll(".product-card").forEach(function (card) {
        var match = filter === "todos" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !match);
      });
    }
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () { applyFilter(btn.dataset.filter); });
    });

    // filtro vindo por link (?filtro=desenho), usado pelo mega menu
    var params = new URLSearchParams(window.location.search);
    var filtroParam = params.get("filtro");
    if (filtroParam && document.querySelector('.filter-btn[data-filter="' + filtroParam + '"]')) {
      applyFilter(filtroParam);
    }
  }

  // vitrine em destaque (home) — sem filtros, seleção curada
  var featuredGrid = document.getElementById("featuredGrid");
  if (featuredGrid) {
    var featuredIds = ["coringa", "banguela", "totoro", "kirby"];
    var featuredItems = featuredIds.map(function (id) {
      for (var i = 0; i < products.length; i++) { if (products[i].id === id) return products[i]; }
      return null;
    }).filter(Boolean);
    featuredGrid.innerHTML = featuredItems.map(cardHTML).join("");
    wireGridInteractions(featuredGrid);
  }

  // ======= WHATSAPP PRINCIPAL (CTA GERAL) =======
  var mainWhats = document.getElementById("mainWhatsapp");
  if (mainWhats) {
    mainWhats.href = buildWhatsappLink("Olá, Emily! Vi seu ateliê no site e queria conversar sobre uma encomenda.");
  }

  // ======= HEADER SCROLL STATE + LINHA DE PROGRESSO =======
  var header = document.getElementById("siteHeader");
  var threadFill = document.getElementById("threadFill");
  function onScroll() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
    if (threadFill) {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0;
      threadFill.style.width = pct + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ======= MENU MOBILE =======
  var navToggle = document.getElementById("navToggle");
  var mainNav = document.getElementById("mainNav");
  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var isOpen = mainNav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      if (!isOpen) closeMega();
    });
    mainNav.querySelectorAll("a:not(.nav-mega-trigger)").forEach(function (a) {
      a.addEventListener("click", function () {
        mainNav.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // ======= MEGA MENU "EXPOSIÇÕES ARTÍSTICAS" =======
  var megaTrigger = document.getElementById("megaTrigger");
  var megaMenu = document.getElementById("megaMenu");
  function closeMega() {
    if (!megaMenu) return;
    megaMenu.classList.remove("is-open");
    if (megaTrigger) megaTrigger.setAttribute("aria-expanded", "false");
  }
  if (megaTrigger && megaMenu) {
    megaTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = megaMenu.classList.toggle("is-open");
      megaTrigger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".has-mega")) closeMega();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMega();
    });
    megaMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        closeMega();
        if (mainNav) mainNav.classList.remove("is-open");
      });
    });
  }

  // ======= FAQ ACCORDION =======
  document.querySelectorAll(".faq-question").forEach(function (btn) {
    var answer = btn.nextElementSibling;
    btn.addEventListener("click", function () {
      var isOpen = btn.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".faq-question").forEach(function (other) {
        if (other !== btn) {
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
      answer.style.maxHeight = isOpen ? null : answer.scrollHeight + "px";
    });
  });

  // ======= BOTÃO VOLTAR AO TOPO + BOTÕES FLUTUANTES (música/favoritos) =======
  var backToTop = document.getElementById("backToTop");
  var musicToggleBtn = document.getElementById("musicToggle");
  var favsWidgetEl = document.querySelector(".favs-widget");
  window.addEventListener("scroll", function () {
    var past = window.scrollY > 420;
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 600);
    if (musicToggleBtn) musicToggleBtn.classList.toggle("is-visible", past || Boolean(document.querySelector("#homeMusic, #pageMusic")));
    if (favsWidgetEl) favsWidgetEl.classList.toggle("is-visible", past);
  }, { passive: true });
  (function () {
    var past = window.scrollY > 420;
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 600);
    if (musicToggleBtn) musicToggleBtn.classList.toggle("is-visible", past || Boolean(document.querySelector("#homeMusic, #pageMusic")));
    if (favsWidgetEl) favsWidgetEl.classList.toggle("is-visible", past);
  })();
  if (backToTop) {
    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ======= RODAPÉ: ANO ATUAL =======
  var footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.textContent = "© " + new Date().getFullYear() + " Emily Artes";
  }

  // ======= MOSTRA EM LOOP CONTÍNUO =======
  var exhibitionWall = document.querySelector(".exhibition .exhibition-wall");
  if (exhibitionWall && exhibitionWall.children.length && !reduceMotion) {
    var originalFrames = Array.prototype.slice.call(exhibitionWall.children);
    var firstLoopGroup = document.createElement("div");
    var secondLoopGroup = document.createElement("div");
    firstLoopGroup.className = "exhibition-loop-group";
    secondLoopGroup.className = "exhibition-loop-group";
    secondLoopGroup.setAttribute("aria-hidden", "true");
    originalFrames.forEach(function (frame) {
      firstLoopGroup.appendChild(frame);
      var clone = frame.cloneNode(true);
      clone.classList.add("is-visible");
      clone.setAttribute("tabindex", "-1");
      secondLoopGroup.appendChild(clone);
    });
    var loopTrack = document.createElement("div");
    loopTrack.className = "exhibition-loop-track";
    loopTrack.appendChild(firstLoopGroup);
    loopTrack.appendChild(secondLoopGroup);
    exhibitionWall.appendChild(loopTrack);
    exhibitionWall.classList.add("loop-gallery");
  }

  // ======= SCROLL REVEAL =======
  document.querySelectorAll("main section > div, .how-step, .faq-item, .frame, .product-card, .obra-visual, .obra-info").forEach(function (el) {
    if (!el.classList.contains("reveal")) el.classList.add("reveal");
  });
  var revealTargets = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // ======= ÁUDIO (Web Audio API — sem arquivos externos) =======
  var audioCtx = null;
  function getCtx() {
    if (!audioCtx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      audioCtx = new AC();
    }
    if (audioCtx.state === "suspended") audioCtx.resume();
    return audioCtx;
  }
  function pluckNote(freq, time, dur, vol) {
    var ctx = getCtx();
    if (!ctx) return;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 3200;
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(vol, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }
  function playChime() {
    var ctx = getCtx();
    if (!ctx) return;
    var t = ctx.currentTime;
    pluckNote(659.25, t, 0.22, 0.13);
    pluckNote(783.99, t + 0.08, 0.24, 0.12);
    pluckNote(1046.5, t + 0.17, 0.32, 0.11);
  }

  // ======= MÚSICA AMBIENTE (somente arquivos escolhidos para cada página) =======
  var musicPlaying = false;
  var homeMusic = document.getElementById("homeMusic");
  var pageMusic = document.getElementById("pageMusic");
  var siteMusic = homeMusic || pageMusic;
  if (siteMusic) siteMusic.volume = .32;

  function startMusic() {
    if (musicPlaying || !siteMusic) return;
    var playRequest = siteMusic.play();
    if (playRequest && typeof playRequest.catch === "function") {
      playRequest.catch(function () {
        musicPlaying = false;
        setMusicUI(false);
      });
    }
    musicPlaying = true;
  }
  function stopMusic() {
    musicPlaying = false;
    if (siteMusic) siteMusic.pause();
  }

  var musicToggle = document.getElementById("musicToggle");
  function setMusicUI(on) {
    if (!musicToggle) return;
    musicToggle.classList.toggle("is-playing", on);
    musicToggle.setAttribute("aria-pressed", on ? "true" : "false");
    musicToggle.setAttribute("aria-label", on ? "Pausar música ambiente" : "Ligar música ambiente");
  }
  if (musicToggle && !siteMusic) musicToggle.hidden = true;
  if (siteMusic) {
    // Tenta tocar no carregamento. Se o navegador bloquear autoplay com som,
    // a primeira interação da visitante libera a faixa automaticamente.
    startMusic();
    window.addEventListener("pointerdown", function () { startMusic(); }, { once:true });
    siteMusic.addEventListener("play", function () { musicPlaying = true; setMusicUI(true); });
    siteMusic.addEventListener("pause", function () { musicPlaying = false; setMusicUI(false); });
  }

  // ======= CONFETE (feedback ao clicar em "pedir no zap") =======
  function burstConfetti(x, y) {
    var colors = ["#B23A48", "#DFA22E", "#56715B", "#D89A96"];
    for (var i = 0; i < 14; i++) {
      var el = document.createElement("span");
      el.className = "confetti-piece";
      el.style.left = x + "px";
      el.style.top = y + "px";
      el.style.background = colors[i % colors.length];
      var angle = Math.random() * Math.PI * 2;
      var dist = 55 + Math.random() * 65;
      var dx = Math.cos(angle) * dist;
      var dy = Math.sin(angle) * dist - 35;
      el.style.setProperty("--dx", dx + "px");
      el.style.setProperty("--dy", dy + "px");
      el.style.setProperty("--rot", Math.random() * 360 + "deg");
      document.body.appendChild(el);
      (function (node) { setTimeout(function () { node.remove(); }, 900); })(el);
    }
  }
  function celebrateAt(x, y) {
    burstConfetti(x, y);
    playChime();
  }
  // cobre os CTAs que são links reais para o WhatsApp (obra, contato, favoritos)
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href*="wa.me"]');
    if (link) celebrateAt(e.clientX, e.clientY);
  });

  // ======= FAVORITOS (lista de desejos) =======
  var FAVS_KEY = "emily-favoritos";
  function getFavs() {
    try { return JSON.parse(localStorage.getItem(FAVS_KEY)) || []; } catch (e) { return []; }
  }
  function saveFavs(arr) { localStorage.setItem(FAVS_KEY, JSON.stringify(arr)); }
  function toggleFav(id) {
    var favs = getFavs();
    var idx = favs.indexOf(id);
    if (idx > -1) favs.splice(idx, 1); else favs.push(id);
    saveFavs(favs);
    updateHeartButtons();
    updateFavsCount();
    renderFavsList();
    return favs.indexOf(id) > -1;
  }
  function toggleFavAnimated(heart) {
    var nowOn = toggleFav(heart.dataset.id);
    heart.classList.add("pop");
    setTimeout(function () { heart.classList.remove("pop"); }, 320);
    if (nowOn) {
      var rect = heart.getBoundingClientRect();
      burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  }
  function updateHeartButtons() {
    var favs = getFavs();
    document.querySelectorAll(".heart-btn").forEach(function (btn) {
      var on = favs.indexOf(btn.dataset.id) > -1;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }
  function updateFavsCount() {
    var el = document.getElementById("favsCount");
    var favs = getFavs();
    if (el) el.textContent = favs.length;
    var widget = document.querySelector(".favs-widget");
    if (widget) widget.classList.toggle("has-items", favs.length > 0);
  }
  function findProduct(id) {
    for (var i = 0; i < products.length; i++) { if (products[i].id === id) return products[i]; }
    return null;
  }
  function relImg(path) {
    var isObra = document.body.hasAttribute("data-obra-id");
    return (isObra ? "../" : "") + path;
  }
  function renderFavsList() {
    var list = document.getElementById("favsList");
    var empty = document.getElementById("favsEmpty");
    var whatsBtn = document.getElementById("favsWhats");
    if (!list) return;
    var items = getFavs().map(findProduct).filter(Boolean);
    if (items.length === 0) {
      list.innerHTML = "";
      if (empty) empty.style.display = "block";
      if (whatsBtn) whatsBtn.style.display = "none";
      return;
    }
    if (empty) empty.style.display = "none";
    if (whatsBtn) whatsBtn.style.display = "inline-flex";
    list.innerHTML = items.map(function (p) {
      return '<div class="fav-item">' +
        '<img src="' + relImg(p.img) + '" alt="' + p.title + '">' +
        '<div class="fav-item-info"><span>' + p.title + '</span><small>' + formatPrice(p.price) + '</small></div>' +
        '<button class="fav-remove" data-id="' + p.id + '" aria-label="Remover">&times;</button>' +
        '</div>';
    }).join("");
    var msg = "Olá, Emily! Vim pelo site e amei estas peças:\n" +
      items.map(function (p, i) { return (i + 1) + ") " + p.title.replace(/&amp;/g, "&") + " (" + formatPrice(p.price) + ")"; }).join("\n") +
      "\nPode me passar mais detalhes?";
    if (whatsBtn) whatsBtn.href = buildWhatsappLink(msg);
  }

  // coração da página de obra (fora do grid, não passa pela delegação acima)
  document.querySelectorAll(".heart-btn:not(.heart-btn-card)").forEach(function (heart) {
    heart.addEventListener("click", function (e) {
      e.preventDefault();
      toggleFavAnimated(heart);
    });
  });

  var favsToggle = document.getElementById("favsToggle");
  var favsPanel = document.getElementById("favsPanel");
  var favsClose = document.getElementById("favsClose");
  function closeFavsPanel() {
    if (!favsPanel) return;
    favsPanel.classList.remove("is-open");
    favsPanel.setAttribute("aria-hidden", "true");
    if (favsToggle) favsToggle.setAttribute("aria-expanded", "false");
  }
  if (favsToggle && favsPanel) {
    favsToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = favsPanel.classList.toggle("is-open");
      favsPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
      favsToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }
  if (favsClose) favsClose.addEventListener("click", closeFavsPanel);
  document.addEventListener("click", function (e) {
    if (favsPanel && favsPanel.classList.contains("is-open") && !e.target.closest(".favs-widget")) {
      closeFavsPanel();
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeFavsPanel(); });
  var favsListEl = document.getElementById("favsList");
  if (favsListEl) {
    favsListEl.addEventListener("click", function (e) {
      var rm = e.target.closest(".fav-remove");
      if (rm) toggleFav(rm.dataset.id);
    });
  }

  // estado inicial dos favoritos (funciona em qualquer página)
  updateHeartButtons();
  updateFavsCount();
  renderFavsList();

})();
