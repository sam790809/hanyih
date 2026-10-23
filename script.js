// ==========================================
// 1. 多語系切換邏輯 (Zh / En)
// ==========================================

// 取得目前儲存的語言，預設為中文 'zh'
function getCurrentLang() {
  return localStorage.getItem('hanyih_lang') || 'zh';
}

// 設定與切換語言
function setLanguage(lang) {
  if (lang === 'en') {
    document.body.classList.remove('lang-zh');
    document.body.classList.add('lang-en');
    document.documentElement.lang = 'en';
  } else {
    document.body.classList.remove('lang-en');
    document.body.classList.add('lang-zh');
    document.documentElement.lang = 'zh-TW';
  }

  // 同步更新 Header 中的按鈕 active 狀態
  const btnZh = document.getElementById('btn-zh');
  const btnEn = document.getElementById('btn-en');

  if (btnZh && btnEn) {
    if (lang === 'en') {
      btnEn.classList.add('active');
      btnZh.classList.remove('active');
    } else {
      btnZh.classList.add('active');
      btnEn.classList.remove('active');
    }
  }

  localStorage.setItem('hanyih_lang', lang);
}

// 頁面初次載入時初始化語言
(function initLang() {
  setLanguage(getCurrentLang());
})();

// ==========================================
// 2. 頁面選單與圖庫篩選邏輯
// ==========================================

// 頁面 Tab 切換
function switchTab(tabId) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(section => section.classList.remove('active'));

  const navs = document.querySelectorAll('.nav-links a');
  navs.forEach(nav => nav.classList.remove('active'));

  const targetSection = document.getElementById(tabId);
  if (targetSection) {
    targetSection.classList.add('active');
  }

  const targetNav = document.getElementById('nav-' + tabId);
  if (targetNav) {
    targetNav.classList.add('active');
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 產品圖庫分類篩選
function filterGallery(category, button) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  const cards = document.querySelectorAll('.gallery-card');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
}

// ==========================================
// 3. 動態模組載入 (Header & Footer)
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // 動態載入 Header
  fetch('header.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('找不到 header.html 檔案');
      }
      return response.text();
    })
    .then(data => {
      const headerElem = document.getElementById('site-header');
      if (headerElem) {
        headerElem.innerHTML = data;
        
        // 1. 同步語言與按鈕狀態
        setLanguage(getCurrentLang());

        // 2. 自動判斷目前頁面並點亮對應選單（使用關鍵字判斷，更穩定）
        const path = window.location.pathname;
        let activeId = 'nav-home'; // 預設首頁

        if (path.includes('about')) {
          activeId = 'nav-about';
        } else if (path.includes('products')) {
          activeId = 'nav-products';
        } else if (path.includes('gallery')) {
          activeId = 'nav-gallery';
        } else if (path.includes('technology')) {
          activeId = 'nav-technology';
        } else if (path.includes('contact')) {
          activeId = 'nav-contact';
        }

        // 移除所有 active
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));

        // 點亮對應選單
        const activeElem = document.getElementById(activeId);
        if (activeElem) {
          activeElem.classList.add('active');
        }
      }
    })
    .catch(error => {
      console.error('載入 Header 失敗:', error);
    });

  // 動態載入 Footer
  fetch('footer.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('找不到 footer.html 檔案');
      }
      return response.text();
    })
    .then(data => {
      const footerElem = document.getElementById('site-footer');
      if (footerElem) {
        footerElem.innerHTML = data;
        // Footer 載入後同步語言
        setLanguage(getCurrentLang());
      }
    })
    .catch(error => {
      console.error('載入 Footer 失敗:', error);
    });
});
