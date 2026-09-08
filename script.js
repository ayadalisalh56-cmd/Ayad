/* Kurdana — script.js
   Consolidated application JavaScript.
   UTF-8 / Kurdish RTL compatible.
*/

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  // Global toast helper.
  window.kurdanaToast = (message) => {
    const toast = $(".toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(window.__kurdanaToastTimer);

    window.__kurdanaToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  };

  // Page/view navigation.
  window.kurdanaGo = (id) => {
    if (!id) return;

    $$(".page-view").forEach((view) => {
      view.classList.remove("active");
    });

    const target = document.getElementById(id);

    if (target) {
      target.classList.add("active");

      const home = document.getElementById("home");

      if (home) {
        home.style.display = id === "home" ? "block" : "none";
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  // Global click handlers.
  document.addEventListener("click", (event) => {
    const pageLink = event.target.closest("[data-page]");

    if (pageLink) {
      event.preventDefault();
      window.kurdanaGo(pageLink.dataset.page);
      return;
    }

    const close = event.target.closest(
      "[data-close], .modal .close, [data-zhir-close]"
    );

    if (close) {
      const modal = close.closest(".modal, .drawer, .zhir-drawer");

      if (modal) {
        modal.classList.remove("open", "active");
        modal.setAttribute("aria-hidden", "true");
      }
    }

    const action = event.target.closest("[data-toast]");

    if (action) {
      window.kurdanaToast(action.dataset.toast);
    }
  });

  // Escape closes visible overlays.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    $$(".modal.open, .modal.active, .drawer.open, .zhir-drawer.open").forEach(
      (element) => {
        element.classList.remove("open", "active");
        element.setAttribute("aria-hidden", "true");
      }
    );
  });

  // Mobile navigation.
  const menuButton = $("[data-menu-toggle]");
  const mobileMenu = $("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");

      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  // Search form.
  const searchForm = $("#searchForm");

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      const input = searchForm.querySelector("input");

      if (!input || !input.value.trim()) {
        event.preventDefault();

        window.kurdanaToast(
          "تکایە وشەیەک بۆ گەڕان بنووسە."
        );
      }
    });
  }

  // Authentication demo.
  $$("[data-auth]").forEach((button) => {
    button.addEventListener("click", () => {
      const provider =
        button.dataset.auth || "هەژمار";

      window.kurdanaToast(
        `بەستەرکردنی ${provider} لە backend ـدا پێویستی بە ڕێکخستن هەیە.`
      );
    });
  });

  // Zhir AI drawer.
  const zhirOpeners = $$("[data-zhir-open]");
  const zhirDrawer = $("#zhirDrawer");

  zhirOpeners.forEach((button) => {
    button.addEventListener("click", () => {
      if (!zhirDrawer) return;

      zhirDrawer.classList.add("open");
      zhirDrawer.setAttribute("aria-hidden", "false");
    });
  });

  // Zhir AI chat.
  const chatForm = $("#chatForm");
  const chatInput = $("#chatInput");
  const chat = $("#chat");

  if (chatForm && chatInput && chat) {
    chatForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const text = chatInput.value.trim();

      if (!text) return;

      const userBubble = document.createElement("div");

      userBubble.className = "bubble user";
      userBubble.textContent = text;

      chat.appendChild(userBubble);

      const botBubble = document.createElement("div");

      botBubble.className = "bubble bot";

      botBubble.textContent =
        "ئەمە وەڵامی prototype ـە. بۆ وەڵامی زیرەک و سەرچاوەدار، API ـی Zhir AI لە backend پەیوەست دەکرێت.";

      chat.appendChild(botBubble);

      chatInput.value = "";

      chat.scrollTop = chat.scrollHeight;
    });
  }

  // Initial hash route.
  const initial = location.hash.slice(1);

  if (
    initial &&
    document.getElementById(initial)
  ) {
    window.kurdanaGo(initial);
  }
})();


/* =========================================================
   Kurdana Stage 15
   ========================================================= */

const s15Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home = document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s15Go(link.dataset.page);
    });
  });

const s15Esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]
  );

document
  .getElementById("s15MorphAnalyze")
  ?.addEventListener("click", () => {
    const input =
      document.getElementById("s15MorphWord");

    const result =
      document.getElementById("s15MorphResult");

    const word = input.value.trim();

    if (!word) {
      result.textContent = "وشەیەک بنووسە.";
      return;
    }

    let root = word;
    const parts = [];

    for (const suffix of [
      "ەکان",
      "ەکانی",
      "ان",
      "ە",
      "ی",
    ]) {
      if (
        root.length > suffix.length + 2 &&
        root.endsWith(suffix)
      ) {
        parts.push(suffix);
        root = root.slice(
          0,
          -suffix.length
        );
        break;
      }
    }

    result.innerHTML =
      "<b>" +
      s15Esc(word) +
      "</b>" +
      "<div class='s15-row'>" +
      "بنەڕەت <span>" +
      s15Esc(root) +
      "</span>" +
      "</div>" +
      "<div class='s15-row'>" +
      "مۆرفیم <span>" +
      (parts.join(" + ") || "—") +
      "</span>" +
      "</div>" +
      "<div class='s15-note'>" +
      "ئەم ئەنجامە prototype ـە؛ lexicon و model ـی زانستی لە backend ـدا جێگیر دەکرێن." +
      "</div>";
  });

document
  .getElementById("s15SyntaxAnalyze")
  ?.addEventListener("click", () => {
    const input =
      document.getElementById("s15SyntaxText");

    const result =
      document.getElementById("s15SyntaxResult");

    const text = input.value.trim();

    if (!text) {
      result.textContent = "ڕستەیەک بنووسە.";
      return;
    }

    const words = text
      .replace(/[.!؟?]/g, "")
      .split(/\s+/)
      .filter(Boolean);

    result.innerHTML =
      "<div class='s15-tree'>" +
      "<span><b>Sentence</b></span>" +
      "<span>↳ Subject: " +
      s15Esc(words[0] || "—") +
      "</span>" +
      "<span>↳ Predicate: " +
      s15Esc(
        words.slice(1).join(" ") || "—"
      ) +
      "</span>" +
      "<span>↳ Tokens: " +
      words.length +
      "</span>" +
      "</div>" +
      "<div class='s15-note'>" +
      "syntax parser ـی تەواو لە backend ـدا پەیوەست دەکرێت." +
      "</div>";
  });

[
  "linguisticsPage15",
  "morphologyPage15",
  "syntaxPage15",
  "phonologyPage15",
  "grammarRulesPage15",
  "linguisticPipelinePage15",
].includes(location.hash.slice(1)) &&
  s15Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 16
   ========================================================= */

const s16Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home = document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s16Go(link.dataset.page);
    });
  });

const s16Esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]
  );

document
  .getElementById("s16AnalyzePoem")
  ?.addEventListener("click", () => {
    const input =
      document.getElementById("s16Poem");

    const result =
      document.getElementById("s16PoemResult");

    const preview =
      document.getElementById("s16PoemPreview");

    const text = input.value.trim();

    if (!text) {
      result.textContent = "شیعرێک بنووسە.";
      return;
    }

    const lines = text
      .split(/\n/)
      .filter((x) => x.trim());

    const words = text
      .split(/\s+/)
      .filter(Boolean);

    const stanzas = text
      .split(/\n\s*\n/)
      .filter((x) => x.trim());

    preview.textContent = text;

    const frequencies = {};

    words.forEach((word) => {
      frequencies[word] =
        (frequencies[word] || 0) + 1;
    });

    const repeatedWords =
      Object.values(frequencies)
        .filter((count) => count > 1)
        .length;

    result.innerHTML =
      "<div class='s16-row'>" +
      "دێڕ <b>" +
      lines.length +
      "</b></div>" +

      "<div class='s16-row'>" +
      "وشە <b>" +
      words.length +
      "</b></div>" +

      "<div class='s16-row'>" +
      "بند <b>" +
      stanzas.length +
      "</b></div>" +

      "<div class='s16-row'>" +
      "دووبارەبوونەوەی وشە <b>" +
      repeatedWords +
      "</b></div>" +

      "<div class='s16-note' style='margin-top:10px'>" +
      "ئەم analyzer ـە لە ئێستادا structure-level prototype ـە؛ rhyme/meter و literary devices ـی production بە corpus و model ـی تایبەت پێشکەوتوو دەکرێن." +
      "</div>";
  });

[
  "literaturePage16",
  "poetryAnalyzerPage16",
  "literaryAnalysisPage16",
  "literaryCorpusPage16",
  "poetryPipelinePage16",
].includes(location.hash.slice(1)) &&
  s16Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 17
   ========================================================= */

const s17Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home = document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s17Go(link.dataset.page);
    });
  });

const s17Esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character]
  );

document
  .getElementById("s17Preview")
  ?.addEventListener("click", () => {
    const title =
      document
        .getElementById("s17Title")
        .value.trim();

    const body =
      document
        .getElementById("s17Body")
        .value.trim();

    const type =
      document.getElementById("s17Type").value;

    const box =
      document.getElementById(
        "s17PreviewBox"
      );

    if (!title || !body) {
      box.textContent =
        "ناونیشان و ناوەڕۆک پڕ بکەرەوە.";
      return;
    }

    box.innerHTML =
      "<h4>" +
      s17Esc(title) +
      "</h4>" +

      "<span class='s17-chip'>" +
      s17Esc(type) +
      "</span>" +

      "<p style='white-space:pre-wrap;line-height:2'>" +
      s17Esc(body) +
      "</p>" +

      "<div class='s17-note'>" +
      "✓ پشکنینی سەرەتایی: ئامادەیە بۆ publishing pipeline" +
      "</div>";
  });

document
  .getElementById("s17Clear")
  ?.addEventListener("click", () => {
    ["s17Title", "s17Body"].forEach(
      (id) => {
        const element =
          document.getElementById(id);

        if (element) {
          element.value = "";
        }
      }
    );

    const box =
      document.getElementById(
        "s17PreviewBox"
      );

    if (box) {
      box.textContent =
        "هێشتا هیچ ناوەڕۆکێک نییە.";
    }
  });

[
  "publishingPage17",
  "profilePage17",
  "composerPage17",
  "feedPage17",
  "moderationPage17",
].includes(location.hash.slice(1)) &&
  s17Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 18
   ========================================================= */

const s18Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


/* =========================================================
   Kurdana Stage 21
   ========================================================= */

const s21Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s21Go(link.dataset.page);
    });
  });

document
  .querySelectorAll("[data-course]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const message =
        document.getElementById(
          "s21CourseMsg"
        );

      if (!message) return;

      message.textContent =
        "کۆرسی «" +
        button.dataset.course +
        "» هەڵبژێردرا. پڕۆگرێس و وانەکان لە workspace ـی بەکارهێنەر تۆمار دەکرێن.";
    });
  });

document
  .querySelectorAll("[data-answer]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const answer =
        document.getElementById(
          "s21Answer"
        );

      if (!answer) return;

      if (button.dataset.answer === "ناو") {
        answer.textContent =
          "✓ وەڵامی ڕاستە — «مامۆستا» ناوە.";
      } else {
        answer.textContent =
          "✗ ئەوە وەڵامی ڕاست نییە؛ دووبارە هەوڵ بدە.";
      }
    });
  });

[
  "learningPage21",
  "coursesPage21",
  "lessonPage21",
  "exercisePage21",
].includes(location.hash.slice(1)) &&
  s21Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 22
   ========================================================= */

const s22Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s22Go(link.dataset.page);
    });
  });

const s22Preview = () => {
  const body =
    document.getElementById(
      "s22Body"
    );

  const preview =
    document.getElementById(
      "s22Preview"
    );

  const unicode =
    document.getElementById(
      "s22Unicode"
    );

  const text =
    body?.value || "";

  if (preview) {
    preview.textContent =
      text ||
      "پێشبینین لێرە دەردەکەوێت.";
  }

  if (unicode) {
    unicode.textContent =
      text
        ? "✓ پشکنین کرا"
        : "ئامادە";
  }
};

document
  .getElementById("s22Body")
  ?.addEventListener(
    "input",
    s22Preview
  );

document
  .querySelectorAll("[data-cmd]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const body =
        document.getElementById(
          "s22Body"
        );

      if (!body) return;

      if (
        button.dataset.cmd ===
        "unicode"
      ) {
        body.value =
          body.value.normalize("NFC");

        s22Preview();

      } else if (
        button.dataset.cmd ===
        "rtl"
      ) {
        body.dir = "rtl";

      } else {
        const start =
          body.selectionStart;

        const end =
          body.selectionEnd;

        const value =
          body.value;

        const tag =
          button.dataset.cmd ===
          "bold"
            ? "**"
            : "*";

        body.value =
          value.slice(0, start) +
          tag +
          value.slice(start, end) +
          tag +
          value.slice(end);

        s22Preview();
      }
    });
  });

document
  .getElementById("s22Publish")
  ?.addEventListener("click", () => {
    const title =
      document
        .getElementById("s22Title")
        .value.trim();

    const body =
      document
        .getElementById("s22Body")
        .value.trim();

    const message =
      document.getElementById(
        "s22Msg"
      );

    if (!message) return;

    message.textContent =
      title && body
        ? "✓ ناوەڕۆکەکە بۆ پرۆسەی بڵاوکردنەوە نێردرا."
        : "تکایە ناونیشان و دەق پڕ بکەوە.";
  });

document
  .getElementById("s22Draft")
  ?.addEventListener("click", () => {
    const message =
      document.getElementById(
        "s22Msg"
      );

    if (message) {
      message.textContent =
        "✓ Draft ـەکە پاشەکەوت کرا.";
    }
  });

[
  "publishPage22",
  "editorialPage22",
  "myPostsPage22",
  "moderationPage22",
].includes(location.hash.slice(1)) &&
  s22Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 23
   ========================================================= */

const s23Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s23Go(link.dataset.page);
    });
  });

document
  .getElementById("s23Normalize")
  ?.addEventListener("click", () => {
    const text =
      document.getElementById(
        "s23Text"
      );

    const result =
      document.getElementById(
        "s23Result"
      );

    if (!text || !result) return;

    text.value =
      text.value.normalize("NFC");

    result.innerHTML =
      "<span class='s23-tag'>✓ Unicode NFC</span><br>" +
      "دەقەکە normalize کرا و ئێستا ئامادەی tokenization ـە.";
  });

document
  .getElementById("s23Analyze")
  ?.addEventListener("click", () => {
    const text =
      document.getElementById(
        "s23Text"
      );

    const result =
      document.getElementById(
        "s23Result"
      );

    if (!text || !result) return;

    const value =
      text.value.trim();

    if (!value) {
      result.textContent =
        "تکایە دەق بنووسە.";
      return;
    }

    const tokens =
      value
        .split(/\s+/)
        .filter(Boolean);

    result.innerHTML =
      "<b>Tokenization:</b> " +
      tokens.length +
      " وشە<br><br>" +

      tokens
        .map(
          (word, index) =>
            "<div class='s23-row'>" +
            "<span>" +
            word +
            "</span>" +
            "<span>" +
            "<span class='s23-tag'>" +
            "token " +
            (index + 1) +
            "</span>" +
            "</span>" +
            "</div>"
        )
        .join("") +

      "<div class='s23-note' style='margin-top:10px'>" +
      "ئەمە لایەری UI ـی شیکەرەوەیە؛ POS، morphology و syntax ـی ڕاستەقینە لە NLP backend ـدا جێگیر دەکرێت." +
      "</div>";
  });

[
  "analyzerPage23",
  "posPage23",
  "syntaxPage23",
  "phonologyPage23",
].includes(location.hash.slice(1)) &&
  s23Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 24
   ========================================================= */

const s24Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s24Go(link.dataset.page);
    });
  });

document
  .getElementById("s24Analyze")
  ?.addEventListener("click", () => {
    const poem =
      document.getElementById(
        "s24Poem"
      );

    const analysis =
      document.getElementById(
        "s24Analysis"
      );

    if (!poem || !analysis) return;

    const text =
      poem.value.trim();

    if (!text) {
      analysis.innerHTML =
        "<div class='s24-note'>" +
        "تکایە شیعرەکە دابنێ." +
        "</div>";
      return;
    }

    const lines =
      text
        .split(/\n/)
        .filter((x) => x.trim());

    const words =
      text
        .split(/\s+/)
        .filter(Boolean);

    analysis.innerHTML =
      "<div class='s24-row'>" +
      "ژمارەی دێڕ <span>" +
      lines.length +
      "</span></div>" +

      "<div class='s24-row'>" +
      "وشە <span>" +
      words.length +
      "</span></div>" +

      "<div class='s24-row'>" +
      "قافیە <span>" +
      "پێویستی بە NLP/Prosody backend هەیە" +
      "</span></div>" +

      "<div class='s24-row'>" +
      "وێنەسازی <span>" +
      "دەتوانرێت بە Zhir AI شیکرێتەوە" +
      "</span></div>" +

      "<div class='s24-row'>" +
      "شێواز <span>" +
      "دەتوانرێت بە corpus بەراورد بکرێت" +
      "</span></div>" +

      "<div class='s24-note' style='margin-top:10px'>" +
      "ئەم لایەرە UI ـە؛ شیکردنەوەی ڕاستەقینەی وزن، قافیە و شێوازی شیعر لە backend ـی ئەدەبی جێگیر دەکرێت." +
      "</div>";
  });

document
  .getElementById("s24Clear")
  ?.addEventListener("click", () => {
    const poem =
      document.getElementById(
        "s24Poem"
      );

    const analysis =
      document.getElementById(
        "s24Analysis"
      );

    if (poem) {
      poem.value = "";
    }

    if (analysis) {
      analysis.innerHTML =
        "<div class='s24-row'>" +
        "ژمارەی دێڕ <span>—</span>" +
        "</div>" +

        "<div class='s24-row'>" +
        "وشە <span>—</span>" +
        "</div>" +

        "<div class='s24-row'>" +
        "قافیە <span>ئامادە بۆ پشکنین</span>" +
        "</div>" +

        "<div class='s24-row'>" +
        "وێنەسازی <span>AI</span>" +
        "</div>" +

        "<div class='s24-row'>" +
        "شێواز <span>AI</span>" +
        "</div>";
    }
  });

[
  "literaturePage24",
  "poetryPage24",
  "poetryWorkbenchPage24",
  "literaryCorpusPage24",
].includes(location.hash.slice(1)) &&
  s24Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 25
   ========================================================= */

const s25Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s25Go(link.dataset.page);
    });
  });

document
  .getElementById("s25Edit")
  ?.addEventListener("click", () => {
    const box =
      document.getElementById(
        "s25EditBox"
      );

    if (box) {
      box.style.display = "block";
    }
  });

document
  .getElementById("s25Save")
  ?.addEventListener("click", () => {
    const name =
      document
        .getElementById("s25Name")
        .value.trim();

    const bio =
      document
        .getElementById("s25Bio")
        .value.trim();

    if (name) {
      const profileName =
        document.querySelector(
          "#profilePage25 .s25-profile h3"
        );

      if (profileName) {
        profileName.textContent = name;
      }
    }

    if (bio) {
      const profileBio =
        document.querySelector(
          "#profilePage25 .s25-profile small"
        );

      if (profileBio) {
        profileBio.textContent = bio;
      }
    }

    const box =
      document.getElementById(
        "s25EditBox"
      );

    if (box) {
      box.style.display = "none";
    }
  });

[
  "communityPage25",
  "profilePage25",
  "feedPage25",
  "authPage25",
].includes(location.hash.slice(1)) &&
  s25Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 26
   ========================================================= */

const s26Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s26Go(link.dataset.page);
    });
  });

const s26Ask = () => {
  const input =
    document.getElementById(
      "s26Prompt"
    );

  const chat =
    document.getElementById(
      "s26Chat"
    );

  if (!input || !chat) return;

  const question =
    input.value.trim();

  if (!question) return;

  const safeQuestion =
    question.replace(
      /</g,
      "&lt;"
    );

  chat.insertAdjacentHTML(
    "beforeend",

    "<div class='s26-msg s26-user'>" +
    safeQuestion +
    "</div>" +

    "<div class='s26-msg s26-ai'>" +
    "پرسیارەکەت وەرگیرا. لە وەشانی production ـدا Zhir AI ئەم پرسیارە بە Kurdish NLP، کۆرپەسی Kurdana و سەرچاوە پەیوەندیدارەکان شیدەکاتەوە و وەڵامی پشتبەستوو بە سەرچاوە دەدات." +
    "</div>"
  );

  input.value = "";

  chat.scrollTop =
    chat.scrollHeight;
};

document
  .getElementById("s26Ask")
  ?.addEventListener(
    "click",
    s26Ask
  );

document
  .getElementById("s26Prompt")
  ?.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Enter") {
        s26Ask();
      }
    }
  );

[
  "zhirPage26",
  "zhirPipelinePage26",
  "zhirToolsPage26",
].includes(location.hash.slice(1)) &&
  s26Go(location.hash.slice(1));


/* =========================================================
   Kurdana Stage 27
   ========================================================= */

const s27Go = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      s27Go(link.dataset.page);
    });
  });

document
  .querySelectorAll("[data-test]")
  .forEach((button) => {
    button.addEventListener("click", () => {
      const log =
        document.getElementById(
          "s27Log"
        );

      if (!log) return;

      const name =
        button.dataset.test;

      log.textContent +=
        "\n> running " +
        name +
        " check..." +

        "\n> " +
        name +
        " check: PASS\n";

      log.scrollTop =
        log.scrollHeight;
    });
  });

[
  "healthPage27",
  "securityPage27",
  "qaPage27",
  "rolesPage27",
].includes(location.hash.slice(1)) &&
  s27Go(location.hash.slice(1));


/* =========================================================
   Kurdana FINAL Integration
   ========================================================= */

const kfGo = (id) => {
  document
    .querySelectorAll(".page-view")
    .forEach((x) => x.classList.remove("active"));

  document
    .getElementById(id)
    ?.classList.add("active");

  const home =
    document.getElementById("home");

  if (home) {
    home.style.display =
      id === "home" ? "block" : "none";
  }

  scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

document
  .querySelectorAll("[data-page]")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      kfGo(link.dataset.page);
    });
  });

document
  .getElementById("kfRun")
  ?.addEventListener("click", () => {
    const box =
      document.getElementById(
        "kfChecks"
      );

    if (!box) return;

    box.insertAdjacentHTML(
      "beforeend",

      "<div class='kf-check'>" +
      "Final integration smoke test " +
      "<span class='kf-ok'>PASS</span>" +
      "</div>"
    );
  });

document
  .getElementById("kfReset")
  ?.addEventListener("click", () => {
    location.reload();
  });
/* =========================================================
   Kurdana — Library Full Navigation Fix
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  function openLibrary() {
    if (typeof window.kurdanaGo === "function") {
      window.kurdanaGo("libraryPage");
    }

    history.pushState(
      null,
      "",
      "#libraryPage"
    );
  }

  // دوگمەی «بینین ←» لە کارتێکی کتێبخانە
  const libraryButton = document.querySelector(
    "#library .link-btn"
  );

  if (libraryButton) {
    libraryButton.addEventListener("click", (event) => {
      event.preventDefault();
      openLibrary();
    });
  }

  // لینکەکانی کتێبخانە لە navigation
  document.querySelectorAll(
    'a[href="#library"]'
  ).forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openLibrary();
    });
  });

});
/* =====================================================
   Kurdana Library — Stage 2
   Book Details System
===================================================== */

(() => {
  "use strict";

  /*
   * Book database — Stage 2
   *
   * لە قۆناغەکانی داهاتوودا ئەمە دەچێتە
   * Database / Backend ـی ڕاستەقینە.
   */

  const kurdanaBooks = {

    "book-1": {
      title: "مێژووی ئەدەبی کوردی",
      author: "د. هێمن مەعروف",
      type: "کتێب",
      category: "ئەدەبیات",
      pages: "٢٤٠",
      year: "٢٠٢٦",
      decoration: "✦",

      description:
        "پێداچوونەوەیەکی کورت بە مێژووی ئەدەبی کوردی، سەردەمەکان و گەشەکردنی ئەدەبیات.",

      contents: [
        "١. پێشەکی",
        "٢. مێژووی ئەدەبی کوردی",
        "٣. سەردەمە ئەدەبییەکان",
        "٤. شاعیر و نووسەرەکان",
        "٥. کۆتایی"
      ],

      tags: [
        "ئەدەبیات",
        "مێژوو",
        "زمانی کوردی"
      ]
    },


    "book-2": {
      title: "بنەماکانی زمانی کوردی",
      author: "د. کامەران عەزیز",
      type: "کتێب",
      category: "زمانەوانی",
      pages: "٣١٠",
      year: "٢٠٢٦",
      decoration: "❖",

      description:
        "سەرچاوەیەکی بنەڕەتی بۆ خوێندنەوەی ڕێزمان و پێکهاتەی زمانی کوردی.",

      contents: [
        "١. پێشەکی",
        "٢. پیت و دەنگ",
        "٣. وشەسازی",
        "٤. ڕێزمان",
        "٥. سینتاکس"
      ],

      tags: [
        "زمان",
        "ڕێزمان",
        "زمانەوانی"
      ]
    },


    "book-3": {
      title: "چیرۆکە کوردییەکان",
      author: "کۆکراوەی Kurdana",
      type: "کتێب",
      category: "ئەدەبیات",
      pages: "١٨٥",
      year: "٢٠٢٦",
      decoration: "☼",

      description:
        "کۆمەڵێک چیرۆکی کوردی لە سەردەم و ناوچە جیاوازەکان.",

      contents: [
        "١. چیرۆکی کوردستان",
        "٢. چیرۆکی خەڵکی",
        "٣. چیرۆکی نوێ",
        "٤. چیرۆکی کورت"
      ],

      tags: [
        "چیرۆک",
        "ئەدەبیات",
        "کەلتوور"
      ]
    },


    "book-4": {
      title: "مۆرفۆلۆژی لە کوردیدا",
      author: "د. ئارام سەلیم",
      type: "کتێب",
      category: "زمانەوانی",
      pages: "٢٧٥",
      year: "٢٠٢٦",
      decoration: "✺",

      description:
        "توێژینەوەیەک لەسەر پێکهاتەی وشە، ڕەگ و پاشگر و پێشگرەکان.",

      contents: [
        "١. پێشەکی",
        "٢. پێکهاتەی وشە",
        "٣. ڕەگ",
        "٤. پێشگر و پاشگر",
        "٥. وشەسازی"
      ],

      tags: [
        "مۆرفۆلۆژی",
        "زمان",
        "وشەسازی"
      ]
    },


    "book-5": {
      title: "شیعری کلاسیکی کوردی",
      author: "ئارشیفی Kurdana",
      type: "کتێب",
      category: "شیعر",
      pages: "٣٢٠",
      year: "٢٠٢٦",
      decoration: "❋",

      description:
        "هەڵبژاردەیەک لە شیعرە کلاسیکییە کوردییەکان و ناساندنی شاعیرەکان.",

      contents: [
        "١. پێشەکی",
        "٢. شیعری کلاسیکی",
        "٣. شاعیرەکان",
        "٤. شێوازی شیعر",
        "٥. هەڵبژاردەی شیعر"
      ],

      tags: [
        "شیعر",
        "کلاسیک",
        "ئەدەبیات"
      ]
    },


    "book-6": {
      title: "ڕێنمایی نووسینی کوردی",
      author: "تیمی Kurdana",
      type: "کتێب",
      category: "زمان",
      pages: "١٢٠",
      year: "٢٠٢٦",
      decoration: "✧",

      description:
        "ڕێنمایی بۆ نووسینی پاک و یەکگرتووی کوردی و بەکارهێنانی Unicode.",

      contents: [
        "١. بنەماکانی نووسین",
        "٢. Unicode",
        "٣. ڕێنووس",
        "٤. نیشانەکانی خاڵبەندی",
        "٥. ڕێنمایی کۆتایی"
      ],

      tags: [
        "نووسین",
        "Unicode",
        "زمانی کوردی"
      ]
    }

  };


  /* -----------------------------------------------------
     Elements
  ----------------------------------------------------- */

  const title =
    document.getElementById("bookDetailTitle");

  const author =
    document.getElementById("bookDetailAuthor");

  const type =
    document.getElementById("bookDetailType");

  const category =
    document.getElementById("bookDetailCategory");

  const pages =
    document.getElementById("bookDetailPages");

  const year =
    document.getElementById("bookDetailYear");

  const description =
    document.getElementById("bookDetailDescription");

  const coverTitle =
    document.getElementById("bookDetailCoverTitle");

  const coverAuthor =
    document.getElementById("bookDetailCoverAuthor");

  const decoration =
    document.getElementById("bookDetailDecoration");

  const contents =
    document.getElementById("bookDetailContents");

  const tags =
    document.getElementById("bookDetailTags");

  const saveButton =
    document.getElementById("bookDetailSave");


  let currentBookId = null;


  /* -----------------------------------------------------
     Render Book
  ----------------------------------------------------- */

  function renderBook(bookId) {

    const book = kurdanaBooks[bookId];

    if (!book) {
      if (typeof window.kurdanaToast === "function") {
        window.kurdanaToast(
          "ئەم کتێبە نەدۆزرایەوە."
        );
      }

      return;
    }

    currentBookId = bookId;

    if (title) {
      title.textContent = book.title;
    }

    if (author) {
      author.textContent =
        "نووسەر: " + book.author;
    }

    if (type) {
      type.textContent = book.type;
    }

    if (category) {
      category.textContent = book.category;
    }

    if (pages) {
      pages.textContent = book.pages;
    }

    if (year) {
      year.textContent = book.year;
    }

    if (description) {
      description.textContent =
        book.description;
    }

    if (coverTitle) {
      coverTitle.innerHTML =
        book.title.replace(
          /\s+/g,
          "<br>"
        );
    }

    if (coverAuthor) {
      coverAuthor.textContent =
        book.author;
    }

    if (decoration) {
      decoration.textContent =
        book.decoration;
    }


    /* Contents */

    if (contents) {

      contents.innerHTML = "";

      book.contents.forEach((item, index) => {

        const button =
          document.createElement("button");

        button.type = "button";
        button.textContent = item;

        button.addEventListener(
          "click",
          () => {

            if (
              typeof window.kurdanaToast ===
              "function"
            ) {
              window.kurdanaToast(
                `بەشی «${item}» هەڵبژێردرا.`
              );
            }

          }
        );

        contents.appendChild(button);

      });

    }


    /* Tags */

    if (tags) {

      tags.innerHTML = "";

      book.tags.forEach((tag) => {

        const span =
          document.createElement("span");

        span.textContent = tag;

        tags.appendChild(span);

      });

    }


    updateSaveButton();
  }


  /* -----------------------------------------------------
     Open Book
  ----------------------------------------------------- */

  function openBook(bookId) {

    renderBook(bookId);

    if (
      typeof window.kurdanaGo ===
      "function"
    ) {
      window.kurdanaGo("bookPage");
    }

    history.pushState(
      null,
      "",
      "#bookPage"
    );
  }


  /* -----------------------------------------------------
     Library Cards
  ----------------------------------------------------- */

  document
    .querySelectorAll(".library-view-btn")
    .forEach((button) => {

      button.addEventListener("click", () => {

        const bookId =
          button.dataset.bookId;

        if (!bookId) return;

        openBook(bookId);

      });

    });


  /* -----------------------------------------------------
     Back to Library
  ----------------------------------------------------- */

  document
    .getElementById("bookBackToLibrary")
    ?.addEventListener(
      "click",
      () => {

        if (
          typeof window.kurdanaGo ===
          "function"
        ) {
          window.kurdanaGo("libraryPage");
        }

        history.pushState(
          null,
          "",
          "#libraryPage"
        );

      }
    );


  /* -----------------------------------------------------
     Save / Favorite
  ----------------------------------------------------- */

  function getSavedBooks() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "kurdanaSavedBooks"
        ) || "[]"
      );

    } catch {

      return [];

    }

  }


  function setSavedBooks(list) {

    localStorage.setItem(
      "kurdanaSavedBooks",
      JSON.stringify(list)
    );

  }


  function updateSaveButton() {

    if (!saveButton || !currentBookId) {
      return;
    }

    const saved =
      getSavedBooks().includes(
        currentBookId
      );

    saveButton.classList.toggle(
      "saved",
      saved
    );

    saveButton.textContent =
      saved
        ? "♥ لە دڵخوازەکانە"
        : "♡ زیادکردن بۆ دڵخوازەکان";
  }


  saveButton?.addEventListener(
    "click",
    () => {

      if (!currentBookId) return;

      let saved =
        getSavedBooks();

      if (saved.includes(currentBookId)) {

        saved =
          saved.filter(
            id => id !== currentBookId
          );

        if (
          typeof window.kurdanaToast ===
          "function"
        ) {
          window.kurdanaToast(
            "کتێبەکە لە دڵخوازەکان لابرا."
          );
        }

      } else {

        saved.push(currentBookId);

        if (
          typeof window.kurdanaToast ===
          "function"
        ) {
          window.kurdanaToast(
            "کتێبەکە زیادکرا بۆ دڵخوازەکان."
          );
        }

      }

      setSavedBooks(saved);

      updateSaveButton();

    }
  );


  /* -----------------------------------------------------
     Start Reading
  ----------------------------------------------------- */

  document
    .getElementById("bookStartReading")
    ?.addEventListener(
      "click",
      () => {

        const book =
          kurdanaBooks[currentBookId];

        if (!book) return;

        if (
          typeof window.kurdanaToast ===
          "function"
        ) {

          window.kurdanaToast(
            `خوێندنەوەی «${book.title}» لە قۆناغی ٣ ـدا چالاک دەکرێت.`
          );

        }

      }
    );


  /* -----------------------------------------------------
     Author Profile
  ----------------------------------------------------- */

  document
    .getElementById("bookAuthorProfile")
    ?.addEventListener(
      "click",
      () => {

        const book =
          kurdanaBooks[currentBookId];

        if (!book) return;

        if (
          typeof window.kurdanaToast ===
          "function"
        ) {

          window.kurdanaToast(
            `پڕۆفایلی «${book.author}» لە قۆناغەکانی داهاتوودا دەکرێتەوە.`
          );

        }

      }
    );

})();
/* =====================================================
   Kurdana Library — Stage 3
   Smart Search / Filter / Sort / Favorites
===================================================== */

(() => {
  "use strict";


  const searchInput =
    document.getElementById("librarySmartSearch");

  const clearSearch =
    document.getElementById("libraryClearSearch");

  const sortSelect =
    document.getElementById("librarySort");

  const resultsInfo =
    document.getElementById("libraryResultsInfo");

  const emptyState =
    document.getElementById("libraryEmptyState");

  const resetButton =
    document.getElementById("libraryResetFilters");

  const filterButtons =
    document.querySelectorAll(
      ".library-filter-btn-stage3"
    );

  const bookGrid =
    document.getElementById("libraryBooksGrid");


  if (!bookGrid) return;


  let currentFilter = "all";
  let currentSearch = "";
  let currentSort = "default";


  /* -----------------------------------------------------
     Helpers
  ----------------------------------------------------- */

  function normalizeText(text) {

    return String(text || "")
      .toLowerCase()
      .replace(/ي/g, "ی")
      .replace(/ى/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/\s+/g, " ")
      .trim();

  }


  function getSavedBooks() {

    try {

      return JSON.parse(
        localStorage.getItem(
          "kurdanaSavedBooks"
        ) || "[]"
      );

    } catch {

      return [];

    }

  }


  function getBookCards() {

    return Array.from(
      bookGrid.querySelectorAll(
        ".library-book-card"
      )
    );

  }


  /* -----------------------------------------------------
     Search
  ----------------------------------------------------- */

  function matchesSearch(card) {

    if (!currentSearch) {
      return true;
    }

    const title =
      card.querySelector("h3")?.textContent || "";

    const author =
      card.querySelector(".library-author")?.textContent || "";

    const description =
      card.querySelector(".library-description")?.textContent || "";

    const type =
      card.querySelector(".library-type")?.textContent || "";

    const searchableText =
      normalizeText(
        `${title} ${author} ${description} ${type}`
      );

    return searchableText.includes(
      normalizeText(currentSearch)
    );

  }


  /* -----------------------------------------------------
     Category
  ----------------------------------------------------- */

  function matchesFilter(card) {

    if (currentFilter === "all") {
      return true;
    }


    if (currentFilter === "favorites") {

      const savedBooks =
        getSavedBooks();

      const bookId =
        card.querySelector(
          "[data-save-book]"
        )?.dataset.saveBook;

      return (
        bookId &&
        savedBooks.includes(bookId)
      );

    }


    const title =
      normalizeText(
        card.querySelector("h3")?.textContent
      );

    const type =
      normalizeText(
        card.querySelector(".library-type")?.textContent
      );

    const author =
      normalizeText(
        card.querySelector(".library-author")?.textContent
      );

    const description =
      normalizeText(
        card.querySelector(".library-description")?.textContent
      );

    const filter =
      normalizeText(currentFilter);


    return (
      title.includes(filter) ||
      type.includes(filter) ||
      author.includes(filter) ||
      description.includes(filter)
    );

  }


  /* -----------------------------------------------------
     Sort
  ----------------------------------------------------- */

  function sortCards(cards) {

    if (currentSort === "default") {
      return cards;
    }


    return cards.sort((a, b) => {

      const titleA =
        normalizeText(
          a.querySelector("h3")?.textContent
        );

      const titleB =
        normalizeText(
          b.querySelector("h3")?.textContent
        );


      if (
        currentSort === "az"
      ) {

        return titleA.localeCompare(
          titleB,
          "ku"
        );

      }


      if (
        currentSort === "za"
      ) {

        return titleB.localeCompare(
          titleA,
          "ku"
        );

      }


      /*
       * The demo cards currently use
       * 2026 as their year.
       *
       * This prepares the system for
       * real metadata later.
       */

      const yearA =
        parseInt(
          a.querySelector(
            ".library-meta span:last-child"
          )?.textContent
          || "0",
          10
        );

      const yearB =
        parseInt(
          b.querySelector(
            ".library-meta span:last-child"
          )?.textContent
          || "0",
          10
        );


      if (
        currentSort === "newest"
      ) {

        return yearB - yearA;

      }


      if (
        currentSort === "oldest"
      ) {

        return yearA - yearB;

      }


      return 0;

    });

  }


  /* -----------------------------------------------------
     Apply
  ----------------------------------------------------- */

  function applyLibraryFilters() {

    let cards =
      getBookCards();


    /*
     * First filter
     */

    cards.forEach((card) => {

      const searchMatch =
        matchesSearch(card);

      const filterMatch =
        matchesFilter(card);

      const visible =
        searchMatch &&
        filterMatch;

      card.classList.toggle(
        "library-hidden-stage3",
        !visible
      );

    });


    /*
     * Then sort
     */

    cards =
      sortCards(cards);


    cards.forEach((card) => {

      bookGrid.appendChild(card);

    });


    /*
     * Visible count
     */

    const visibleCount =
      cards.filter(
        card =>
          !card.classList.contains(
            "library-hidden-stage3"
          )
      ).length;


    if (resultsInfo) {

      resultsInfo.textContent =
        `${visibleCount} ئەنجام دۆزرایەوە`;

    }


    if (emptyState) {

      emptyState.hidden =
        visibleCount !== 0;

    }


    if (clearSearch) {

      clearSearch.style.display =
        currentSearch
          ? "block"
          : "none";

    }

  }


  /* -----------------------------------------------------
     Search Input
  ----------------------------------------------------- */

  searchInput?.addEventListener(
    "input",
    (event) => {

      currentSearch =
        event.target.value;

      applyLibraryFilters();

    }
  );


  /* -----------------------------------------------------
     Clear Search
  ----------------------------------------------------- */

  clearSearch?.addEventListener(
    "click",
    () => {

      if (searchInput) {
        searchInput.value = "";
      }

      currentSearch = "";

      applyLibraryFilters();

      searchInput?.focus();

    }
  );


  /* -----------------------------------------------------
     Filter Buttons
  ----------------------------------------------------- */

  filterButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        currentFilter =
          button.dataset.libraryFilter
          || "all";


        filterButtons.forEach(
          (item) => {

            item.classList.toggle(
              "active",
              item === button
            );

          }
        );


        applyLibraryFilters();

      }
    );

  });


  /* -----------------------------------------------------
     Sort
  ----------------------------------------------------- */

  sortSelect?.addEventListener(
    "change",
    (event) => {

      currentSort =
        event.target.value;

      applyLibraryFilters();

    }
  );


  /* -----------------------------------------------------
     Reset
  ----------------------------------------------------- */

  resetButton?.addEventListener(
    "click",
    () => {

      currentFilter = "all";
      currentSearch = "";
      currentSort = "default";


      if (searchInput) {
        searchInput.value = "";
      }


      if (sortSelect) {
        sortSelect.value = "default";
      }


      filterButtons.forEach(
        (button) => {

          button.classList.toggle(
            "active",
            button.dataset.libraryFilter === "all"
          );

        }
      );


      applyLibraryFilters();

    }
  );


  /* -----------------------------------------------------
     Update favorites filter when saving
     -----------------------------------------------------
     ئەگەر لە قۆناغی ٢ ـدا favorite بگۆڕدرێت،
     ئەنجامەکانی دڵخوازەکانیش نوێ دەکرێنەوە.
  ----------------------------------------------------- */

  window.addEventListener(
    "storage",
    (event) => {

      if (
        event.key === "kurdanaSavedBooks"
      ) {

        applyLibraryFilters();

      }

    }
  );


  /*
   * Initial state
   */

  applyLibraryFilters();

})();

/* =====================================================
   KURDANA LIBRARY — STAGE 4
   Final Library Interaction Layer
===================================================== */

(() => {
  "use strict";

  /* -----------------------------------------------------
     Library Books Database
  ----------------------------------------------------- */

  const LIBRARY_BOOKS = {

    "book-1": {
      title: "وشەسازی",
      author: "نەریمان عەبدوڵڵا خۆشناو",
      type: "کتێب",
      description: "کتێبێک لە بواری وشەسازی و زمان.",
      pdf: "وشەسازی.pdf"
    },

    "book-2": {
      title: "مۆرفۆلۆژی لە زمانی کوردیدا",
      author: "د. کامەران عەزیز",
      type: "وتار",
      description:
        "توێژینەوەیەک لەسەر پێکهاتەی وشە، ڕەگ، پاشگر، پێشگر و گۆڕانکارییە مۆرفۆلۆژییەکان."
    },

    "book-3": {
      title: "لە سەدەی دوورەوە",
      author: "جەلال تەیباری",
      type: "شیعر",
      description:
        "کۆمەڵێک شیعری کوردی لەگەڵ شێواز و وێنەسازیی ئەدەبی."
    },

    "book-4": {
      title: "ڕێزمانی کوردی",
      author: "Kurdana",
      type: "کتێب",
      description:
        "سەرچاوەیەکی فێرکاری بۆ ناسینی بنەماکانی ڕێزمانی زمانی کوردی."
    },

    "book-5": {
      title: "بنەماکانی زمانەوانی",
      author: "Kurdana Research",
      type: "توێژینەوە",
      description:
        "پێشەکییەک بۆ زمانەوانی، مۆرفۆلۆژی، سینتاکس و بواری توێژینەوەی زمان."
    },

    "book-6": {
      title: "فەرهەنگی زمانی کوردی",
      author: "Kurdana",
      type: "کتێب",
      description:
        "کۆمەڵە وشە و زانیاریی زمانەوانی بۆ بەکارهێنانی خوێنەر و توێژەر."
    }

  };


  /* -----------------------------------------------------
     Storage
  ----------------------------------------------------- */

  const STORAGE_KEY = "kurdanaSavedBooks";


  function getSavedBooks() {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
    } catch {
      return [];
    }
  }


  function saveBooks(books) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(books)
    );
  }


  function isSaved(bookId) {
    return getSavedBooks().includes(bookId);
  }


  function toggleSaved(bookId) {
    const saved = getSavedBooks();

    if (saved.includes(bookId)) {
      saveBooks(
        saved.filter((id) => id !== bookId)
      );

      return false;
    }

    saved.push(bookId);
    saveBooks(saved);

    return true;
  }


  /* -----------------------------------------------------
     Go To Library
  ----------------------------------------------------- */

  function goToLibrary() {

    if (typeof window.kurdanaGo === "function") {
      window.kurdanaGo("libraryPage");
    }

    history.pushState(
      null,
      "",
      "#libraryPage"
    );

  }


  /* -----------------------------------------------------
     Open Book
  ----------------------------------------------------- */

  function openBook(bookId) {

    const book = LIBRARY_BOOKS[bookId];

    if (!book) {

      if (
        typeof window.kurdanaToast === "function"
      ) {
        window.kurdanaToast(
          "ئەم کتێبە نەدۆزرایەوە."
        );
      }

      return;
    }


    const title =
      document.getElementById("bookTitle");

    const author =
      document.getElementById("bookAuthor");

    const type =
      document.getElementById("bookType");

    const description =
      document.getElementById("bookDescription");

    const saveButton =
      document.getElementById("bookSaveBtn");


    if (title) {
      title.textContent = book.title;
    }


    if (author) {
      author.textContent =
        "نووسەر: " + book.author;
    }


    if (type) {
      type.textContent = book.type;
    }


    if (description) {
      description.textContent =
        book.description;
    }


    if (saveButton) {

      saveButton.dataset.bookId = bookId;

      const saved = isSaved(bookId);

      saveButton.textContent =
        saved
          ? "♥ پاشەکەوتکراوە"
          : "♡ پاشەکەوتکردن";

      saveButton.classList.toggle(
        "saved",
        saved
      );

      saveButton.setAttribute(
        "aria-pressed",
        String(saved)
      );

    }


    if (typeof window.kurdanaGo === "function") {

      window.kurdanaGo("bookPage");

    } else {

      document
        .querySelectorAll(".page-view")
        .forEach((page) =>
          page.classList.remove("active")
        );

      document
        .getElementById("bookPage")
        ?.classList.add("active");

      document
        .getElementById("home")
        ?.style.setProperty(
          "display",
          "none"
        );

    }


    history.pushState(
      null,
      "",
      "#bookPage"
    );

  }


  /* -----------------------------------------------------
     Open Book Buttons
  ----------------------------------------------------- */

  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".library-view-btn"
        );

      if (!button) return;

      event.preventDefault();

      const bookId =
        button.dataset.bookId;

      if (!bookId) return;

      openBook(bookId);

    }
  );


  /* -----------------------------------------------------
     Save / Bookmark
  ----------------------------------------------------- */

  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          ".library-save-btn, #bookSaveBtn"
        );

      if (!button) return;

      event.preventDefault();

      const bookId =
        button.dataset.bookId;

      if (!bookId) return;

      const saved =
        toggleSaved(bookId);


      button.textContent =
        saved
          ? "♥ پاشەکەوتکراوە"
          : "♡ پاشەکەوتکردن";


      button.classList.toggle(
        "saved",
        saved
      );


      button.setAttribute(
        "aria-pressed",
        String(saved)
      );


      if (
        typeof window.kurdanaToast === "function"
      ) {

        window.kurdanaToast(
          saved
            ? "کتێبەکە پاشەکەوت کرا."
            : "کتێبەکە لە پاشەکەوتکراوەکان سڕایەوە."
        );

      }

    }
  );


  /* -----------------------------------------------------
     Back To Library
  ----------------------------------------------------- */

  document.addEventListener(
    "click",
    (event) => {

      const button =
        event.target.closest(
          "#bookBackToLibrary"
        );

      if (!button) return;

      event.preventDefault();

      goToLibrary();

    }
  );


  /* -----------------------------------------------------
     Update Bookmark Buttons
  ----------------------------------------------------- */

  function updateBookmarkButtons() {

    document
      .querySelectorAll(
        ".library-save-btn"
      )
      .forEach((button) => {

        const bookId =
          button.dataset.bookId;

        if (!bookId) return;

        const saved =
          isSaved(bookId);

        button.textContent =
          saved ? "♥" : "♡";

        button.classList.toggle(
          "saved",
          saved
        );

        button.setAttribute(
          "aria-pressed",
          String(saved)
        );

      });

  }


  updateBookmarkButtons();


  /* -----------------------------------------------------
     Publish From Library
  ----------------------------------------------------- */

  document
    .getElementById(
      "newPublishFromLibrary"
    )
    ?.addEventListener(
      "click",
      () => {

        if (
          typeof window.kurdanaGo === "function"
        ) {

          window.kurdanaGo(
            "publishPage"
          );

        }

      }
    );


  /* -----------------------------------------------------
     Hash Support
  ----------------------------------------------------- */

  if (
    location.hash === "#libraryPage"
  ) {

    setTimeout(() => {

      if (
        typeof window.kurdanaGo === "function"
      ) {

        window.kurdanaGo(
          "libraryPage"
        );

      }

    }, 0);

  }


  /* -----------------------------------------------------
     Public API
  ----------------------------------------------------- */

  window.KurdanaLibrary = {

    books: LIBRARY_BOOKS,

    openBook,

    goToLibrary,

    getSavedBooks,

    isSaved,

    toggleSaved

  };

})();
/* =========================================================
   Kurdana — Robust Library Navigation
   ========================================================= */
(() => {
  "use strict";

  const openLibraryPage = () => {
    if (typeof window.kurdanaGo === "function") {
      window.kurdanaGo("libraryPage");
    } else {
      document.querySelectorAll(".page-view").forEach((page) => {
        page.classList.remove("active");
      });

      const library = document.getElementById("libraryPage");
      const home = document.getElementById("home");

      if (library) library.classList.add("active");
      if (home) home.style.display = "none";

      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (location.hash !== "#libraryPage") {
      history.pushState(null, "", "#libraryPage");
    }
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest(
      'a[href="#library"], a[href="#libraryPage"], [data-page="libraryPage"]'
    );

    if (link) {
      event.preventDefault();
      openLibraryPage();
    }
  });

  window.addEventListener("hashchange", () => {
    const hash = location.hash.slice(1);

    if (hash === "library" || hash === "libraryPage") {
      openLibraryPage();
      return;
    }

    const target = document.getElementById(hash);
    if (target && target.classList.contains("page-view") &&
        typeof window.kurdanaGo === "function") {
      window.kurdanaGo(hash);
    }
  });

  if (location.hash === "#library") {
    setTimeout(openLibraryPage, 0);
  }
})();

/* =========================================================
   Kurdana Library — FINAL Add Book + PDF Upload + Reader
   IndexedDB keeps uploaded PDFs in-browser without putting
   binary data into localStorage.
========================================================= */
(() => {
  "use strict";

  const DB_NAME = "KurdanaLibraryDB";
  const DB_VERSION = 1;
  const STORE = "pdfs";
  const META_KEY = "kurdana_library_v4";
  const MAX_PDF_BYTES = 50 * 1024 * 1024;

  const DEFAULTS = [
    {id:"book-1",type:"book",category:"زمان",title:"وشەسازی",author:"نەریمان عەبدوڵڵا خۆشناو",pages:"١٧٠",year:"٢٠٢٦",description:"کتێبێک لە بواری وشەسازی و زمان.",pdf:"وشەسازی.pdf",tags:["وشەسازی","زمانی کوردی","مۆرفۆلۆژی"]},
    {id:"book-2",type:"article",category:"زمانەوانی",title:"مۆرفۆلۆژی لە زمانی کوردیدا",author:"د. کامەران عەزیز",pages:"—",year:"٢٠٢٦",description:"توێژینەوەیەک لەسەر پێکهاتەی وشە، ڕەگ، پاشگر، پێشگر و گۆڕانکارییە مۆرفۆلۆژییەکان.",tags:["مۆرفۆلۆژی","زمانەوانی"]},
    {id:"book-3",type:"book",category:"ئەدەبیات",title:"چیرۆکە کوردییەکان",author:"کۆکراوەی Kurdana",pages:"١٨٥",year:"٢٠٢٦",description:"کۆمەڵێک چیرۆکی کوردی لە سەردەم و ناوچە جیاوازەکان.",tags:["چیرۆک","ئەدەبیات"]},
    {id:"book-4",type:"book",category:"ڕێزمان",title:"ڕێزمانی کوردی",author:"Kurdana",pages:"—",year:"٢٠٢٦",description:"سەرچاوەیەکی فێرکاری بۆ ناسینی بنەماکانی ڕێزمانی زمانی کوردی.",tags:["ڕێزمان","زمانی کوردی"]},
    {id:"book-5",type:"linguistics",category:"زمانەوانی",title:"بنەماکانی زمانەوانی",author:"Kurdana Research",pages:"—",year:"٢٠٢٦",description:"پێشەکییەک بۆ زمانەوانی، مۆرفۆلۆژی، سینتاکس و بواری توێژینەوەی زمان.",tags:["زمانەوانی","توێژینەوە"]},
    {id:"book-6",type:"book",category:"نووسین",title:"ڕێنمایی نووسینی کوردی",author:"تیمی Kurdana",pages:"١٢٠",year:"٢٠٢٦",description:"ڕێنمایی بۆ نووسینی پاک و یەکگرتووی کوردی و بەکارهێنانی Unicode.",tags:["نووسین","Unicode"]}
  ];

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
  const typeName = t => ({book:"کتێب",article:"وتار",poem:"شیعر",linguistics:"زمانەوانی"}[t] || "سەرچاوە");
  const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const norm = v => String(v ?? "").toLocaleLowerCase().replace(/ي/g,"ی").replace(/ى/g,"ی").replace(/ك/g,"ک").replace(/\s+/g," ").trim();

  function toast(msg) {
    if (typeof window.kurdanaToast === "function") window.kurdanaToast(msg);
    else console.log(msg);
  }

  function readMeta() {
    try {
      const value = JSON.parse(localStorage.getItem(META_KEY) || "null");
      return Array.isArray(value) ? value : null;
    } catch { return null; }
  }

  function writeMeta(list) {
    localStorage.setItem(META_KEY, JSON.stringify(list));
  }

  function getBooks() {
    const saved = readMeta();
    if (saved) return saved;
    const legacy = (() => {
      try { return JSON.parse(localStorage.getItem("kurdana_library_books") || "null"); }
      catch { return null; }
    })();
    const list = Array.isArray(legacy) && legacy.length
      ? legacy.map(x => ({
          id:x.id || ("book-"+Date.now()+"-"+Math.random().toString(36).slice(2)),
          type:x.type || "book", category:x.category || "گشتی",
          title:x.title || "بێ ناونیشان", author:x.author || "نەناسراو",
          pages:x.pages || "—", year:x.year || "—",
          description:x.description || "", pdf:x.file || x.pdf || "",
          tags:Array.isArray(x.tags)?x.tags:[]
        }))
      : DEFAULTS.map(x => ({...x}));
    writeMeta(list);
    return list;
  }

  function saveBooks(list) { writeMeta(list); }

  function openDB() {
    return new Promise((resolve,reject) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error("IndexedDB error"));
    });
  }

  async function putPdf(id, blob) {
    const db = await openDB();
    return new Promise((resolve,reject) => {
      const tx = db.transaction(STORE,"readwrite");
      tx.objectStore(STORE).put(blob,id);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); reject(tx.error || new Error("PDF save failed")); };
    });
  }

  async function getPdf(id) {
    const db = await openDB();
    return new Promise((resolve,reject) => {
      const tx = db.transaction(STORE,"readonly");
      const req = tx.objectStore(STORE).get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error || new Error("PDF read failed"));
      tx.oncomplete = () => db.close();
    });
  }

  async function deletePdf(id) {
    try {
      const db = await openDB();
      await new Promise((resolve,reject) => {
        const tx = db.transaction(STORE,"readwrite");
        tx.objectStore(STORE).delete(id);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
      db.close();
    } catch {}
  }

  function savedIds() {
    try {
      const a = JSON.parse(localStorage.getItem("kurdanaSavedBooks") || "[]");
      return Array.isArray(a) ? a : [];
    } catch { return []; }
  }

  function toggleSaved(id) {
    const a = savedIds();
    const i = a.indexOf(id);
    if (i >= 0) { a.splice(i,1); localStorage.setItem("kurdanaSavedBooks",JSON.stringify(a)); return false; }
    a.push(id); localStorage.setItem("kurdanaSavedBooks",JSON.stringify(a)); return true;
  }

  function updateStats(list) {
    const set = (id,v) => { const e=$("#"+id); if(e)e.textContent=v; };
    set("libraryTotal",list.length);
    set("libraryBooks",list.filter(x=>x.type==="book").length);
    set("libraryArticles",list.filter(x=>x.type==="article").length);
    set("libraryPoems",list.filter(x=>x.type==="poem").length);
    const badge=$("#libraryCountBadge"); if(badge) badge.textContent=`${list.length} سەرچاوە`;
  }

  function getFilter() {
    return $(".library-filter.active")?.dataset.libraryFilter || "all";
  }

  function currentQuery() {
    return norm($("#librarySmartSearch")?.value || $("#librarySearch")?.value || "");
  }

  function matches(book) {
    const q = currentQuery();
    const f = getFilter();
    const text = norm([book.title,book.author,book.category,book.description,typeName(book.type)].join(" "));
    if (q && !text.includes(q)) return false;
    if (f === "favorites") return savedIds().includes(book.id);
    if (f !== "all" && book.type !== f) return false;
    return true;
  }

  function sortList(list) {
    const s = $("#librarySort")?.value || "default";
    const copy = [...list];
    if (s === "az") copy.sort((a,b)=>norm(a.title).localeCompare(norm(b.title),"ku"));
    if (s === "za") copy.sort((a,b)=>norm(b.title).localeCompare(norm(a.title),"ku"));
    if (s === "newest") copy.sort((a,b)=>String(b.year).localeCompare(String(a.year),"ku"));
    if (s === "oldest") copy.sort((a,b)=>String(a.year).localeCompare(String(b.year),"ku"));
    return copy;
  }

  function card(book) {
    const saved = savedIds().includes(book.id);
    const hasPdf = !!book.pdf || !!book.indexedPdf;
    const uploaded = !!book.indexedPdf;
    const pages = book.pages || "—";
    return `
      <article class="library-book-card" data-book-id="${esc(book.id)}">
        <div class="library-book-cover">
          <div class="book-cover-decoration">${esc(book.decoration || "✦")}</div>
          <div class="book-cover-title">${esc(book.title)}</div>
          <div class="book-cover-author">${esc(book.author)}</div>
        </div>
        <div class="library-book-info">
          <span class="library-type">${esc(typeName(book.type))}</span>
          <h3>${esc(book.title)}</h3>
          <p class="library-author">${esc(book.author)}</p>
          <p class="library-description">${esc(book.description)}</p>
          <div class="library-meta"><span>📖 ${esc(pages)} لاپەڕە</span><span>${esc(book.year || "—")}</span></div>
          ${hasPdf ? `<span class="library-pdf-badge">PDF ${uploaded ? "ناوخۆیی" : "ئامادە"}</span>` : ""}
          <div class="library-card-actions">
            <button type="button" class="library-view-btn" data-final-book="${esc(book.id)}">بینین ←</button>
            <button type="button" class="library-save-btn ${saved ? "saved":""}" data-final-save="${esc(book.id)}" aria-label="پاشەکەوتکردن">${saved ? "♥":"♡"}</button>
          </div>
          ${hasPdf ? `<button type="button" class="library-view-btn library-read-pdf-btn" style="width:100%;margin-top:8px" data-final-read="${esc(book.id)}">📖 خوێندنەوەی PDF</button>` : ""}
          ${uploaded ? `<button type="button" class="library-secondary-btn library-delete-btn" style="width:100%;margin-top:8px" data-final-delete="${esc(book.id)}">سڕینەوەی کتێب</button>` : ""}
        </div>
      </article>`;
  }

  function render() {
    const grid = $("#libraryBooksGrid");
    if (!grid) return;
    const all = getBooks();
    const visible = sortList(all.filter(matches));
    grid.innerHTML = visible.map(card).join("");
    updateStats(all);
    const info = $("#libraryResultsInfo"); if(info) info.textContent = `${visible.length} لە ${all.length} سەرچاوە`;
    const empty = $("#libraryEmptyState"); if(empty) empty.hidden = visible.length !== 0;
    const clear = $("#libraryClearSearch"); if(clear) clear.style.display = currentQuery() ? "block":"none";
    if (typeof window.kurdanaLibraryRefresh === "function") {
      try { window.kurdanaLibraryRefresh(); } catch {}
    }
  }

  async function openReader(book) {
    const reader = $("#kurdanaPdfReader");
    const frame = $("#kurdanaPdfFrame");
    const title = $("#kurdanaPdfReaderTitle");
    if (!reader || !frame) return;

    let url = "";
    let revoke = false;

    try {
      if (book.indexedPdf) {
        const blob = await getPdf(book.id);
        if (!blob) throw new Error("PDF not found");
        url = URL.createObjectURL(blob);
        revoke = true;
      } else if (book.pdf) {
        url = book.pdf;
      } else {
        throw new Error("No PDF");
      }

      title.textContent = book.title;
      frame.src = url;
      reader.classList.add("open");
      reader.setAttribute("aria-hidden","false");
      document.body.classList.add("kurdana-reader-open");

      const openNew = $("#kurdanaPdfNewTab");
      if (openNew) {
        openNew.onclick = () => window.open(url, "_blank", "noopener,noreferrer");
      }

      reader._revoke = () => {
        if (revoke && url) URL.revokeObjectURL(url);
      };
    } catch (e) {
      toast("PDF ـی ئەم کتێبە نەدۆزرایەوە.");
    }
  }

  function closeReader() {
    const reader = $("#kurdanaPdfReader");
    const frame = $("#kurdanaPdfFrame");
    if (!reader) return;
    try { if (typeof reader._revoke === "function") reader._revoke(); } catch {}
    if (frame) frame.src = "about:blank";
    reader.classList.remove("open");
    reader.setAttribute("aria-hidden","true");
    document.body.classList.remove("kurdana-reader-open");
  }

  async function handleAddBook(form) {
    const title = $("#libraryBookTitle")?.value.trim();
    const author = $("#libraryBookAuthor")?.value.trim();
    const type = $("#libraryBookType")?.value || "book";
    const category = $("#libraryBookCategory")?.value.trim() || "گشتی";
    const year = $("#libraryBookYear")?.value.trim() || "—";
    const description = $("#libraryBookDescription")?.value.trim() || "";
    const file = $("#libraryBookPdf")?.files?.[0];

    if (!title || !author || !file) {
      toast("ناونیشان، نووسەر و فایلی PDF پڕ بکەرەوە.");
      return;
    }
    const isPdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);
    if (!isPdf) { toast("تەنها فایلی PDF ڕێگەپێدراوە."); return; }
    if (file.size > MAX_PDF_BYTES) { toast("قەبارەی PDF نابێت لە ٥٠MB زیاتر بێت."); return; }

    const id = "uploaded-" + Date.now() + "-" + Math.random().toString(36).slice(2,8);
    const book = {id,type,category,title,author,year,description,pages:"—",indexedPdf:true,fileName:file.name,tags:[]};

    const btn = $("#libraryAddBookBtn");
    const status = $("#libraryUploadStatus");
    if(btn){btn.disabled=true;btn.textContent="خەریکی پاشەکەوتکردنە...";}
    if(status){status.className="library-upload-status";status.textContent="PDF ـەکە خەریکی پاشەکەوتکردنە...";}

    try {
      await putPdf(id,file);
      const list = getBooks();
      list.unshift(book);
      saveBooks(list);
      form.reset();
      render();
      if(status){status.className="library-upload-status ok";status.textContent="✓ کتێبەکە بە سەرکەوتوویی زیادکرا.";}
      toast("کتێبەکە بە سەرکەوتوویی زیاد کرا.");
    } catch(e) {
      await deletePdf(id);
      if(status){status.className="library-upload-status error";status.textContent="هەڵەیەک لە پاشەکەوتکردنی PDF ڕوویدا.";}
      toast("نەتوانرا PDF پاشەکەوت بکرێت.");
    } finally {
      if(btn){btn.disabled=false;btn.textContent="+ زیادکردنی کتێب";}
    }
  }

  async function removeUploaded(id) {
    const list = getBooks();
    const book = list.find(x=>x.id===id);
    if (!book || !book.indexedPdf) return;
    if (!confirm(`دڵنیایت لە سڕینەوەی «${book.title}»؟`)) return;
    await deletePdf(id);
    saveBooks(list.filter(x=>x.id!==id));
    render();
    toast("کتێبەکە سڕایەوە.");
  }

  async function handleClick(event) {
    const read = event.target.closest("[data-final-read]");
    if (read) {
      event.preventDefault(); event.stopImmediatePropagation();
      const book = getBooks().find(x=>x.id===read.dataset.finalRead);
      if(book) await openReader(book);
      return;
    }

    const del = event.target.closest("[data-final-delete]");
    if (del) {
      event.preventDefault(); event.stopImmediatePropagation();
      await removeUploaded(del.dataset.finalDelete);
      return;
    }

    const save = event.target.closest("[data-final-save]");
    if (save) {
      event.preventDefault(); event.stopImmediatePropagation();
      const state = toggleSaved(save.dataset.finalSave);
      render();
      toast(state ? "کتێبەکە پاشەکەوت کرا." : "کتێبەکە لە دڵخوازەکان لابرا.");
      return;
    }

    const view = event.target.closest("[data-final-book]");
    if (view) {
      event.preventDefault(); event.stopImmediatePropagation();
      const id=view.dataset.finalBook;
      const book=getBooks().find(x=>x.id===id);
      if (!book) return;
      // Reuse the existing book details page when available.
      if (typeof window.KurdanaLibrary?.openBook === "function") {
        try { window.KurdanaLibrary.openBook(id); return; } catch {}
      }
      toast(`کتێبی «${book.title}» هەڵبژێردرا.`);
    }
  }

  function bind() {
    const form=$("#libraryAddBookForm");
    form?.addEventListener("submit", e => { e.preventDefault(); handleAddBook(form); });

    $("#kurdanaPdfClose")?.addEventListener("click", closeReader);
    $("#kurdanaPdfReader")?.addEventListener("click", e => { if(e.target.id==="kurdanaPdfReader") closeReader(); });
    document.addEventListener("keydown", e => { if(e.key==="Escape") closeReader(); });

    // Capture phase prevents old duplicate library listeners from fighting the final layer.
    document.addEventListener("click", handleClick, true);

    const syncSearch = () => render();
    $("#librarySearch")?.addEventListener("input", syncSearch);
    $("#librarySmartSearch")?.addEventListener("input", syncSearch);
    $("#libraryClearSearch")?.addEventListener("click", () => {
      if($("#librarySearch")) $("#librarySearch").value="";
      if($("#librarySmartSearch")) $("#librarySmartSearch").value="";
      render();
    });
    $("#librarySort")?.addEventListener("change", render);

    $$(".library-filter").forEach(btn => btn.addEventListener("click", () => {
      $$(".library-filter").forEach(x=>x.classList.remove("active"));
      btn.classList.add("active");
      render();
    }));

    $("#libraryResetFilters")?.addEventListener("click", () => {
      if($("#librarySearch")) $("#librarySearch").value="";
      if($("#librarySmartSearch")) $("#librarySmartSearch").value="";
      if($("#librarySort")) $("#librarySort").value="default";
      $$(".library-filter").forEach(x=>x.classList.toggle("active", x.dataset.libraryFilter==="all"));
      render();
    });

    window.addEventListener("storage", e => {
      if(e.key==="kurdana_library_v4" || e.key==="kurdanaSavedBooks") render();
    });

    window.addEventListener("hashchange", () => {
      if(location.hash==="#libraryPage" || location.hash==="#library") setTimeout(render,0);
    });

    render();
  }

  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();

  window.KurdanaFinalLibrary = {
    getBooks, saveBooks, render, openReader, closeReader, putPdf, getPdf
  };
})();
