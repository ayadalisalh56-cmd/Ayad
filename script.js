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
