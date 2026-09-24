// ==========================================================================
// Mailcow / SOGo Corporate Enhancements
// Simplified, Executive, Bilingual (Arabic & English) Experience
// ==========================================================================

// 1. Redirect to Mailcow custom login if on native login screen
document.addEventListener('DOMContentLoaded', function () {
    var loginForm = document.forms.namedItem("loginForm");
    if (loginForm) {
        window.location.href = '/user';
    }
});

// 2. Global Logout Handler
function mc_logout() {
    fetch("/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "logout=1"
    }).then(function () {
        window.location.href = '/';
    }).catch(function () {
        window.location.href = '/';
    });
}

// 3. CKEditor Default Settings
if (typeof CKEDITOR !== 'undefined') {
    CKEDITOR.addCss("body { font-size: 15px !important; font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif !important; }");
}

// 4. Inject Google Fonts & Modern Stylesheet
(function injectStyles() {
    // Google Fonts
    if (!document.getElementById('sogo-google-fonts')) {
        var fontLink = document.createElement('link');
        fontLink.id = 'sogo-google-fonts';
        fontLink.rel = 'stylesheet';
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
        document.head.appendChild(fontLink);
    }

    // External CSS link
    if (!document.getElementById('sogo-modern-css-file')) {
        var cssFile = document.createElement('link');
        cssFile.id = 'sogo-modern-css-file';
        cssFile.rel = 'stylesheet';
        cssFile.href = '/css/sogo-modern.css?v=' + Date.now();
        document.head.appendChild(cssFile);
    }
})();

// 5. Bilingual Language Switching Logic
window.sogoToggleLanguage = function () {
    var isArabic = (document.documentElement.lang === 'ar' ||
                    (window.UserLanguage && window.UserLanguage.toLowerCase() === 'arabic') ||
                    document.body.classList.contains('rtl'));

    var targetLang = isArabic ? 'English' : 'Arabic';

    // Visual feedback
    var btn = document.getElementById('sogo-lang-toggle-btn');
    if (btn) {
        btn.innerHTML = isArabic ? '⏳ Switching to English...' : '⏳ جاري التحويل للعربية...';
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';
    }

    // 1. Try SOGo AngularJS Preferences service
    try {
        var injector = angular.element(document.body).injector();
        if (injector && injector.has('Preferences')) {
            var prefs = injector.get('Preferences');
            if (prefs && prefs.defaults) {
                prefs.defaults.SOGoLanguage = targetLang;
                prefs.$save().then(function () {
                    window.location.reload();
                }).catch(function () {
                    saveLangDirect(targetLang);
                });
                return;
            }
        }
    } catch (e) {
        console.warn('Angular prefs save failed, fallback to direct POST', e);
    }

    // 2. Direct POST fallback
    saveLangDirect(targetLang);
};

function saveLangDirect(targetLang) {
    var userFolder = window.UserFolderURL || ('/SOGo/so/' + (window.UserEmail || window.UserLogin));
    var defaultsScript = document.getElementById('UserDefaults');
    var defaults = {};
    if (defaultsScript) {
        try { defaults = JSON.parse(defaultsScript.textContent); } catch (e) { }
    }
    defaults.SOGoLanguage = targetLang;

    fetch(userFolder + '/Preferences/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ defaults: defaults })
    }).finally(function () {
        window.location.reload();
    });
}

// 6. Prominent Compose Message Handler
window.sogoComposeMessage = function (e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    // Try native SOGo FAB or buttons
    var fab = document.querySelector('.sg-fab-bottom-center, md-button[aria-label*="Write a new message"], md-button[aria-label*="رسالة جديدة"], md-fab-trigger button');
    if (fab) {
        fab.click();
        return;
    }
    // Scope fallback
    try {
        var el = document.querySelector('[ng-controller="navController"], .view-list');
        if (el) {
            var scope = angular.element(el).scope();
            if (scope && scope.mailbox && typeof scope.mailbox.newMessage === 'function') {
                scope.mailbox.newMessage();
                scope.$apply();
            }
        }
    } catch (err) {
        console.warn('Scope newMessage fallback', err);
    }
};

// 7. Quick Mailbox Refresh
window.sogoRefreshMail = function (e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    try {
        var el = document.querySelector('.view-list');
        if (el) {
            var scope = angular.element(el).scope();
            if (scope && scope.mailbox && scope.mailbox.selectedFolder) {
                scope.mailbox.selectedFolder.$filter(scope.mailbox.service ? scope.mailbox.service.$query : '');
                scope.$apply();
                return;
            }
        }
    } catch (err) {
        console.warn('Refresh error', err);
    }
    // Reload state if needed
    window.location.reload();
};

// 8. Dynamic UI Injection (Language Switcher, Prominent Compose, Company Badge)
(function initUIEnhancements() {
    function getCompanyInfo(email) {
        if (!email) email = window.UserEmail || window.UserLogin || '';
        email = email.toLowerCase();
        if (email.includes('@qafilatfood.sa')) {
            return { ar: 'قافلة الغذاء', en: 'Qafilat Food' };
        } else if (email.includes('@rowaddevelopment.sa')) {
            return { ar: 'رواد التعمير والتنمية', en: 'Rowad Development' };
        } else if (email.includes('@diyarsupply.sa')) {
            return { ar: 'تموين الديار', en: 'Diyar Supply' };
        } else if (email.includes('@khotoutco.sa')) {
            return { ar: 'خطوط الإنشاء', en: 'Khotout Co.' };
        }
        return null;
    }

    function renderEnhancements() {
        var isArabic = (document.documentElement.lang === 'ar' ||
                        (window.UserLanguage && window.UserLanguage.toLowerCase() === 'arabic') ||
                        document.body.classList.contains('rtl'));

        var company = getCompanyInfo();

        // A. Inject into Topbar (.toolbar-main)
        var topbar = document.querySelector('md-toolbar.toolbar-main');
        if (topbar) {
            var groupLast = topbar.querySelector('.sg-toolbar-group-last');
            var groupFirst = topbar.querySelector('.sg-toolbar-group-1');

            // 1. Company Badge in Topbar
            if (groupFirst && company && !document.getElementById('sogo-company-header-badge')) {
                var compBadge = document.createElement('div');
                compBadge.id = 'sogo-company-header-badge';
                compBadge.className = 'sogo-header-company hide show-gt-sm';
                compBadge.innerHTML = '<span class="company-dot"></span>' + (isArabic ? company.ar : company.en);
                groupFirst.appendChild(compBadge);
            }

            // 2. Language Switcher & Quick Buttons in Topbar
            if (groupLast && !document.getElementById('sogo-lang-toggle-btn')) {
                // Wrapper
                var actionsWrap = document.createElement('div');
                actionsWrap.id = 'sogo-topbar-actions-wrap';
                actionsWrap.style.display = 'inline-flex';
                actionsWrap.style.alignItems = 'center';

                // Compose Button in Topbar
                var composeBtn = document.createElement('button');
                composeBtn.className = 'sogo-topbar-compose hide show-gt-xs';
                composeBtn.innerHTML = '<span>✏️ ' + (isArabic ? 'رسالة جديدة' : 'New Email') + '</span>';
                composeBtn.onclick = window.sogoComposeMessage;
                actionsWrap.appendChild(composeBtn);

                // Quick Refresh Button
                var refreshBtn = document.createElement('button');
                refreshBtn.className = 'sogo-quick-refresh';
                refreshBtn.title = isArabic ? 'تحديث البريد' : 'Refresh Mail';
                refreshBtn.innerHTML = '↻';
                refreshBtn.onclick = window.sogoRefreshMail;
                actionsWrap.appendChild(refreshBtn);

                // Language Toggle Pill Button
                var langBtn = document.createElement('button');
                langBtn.id = 'sogo-lang-toggle-btn';
                langBtn.className = 'sogo-lang-toggle';
                langBtn.title = isArabic ? 'Switch interface to English' : 'التحويل للواجهة العربية';
                langBtn.innerHTML = isArabic ? '🌐 English' : '🌐 العربية';
                langBtn.onclick = window.sogoToggleLanguage;
                actionsWrap.appendChild(langBtn);

                // Insert before user controls
                groupLast.insertBefore(actionsWrap, groupLast.firstChild);
            }
        }

        // B. Inject Prominent Compose Button in Sidebar
        var sidenav = document.querySelector('md-sidenav.md-sidenav-left');
        if (sidenav) {
            var toolbarPadded = sidenav.querySelector('md-toolbar.sg-padded');
            if (toolbarPadded && !document.getElementById('sogo-sidebar-compose-btn')) {
                var sideComposeBtn = document.createElement('button');
                sideComposeBtn.id = 'sogo-sidebar-compose-btn';
                sideComposeBtn.className = 'sogo-sidebar-compose';
                sideComposeBtn.innerHTML = '<span>➕ ' + (isArabic ? 'إنشاء بريد جديد' : 'Compose Message') + '</span>';
                sideComposeBtn.onclick = window.sogoComposeMessage;

                // Insert right after user info header
                toolbarPadded.parentNode.insertBefore(sideComposeBtn, toolbarPadded.nextSibling);
            }
        }
    }

    // Run on load and periodically to maintain UI consistency during SPA routing
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderEnhancements);
    } else {
        renderEnhancements();
    }

    setInterval(renderEnhancements, 1000);
})();
