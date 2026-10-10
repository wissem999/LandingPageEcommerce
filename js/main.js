/* =========================================================
   Respiro — product page replica (vanilla JS)
   ========================================================= */

const CDN = "https://cdn.converty.shop/images/";
const CURRENCY = "DT";
const DELIVERY = 6;

/* ---------- Data ---------- */
const IMAGES = [
  "fec54395ef876730f53553e9efb480356aa58853910fe9fccd7c2eb6902864c7_lg.webp",
  "5a20d0ac55ddd9c373952ba95bdfdc8b85dd54b99cc8667e21a93590bc3284e0_lg.webp",
  "65be4926e6bbdcd016af50d9_1720198363757_lg.webp",
  "8b9459510a13fae23809a3f9bb307c48dfefc7e13616148781a1344d5ed6fa1d_lg.webp",
  "65be4926e6bbdcd016af50d9_1720198275645_lg.webp",
  "65be4926e6bbdcd016af50d9_1720198275957_lg.webp"
];

const VARIANTS = {
  "1": { base: 49, compare: 69 },
  "2": { base: 84, compare: 138 },
  "3": { base: 119, compare: 207 }
};

const REVIEWS = [
  {
    name: "Maram",
    rating: 5,
    comment: "Weslouni ezouz merci bcp walah yesser y3awnou 💖💖",
    image: CDN + "65be4926e6bbdcd016af50d9_1729346381652_lg.webp"
  },
  {
    name: "أسماء",
    rating: 5,
    comment: "🥰🥰RESPIRO وليت منرقد كان باهم حاجة طيارة",
    image: CDN + "65be4926e6bbdcd016af50d9_1729346846233_lg.webp"
  },
  {
    name: "sihem",
    rating: 5,
    comment: "ORL وزيد انا نخدم مع طبيب tooppppp انا زادة خذيت بصراحة حاجة ❤️❤️\nكي شافها قلي حاجة مزيانة نصحت بها برشا ناس والله يعطيكم الف صحة",
    image: CDN + "4bcc084e6dad44387d10e165413c97e0e116835bf5a6061f8c6f6504c66e97d8_lg.webp"
  }
];

const FAQ = [
  { q: "كيفاش تشتغل شرائط الأنف؟", a: "شرائط لاصقة مرنة تحطها على الأنف، تفتح المجاري الهوائية وتساعدك تتنفس أحسن — بدون دواء." },
  { q: "كيفاش نستعملها؟", a: "نظّف أنفك وجفّفه، حط الشريطة على سطح الأنف، اضغط عليها بلطف 30 ثانية وخليها حتى الصباح. تستعمل مرة واحدة." },
  { q: "قدّاش تدوم العلبة؟", a: "كل علبة فيها مجموعة شرائط تكفيك لمدة كاملة. تُحفظ في مكان جاف بعيد على الشمس." },
  { q: "هل هي آمنة؟", a: "نعم — مصنوعة من مواد صديقة للبشرة وخالية من الدواء. إذا عندك بشرة حساسة، جرّبها أول مرة بحرص." },
  { q: "متى نبدأ نحس بالفرق؟", a: "أغلب الناس يحسّوا بفرق في التنفس من أول ليلة، ومع المواصلة تتحسّن جودة النوم أكثر." },
  { q: "واش تنجم تستعملها مع الشخير؟", a: "نعم — شرائط الأنف تساعد على تقليل الشخير وتحسين تدفق الهواء أثناء النوم." },
  { q: "كيفاش الدفع والتوصيل؟", a: "الدفع عند الاستلام — التوصيل لباب الدار في 24 إلى 48 ساعة لكل تونس، مع إمكانية فتح الطلب قبل الدفع." },
  { q: "نجم نرجّع المنتج؟", a: "نعم — ضمان استرداد كامل خلال 30 يوم. إذا ما عجبكش نرجعولك فلوسك بدون أسئلة." }
];

/* ---------- Helpers ---------- */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const fmt = (n) => `${n} ${CURRENCY}`;

let state = {
  qty: 1,
  color: { hex: "#000000", name: "أسود" },
  images: IMAGES,
  activeImage: 0,
  bundle: { price: 49, compare: 69, units: 1 },
  cart: []
};

/* ---------- Gallery ---------- */
function renderGallery() {
  const thumbs = $("#thumbs");
  thumbs.innerHTML = state.images
    .map((src, i) => `
      <button class="gallery__thumb ${i === state.activeImage ? "is-active" : ""}" data-index="${i}">
        <img src="${CDN + src}" alt="صورة المنتج ${i + 1}" loading="lazy">
      </button>`)
    .join("");
  $("#mainImage").src = CDN + state.images[state.activeImage];

  $$(".gallery__thumb", thumbs).forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeImage = +btn.dataset.index;
      renderGallery();
    });
  });
}

/* ---------- Price ---------- */
function currentPrice() {
  // bundle overrides variant price
  return state.bundle;
}

function renderPrice() {
  const { price, compare } = state.bundle;
  const save = compare - price;
  const pct = Math.round((save / compare) * 100);

  $("#priceNow").textContent = fmt(price);
  $("#priceOld").textContent = fmt(compare);
  $("#priceSave").textContent = `وفّر ${save} ${CURRENCY}`;
  $("#discountBadge").textContent = `-${pct}%`;

  $("#formTotal").textContent = fmt(price + DELIVERY);
  $("#stickyPrice").textContent = fmt(price);
  $("#stickyOld").textContent = fmt(compare);
}

/* ---------- Options ---------- */
function bindOptions() {
  $$("#qtyChips .chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$("#qtyChips .chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      state.qty = +chip.dataset.qty;
      // sync bundle: qty 1 => single, qty>=2 => hot bundle
      selectBundleByQty(state.qty);
    });
  });

  $$("#colorSwatches .swatch").forEach((sw) => {
    sw.addEventListener("click", () => {
      $$("#colorSwatches .swatch").forEach((s) => s.classList.remove("is-active"));
      sw.classList.add("is-active");
      state.color = { hex: sw.dataset.color, name: sw.dataset.name };
      $("#colorName").textContent = sw.dataset.name;
    });
  });

  $$(".bundle").forEach((b) => {
    b.addEventListener("click", () => {
      $$(".bundle").forEach((x) => x.classList.remove("is-active"));
      b.classList.add("is-active");
      b.querySelector("input").checked = true;
      state.bundle = {
        price: +b.dataset.price,
        compare: +b.dataset.compare,
        units: +b.querySelector("input").value === 2 ? 3 : 1
      };
      renderPrice();
    });
  });
}

function selectBundleByQty(qty) {
  const bundles = $$(".bundle");
  const target = qty >= 2 ? bundles[1] : bundles[0];
  bundles.forEach((x) => x.classList.remove("is-active"));
  target.classList.add("is-active");
  target.querySelector("input").checked = true;
  state.bundle = {
    price: +target.dataset.price,
    compare: +target.dataset.compare,
    units: qty >= 2 ? 3 : 1
  };
  renderPrice();
}

/* ---------- Order form ---------- */
function bindForm() {
  const form = $("#orderForm");
  const phoneRegex = /^(?:\+216|00216)?(?:\s*\d\s*){8}$/;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const errorEl = $("#formError");
    errorEl.textContent = "";

    const el = form.elements;
    const name = el.name.value.trim();
    const phone = el.phone.value.trim();
    const city = el.city.value;

    el.phone.classList.remove("is-error");
    el.city.classList.remove("is-error");
    el.name.classList.remove("is-error");

    if (name.length < 2) {
      errorEl.textContent = "المرجو إدخال الاسم.";
      el.name.classList.add("is-error");
      el.name.focus();
      return;
    }
    if (!phoneRegex.test(phone)) {
      errorEl.textContent = "المرجو إدخال رقم هاتف صحيح (8 أرقام).";
      el.phone.classList.add("is-error");
      el.phone.focus();
      return;
    }
    if (!city) {
      errorEl.textContent = "المرجو اختيار الولاية.";
      el.city.classList.add("is-error");
      el.city.focus();
      return;
    }

    const order = {
      name,
      phone,
      city,
      address: el.address.value.trim(),
      note: el.note.value.trim(),
      quantity: state.qty,
      color: state.color.name,
      bundle: state.bundle,
      total: state.bundle.price + DELIVERY
    };
    console.log("New order:", order);

    showToast(`🎉 تم استلام طلبك بنجاح! سنتصل بك على ${phone}`);
    form.reset();
    state.qty = 1;
    $$("#qtyChips .chip").forEach((c, i) => c.classList.toggle("is-active", i === 0));
    selectBundleByQty(1);
  });
}

/* ---------- Reviews ---------- */
function renderReviews() {
  $("#reviewsGrid").innerHTML = REVIEWS.map((r) => `
    <article class="review">
      <div class="review__head">
        <img class="review__avatar" src="${r.image}" alt="${r.name}" loading="lazy">
        <div>
          <div class="review__name">${r.name}</div>
          <div class="review__stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
        </div>
      </div>
      <p class="review__comment">${escapeHtml(r.comment)}</p>
    </article>`).join("");
}

/* ---------- FAQ ---------- */
function renderFaq() {
  $("#faqList").innerHTML = FAQ.map((item, i) => `
    <div class="faq__item" data-i="${i}">
      <button class="faq__q">${item.q}</button>
      <div class="faq__a"><div class="faq__a-inner">${item.a}</div></div>
    </div>`).join("");

  $$(".faq__item").forEach((item) => {
    const q = $(".faq__q", item);
    const a = $(".faq__a", item);
    q.addEventListener("click", () => {
      const open = item.classList.contains("is-open");
      $$(".faq__item").forEach((el) => {
        el.classList.remove("is-open");
        $(".faq__a", el).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add("is-open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });
}

/* ---------- Cart ---------- */
function addToCart() {
  const { price, units } = state.bundle;
  state.cart.push({
    name: "شرائط الأنف اللاصقة",
    image: CDN + state.images[0],
    qty: units,
    price,
    color: state.color.name
  });
  renderCart();
  openDrawer();
}

function renderCart() {
  const count = state.cart.reduce((s, i) => s + i.qty, 0);
  $("#cartCount").textContent = count;

  const body = $("#drawerBody");
  if (!state.cart.length) {
    body.innerHTML = '<p class="drawer__empty">السلة فارغة</p>';
  } else {
    body.innerHTML = state.cart.map((i) => `
      <div class="drawer__item">
        <img src="${i.image}" alt="${i.name}">
        <div class="drawer__item-info">
          <strong>${i.name}</strong>
          <small>اللون: ${i.color} · الكمية: ${i.qty}</small>
        </div>
        <div class="drawer__qty">${fmt(i.price)}</div>
      </div>`).join("");
  }
  const total = state.cart.reduce((s, i) => s + i.price, 0);
  $("#drawerTotal").textContent = fmt(total);
}

/* ---------- Drawer ---------- */
function openDrawer() {
  $("#drawer").classList.add("is-open");
  $("#overlay").classList.add("is-open");
}
function closeDrawer() {
  $("#drawer").classList.remove("is-open");
  $("#overlay").classList.remove("is-open");
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-visible"), 4000);
}

/* ---------- Misc ---------- */
function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function bindUi() {
  $("#burger").addEventListener("click", () => $("#nav").classList.toggle("is-open"));
  $("#cartBtn").addEventListener("click", openDrawer);
  $("#drawerClose").addEventListener("click", closeDrawer);
  $("#overlay").addEventListener("click", closeDrawer);
  $("#drawerCheckout").addEventListener("click", () => {
    if (!state.cart.length) { showToast("السلة فارغة — أضف المنتج أولاً"); return; }
    closeDrawer();
    $("#orderForm").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // sticky CTA
  const sticky = $("#stickyCta");
  const productSection = $("#product");
  const orderForm = $("#orderForm");

  window.addEventListener("scroll", () => {
    const pastHero = productSection.getBoundingClientRect().top < -200;
    const formVisible = orderForm.getBoundingClientRect().top < window.innerHeight &&
      orderForm.getBoundingClientRect().bottom > 0;
    sticky.classList.toggle("is-visible", pastHero && !formVisible);
  });

  $("#stickyBtn").addEventListener("click", () => {
    $("#orderForm").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // header shadow on scroll
  window.addEventListener("scroll", () => {
    $("#header").style.boxShadow = window.scrollY > 10 ? "var(--shadow)" : "none";
  });
}

/* expose for order/add */
window.addToCart = addToCart;

/* ---------- Init ---------- */
function init() {
  renderGallery();
  bindOptions();
  bindForm();
  renderReviews();
  renderFaq();
  renderCart();
  renderPrice();
  bindUi();
}

document.addEventListener("DOMContentLoaded", init);
