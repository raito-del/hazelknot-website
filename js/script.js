// ============================================================
// হ্যাজেলনট · মূল স্ক্রিপ্ট (js/script.js)
// ============================================================
// এই ফাইলে আছে:
//  - প্রোডাক্ট তালিকা (PRODUCTS) ও দাম: নাম, দাম, রং/সাইজের অপশন বদলাতে এখানে যান
//  - কার্ট ও অর্ডার বার্তা তৈরি (buildMessage)
//  - মেসেঞ্জারে পাঠানোর বাটন (sendOrder)
//  - ঘূর্ণায়মান প্রোডাক্ট রিং, ড্রপডাউন, অর্ডার শিট ও অ্যানিমেশন
// সেটিংস (মেসেঞ্জার লিংক, মুদ্রা) আছে config/settings.js ফাইলে।
// ============================================================

// সেটিংস থেকে ফেসবুক ও মেসেঞ্জার লিংক বসানো হয়
(function applyConfig() {
  var c = window.HAZEL_CONFIG || {};
  var page = c.messengerPage || "hazelknot";
  document.querySelectorAll('a[href^="https://m.me/"]').forEach(function (a) {
    a.href = "https://m.me/" + page;
  });
  if (c.facebookPage) {
    document.querySelectorAll('a[href^="https://www.facebook.com/"]').forEach(function (a) {
      a.href = c.facebookPage;
    });
  }
})();

(function () {
  /* ====== CONFIG: replace these with your real details ====== */
  var PAGE_USERNAME = (window.HAZEL_CONFIG && window.HAZEL_CONFIG.messengerPage) || "hazelknot";   // your Facebook page username (used for m.me/ link)
  var CURRENCY = (window.HAZEL_CONFIG && window.HAZEL_CONFIG.currency) || "৳";

  /* ====== PRODUCTS: প্রোডাক্টের নাম, দাম ও অপশন এখানে বদলান (নমুনা ডেটা) ====== */
  var PRODUCTS = window.HAZEL_PRODUCTS || [];

  var cart = {}; // key: productId|optionsString -> {id,name,price,opts,qty}

  function money(n) { return CURRENCY + n.toLocaleString("en-US"); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]; }); }

  /* ====== Illustrations (simple inline SVG, no external images) ====== */
  function art(p) {
    var s = 'fill="none" stroke="#3b2f2a" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"';
    var t = p.tone, body = "";
    switch (p.kind) {
      case "cat":
        body = '<circle cx="100" cy="110" r="52" fill="' + t + '"/><path d="M62 78 L58 46 L84 66 Z M138 78 L142 46 L116 66 Z" fill="' + t + '"/><path d="M70 110 q6 -6 12 0 M118 110 q6 -6 12 0 M90 128 q10 8 20 0" ' + s + '/>';
        break;
      case "bear":
        body = '<circle cx="100" cy="100" r="46" fill="' + t + '"/><circle cx="62" cy="62" r="14" fill="' + t + '"/><circle cx="138" cy="62" r="14" fill="' + t + '"/><path d="M88 100h.01M112 100h.01M92 118q8 6 16 0" stroke-width="7" ' + s + '/>';
        break;
      case "bunny":
        body = '<ellipse cx="82" cy="50" rx="12" ry="34" fill="' + t + '"/><ellipse cx="118" cy="50" rx="12" ry="34" fill="' + t + '"/><circle cx="100" cy="112" r="48" fill="' + t + '"/><path d="M86 110h.01M114 110h.01M96 124q4 4 8 0" stroke-width="7" ' + s + '/>';
        break;
      case "bag":
        body = '<path d="M60 90 h80 l-8 70 h-64 z" fill="' + t + '"/><path d="M76 90 c0 -40 48 -40 48 0" ' + s + '/><path d="M70 110h60M68 130h64" ' + s + '/>';
        break;
      case "flower":
        body = '<g fill="' + t + '">' +
          '<circle cx="100" cy="72" r="20"/><circle cx="128" cy="92" r="20"/><circle cx="118" cy="122" r="20"/><circle cx="82" cy="122" r="20"/><circle cx="72" cy="92" r="20"/></g>' +
          '<circle cx="100" cy="100" r="13" fill="#fffaf4"/><path d="M100 130 v44" ' + s + '/>';
        break;
      case "coaster":
        body = '<circle cx="78" cy="96" r="34" fill="' + t + '"/><circle cx="124" cy="104" r="30" fill="#fffaf4" ' + s + '/><circle cx="124" cy="104" r="14" fill="' + t + '" ' + s + '/>';
        break;
      default:
        body = '<circle cx="100" cy="100" r="50" fill="' + t + '"/>';
    }
    return '<svg viewBox="0 0 200 180" role="img" aria-label="' + esc(p.name) + ' illustration">' + body + '</svg>';
  }

  /* ছবি থাকলে উপরে বসে; ছবি না পেলে নিচের নমুনা আইকনই থাকে */
  function picImg(p) {
    if (!p.image) return "";
    return '<img class="pic-img" src="' + esc(p.image) + '" alt="' + esc(p.name) + '" loading="lazy" onerror="this.remove()">';
  }

  /* ====== Render products ====== */
  var grid = document.getElementById("productGrid");
  function optionSelects(p) {
    var keys = Object.keys(p.options);
    return '<div class="opts">' + keys.map(function (k) {
      var id = "opt-" + p.id + "-" + k.replace(/\s+/g, "");
      return '<label>' + esc(k) + '<select id="' + id + '" data-key="' + esc(k) + '">' +
        p.options[k].map(function (v) { return '<option>' + esc(v) + '</option>'; }).join("") +
        '</select></label>';
    }).join("") + '</div>';
  }
  function render(filter) {
    var list = PRODUCTS.filter(function (p) { return filter === "all" || p.cat === filter; });
    grid.innerHTML = list.map(function (p) {
      return '<article class="product" data-id="' + p.id + '" data-cat="' + p.cat + '" style="--i:' + list.indexOf(p) + '">' +
        '<div class="pic" style="background:' + p.hue + '">' + art(p) + picImg(p) + '</div>' +
        '<div class="info">' +
          '<h3>' + esc(p.name) + '</h3>' +
          '<div class="meta">' + esc(p.summary || "Handmade · made to order") + '</div>' +
          optionSelects(p) +
          '<div class="row">' +
            '<span class="price">' + money(p.price) + '</span>' +
            '<button class="btn btn-primary btn-sm" type="button" data-add="' + p.id + '">Add to order</button>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join("");
  }
  render("all");

  /* Filters */
  document.querySelectorAll(".chip").forEach(function (c) {
    c.addEventListener("click", function () {
      document.querySelectorAll(".chip").forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      c.setAttribute("aria-pressed", "true");
      render(c.getAttribute("data-filter"));
    });
  });

  /* ====== ড্র্যাগ / সোয়াইপ গ্যালারি ====== */
  var dragMoved = false, dragging = false, startX = 0, startLeft = 0, pid = null;
  grid.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    dragging = true; dragMoved = false; startX = e.clientX; startLeft = grid.scrollLeft; pid = e.pointerId;
  });
  grid.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (!dragMoved && Math.abs(dx) > 6) { dragMoved = true; grid.classList.add("dragging"); try { grid.setPointerCapture(pid); } catch (err) {} }
    if (dragMoved) grid.scrollLeft = startLeft - dx;
  });
  function endDrag() {
    if (!dragging) return;
    dragging = false; grid.classList.remove("dragging");
    setTimeout(function () { dragMoved = false; }, 0);
  }
  grid.addEventListener("pointerup", endDrag);
  grid.addEventListener("pointercancel", endDrag);
  grid.addEventListener("pointerleave", endDrag);
  grid.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") grid.scrollBy({ left: 280, behavior: "smooth" });
    if (e.key === "ArrowLeft") grid.scrollBy({ left: -280, behavior: "smooth" });
  });

  /* ====== প্রোডাক্টের বড় করে দেখার পপআপ ====== */
  var modal = document.getElementById("modal"), mPic = document.getElementById("mPic"), mTitle = document.getElementById("mTitle"),
      mDesc = document.getElementById("mDesc"), mPrice = document.getElementById("mPrice"), mOpts = document.getElementById("mOpts"),
      mAdd = document.getElementById("mAdd"), mId = null;
  function openModal(id) {
    var p = PRODUCTS.find(function (x) { return x.id === id; });
    if (!p) return;
    mId = id;
    mPic.style.background = p.hue;
    mPic.innerHTML = art(p) + picImg(p);
    mTitle.textContent = p.name;
    mDesc.textContent = p.details || "Handmade to order. Pick your options, then add it to your order.";
    mPrice.textContent = money(p.price);
    mOpts.innerHTML = optionSelects(p);
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    mAdd.focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeModal(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  mAdd.addEventListener("click", function () {
    var p = PRODUCTS.find(function (x) { return x.id === mId; });
    if (!p) return;
    var opts = optsString(mOpts, p);
    var pn = document.getElementById("mName");
    if (pn && pn.value.trim()) { opts = (opts ? opts + ", " : "") + "Name: " + pn.value.trim(); pn.value = ""; }
    var key = p.id + "|" + opts;
    if (!cart[key]) cart[key] = { id: p.id, name: p.name, price: p.price, opts: opts, qty: 0 };
    cart[key].qty += 1;
    renderCart();
    closeModal();
    notify("Added: " + p.name);
  });

  /* ====== কার্ট: এখানে অর্ডারের আইটেম যোগ, কমানো ও মোট হিসাব হয় ====== */
  var toast = document.getElementById("toast"), tmr;
  function notify(msg) { toast.textContent = msg; toast.classList.add("show"); clearTimeout(tmr); tmr = setTimeout(function () { toast.classList.remove("show"); }, 1800); }

  function optsString(card, p) {
    var parts = [];
    Object.keys(p.options).forEach(function (k) {
      var sel = card.querySelector('select[data-key="' + k.replace(/"/g, '\\"') + '"]');
      if (sel) parts.push(k + ": " + sel.value);
    });
    return parts.join(", ");
  }

  grid.addEventListener("click", function (e) {
    var b = e.target.closest("[data-add]");
    if (dragMoved) return;
    if (!b) {
      if (e.target.closest("select, label, button")) return;
      var pc = e.target.closest(".product");
      if (pc) openModal(pc.getAttribute("data-id"));
      return;
    }
    var p = PRODUCTS.find(function (x) { return x.id === b.getAttribute("data-add"); });
    var card = b.closest(".product");
    var opts = optsString(card, p);
    var key = p.id + "|" + opts;
    if (!cart[key]) cart[key] = { id: p.id, name: p.name, price: p.price, opts: opts, qty: 0 };
    cart[key].qty += 1;
    renderCart();
    notify("Added: " + p.name);
  });

  /* Custom order button: adds a custom line that needs confirmation */
  document.querySelectorAll('[data-product="custom"]').forEach(function (b) {
    b.addEventListener("click", function () {
      var key = "custom|";
      if (!cart[key]) cart[key] = { id: "custom", name: "Custom order (price on confirmation)", price: 0, opts: "Describe in note", qty: 0 };
      cart[key].qty = 1;
      renderCart();
      document.getElementById("order").scrollIntoView({ behavior: "smooth" });
      notify("Custom order added. Describe it in the note box.");
    });
  });

  function renderCart() {
    var keys = Object.keys(cart).filter(function (k) { return cart[k].qty > 0; });
    var lines = document.getElementById("lines");
    var total = 0, count = 0;
    if (!keys.length) {
      lines.innerHTML = '<li class="empty">Your order is empty. Add a piece from the shop above.</li>';
    } else {
      lines.innerHTML = keys.map(function (k) {
        var c = cart[k]; total += c.price * c.qty; count += c.qty;
        return '<li>' +
          '<div><div class="name">' + esc(c.name) + '</div>' +
          (c.opts ? '<div class="sub">' + esc(c.opts) + '</div>' : '') +
          '<div class="sub">' + (c.price ? money(c.price) + ' each' : 'Price confirmed on chat') + '</div></div>' +
          '<div class="qty"><button type="button" data-dec="' + esc(k) + '" aria-label="Decrease">−</button>' +
          '<span>' + c.qty + '</span>' +
          '<button type="button" data-inc="' + esc(k) + '" aria-label="Increase">+</button></div>' +
        '</li>';
      }).join("");
    }
    document.getElementById("total").textContent = total ? money(total) : "৳0";
    document.getElementById("cartCount").textContent = count;
  }
  document.getElementById("lines").addEventListener("click", function (e) {
    var inc = e.target.getAttribute("data-inc"), dec = e.target.getAttribute("data-dec");
    if (inc && cart[inc]) cart[inc].qty += 1;
    if (dec && cart[dec]) cart[dec].qty = Math.max(0, cart[dec].qty - 1);
    renderCart();
  });
  renderCart();

  document.getElementById("cartOpen").addEventListener("click", function () {
    document.getElementById("order").scrollIntoView({ behavior: "smooth" });
  });

  /* ====== অর্ডার বার্তা তৈরি ও মেসেঞ্জারে পাঠানো ====== */
  function val(id) { return document.getElementById(id).value.trim(); }

  function buildMessage() {
    var keys = Object.keys(cart).filter(function (k) { return cart[k].qty > 0; });
    var lines = keys.map(function (k, i) {
      var c = cart[k];
      return (i + 1) + ". " + c.name + (c.opts ? " (" + c.opts + ")" : "") + " x" + c.qty +
        (c.price ? " = " + money(c.price * c.qty) : " (price to confirm)");
    });
    var total = keys.reduce(function (s, k) { return s + cart[k].price * cart[k].qty; }, 0);
    return [
      "Hi Hazelknot! I'd like to place an order.",
      "",
      "ORDER:",
      lines.join("\n"),
      "Estimated total: " + money(total) + " (+ delivery)",
      "Gift wrap: " + (window.giftPick() ? "yes (+৳50)" : "no"),
      "",
      "DELIVERY DETAILS:",
      "Name: " + val("fName"),
      "Phone: " + val("fPhone"),
      "Area: " + val("fArea"),
      "Address: " + val("fAddress"),
      val("fNote") ? "Note: " + val("fNote") : ""
    ].filter(function (x) { return x !== undefined; }).join("\n");
  }

  var preview = document.getElementById("preview");

  document.getElementById("sendOrder").addEventListener("click", function () {
    var hasItems = Object.keys(cart).some(function (k) { return cart[k].qty > 0; });
    if (!hasItems) { notify("Add at least one piece first."); return; }
    if (!val("fName") || !val("fPhone") || !val("fArea") || !val("fAddress")) {
      notify("Please fill name, phone, area and address.");
      return;
    }
    var msg = buildMessage();
    preview.hidden = false;
    preview.textContent = msg;

    var url = "https://m.me/" + PAGE_USERNAME;
    var open = function () { window.open(url, "_blank", "noopener"); };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(msg).then(function () {
        notify("Order copied. Paste it in the Messenger chat.");
        open();
      }, function () {
        notify("Copy the text below, then open Messenger.");
        open();
      });
    } else {
      notify("Copy the text below, then open Messenger.");
      open();
    }
  });
})();

(function () {
  var intro = document.getElementById("intro");
  document.getElementById("enterBtn").addEventListener("click", function () {
    document.body.classList.add("entered");
    intro.classList.add("leave");
    setTimeout(function () { intro.remove(); }, 950);
  });

  var grid = document.getElementById("productGrid"), bar = document.getElementById("gBar");
  function step() {
    var first = grid.querySelector(".product");
    return first ? first.offsetWidth + 22 : 280;
  }
  document.getElementById("gPrev").addEventListener("click", function () { grid.scrollBy({ left: -step(), behavior: "smooth" }); });
  document.getElementById("gNext").addEventListener("click", function () { grid.scrollBy({ left: step(), behavior: "smooth" }); });

  function update() {
    var max = grid.scrollWidth - grid.clientWidth;
    var ratio = max > 0 ? grid.scrollLeft / max : 0;
    var thumb = Math.max(18, Math.min(100, (grid.clientWidth / Math.max(grid.scrollWidth, 1)) * 100));
    bar.style.width = thumb + "%";
    bar.style.left = (ratio * (100 - thumb)) + "%";
  }
  grid.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();

  /* 3D tilt + light follow on products (mouse only) */
  grid.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    var c = e.target.closest(".product");
    if (!c) return;
    var r = c.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    c.style.setProperty("--mx", (x * 100) + "%");
    c.style.setProperty("--my", (y * 100) + "%");
    c.style.setProperty("--ry", ((x - 0.5) * 10) + "deg");
    c.style.setProperty("--rx", ((0.5 - y) * 8) + "deg");
  });
  grid.addEventListener("pointerout", function (e) {
    var c = e.target.closest(".product");
    if (!c || c.contains(e.relatedTarget)) return;
    c.style.setProperty("--rx", "0deg");
    c.style.setProperty("--ry", "0deg");
  });
})();

(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Scroll progress bar */
  var bar = document.getElementById("progress");
  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = "scaleX(" + (h > 0 ? window.scrollY / h : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Hero title: split into words for staggered entrance */
  var h1 = document.querySelector(".hero h1");
  if (h1) {
    var text = h1.textContent.trim();
    var words = text.split(/\s+/);
    h1.classList.add("split");
    h1.setAttribute("aria-label", text);
    h1.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true" style="--d:' + i + '">' + w + '</span>';
    }).join(" ");
  }

  /* Scroll reveal for sections and cards */
  var revealEls = document.querySelectorAll(".head, .custom, .card-box, .checks li, .step");
  revealEls.forEach(function (el, i) { el.classList.add("reveal"); el.style.transitionDelay = (i % 4) * 80 + "ms"; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* Count-up stats, starts after entering the shop */
  var stats = document.querySelectorAll(".stat strong");
  function countUp(el) {
    var target = parseInt(el.textContent, 10);
    if (reduce || isNaN(target)) return;
    var start = null, dur = 1400;
    el.textContent = "0";
    function frame(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var enter = document.getElementById("enterBtn");
  if (enter) enter.addEventListener("click", function () { stats.forEach(countUp); });

  /* Magnetic primary buttons (mouse only) */
  if (!reduce) {
    document.querySelectorAll(".btn-primary").forEach(function (b) {
      b.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = b.getBoundingClientRect();
        var x = (e.clientX - (r.left + r.width / 2)) * 0.2;
        var y = (e.clientY - (r.top + r.height / 2)) * 0.25;
        b.style.transform = "translate(" + x + "px, " + y + "px)";
      });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
  }

  /* Hero spotlight follows the cursor */
  var hero = document.querySelector(".hero");
  if (hero && !reduce) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--sx", (e.clientX - r.left) + "px");
      hero.style.setProperty("--sy", (e.clientY - r.top) + "px");
    });
  }
})();

(function () {
  function ripple(btn, e) {
    var r = btn.getBoundingClientRect();
    var s = document.createElement("span");
    s.className = "ripple";
    s.style.left = (e.clientX - r.left) + "px";
    s.style.top = (e.clientY - r.top) + "px";
    btn.appendChild(s);
    setTimeout(function () { s.remove(); }, 650);
  }
  function confirmAdded(btn) {
    if (!btn.dataset.label) btn.dataset.label = btn.textContent.trim();
    btn.textContent = "Added \u2713";
    btn.classList.add("added");
    clearTimeout(btn._t);
    btn._t = setTimeout(function () {
      btn.textContent = btn.dataset.label;
      btn.classList.remove("added");
    }, 1300);
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-add], #mAdd");
    if (!btn) return;
    ripple(btn, e);
    setTimeout(function () { confirmAdded(btn); }, 0);
  }, true);

  var count = document.getElementById("cartCount");
  if (count && "MutationObserver" in window) {
    new MutationObserver(function () {
      count.classList.remove("pop");
      void count.offsetWidth;
      count.classList.add("pop");
    }).observe(count, { childList: true, characterData: true, subtree: true });
  }
})();

(function () {
  /* Colour palettes, remembered on this device when storage is available */
  var root = document.documentElement;
  var picks = document.querySelectorAll("[data-theme-pick]");
  function setPalette(name) {
    if (name === "berry") root.removeAttribute("data-palette"); else root.setAttribute("data-palette", name);
    picks.forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-theme-pick") === name ? "true" : "false");
    });
    try { localStorage.setItem("hk-palette", name); } catch (e) {}
  }
  picks.forEach(function (b) {
    b.addEventListener("click", function () { setPalette(b.getAttribute("data-theme-pick")); });
  });
  var saved = null;
  try { saved = localStorage.getItem("hk-palette"); } catch (e) {}
  setPalette(saved || "berry");

  /* Sticky order bar: shows once something is in the order */
  var count = document.getElementById("cartCount"), total = document.getElementById("total");
  var bar = document.getElementById("stickyOrder"), soText = document.getElementById("soText");
  function syncBar() {
    var n = parseInt(count.textContent, 10) || 0;
    soText.textContent = n + (n === 1 ? " item" : " items") + " \u00b7 " + total.textContent;
    bar.classList.toggle("show", n > 0);
  }
  if ("MutationObserver" in window) {
    new MutationObserver(syncBar).observe(count, { childList: true, characterData: true, subtree: true });
    new MutationObserver(syncBar).observe(total, { childList: true, characterData: true, subtree: true });
  }
  syncBar();
})();

(function () {
  var ids = ["fName", "fPhone", "fArea", "fAddress"];
  var bar = document.getElementById("fillBar"), pill = document.getElementById("fillPill");
  var KEY = "hk-details";

  function valid(id, v) {
    if (id === "fPhone") return /^01\d{9}$/.test(v.replace(/[\s-]/g, ""));
    return v.trim().length >= 2;
  }

  function refresh() {
    var done = 0;
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      var ok = valid(id, el.value);
      el.closest("label").classList.toggle("is-ok", ok);
      if (ok) done++;
    });
    bar.style.width = Math.round((done / ids.length) * 100) + "%";
    var text = done + " of " + ids.length;
    if (pill.textContent !== text) {
      pill.textContent = text;
      pill.classList.remove("bump"); void pill.offsetWidth; pill.classList.add("bump");
    }
  }

  var remember = document.getElementById("fRemember");
  function save() {
    if (!remember.checked) return;
    var data = {};
    ids.concat(["fNote"]).forEach(function (id) { data[id] = document.getElementById(id).value; });
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }
  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!d) return;
      remember.checked = true;
      Object.keys(d).forEach(function (k) {
        var el = document.getElementById(k);
        if (el && !el.value) el.value = d[k];
      });
    } catch (e) {}
  }
  load();
  remember.addEventListener("change", function () {
    if (remember.checked) save();
    else { try { localStorage.removeItem(KEY); } catch (e) {} }
  });

  ids.concat(["fNote"]).forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener("input", function () {
      if (el.closest("label").classList.contains("is-bad")) el.closest("label").classList.remove("is-bad");
      refresh(); save();
    });
    if (ids.indexOf(id) > -1) {
      el.addEventListener("blur", function () {
        el.closest("label").classList.toggle("is-bad", !valid(id, el.value));
      });
    }
  });

  /* Shake any required field that is still empty when sending */
  document.getElementById("sendOrder").addEventListener("click", function () {
    ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (valid(id, el.value)) return;
      el.closest("label").classList.add("is-bad");
      el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
    });
  }, true);

  window.deliveryPick = function () {
    var r = document.querySelector('input[name="fDelivery"]:checked');
    return r ? r.value : "Regular";
  };
  window.giftPick = function () {
    var g = document.getElementById("fGift");
    return !!(g && g.checked);
  };

  refresh();
})();

(function () {
  var sheet = document.getElementById("orderSheet");
  var preview = document.getElementById("preview");
  var viewFull = document.getElementById("viewFull");
  var body = document.getElementById("sheetBody");
  var copyBtn = document.getElementById("sheetCopy");

  function open() {
    body.textContent = "";
    preview.textContent.split("\n").forEach(function (line, i) {
      var s = document.createElement("span");
      s.className = "ln";
      s.style.setProperty("--i", i);
      s.textContent = line || "\u00a0";
      body.appendChild(s);
    });
    sheet.classList.add("open");
    sheet.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    copyBtn.textContent = "Copy";
  }
  function close() {
    sheet.classList.remove("open");
    sheet.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  viewFull.addEventListener("click", open);
  preview.addEventListener("click", open);
  sheet.addEventListener("click", function (e) {
    if (e.target.closest("[data-sheet-close]")) close();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet.classList.contains("open")) close();
  });

  copyBtn.addEventListener("click", function () {
    var text = preview.textContent;
    var done = function () { copyBtn.textContent = "Copied \u2713"; };
    var fail = function () { copyBtn.textContent = "Select and copy"; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fail);
    } else { fail(); }
  });

  document.getElementById("sheetSend").addEventListener("click", function () {
    var a = document.querySelector('footer a[href^="https://m.me/"]');
    window.open(a ? a.href : "https://m.me/hazelknot", "_blank", "noopener");
  });

  viewFull.hidden = preview.hidden;
  new MutationObserver(function () { viewFull.hidden = preview.hidden; })
    .observe(preview, { attributes: true, attributeFilter: ["hidden"] });
})();

(function () {
  var t = document.querySelector(".intro-title");
  if (!t || t.dataset.split) return;
  var txt = t.textContent.trim();
  t.dataset.split = "1";
  t.setAttribute("aria-label", txt);
  t.innerHTML = txt.split("").map(function (ch, i) {
    return '<span class="l" aria-hidden="true" style="--d:' + i + '">' + ch + '</span>';
  }).join("");
})();

(function () {
  var openItem = null;

  function place(btn, list) {
    var r = btn.getBoundingClientRect();
    var spaceBelow = window.innerHeight - r.bottom;
    list.style.left = r.left + "px";
    list.style.width = r.width + "px";
    if (spaceBelow < 260 && r.top > spaceBelow) {
      list.style.top = "";
      list.style.bottom = (window.innerHeight - r.top + 8) + "px";
    } else {
      list.style.bottom = "";
      list.style.top = (r.bottom + 8) + "px";
    }
  }

  function close() {
    if (!openItem) return;
    openItem.list.classList.remove("show");
    openItem.btn.setAttribute("aria-expanded", "false");
    openItem = null;
  }

  function enhance(sel) {
    if (sel.dataset.enh) return;
    sel.dataset.enh = "1";
    sel.classList.add("cs-native");

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "cs-btn";
    btn.setAttribute("aria-haspopup", "listbox");
    btn.setAttribute("aria-expanded", "false");
    btn.innerHTML = '<span class="cs-val"></span><span class="cs-caret" aria-hidden="true"></span>';

    var list = document.createElement("ul");
    list.className = "cs-list";
    list.setAttribute("role", "listbox");
    Array.prototype.forEach.call(sel.options, function (o, i) {
      var li = document.createElement("li");
      li.className = "cs-opt";
      li.setAttribute("role", "option");
      li.dataset.value = o.value;
      li.style.setProperty("--i", i);
      li.textContent = o.textContent;
      list.appendChild(li);
    });
    list._sel = sel;

    function setVal(v) {
      sel.value = v;
      btn.querySelector(".cs-val").textContent = v;
      list.querySelectorAll(".cs-opt").forEach(function (li) {
        li.classList.toggle("on", li.dataset.value === v);
      });
    }
    setVal(sel.value);

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (openItem && openItem.list === list) { close(); return; }
      close();
      place(btn, list);
      list.classList.add("show");
      btn.setAttribute("aria-expanded", "true");
      openItem = { list: list, btn: btn };
    });

    list.addEventListener("click", function (e) {
      var li = e.target.closest(".cs-opt");
      if (!li) return;
      setVal(li.dataset.value);
      sel.dispatchEvent(new Event("change", { bubbles: true }));
      close();
    });

    sel.parentNode.insertBefore(btn, sel);
    document.body.appendChild(list);
  }

  function sweep() {
    document.querySelectorAll("select[data-key]:not([data-enh])").forEach(enhance);
    document.querySelectorAll(".cs-list").forEach(function (l) {
      if (!l._sel.isConnected) {
        if (openItem && openItem.list === l) close();
        l.remove();
      }
    });
  }
  sweep();
  new MutationObserver(sweep).observe(document.body, { childList: true, subtree: true });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".cs-btn, .cs-list")) close();
  });
  window.addEventListener("scroll", close, { passive: true });
  window.addEventListener("resize", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
})();

(function () {
  var grid = document.getElementById("productGrid");
  if (!grid) return;
  var bar = document.getElementById("gBar");
  var prevBtn = document.getElementById("gPrev"), nextBtn = document.getElementById("gNext");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var cards = [], N = 0, lastN = -1, cardW = 270, R = 300;
  var current = 0, animId = null;
  var dragging = false, moved = false, justDragged = false;
  var startX = 0, startCur = 0, lastX = 0, lastT = 0, vel = 0, pid = null;

  function wrapDelta(d) { return d - N * Math.round(d / N); }
  function activeIndex() { return ((Math.round(current) % N) + N) % N; }

  function updateBar() {
    if (!bar || !N) return;
    var w = 100 / N;
    bar.style.width = w + "%";
    bar.style.left = (activeIndex() * w) + "%";
  }

  function render() {
    if (!N) return;
    var step = 360 / N;
    cards.forEach(function (c, i) {
      var d = wrapDelta(i - current);
      var ad = Math.abs(d);
      var front = ad < 0.5;
      c.style.transform = "translateZ(" + (-R) + "px) rotateY(" + (d * step) + "deg) translateZ(" + R + "px) scale(" + (1 - Math.min(ad, 2) * 0.06) + ")";
      c.style.opacity = String(Math.max(0.35, 1 - ad * 0.28));
      c.style.zIndex = String(100 - Math.round(ad * 10));
      c.style.filter = front ? "none" : "saturate(0.65)";
      c.classList.toggle("is-front", front);
    });
    updateBar();
  }

  function layout() {
    cards = Array.prototype.slice.call(grid.querySelectorAll(".product"));
    N = cards.length;
    if (!N) return;
    if (N !== lastN) { current = 0; lastN = N; }
    cardW = Math.min(270, Math.round(window.innerWidth * 0.62));
    if (N < 3) R = Math.round(cardW * 0.5);
    else R = Math.round((cardW * 0.95) / (2 * Math.sin(Math.PI / N)));
    var maxH = 0;
    cards.forEach(function (c) {
      c.style.width = cardW + "px";
      c.style.marginLeft = (-cardW / 2) + "px";
      maxH = Math.max(maxH, c.offsetHeight);
    });
    grid.style.height = (maxH + 24) + "px";
    render();
  }

  function animateTo(target) {
    if (animId) cancelAnimationFrame(animId);
    var from = current, dist = target - from, t0 = null;
    var dur = reduce ? 0 : 850;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = dur ? Math.min((ts - t0) / dur, 1) : 1;
      current = from + dist * (1 - Math.pow(1 - p, 4));
      render();
      animId = p < 1 ? requestAnimationFrame(step) : null;
    }
    animId = requestAnimationFrame(step);
  }
  function rotateBy(n) { animateTo(Math.round(current) + n); }

  grid.addEventListener("pointerdown", function (e) {
    if (!N) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    if (animId) { cancelAnimationFrame(animId); animId = null; }
    dragging = true; moved = false;
    startX = lastX = e.clientX;
    startCur = current; lastT = performance.now(); vel = 0; pid = e.pointerId;
  });

  grid.addEventListener("pointermove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - startX;
    if (!moved && Math.abs(dx) > 6) {
      moved = true;
      grid.classList.add("spinning");
      try { grid.setPointerCapture(pid); } catch (err) {}
    }
    if (!moved) return;
    var now = performance.now(), dt = Math.max(1, now - lastT);
    vel = (e.clientX - lastX) / dt;
    lastX = e.clientX; lastT = now;
    current = startCur - dx / (cardW * 0.85);
    render();
  });

  function endDrag() {
    if (!dragging) return;
    dragging = false;
    grid.classList.remove("spinning");
    if (!moved) return;
    justDragged = true;
    setTimeout(function () { justDragged = false; }, 120);
    var flick = -vel * 110;
    animateTo(Math.round(current + flick / (cardW * 0.85)));
  }
  grid.addEventListener("pointerup", endDrag);
  grid.addEventListener("pointercancel", endDrag);
  grid.addEventListener("pointerleave", endDrag);

  /* Clicks: a side card brings itself to the front; a drag never opens a product */
  grid.addEventListener("click", function (e) {
    if (justDragged) { e.stopPropagation(); e.preventDefault(); return; }
    var card = e.target.closest(".product");
    if (!card) return;
    var idx = cards.indexOf(card);
    if (idx < 0) return;
    var d = wrapDelta(idx - current);
    if (Math.abs(d) >= 0.5) {
      e.stopPropagation(); e.preventDefault();
      animateTo(current + d);
    }
  }, true);

  if (prevBtn) prevBtn.addEventListener("click", function () { rotateBy(-1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { rotateBy(1); });

  grid.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") { rotateBy(1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { rotateBy(-1); e.preventDefault(); }
  });

  new MutationObserver(layout).observe(grid, { childList: true });
  window.addEventListener("resize", layout);
  layout();
})();
