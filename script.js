/* =========================================================
   KURDANA — CLEAN script.js
   Library/navigation repair
   UTF-8 / Kurdish RTL compatible
   ========================================================= */

(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) =>
    Array.from(root.querySelectorAll(selector));

  /* ---------------------------------------------------------
     Toast
     --------------------------------------------------------- */
  window.kurdanaToast = (message) => {
    const toast = $(".toast");
    if (!toast) return;

    toast.textContent = String(message || "");
    toast.classList.add("show");

    clearTimeout(window.__kurdanaToastTimer);
    window.__kurdanaToastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  };

  /* ---------------------------------------------------------
     ONE navigation function
     This replaces the many duplicated sXXGo/kfGo functions.
     --------------------------------------------------------- */
  window.kurdanaGo = (id, options = {}) => {
    if (!id) return false;

    const target = document.getElementById(id);
    if (!target) return false;

    $$(".page-view").forEach((view) => {
      view.classList.remove("active");
      view.setAttribute("aria-hidden", "true");
    });

    target.classList.add("active");
    target.setAttribute("aria-hidden", "false");

    const home = document.getElementById("home");
    if (home) {
      home.style.display = id === "home" ? "block" : "none";
    }

    if (options.hash !== false) {
      const nextHash = `#${id}`;
      if (location.hash !== nextHash) {
        history.pushState({ page: id }, "", nextHash);
      }
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    return true;
  };

  /* ---------------------------------------------------------
     Global navigation
     --------------------------------------------------------- */
  document.addEventListener("click", (event) => {
    const pageLink = event.target.closest("[data-page]");
    if (pageLink) {
      const page = pageLink.dataset.page;
      if (page && document.getElementById(page)) {
        event.preventDefault();
        window.kurdanaGo(page);
        return;
      }
    }

    const hrefLink = event.target.closest('a[href^="#"]');
    if (hrefLink) {
      const id = hrefLink.getAttribute("href").slice(1);

      if (id && document.getElementById(id)) {
        event.preventDefault();
        window.kurdanaGo(id);
        return;
      }
    }

    const close = event.target.closest(
      "[data-close], .modal .close, [data-zhir-close]"
    );

    if (close) {
      const overlay = close.closest(
        ".modal, .drawer, .zhir-drawer"
      );

      if (overlay) {
        overlay.classList.remove("open", "active");
        overlay.setAttribute("aria-hidden", "true");
      }
    }

    const toastAction = event.target.closest("[data-toast]");
    if (toastAction) {
      window.kurdanaToast(toastAction.dataset.toast);
    }
  });

  window.addEventListener("popstate", () => {
    const id = location.hash.slice(1);

    if (id && document.getElementById(id)) {
      window.kurdanaGo(id, { hash: false });
    } else {
      window.kurdanaGo("home", { hash: false });
    }
  });

  /* ---------------------------------------------------------
     Mobile menu
     --------------------------------------------------------- */
  const menuButton = $("[data-menu-toggle]");
  const mobileMenu = $("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(open));
    });
  }

  /* ---------------------------------------------------------
     Search form
     --------------------------------------------------------- */
  const searchForm = $("#searchForm");

  if (searchForm) {
    searchForm.addEventListener("submit", (event) => {
      const input = searchForm.querySelector("input");

      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.kurdanaToast("تکایە وشەیەک بۆ گەڕان بنووسە.");
      }
    });
  }

  /* ---------------------------------------------------------
     Authentication demo
     --------------------------------------------------------- */
  $$("[data-auth]").forEach((button) => {
    button.addEventListener("click", () => {
      const provider = button.dataset.auth || "هەژمار";
      window.kurdanaToast(
        `بەستەرکردنی ${provider} لە backend ـدا پێویستی بە ڕێکخستن هەیە.`
      );
    });
  });

  /* ---------------------------------------------------------
     Zhir AI drawer
     --------------------------------------------------------- */
  const zhirDrawer = $("#zhirDrawer");

  $$("[data-zhir-open]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!zhirDrawer) return;

      zhirDrawer.classList.add("open");
      zhirDrawer.setAttribute("aria-hidden", "false");
    });
  });

  /* ---------------------------------------------------------
     Zhir AI prototype chat
     --------------------------------------------------------- */
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

      const botBubble = document.createElement("div");
      botBubble.className = "bubble bot";
      botBubble.textContent =
        "ئەمە وەڵامی prototype ـە. بۆ وەڵامی زیرەک و سەرچاوەدار، API ـی Zhir AI لە backend پەیوەست دەکرێت.";

      chat.append(userBubble, botBubble);
      chatInput.value = "";
      chat.scrollTop = chat.scrollHeight;
    });
  }

  /* =========================================================
     KURDANA LIBRARY
     ========================================================= */

  const LIBRARY_BOOKS = {
    "book-1": {
      title: "وشەسازی",
      author: "نەریمان عەبدوڵڵا خۆشناو",
      type: "کتێب",
      category: "زمان",
      pages: "١٧٠",
      year: "٢٠٢٦",
      description: "کتێبێک لە بواری وشەسازی و زمان.",
      pdf: "وشەسازی.pdf",
      tags: ["وشەسازی", "زمانی کوردی", "مۆرفۆلۆژی"]
    },

    "book-2": {
      title: "مۆرفۆلۆژی لە زمانی کوردیدا",
      author: "د. کامەران عەزیز",
      type: "وتار",
      category: "زمانەوانی",
      pages: "—",
      year: "٢٠٢٦",
      description:
        "توێژینەوەیەک لەسەر پێکهاتەی وشە، ڕەگ، پاشگر، پێشگر و گۆڕانکارییە مۆرفۆلۆژییەکان.",
      tags: ["مۆرفۆلۆژی", "زمانەوانی"]
    },

    "book-3": {
      title: "چیرۆکە کوردییەکان",
      author: "کۆکراوەی Kurdana",
      type: "کتێب",
      category: "ئەدەبیات",
      pages: "١٨٥",
      year: "٢٠٢٦",
      description: "کۆمەڵێک چیرۆکی کوردی لە سەردەم و ناوچە جیاوازەکان.",
      tags: ["چیرۆک", "ئەدەبیات"]
    },

    "book-4": {
      title: "ڕێزمانی کوردی",
      author: "Kurdana",
      type: "کتێب",
      category: "ڕێزمان",
      pages: "—",
      year: "٢٠٢٦",
      description:
        "سەرچاوەیەکی فێرکاری بۆ ناسینی بنەماکانی ڕێزمانی زمانی کوردی.",
      tags: ["ڕێزمان", "زمانی کوردی"]
    },

    "book-5": {
      title: "بنەماکانی زمانەوانی",
      author: "Kurdana Research",
      type: "توێژینەوە",
      category: "زمانەوانی",
      pages: "—",
      year: "٢٠٢٦",
      description:
        "پێشەکییەک بۆ زمانەوانی، مۆرفۆلۆژی، سینتاکس و بواری توێژینەوەی زمان.",
      tags: ["زمانەوانی", "توێژینەوە"]
    },

    "book-6": {
      title: "ڕێنمایی نووسینی کوردی",
      author: "تیمی Kurdana",
      type: "کتێب",
      category: "نووسین",
      pages: "١٢٠",
      year: "٢٠٢٦",
      description:
        "ڕێنمایی بۆ نووسینی پاک و یەکگرتووی کوردی و بەکارهێنانی Unicode.",
      tags: ["نووسین", "Unicode"]
    }
  };

  const SAVED_KEY = "kurdanaSavedBooks";

  function normalizeText(value) {
    return String(value || "")
      .toLocaleLowerCase()
      .replace(/ي/g, "ی")
      .replace(/ى/g, "ی")
      .replace(/ك/g, "ک")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getSavedBooks() {
    try {
      const value = JSON.parse(
        localStorage.getItem(SAVED_KEY) || "[]"
      );
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }

  function setSavedBooks(list) {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  }

  function isSaved(bookId) {
    return getSavedBooks().includes(bookId);
  }

  function toggleSaved(bookId) {
    const saved = getSavedBooks();

    if (saved.includes(bookId)) {
      setSavedBooks(saved.filter((id) => id !== bookId));
      return false;
    }

    saved.push(bookId);
    setSavedBooks(saved);
    return true;
  }

  function updateBookmarkButtons() {
    $$(".library-save-btn, #bookSaveBtn").forEach((button) => {
      const id = button.dataset.bookId;
      if (!id) return;

      const saved = isSaved(id);

      button.classList.toggle("saved", saved);
      button.setAttribute("aria-pressed", String(saved));

      if (button.id === "bookSaveBtn") {
        button.textContent = saved
          ? "♥ پاشەکەوتکراوە"
          : "♡ پاشەکەوتکردن";
      } else {
        button.textContent = saved ? "♥" : "♡";
      }
    });
  }

  function updateLibraryResultsInfo(visible, total) {
    const info =
      $("#libraryResultsInfo") || $("#libraryResults");

    if (info) {
      info.textContent = `${visible} لە ${total} کتێب`;
    }

    const empty =
      $("#libraryEmptyState") || $("#libraryEmpty");

    if (empty) {
      empty.style.display = visible === 0 ? "block" : "none";
    }
  }

  function getLibraryCards() {
    const grid =
      $("#libraryBooksGrid") ||
      $("#libraryGrid");

    if (!grid) return [];

    return $$(".library-book-card, [data-book-id]", grid);
  }

  function applyLibraryFilters() {
    const search =
      $("#librarySmartSearch")?.value ||
      $("#librarySearch")?.value ||
      "";

    const activeFilter =
      $(".library-filter-btn-stage3.active")?.dataset.libraryFilter ||
      "all";

    const sort =
      $("#librarySort")?.value || "default";

    const cards = getLibraryCards();
    const visibleCards = [];

    cards.forEach((card) => {
      const id = card.dataset.bookId;
      const book = LIBRARY_BOOKS[id];

      const text = normalizeText(
        book
          ? `${book.title} ${book.author} ${book.type} ${book.category} ${book.description}`
          : card.textContent
      );

      const searchMatch =
        !normalizeText(search) ||
        text.includes(normalizeText(search));

      let filterMatch = true;

      if (activeFilter === "favorites") {
        filterMatch = id ? isSaved(id) : false;
      } else if (activeFilter !== "all") {
        filterMatch =
          normalizeText(book?.type) === normalizeText(activeFilter) ||
          normalizeText(book?.category) === normalizeText(activeFilter);
      }

      const show = searchMatch && filterMatch;

      card.style.display = show ? "" : "none";

      if (show) visibleCards.push(card);
    });

    if (sort !== "default") {
      const grid =
        $("#libraryBooksGrid") ||
        $("#libraryGrid");

      if (grid) {
        const sorted = [...visibleCards].sort((a, b) => {
          const aBook = LIBRARY_BOOKS[a.dataset.bookId] || {};
          const bBook = LIBRARY_BOOKS[b.dataset.bookId] || {};

          if (sort === "title-asc") {
            return normalizeText(aBook.title).localeCompare(
              normalizeText(bBook.title),
              "ku"
            );
          }

          if (sort === "author-asc") {
            return normalizeText(aBook.author).localeCompare(
              normalizeText(bBook.author),
              "ku"
            );
          }

          return 0;
        });

        sorted.forEach((card) => grid.appendChild(card));
      }
    }

    updateLibraryResultsInfo(visibleCards.length, cards.length);
    updateBookmarkButtons();
  }

  function goToLibrary() {
    if (!document.getElementById("libraryPage")) {
      window.kurdanaToast("بەشی کتێبخانە لە HTML ـدا نەدۆزرایەوە.");
      return false;
    }

    return window.kurdanaGo("libraryPage");
  }

  function renderBook(bookId) {
    const book = LIBRARY_BOOKS[bookId];

    if (!book) {
      window.kurdanaToast("ئەم کتێبە نەدۆزرایەوە.");
      return false;
    }

    const setText = (id, value) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value ?? "";
    };

    setText("bookTitle", book.title);
    setText("bookDetailTitle", book.title);

    setText("bookAuthor", `نووسەر: ${book.author}`);
    setText("bookDetailAuthor", book.author);

    setText("bookType", book.type);
    setText("bookDetailType", book.type);

    setText("bookDetailCategory", book.category);
    setText("bookDetailPages", book.pages);
    setText("bookDetailYear", book.year);
    setText("bookDescription", book.description);
    setText("bookDetailDescription", book.description);

    const coverTitle =
      $("#bookDetailCoverTitle");

    if (coverTitle) {
      coverTitle.textContent = book.title;
    }

    const coverAuthor =
      $("#bookDetailCoverAuthor");

    if (coverAuthor) {
      coverAuthor.textContent = book.author;
    }

    const decoration =
      $("#bookDetailDecoration");

    if (decoration) {
      decoration.textContent = "✦";
    }

    const tags =
      $("#bookDetailTags");

    if (tags) {
      tags.replaceChildren();

      (book.tags || []).forEach((tag) => {
        const span = document.createElement("span");
        span.textContent = tag;
        tags.appendChild(span);
      });
    }

    const saveButtons =
      $$(".library-save-btn, #bookSaveBtn");

    saveButtons.forEach((button) => {
      button.dataset.bookId = bookId;
    });

    updateBookmarkButtons();

    const readButton =
      $("#bookStartReading");

    if (readButton) {
      readButton.dataset.bookId = bookId;
    }

    const pdfButton =
      $("#bookOpenPdf, #bookReadPdf, #bookReadButton");

    if (pdfButton) {
      pdfButton.onclick = () => {
        if (!book.pdf) {
          window.kurdanaToast(
            "فایلی بۆ ئەم کتێبە دانەنراوە."
          );
          return;
        }

        window.open(book.pdf, "_blank", "noopener");
      };
    }

    return true;
  }

  function openBook(bookId) {
    if (!renderBook(bookId)) return false;

    if (document.getElementById("bookPage")) {
      window.kurdanaGo("bookPage");
      return true;
    }

    return false;
  }

  /* ---------------------------------------------------------
     Library buttons — event delegation.
     This is important because cards can be rendered dynamically.
     --------------------------------------------------------- */
  document.addEventListener("click", (event) => {
    const viewButton = event.target.closest(
      ".library-view-btn, [data-library-book], [data-open-book]"
    );

    if (viewButton) {
      const id =
        viewButton.dataset.bookId ||
        viewButton.dataset.libraryBook ||
        viewButton.dataset.openBook;

      if (id && LIBRARY_BOOKS[id]) {
        event.preventDefault();
        openBook(id);
        return;
      }
    }

    const saveButton = event.target.closest(
      ".library-save-btn, #bookSaveBtn"
    );

    if (saveButton) {
      const id = saveButton.dataset.bookId;

      if (id && LIBRARY_BOOKS[id]) {
        event.preventDefault();

        const saved = toggleSaved(id);

        updateBookmarkButtons();

        window.kurdanaToast(
          saved
            ? "کتێبەکە پاشەکەوت کرا."
            : "کتێبەکە لە پاشەکەوتکراوەکان سڕایەوە."
        );

        applyLibraryFilters();
        return;
      }
    }

    const libraryHomeButton = event.target.closest(
      "#library .link-btn, #library [data-library-open]"
    );

    if (libraryHomeButton) {
      event.preventDefault();
      goToLibrary();
      return;
    }

    const backButton = event.target.closest(
      "#bookBackToLibrary, [data-back-library]"
    );

    if (backButton) {
      event.preventDefault();
      goToLibrary();
      return;
    }

    const publishButton = event.target.closest(
      "#newPublishFromLibrary"
    );

    if (publishButton) {
      event.preventDefault();

      if (document.getElementById("publishPage")) {
        window.kurdanaGo("publishPage");
      }
      return;
    }
  });

  /* ---------------------------------------------------------
     Library search/filter/sort
     --------------------------------------------------------- */
  const searchInputs = [
    $("#librarySmartSearch"),
    $("#librarySearch")
  ].filter(Boolean);

  searchInputs.forEach((input) => {
    input.addEventListener("input", applyLibraryFilters);
  });

  $("#libraryClearSearch")?.addEventListener("click", () => {
    searchInputs.forEach((input) => {
      input.value = "";
    });
    applyLibraryFilters();
  });

  $$(".library-filter-btn-stage3").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".library-filter-btn-stage3").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      applyLibraryFilters();
    });
  });

  $("#librarySort")?.addEventListener(
    "change",
    applyLibraryFilters
  );

  $("#libraryResetFilters")?.addEventListener("click", () => {
    searchInputs.forEach((input) => {
      input.value = "";
    });

    if ($("#librarySort")) {
      $("#librarySort").value = "default";
    }

    $$(".library-filter-btn-stage3").forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.libraryFilter === "all"
      );
    });

    applyLibraryFilters();
  });

  window.addEventListener("storage", (event) => {
    if (
      event.key === SAVED_KEY ||
      event.key === "kurdana_saved_books"
    ) {
      updateBookmarkButtons();
      applyLibraryFilters();
    }
  });

  /* ---------------------------------------------------------
     Public library API
     --------------------------------------------------------- */
  window.KurdanaLibrary = {
    books: LIBRARY_BOOKS,
    openBook,
    goToLibrary,
    getSavedBooks,
    isSaved,
    toggleSaved,
    applyLibraryFilters
  };

  /* ---------------------------------------------------------
     Initial route
     --------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    const id = location.hash.slice(1);

    if (id && document.getElementById(id)) {
      window.kurdanaGo(id, { hash: false });
    } else {
      const active =
        $(".page-view.active") ||
        document.getElementById("home");

      if (active && active.id) {
        const home = document.getElementById("home");
        if (home) {
          home.style.display =
            active.id === "home" ? "block" : "none";
        }
      }
    }

    updateBookmarkButtons();
    applyLibraryFilters();
  });

})();
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// کۆدی بەستنەوەی فایەربەیسەکەت لێرە دابنێ
const firebaseConfig = {
  apiKey: "کۆدی_apiKey_خۆت_لێرە_دابنێ",
  authDomain: "my-books12.firebaseapp.com",
  projectId: "my-books12",
  storageBucket: "my-books12.firebasestorage.app",
  messagingSenderId: "861887444664",
  appId: "1:861887444664:web:596d86b10c23...",
  measurementId: "G-ZH6F4HCV6B"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const postForm = document.getElementById("postForm");
const postsContainer = document.getElementById("postsContainer");

// ۱. ناردنی زانیارییەکان بۆ داتابەیس
if (postForm) {
  postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const authorName = document.getElementById("authorName").value;
    const category = document.getElementById("category").value;
    const title = document.getElementById("title").value;
    const content = document.getElementById("content").value;
    const link = document.getElementById("link").value;

    try {
      await addDoc(collection(db, "posts"), {
        author: authorName || "نەنوسراو",
        category: category,
        title: title,
        content: content,
        link: link || "",
        createdAt: serverTimestamp()
      });

      alert("بابەتەکەت بە سەرکەوتوویی بڵاوکرایەوە!");
      postForm.reset();
    } catch (error) {
      console.error("خەتا لە بڵاوکردنەوە: ", error);
      alert("کێشەیەک ڕووی دا لە بڵاوکردنەوەدا!");
    }
  });
}

// ۲. خوێندنەوەی ڕاستەوخۆ لە داتابەیس و دەردانی لەسەر پەڕەکە
if (postsContainer) {
  onSnapshot(collection(db, "posts"), (snapshot) => {
    postsContainer.innerHTML = "";

    snapshot.forEach((doc) => {
      const item = doc.data();
      
      const card = document.createElement("div");
      card.style.cssText = "border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 8px; background: #f9f9f9; text-align: right;";

      card.innerHTML = `
        <span style="background: #007bff; color: white; padding: 3px 8px; border-radius: 4px; font-size: 12px;">${item.category}</span>
        <h3 style="margin: 10px 0 5px 0;">${item.title}</h3>
        <small style="color: #666;">نووسەر/نێرەر: ${item.author}</small>
        <p style="margin-top: 10px; white-space: pre-line;">${item.content}</p>
        ${item.link ? `<a href="${item.link}" target="_blank" style="color: #007bff; display: inline-block; margin-top: 5px; font-weight: bold;">داگرتن / بینینی لینک</a>` : ''}
      `;

      postsContainer.appendChild(card);
    });
  });
}
