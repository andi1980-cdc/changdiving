/**
 * Shared on-site search for /en|de|th/search/
 * Loads search-index.json + search-synonyms.json
 */
(function () {
  "use strict";

  const MAX_RESULTS = 15;

  function initSiteSearch(opts) {
    const lang = opts.lang;
    const i18n = opts.i18n || {};
    const allCat = i18n.allCategory || "All";

    let searchData = [];
    let synonymGroups = [];
    let activeCategory = allCat;
    let lastResults = [];
    let lastRawTerms = [];
    let lastQuery = "";
    let acTimer = null;
    let acActive = -1;

    function norm(str) {
      if (!str) return "";
      let s = String(str).toLowerCase();
      // ASCII escapes only — avoids encoding / unicode-regex parse issues
      s = s
        .replace(/\u00e4/g, "ae")
        .replace(/\u00f6/g, "oe")
        .replace(/\u00fc/g, "ue")
        .replace(/\u00df/g, "ss");
      if (typeof s.normalize === "function") {
        s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      }
      s = s.replace(/['\u2019\u2018`]/g, "");
      // Hyphens/underscores → space; keep slashes (URLs)
      s = s.replace(/[-_]+/g, " ");
      s = s.replace(/\bsnorkelling\b/g, "snorkeling");
      s = s.replace(/\s+/g, " ").trim();
      return s;
    }

    function compact(str) {
      return norm(str).replace(/\s+/g, "");
    }

    function tokens(str) {
      return norm(str)
        .split(/\s+/)
        .filter((t) => t.length >= 2);
    }

    function escHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

    function highlight(text, rawTerms) {
      let result = escHtml(text);
      const sorted = [...rawTerms]
        .filter((t) => t.length >= 2)
        .sort((a, b) => b.length - a.length);
      for (const term of sorted) {
        const esc = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result = result.replace(
          new RegExp(`(${esc})`, "gi"),
          "<mark>$1</mark>"
        );
      }
      return result;
    }

    function levenshtein(a, b) {
      if (Math.abs(a.length - b.length) > 3) return 99;
      const m = a.length;
      const n = b.length;
      const dp = [];
      for (let i = 0; i <= m; i++) {
        dp[i] = [i];
        for (let j = 1; j <= n; j++) dp[i][j] = i === 0 ? j : 0;
      }
      for (let i = 1; i <= m; i++)
        for (let j = 1; j <= n; j++)
          dp[i][j] =
            a[i - 1] === b[j - 1]
              ? dp[i - 1][j - 1]
              : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      return dp[m][n];
    }

    function fuzzyTermMatch(haystack, needle) {
      if (needle.length < 4) return false;
      const maxDist = needle.length >= 7 ? 2 : 1;
      return haystack
        .split(/\s+/)
        .some(
          (w) =>
            Math.abs(w.length - needle.length) <= maxDist &&
            levenshtein(w, needle) <= maxDist
        );
    }

    function prepareGroups(rawGroups) {
      return (rawGroups || []).map((g) => ({
        id: g.id,
        termsNorm: (g.terms || []).map((t) => norm(t)).filter(Boolean),
        termsCompact: (g.terms || []).map((t) => compact(t)).filter(Boolean),
        matchTerms: {
          en: (g.matchTerms && g.matchTerms.en) || [],
          de: (g.matchTerms && g.matchTerms.de) || [],
          th: (g.matchTerms && g.matchTerms.th) || [],
        },
        targets: {
          en: (g.targets && g.targets.en) || [],
          de: (g.targets && g.targets.de) || [],
          th: (g.targets && g.targets.th) || [],
        },
      }));
    }

    function findMatchingGroups(queryNorm) {
      const qCompact = queryNorm.replace(/\s+/g, "");
      const matched = [];
      for (const g of synonymGroups) {
        let hit = false;
        for (let i = 0; i < g.termsNorm.length; i++) {
          const t = g.termsNorm[i];
          const tc = g.termsCompact[i];
          if (!t) continue;
          if (queryNorm === t || queryNorm.includes(t)) {
            hit = true;
            break;
          }
          if (tc && qCompact.includes(tc)) {
            hit = true;
            break;
          }
          // multi-word: all tokens present
          const parts = t.split(/\s+/).filter((p) => p.length >= 2);
          if (parts.length > 1 && parts.every((p) => queryNorm.includes(p))) {
            hit = true;
            break;
          }
        }
        if (hit) matched.push(g);
      }
      return matched;
    }

    function scoreTerms(item, searchTerms) {
      if (!searchTerms.length) return 0;
      const title = norm(item.title);
      const urlPath = norm(item.url);
      const description = norm(item.description || "");
      const blobCompact = compact(
        item.title + " " + item.url + " " + (item.description || "")
      );

      let totalScore = 0;
      for (const term of searchTerms) {
        let termScore = 0;
        if (title.includes(term)) termScore += 10;
        if (urlPath.includes(term)) termScore += 8;
        if (description.includes(term)) termScore += 5;
        // Thai / compound: token as substring of compacted blob
        if (termScore === 0 && term.length >= 2 && blobCompact.includes(term)) {
          termScore += 6;
        }
        if (termScore === 0) {
          if (
            fuzzyTermMatch(title, term) ||
            fuzzyTermMatch(urlPath, term) ||
            fuzzyTermMatch(description, term)
          ) {
            termScore = 2;
          } else {
            return 0;
          }
        }
        totalScore += termScore;
      }
      totalScore += (item.priority || 0.5) * 2;
      return totalScore;
    }

    function getRelevanceScore(item, searchTerms, matchedGroups) {
      let score = scoreTerms(item, searchTerms);

      for (const g of matchedGroups) {
        const seeds = (g.matchTerms[lang] || [])
          .map((t) => norm(t))
          .filter((t) => t.length >= 2);
        if (seeds.length) {
          score = Math.max(score, scoreTerms(item, seeds));
        }
        const targets = g.targets[lang] || [];
        const tIdx = targets.indexOf(item.url);
        if (tIdx >= 0) {
          // Strong boost; earlier targets in the list rank higher
          score = Math.max(score, 70 - tIdx * 3 + (item.priority || 0.5) * 2);
        }
      }
      return score;
    }

    function buildFilterBar(results) {
      const cats = [allCat];
      results.forEach((item) => {
        if (!cats.includes(item.category)) cats.push(item.category);
      });
      if (cats.length <= 2) return "";
      return (
        '<div class="filter-bar">' +
        cats
          .map(
            (cat) =>
              `<button type="button" class="filter-btn${
                cat === activeCategory ? " active" : ""
              }" aria-pressed="${
                cat === activeCategory ? "true" : "false"
              }" onclick="filterByCategory('${escHtml(cat)}')">${escHtml(
                cat
              )}</button>`
          )
          .join("") +
        "</div>"
      );
    }

    function filterByCategory(cat) {
      activeCategory = cat;
      const filtered =
        cat === allCat
          ? lastResults
          : lastResults.filter((item) => item.category === cat);
      renderResultItems(filtered, lastRawTerms, lastQuery, lastResults);
    }

    function renderResultItems(results, rawTerms, query, allResults) {
      const container = document.getElementById("searchResults");
      const total = allResults.length;
      const countLabel =
        total > MAX_RESULTS
          ? i18n.topResults.replace("{n}", String(total))
          : (total === 1
              ? i18n.resultCount
              : i18n.resultCountPlural || i18n.resultCount
            ).replace("{n}", String(total));

      let html =
        `<div class="search-info" role="status"><h3>🔍 ${countLabel} ${i18n.forQuery} "${escHtml(
          query
        )}"</h3></div>` + buildFilterBar(allResults);

      if (results.length === 0) {
        html += `<div class="search-info"><p>${i18n.noCategory} <a href="#" onclick="filterByCategory('${escHtml(
          allCat
        )}');return false;">${i18n.showAll}</a></p></div>`;
      } else {
        results.forEach((item) => {
          html += `
              <div class="result-item">
                <div class="result-category">${escHtml(item.category)}</div>
                <h3><a href="${escHtml(item.url)}">${highlight(
                  item.title,
                  rawTerms
                )}</a></h3>
                <p class="result-description">${highlight(
                  item.description || "",
                  rawTerms
                )}</p>
              </div>
            `;
        });
      }
      container.innerHTML = html;
    }

    function displaySearchResults(results, query, rawTerms, dymSuggestion) {
      const resultsContainer = document.getElementById("searchResults");
      if (results.length === 0) {
        let html = `
            <div class="search-info">
              <h3>🔍 ${i18n.noResults} "${escHtml(query)}"</h3>
              <p>${i18n.tryDifferent}</p>
              <ul>
                ${i18n.suggestions
                  .map((s) => `<li>${escHtml(s)}</li>`)
                  .join("")}
              </ul>
            </div>
          `;
        if (dymSuggestion) {
          html += `
              <div class="dym-box">
                ${i18n.dymPrefix}
                <a href="#" onclick="document.getElementById('searchInput').value='${escHtml(
                  dymSuggestion.term
                )}';performSearch('${escHtml(
                  dymSuggestion.term
                )}');return false;">"${escHtml(dymSuggestion.term)}"</a>
                ${i18n.dymSuffix || ""}
              </div>
            `;
          lastResults = dymSuggestion.results;
          lastRawTerms = dymSuggestion.term.split(/\s+/);
          lastQuery = query;
          dymSuggestion.results.forEach((item) => {
            html += `
                <div class="result-item">
                  <div class="result-category">${escHtml(item.category)}</div>
                  <h3><a href="${escHtml(item.url)}">${highlight(
                    item.title,
                    lastRawTerms
                  )}</a></h3>
                  <p class="result-description">${highlight(
                    item.description || "",
                    lastRawTerms
                  )}</p>
                </div>
              `;
          });
        }
        resultsContainer.innerHTML = html;
        return;
      }
      renderResultItems(results, rawTerms, query, results);
    }

    function performSearch(query) {
      if (!query.trim()) {
        document.getElementById("searchResults").innerHTML =
          `<div class="search-info"><h3>${i18n.enterTerm}</h3></div>`;
        return;
      }

      const rawTerms = query.trim().split(/\s+/);
      const queryNorm = norm(query);
      const searchTerms = tokens(query);
      const matchedGroups = findMatchingGroups(queryNorm);

      if (!searchTerms.length && !matchedGroups.length) return;

      const effectiveTerms = searchTerms.length
        ? searchTerms
        : tokens(matchedGroups[0].termsNorm[0] || "");

      const allMatches = searchData
        .map((item) => ({
          item,
          score: getRelevanceScore(item, effectiveTerms, matchedGroups),
        }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, MAX_RESULTS)
        .map(({ item }) => item);

      let dymSuggestion = null;
      if (allMatches.length === 0 && searchTerms.length > 1) {
        for (const singleTerm of searchTerms) {
          const fallback = searchData
            .map((item) => ({
              item,
              score: getRelevanceScore(item, [singleTerm], []),
            }))
            .filter(({ score }) => score > 0)
            .slice(0, MAX_RESULTS)
            .map(({ item }) => item);
          if (fallback.length > 0) {
            dymSuggestion = { term: singleTerm, results: fallback };
            break;
          }
        }
      }

      activeCategory = allCat;
      lastResults = allMatches;
      lastRawTerms = rawTerms;
      lastQuery = query;
      displaySearchResults(allMatches, query, rawTerms, dymSuggestion);
    }

    function setComboboxExpanded(open) {
      const inputEl = document.getElementById("searchInput");
      if (inputEl)
        inputEl.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function acUpdate() {
      const inputEl = document.getElementById("searchInput");
      const q = inputEl.value.trim();
      const drop = document.getElementById("ac-dropdown");
      if (!q || q.length < 2 || !searchData.length) {
        drop.hidden = true;
        drop.innerHTML = "";
        setComboboxExpanded(false);
        inputEl.removeAttribute("aria-activedescendant");
        return;
      }
      const nq = norm(q);
      const groups = findMatchingGroups(nq);
      const targetSet = new Set();
      groups.forEach((g) =>
        (g.targets[lang] || []).forEach((u) => targetSet.add(u))
      );

      const matches = searchData
        .filter(
          (item) =>
            targetSet.has(item.url) ||
            norm(item.title).includes(nq) ||
            norm(item.url).includes(nq) ||
            compact(item.title).includes(compact(q))
        )
        .slice(0, 6);
      if (!matches.length) {
        drop.hidden = true;
        drop.innerHTML = "";
        setComboboxExpanded(false);
        inputEl.removeAttribute("aria-activedescendant");
        return;
      }
      const rawTerms = q.split(/\s+/);
      drop.innerHTML = matches
        .map(
          (item, idx) =>
            `<a class="ac-item" role="option" id="ac-opt-${idx}" href="${escHtml(
              item.url
            )}">` +
            `<span class="ac-cat">${escHtml(item.category)}</span>` +
            `<span class="ac-title">${highlight(item.title, rawTerms)}</span>` +
            `</a>`
        )
        .join("");
      acActive = -1;
      drop.hidden = false;
      setComboboxExpanded(true);
      inputEl.removeAttribute("aria-activedescendant");
    }

    function acClose() {
      const drop = document.getElementById("ac-dropdown");
      const inputEl = document.getElementById("searchInput");
      if (drop) {
        drop.hidden = true;
        drop.innerHTML = "";
      }
      setComboboxExpanded(false);
      if (inputEl) inputEl.removeAttribute("aria-activedescendant");
      acActive = -1;
    }

    async function load() {
      const resultsEl = document.getElementById("searchResults");
      const inputEl = document.getElementById("searchInput");
      const formEl = document.getElementById("searchForm");
      if (!resultsEl || !inputEl || !formEl) {
        console.error("Search DOM nodes missing");
        return;
      }

      resultsEl.innerHTML = `<div class="loading">${i18n.loading}</div>`;
      try {
        const indexRes = await fetch("/search-index.json");
        if (!indexRes.ok) throw new Error(`HTTP ${indexRes.status}`);
        const index = await indexRes.json();
        searchData = index[lang] || [];
      } catch (error) {
        console.error("Error loading search index:", error);
        resultsEl.innerHTML = `<div class="search-info"><h3>${i18n.loadErrorTitle}</h3><p>${i18n.loadErrorBody}</p></div>`;
        return;
      }

      // Synonyms are optional — never block core search if this fails
      try {
        const synRes = await fetch("/search-synonyms.json");
        if (synRes.ok) {
          const syn = await synRes.json();
          synonymGroups = prepareGroups(syn.groups || []);
        }
      } catch (error) {
        console.warn("Search synonyms skipped:", error);
        synonymGroups = [];
      }

      console.log(
        `Loaded ${searchData.length} pages + ${synonymGroups.length} synonym groups for ${lang}`
      );

      inputEl.addEventListener("input", function () {
        clearTimeout(acTimer);
        acTimer = setTimeout(acUpdate, 200);
      });

      // Combobox wiring for autocomplete
      inputEl.setAttribute("role", "combobox");
      inputEl.setAttribute("aria-autocomplete", "list");
      inputEl.setAttribute("aria-controls", "ac-dropdown");
      inputEl.setAttribute("aria-expanded", "false");
      inputEl.setAttribute("autocomplete", "off");
      const dropEl = document.getElementById("ac-dropdown");
      if (dropEl) {
        dropEl.setAttribute("role", "listbox");
        if (!dropEl.getAttribute("aria-label")) {
          dropEl.setAttribute(
            "aria-label",
            i18n.suggestionsLabel || "Search suggestions"
          );
        }
      }
      resultsEl.setAttribute("aria-live", "polite");
      resultsEl.setAttribute("aria-atomic", "false");

      inputEl.addEventListener("keydown", function (e) {
        const drop = document.getElementById("ac-dropdown");
        if (!drop || drop.hidden) return;
        const items = drop.querySelectorAll(".ac-item");
        if (e.key === "ArrowDown") {
          e.preventDefault();
          acActive = Math.min(acActive + 1, items.length - 1);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          acActive = Math.max(acActive - 1, -1);
        } else if (e.key === "Escape") {
          acClose();
          return;
        } else if (e.key === "Enter" && acActive >= 0) {
          e.preventDefault();
          items[acActive].click();
          return;
        }
        items.forEach((el, i) =>
          el.classList.toggle("ac-active", i === acActive)
        );
        if (acActive >= 0) {
          items[acActive].scrollIntoView({ block: "nearest" });
          inputEl.setAttribute("aria-activedescendant", items[acActive].id);
        } else {
          inputEl.removeAttribute("aria-activedescendant");
        }
      });

      document.addEventListener("click", function (e) {
        if (!formEl.contains(e.target)) acClose();
      });

      formEl.addEventListener("submit", function (e) {
        e.preventDefault();
        const query = inputEl.value;
        performSearch(query);
        const url = new URL(window.location);
        url.searchParams.set("q", query);
        window.history.pushState({}, "", url);
      });

      const urlParams = new URLSearchParams(window.location.search);
      const query = urlParams.get("q");
      if (query) {
        inputEl.value = query;
        performSearch(query);
      } else {
        resultsEl.innerHTML = `
              <div class="search-info">
                <h3>${i18n.readyTitle}</h3>
                <p>${i18n.readyBody}</p>
              </div>`;
      }
    }

    // Expose for inline onclick handlers
    window.performSearch = performSearch;
    window.filterByCategory = filterByCategory;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", load);
    } else {
      load();
    }
  }

  window.initSiteSearch = initSiteSearch;
})();
