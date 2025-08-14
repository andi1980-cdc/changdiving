// Breadcrumbs
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const breadcrumb = document.getElementById("breadcrumb");
  if (breadcrumb) {
    const path = window.location.pathname.split("/").filter(Boolean);
    const lang = path[0]; // z. B. "en", "de", "th"
    const baseHref = "/" + lang + "/";

    // Sprachabhängiger Text für "Home"
    const homeLabels = {
      en: "Home",
      de: "Startseite",
      th: "หน้าแรก",
    };
    const homeLabel = homeLabels[lang] || "Home";

    let html = `<a href="${baseHref}">🏠 ${homeLabel}</a>`;
    let cumulative = "";

    const nonClickable = ["store", "category", "product"];

    path.forEach((segment, index) => {
      cumulative += "/" + segment;
      const label = decodeURIComponent(segment).replace(/-/g, " ");

      if (index === 0) return; // Sprache überspringen (z. B. "en")

      if (nonClickable.includes(segment.toLowerCase())) {
        html += ` › <span class="breadcrumb-disabled">${label}</span>`;
      } else {
        html += ` › <a href="${cumulative}/">${label}</a>`;
      }
    });

    breadcrumb.innerHTML = html;
  }
});

// Menü-Toggle für Mobile Dropdown (mit Debug-Ausgaben)
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  const toggles = document.querySelectorAll(".menu-toggle");
  console.log("[DEBUG] Gefundene .menu-toggle Buttons:", toggles.length);
  toggles.forEach(function (toggle, i) {
    // Suche im Eltern-Container nach .dropdown-menu
    const parent = toggle.closest(".lang-switch") || toggle.parentElement;
    const dropdown = parent.querySelector(".dropdown-menu");
    console.log(`[DEBUG] Button #${i + 1}:`, toggle);
    if (dropdown) {
      console.log(
        `[DEBUG] Zugehöriges Dropdown für Button #${i + 1} gefunden:`,
        dropdown,
      );
      toggle.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdown.classList.toggle("show");
        console.log(
          `[DEBUG] Button #${i + 1} geklickt. Dropdown sichtbar:`,
          dropdown.classList.contains("show"),
        );
      });
      // Klick außerhalb schließt das Menü
      document.addEventListener("click", function (event) {
        if (
          !toggle.contains(event.target) &&
          !dropdown.contains(event.target)
        ) {
          if (dropdown.classList.contains("show")) {
            dropdown.classList.remove("show");
            console.log(
              `[DEBUG] Dropdown für Button #${i + 1} durch Außenklick geschlossen.`,
            );
          }
        }
      });
    } else {
      console.warn(`[DEBUG] Kein Dropdown für Button #${i + 1} gefunden!`);
    }
  });
});

// Cookie Consent Banner Initialisierung (sprachabhängig)
// ---------------------------------------------
window.addEventListener("load", function () {
  if (window.cookieconsent) {
    // Sprache aus URL erkennen
    var lang = (window.location.pathname.split("/")[1] || "en").toLowerCase();
    var content = {
      en: {
        message:
          "We use cookies to improve your experience. You can accept or reject non-essential cookies.",
        dismiss: "Reject",
        allow: "Accept",
        link: "Privacy Policy",
        href: "/en/privacy-policy/",
      },
      de: {
        message:
          "Wir verwenden Cookies, um dein Erlebnis zu verbessern. Du kannst nicht notwendige Cookies akzeptieren oder ablehnen.",
        dismiss: "Ablehnen",
        allow: "Akzeptieren",
        link: "Datenschutz",
        href: "/de/privacy-policy/",
      },
      th: {
        message:
          "เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์ของคุณ คุณสามารถยอมรับหรือปฏิเสธคุกกี้ที่ไม่จำเป็นได้",
        dismiss: "ปฏิเสธ",
        allow: "ยอมรับ",
        link: "นโยบายความเป็นส่วนตัว",
        href: "/th/privacy-policy/",
      },
    };
    var c = content[lang] || content["en"];
    window.cookieconsent.initialise({
      palette: {
        popup: { background: "#000" },
        button: { background: "#0077B6", text: "#fff" },
      },
      theme: "classic",
      position: "bottom",
      type: "opt-in",
      content: c,
      onInitialise: function (status) {
        if (status === window.cookieconsent.status.allow) {
          // Optional: activate analytics or other scripts
        }
      },
    });
  }
});

// Footer dynamisch je nach Sprache einfügen
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  var lang = (window.location.pathname.split("/")[1] || "en").toLowerCase();
  var footers = {
    en: `<nav class="footer-navigation">
    <div class="container">
      <div class="row">
        <div class="three columns">
          <a href="/en/about/">About us</a>
          <a href="/en/posts/diving-how-to-guides-koh-chang/ ">How to guides</a>
          <a href="/en/getting-to-koh-chang/">Getting to Koh Chang</a>
          <a href="/en/dive-sites/">Dive sites</a>
          <a href="/en/faqs/">FAQs</a>
          <a href="/en/videos/">Videos</a>
          <a href="/en/contact/">Contact us</a>
        </div>
        <div class="three columns">
          <a href="/en/store/category/courses/">Courses</a>
          <a href="/en/product/open-water-diver/">Open Water Diver</a>
          <a href="/en/product/advanced/">Advanced Diver</a>
          <a href="/en/product/rescue-diver/">Rescue Diver</a>
          <a href="/en/product/divemaster/">Divemaster</a>
          <a href="/en/product/sdi-idc/">IDC</a>
        </div>
        <div class="three columns">
          <a href="/en/store/category/day-trips/">Day Trips</a>
          <a href="/en/product/fun-dives/">Fun Dives</a>
          <a href="/en/product/try-dive/">Try Diving</a>
          <a href="/en/product/scuba-review/">Scuba Review</a>
          <a href="/en/product/snorkeling/">Snorkeling</a>
        </div>
        <div class="three columns">
          <a href="/en/product/open-advanced-package/">OW & Advanced</a>
          <a href="/en/product/deep-wreck-nitrox/">Deep, Wreck, Nitrox</a>
          <a href="/en/product/open-to-divemaster/">Open to Divemaster</a>
          <a href="/en/product/tech-package/">Technical Diving</a>
        </div>
      </div>
    </div>
  </nav>
  <div class="footer-meta">
    <div class="container">
      <p><strong>Phone, WhatsApp & Line:</strong> +66 (0) 894-013-927</p>
      <p>
        Chang Diving Center Co.,Ltd<br>
        21/52 Moo 4, Klong Prao Beach<br>
        Koh Chang, Trat, Thailand 23170
      </p>
      <p>
        <a href="/en/terms-and-conditions/">Terms</a> |
        <a href="/en/privacy-policy/">Privacy</a> |
        <a href="/en/refund-policy/">Refunds</a>
      </p>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>`,
    de: `<nav class="footer-navigation">
    <div class="container">
      <div class="row">
        <div class="three columns">
          <a href="/de/about/">About us</a>
          <a href="/de/posts/diving-how-to-guides-koh-chang/ ">How to guides</a>
          <a href="/de/getting-to-koh-chang/">Getting to Koh Chang</a>
          <a href="/de/dive-sites/">Dive sites</a>
          <a href="/de/faqs/">FAQs</a>
          <a href="/de/videos/">Videos</a>
          <a href="/de/contact/">Contact us</a>
        </div>
        <div class="three columns">
          <a href="/de/store/category/Courses/">Courses</a>
          <a href="/de/product/open-water-diver/">Open Water Diver</a>
          <a href="/de/product/advanced/">Advanced Diver</a>
          <a href="/de/product/rescue-diver/">Rescue Diver</a>
          <a href="/de/product/divemaster/">Divemaster</a>
          <a href="/de/product/sdi-idc/">IDC</a>
        </div>
        <div class="three columns">
          <a href="/de/store/category/Day-trips/">Day Trips</a>
          <a href="/de/product/fun-dives/">Fun Dives</a>
          <a href="/de/product/try-dive/">Try Diving</a>
          <a href="/de/product/scuba-review/">Scuba Review</a>
          <a href="/de/product/snorkeling/">Snorkeling</a>
        </div>
        <div class="three columns">
          <a href="/de/product/open-advanced-package/">OW & Advanced</a>
          <a href="/de/product/deep-wreck-nitrox/">Deep, Wreck, Nitrox</a>
          <a href="/de/product/open-to-divemaster/">Open to Divemaster</a>
          <a href="/de/product/tech-package/">Technical Diving</a>
        </div>
      </div>
    </div>
  </nav>
  <div class="footer-meta">
    <div class="container">
      <p><strong>Phone, WhatsApp & Line:</strong> +66 (0) 894-013-927</p>
      <p>
        Chang Diving Center Co.,Ltd<br>
        21/52 Moo 4, Klong Prao Beach<br>
        Koh Chang, Trat, Thailand 23170
      </p>
      <div class="footer-links">
        <a href="/de/privacy-policy/">Datenschutz</a>
        <a href="/de/terms-and-conditions/">AGB</a>
        <a href="/de/refund-policy/">Rückerstattung</a>
      </div>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>`,
    th: `<nav class="footer-navigation">
    <div class="container">
      <div class="row">
        <div class="three columns">
          <a href="/th/about/">About us</a>
          <a href="/th/posts/diving-how-to-guides-koh-chang/ ">How to guides</a>
          <a href="/th/getting-to-koh-chang/">Getting to Koh Chang</a>
          <a href="/th/dive-sites/">Dive sites</a>
          <a href="/th/faqs/">FAQs</a>
          <a href="/th/videos/">Videos</a>
          <a href="/th/contact/">Contact us</a>
        </div>
        <div class="three columns">
          <a href="/th/store/category/courses/">Courses</a>
          <a href="/th/product/open-water-diver/">Open Water Diver</a>
          <a href="/th/product/advanced/">Advanced Diver</a>
          <a href="/th/product/rescue-diver/">Rescue Diver</a>
          <a href="/th/product/divemaster/">Divemaster</a>
          <a href="/th/product/sdi-idc/">IDC</a>
        </div>
        <div class="three columns">
          <a href="/th/store/category/day-trips/">Day Trips</a>
          <a href="/th/product/fun-dives/">Fun Dives</a>
          <a href="/th/product/try-dive/">Try Diving</a>
          <a href="/th/product/scuba-review/">Scuba Review</a>
          <a href="/th/product/snorkeling/">Snorkeling</a>
        </div>
        <div class="three columns">
          <a href="/th/product/open-advanced-package/">OW & Advanced</a>
          <a href="/th/product/deep-wreck-nitrox/">Deep, Wreck, Nitrox</a>
          <a href="/th/product/open-to-divemaster/">Open to Divemaster</a>
          <a href="/th/product/tech-package/">Technical Diving</a>
        </div>
      </div>
    </div>
  </nav>
  <div class="footer-meta">
    <div class="container">
      <p><strong>Phone, WhatsApp & Line:</strong> +66 (0) 894-013-927</p>
      <p>
        บจก ช้างไดร์วิ่ง เซ็นเตอร์<br>
        21/52 หมู่ที่ 4,<br>
        อ.เกาะช้าง ต.เกาะช้าง จ.ตราด
        23170 ประเทศไทย
      </p>
      <p>
        <a href="/th/terms-and-conditions/">Terms</a> |
        <a href="/th/privacy-policy/">Privacy</a> |
        <a href="/th/refund-policy/">Refunds</a>
      </p>
      <p>
        <strong>DBD:</strong> 0237354800207 &nbsp;
        <strong>TAT:</strong> 13/02754 &nbsp;
        <strong>Tax ID:</strong> 0-2355-48000-20-7
      </p>
      <p>
        <strong>2025 © Chang Diving Center CO.,LTD</strong>
      </p>
    </div>
  </div>`,
  };
  var footer = document.getElementById("footer");
  if (footer) {
    footer.innerHTML = footers[lang] || footers["en"];
  }
});

function openLightbox(src) {
  var lightbox = document.getElementById("lightbox");
  var img = document.getElementById("lightbox-img");
  if (img && lightbox) {
    img.src = src;
    lightbox.style.display = "flex";
  }
}
function closeLightbox() {
  var lightbox = document.getElementById("lightbox");
  var img = document.getElementById("lightbox-img");
  if (img && lightbox) {
    img.src = "";
    lightbox.style.display = "none";
  }
}

// YouTube Lite Embed - Performance Optimized (Simplified)
// ---------------------------------------------

// Global function - DIRECT CONTAINER APPROACH (no more nested containers!)
function loadYouTubeVideo(element, videoId, title) {
  console.log('[YouTube Lite] 🎬 Direct container approach for:', videoId);
  
  if (!element || !videoId) {
    console.error('[YouTube Lite] ❌ Missing element or videoId');
    return;
  }
  
  // The element IS the video container now (no more nested searching!)
  const videoContainer = element;
  
  if (videoContainer.classList.contains('lyt-activated')) {
    console.log('[YouTube Lite] ⚠️ Video already loaded');
    return;
  }
  
  console.log('[YouTube Lite] 🚀 Starting direct replacement...');
  
  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  iframe.title = title || 'YouTube Video';
  iframe.frameBorder = '0';
  iframe.allowFullscreen = true;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  
  // Direct replacement - no background image interference
  videoContainer.innerHTML = '';
  videoContainer.style.backgroundImage = 'none';
  videoContainer.appendChild(iframe);
  videoContainer.classList.add('lyt-activated');
  
  console.log('[YouTube Lite] ✅ Direct replacement completed - no more nested containers!');
}
function initYouTubeLite() {
  console.log('[YouTube Lite] Initializing...');
  
  // Find all youtube-lite-embed elements
  const youtubeLiteElements = document.querySelectorAll('.youtube-lite-embed');
  
  console.log('[YouTube Lite] Found', youtubeLiteElements.length, 'video elements');
  
  youtubeLiteElements.forEach((element, index) => {
    const videoId = element.getAttribute('data-videoid');
    const title = element.getAttribute('data-title') || 'YouTube Video';
    
    console.log(`[YouTube Lite] Processing video ${index + 1}:`, videoId, title);
    
    if (!videoId) {
      console.warn('[YouTube Lite] No video ID found for element', element);
      return;
    }
    
    // Set background image (YouTube thumbnail)
    const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    element.style.backgroundImage = `url("${thumbnailUrl}")`;
    element.style.backgroundSize = 'cover';
    element.style.backgroundPosition = 'center';
    
    // Add fallback background color and text if thumbnail fails to load
    element.style.backgroundColor = '#000';
    element.style.color = '#fff';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    element.style.justifyContent = 'center';
    
    console.log(`[YouTube Lite] Set thumbnail for video ${index + 1}:`, thumbnailUrl);
    
    // Remove any existing click handlers
    element.replaceWith(element.cloneNode(true));
    const newElement = document.querySelectorAll('.youtube-lite-embed')[index];
    
    // Add click handler to the element AND the play button
    function handleVideoClick(e) {
      e.preventDefault();
      e.stopPropagation();
      
      console.log(`[YouTube Lite] Click detected on video ${index + 1}:`, videoId);
      
      if (newElement.classList.contains('lyt-activated')) {
        console.log(`[YouTube Lite] Video ${index + 1} already activated`);
        return;
      }
      
      console.log(`[YouTube Lite] Loading video ${index + 1}:`, videoId);
      
      // Clear existing content
      newElement.innerHTML = '';
      
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.title = title;
      iframe.frameBorder = '0';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
      iframe.style.position = 'absolute';
      iframe.style.top = '0';
      iframe.style.left = '0';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.zIndex = '10';
      
      newElement.appendChild(iframe);
      newElement.classList.add('lyt-activated');
      
      console.log(`[YouTube Lite] Successfully loaded video ${index + 1}`);
    }
    
    // Add click handler to container
    newElement.addEventListener('click', handleVideoClick);
    
    // Add click handler to play button
    const playButton = newElement.querySelector('.lty-playbtn');
    if (playButton) {
      playButton.addEventListener('click', handleVideoClick);
      console.log(`[YouTube Lite] Added click handler to play button ${index + 1}`);
    }
  });
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  console.log('[YouTube Lite] DOM loaded, initializing...');
  console.log('[YouTube Lite] loadYouTubeVideo function available:', typeof loadYouTubeVideo === 'function');
  initYouTubeLite();
});

// Also initialize after delays to catch any dynamic content
setTimeout(() => {
  console.log('[YouTube Lite] Secondary initialization after 500ms...');
  initYouTubeLite();
}, 500);

setTimeout(() => {
  console.log('[YouTube Lite] Tertiary initialization after 1000ms...');
  initYouTubeLite();
}, 1000);

// Make function globally available
window.loadYouTubeVideo = loadYouTubeVideo;

// Test function for console debugging
window.testYouTubeLoad = function() {
  console.log('[YouTube Test] 🧪 Testing YouTube loading...');
  const testElement = document.querySelector('.youtube-lite-embed');
  if (testElement) {
    console.log('[YouTube Test] 📍 Found test element:', testElement);
    loadYouTubeVideo(testElement, 'gnjOODLvkqo', 'Test Video');
  } else {
    console.error('[YouTube Test] ❌ No test element found');
  }
};

// Click test function
window.testClick = function() {
  console.log('[YouTube Test] 🖱️ Simulating click...');
  const element = document.querySelector('.youtube-lite-embed');
  if (element) {
    element.click();
  } else {
    console.error('[YouTube Test] ❌ No element to click');
  }
};

// Performance Optimization: Add lazy loading to all tile images
// ---------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  // Add loading="lazy" to all images in .three.columns containers (tiles)
  const tileImages = document.querySelectorAll('.three.columns img');
  tileImages.forEach(function(img) {
    if (!img.hasAttribute('loading')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  // Add loading="lazy" to all images in .row containers that don't have it
  const rowImages = document.querySelectorAll('.row img');
  rowImages.forEach(function(img) {
    if (!img.hasAttribute('loading') && !img.closest('.hero')) {
      img.setAttribute('loading', 'lazy');
    }
  });

  console.log('[PERF] Lazy loading added to', tileImages.length, 'tile images and', rowImages.length, 'row images');
});
