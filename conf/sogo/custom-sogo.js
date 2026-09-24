// ==========================================================================
// Mailcow / SOGo Corporate Enhancements
// Robust, Crash-Proof, Bilingual (Arabic & English) Experience
// ==========================================================================

// 1. Redirect to Mailcow custom login if on native login screen
try {
    document.addEventListener('DOMContentLoaded', function () {
        var loginForm = document.forms.namedItem("loginForm");
        if (loginForm) {
            window.location.href = '/user';
        }
    });
} catch (e) {}

// 2. Global Logout Handler
window.mc_logout = function () {
    try {
        fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "logout=1"
        }).finally(function () {
            window.location.href = '/';
        });
    } catch (e) {
        window.location.href = '/';
    }
};

// 3. CKEditor Safe Font Adjustment
try {
    if (typeof CKEDITOR !== 'undefined' && typeof CKEDITOR.addCss === 'function') {
        CKEDITOR.addCss("body { font-size: 15px !important; font-family: 'Cairo', 'Plus Jakarta Sans', sans-serif !important; }");
    }
} catch (e) {}

// 4. Inject Google Fonts & Modern Stylesheet
(function injectStyles() {
    try {
        if (!document.getElementById('sogo-google-fonts')) {
            var fontLink = document.createElement('link');
            fontLink.id = 'sogo-google-fonts';
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap';
            document.head.appendChild(fontLink);
        }

        if (!document.getElementById('sogo-modern-css-file')) {
            var cssFile = document.createElement('link');
            cssFile.id = 'sogo-modern-css-file';
            cssFile.rel = 'stylesheet';
            cssFile.href = '/css/sogo-modern.css?v=' + Date.now();
            document.head.appendChild(cssFile);
        }
    } catch (e) {}
})();

// 5. Bilingual Language Switching Logic
window.sogoToggleLanguage = function (e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }

    var isArabic = (document.documentElement.lang === 'ar' ||
                    (window.UserLanguage && window.UserLanguage.toLowerCase().indexOf('ar') >= 0) ||
                    document.body.classList.contains('rtl'));

    var targetLang = isArabic ? 'English' : 'Arabic';

    var btn = document.getElementById('sogo-lang-toggle-btn');
    if (btn) {
        btn.innerHTML = (targetLang === 'Arabic') ? '⏳ جاري التحويل...' : '⏳ Switching...';
        btn.style.opacity = '0.6';
        btn.style.pointerEvents = 'none';
    }

    // A. Try AngularJS Preferences service
    try {
        if (typeof angular !== 'undefined') {
            var injector = angular.element(document.querySelector('[ng-app]') || document.body).injector();
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
        }
    } catch (err) {
        console.warn('Angular prefs save error:', err);
    }

    // B. Direct POST fallback
    saveLangDirect(targetLang);
};

function saveLangDirect(targetLang) {
    try {
        var userFolder = window.UserFolderURL || ('/SOGo/so/' + (window.UserEmail || window.UserLogin));
        var defaultsScript = document.getElementById('UserDefaults');
        var defaults = {};
        if (defaultsScript) {
            try { defaults = JSON.parse(defaultsScript.textContent); } catch (e) {}
        }
        defaults.SOGoLanguage = targetLang;

        fetch(userFolder + '/Preferences/save', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: JSON.stringify({ defaults: defaults })
        }).finally(function () {
            window.location.reload();
        });
    } catch (e) {
        window.location.reload();
    }
}

// 6. Robust Compose Message Trigger
window.sogoComposeMessage = function (e) {

    // Only method: find Angular scope with mailbox.newMessage and call it directly
    try {
        if (typeof angular !== 'undefined') {
            var targets = [
                '[ui-view="mailbox"]',
                '.view-list',
                'main.view',
                '[ng-app]',
                'body'
            ];
            for (var t = 0; t < targets.length; t++) {
                var el = document.querySelector(targets[t]);
                if (el) {
                    var scope = angular.element(el).scope();
                    if (scope && scope.mailbox && typeof scope.mailbox.newMessage === 'function') {
                        var syntheticEvent = e || null;
                        if (scope.$$phase || (scope.$root && scope.$root.$$phase)) {
                            scope.mailbox.newMessage(syntheticEvent);
                        } else {
                            scope.$apply(function () {
                                scope.mailbox.newMessage(syntheticEvent);
                            });
                        }
                        return;
                    }
                }
            }
            console.warn('SOGo compose: mailbox scope not found on any target element');
        }
    } catch (scopeErr) {
        console.warn('SOGo compose error:', scopeErr);
    }
};

// 7. Quick Mailbox Refresh Trigger
window.sogoRefreshMail = function (e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    try {
        if (typeof angular !== 'undefined') {
            var el = document.querySelector('.view-list');
            if (el) {
                var scope = angular.element(el).scope();
                if (scope && scope.mailbox && scope.mailbox.selectedFolder) {
                    scope.mailbox.selectedFolder.$filter(scope.mailbox.service ? scope.mailbox.service.$query : '');
                    scope.$apply();
                    return;
                }
            }
        }
    } catch (err) {}
    window.location.reload();
};

// 8. Safe, Non-Intrusive UI Injections
(function initUIEnhancements() {
    function getCompanyInfo(email) {
        if (!email) email = window.UserEmail || window.UserLogin || '';
        email = email.toLowerCase();
        if (email.indexOf('qafilatfood.sa') >= 0) {
            return { ar: 'قافلة الغذاء', en: 'Qafilat Food' };
        } else if (email.indexOf('rowaddevelopment.sa') >= 0) {
            return { ar: 'رواد التعمير والتنمية', en: 'Rowad Development' };
        } else if (email.indexOf('diyarsupply.sa') >= 0) {
            return { ar: 'تموين الديار', en: 'Diyar Supply' };
        } else if (email.indexOf('khotoutco.sa') >= 0) {
            return { ar: 'خطوط الإنشاء', en: 'Khotout Co.' };
        }
        return null;
    }

    function renderEnhancements() {
        try {
            var isArabic = (document.documentElement.lang === 'ar' ||
                            (window.UserLanguage && window.UserLanguage.toLowerCase().indexOf('ar') >= 0) ||
                            document.body.classList.contains('rtl'));

            var company = getCompanyInfo();

            // A. Topbar Enhancements
            var topbar = document.querySelector('md-toolbar.toolbar-main');
            if (topbar) {
                var groupFirst = topbar.querySelector('.sg-toolbar-group-1');
                var groupLast = topbar.querySelector('.sg-toolbar-group-last');

                // 1. Company Badge in Topbar (only if not already there)
                if (groupFirst && company && !document.getElementById('sogo-company-header-badge')) {
                    var compBadge = document.createElement('div');
                    compBadge.id = 'sogo-company-header-badge';
                    compBadge.className = 'sogo-header-company hide show-gt-sm';
                    compBadge.innerHTML = '<span class="company-dot"></span>' + (isArabic ? company.ar : company.en);
                    groupFirst.appendChild(compBadge);
                }

                // 2. Language Switcher & Quick Actions in Topbar (only if not already there)
                if (groupLast && !document.getElementById('sogo-lang-toggle-btn')) {
                    var actionsWrap = document.createElement('div');
                    actionsWrap.id = 'sogo-topbar-actions-wrap';
                    actionsWrap.style.display = 'inline-flex';
                    actionsWrap.style.alignItems = 'center';

                    // Quick Compose in Topbar
                    var composeBtn = document.createElement('button');
                    composeBtn.id = 'sogo-topbar-compose-btn';
                    composeBtn.className = 'sogo-topbar-compose';
                    composeBtn.type = 'button';
                    composeBtn.innerHTML = '<span>✏️ ' + (isArabic ? 'رسالة جديدة' : 'New Email') + '</span>';
                    composeBtn.onclick = window.sogoComposeMessage;
                    actionsWrap.appendChild(composeBtn);

                    // Quick Refresh Button
                    var refreshBtn = document.createElement('button');
                    refreshBtn.className = 'sogo-quick-refresh';
                    refreshBtn.type = 'button';
                    refreshBtn.title = isArabic ? 'تحديث البريد' : 'Refresh Mail';
                    refreshBtn.innerHTML = '↻';
                    refreshBtn.onclick = window.sogoRefreshMail;
                    actionsWrap.appendChild(refreshBtn);

                    // Language Toggle Pill Button
                    var langBtn = document.createElement('button');
                    langBtn.id = 'sogo-lang-toggle-btn';
                    langBtn.className = 'sogo-lang-toggle';
                    langBtn.type = 'button';
                    langBtn.title = isArabic ? 'Switch interface to English' : 'التحويل للواجهة العربية';
                    langBtn.innerHTML = isArabic ? '🌐 English' : '🌐 العربية';
                    langBtn.onclick = window.sogoToggleLanguage;
                    actionsWrap.appendChild(langBtn);

                    groupLast.insertBefore(actionsWrap, groupLast.firstChild);
                }

                // Clean up unwanted topbar buttons: mailcow Preferences (build icon) and disabled Mail icon
                var unwantedBtns = topbar.querySelectorAll(
                    'a[aria-label*="mailcow Preferences" i], ' +
                    'a[href="/user"], ' +
                    'a[ng-href="/user"], ' +
                    'a[aria-label="Mail"][disabled], ' +
                    'a[ng-href*="Mail"][disabled]'
                );
                for (var u = 0; u < unwantedBtns.length; u++) {
                    unwantedBtns[u].style.setProperty('display', 'none', 'important');
                }

                // Set localized tooltips for kept buttons
                var logoutBtn = topbar.querySelector('a[aria-label="Disconnect"], a[onclick*="mc_logout"]');
                if (logoutBtn) logoutBtn.title = isArabic ? 'تسجيل الخروج' : 'Log out';
                var calBtn = topbar.querySelector('a[aria-label="Calendar"], a[ng-href*="Calendar"]');
                if (calBtn) calBtn.title = isArabic ? 'التقويم' : 'Calendar';
                var contactsBtn = topbar.querySelector('a[aria-label="Address Book"], a[ng-href*="Contacts"]');
                if (contactsBtn) contactsBtn.title = isArabic ? 'جهات الاتصال' : 'Contacts';
            }

            // B. Sidebar User Profile Badge & Compose Button
            var sidenav = document.querySelector('md-sidenav.md-sidenav-left');
            if (sidenav) {
                var toolbarPadded = sidenav.querySelector('md-toolbar.sg-padded');
                if (toolbarPadded) {
                    // Organization badge under user email
                    if (company && !document.getElementById('sogo-sidebar-company-badge')) {
                        var textContainer = toolbarPadded.querySelector('div[style*="overflow"]');
                        if (textContainer) {
                            var sideCompBadge = document.createElement('div');
                            sideCompBadge.id = 'sogo-sidebar-company-badge';
                            sideCompBadge.className = 'sogo-profile-badge';
                            sideCompBadge.textContent = isArabic ? company.ar : company.en;
                            textContainer.appendChild(sideCompBadge);
                        }
                    }

                    // Prominent Compose Button
                    if (!document.getElementById('sogo-sidebar-compose-btn')) {
                        var sideComposeBtn = document.createElement('button');
                        sideComposeBtn.id = 'sogo-sidebar-compose-btn';
                        sideComposeBtn.className = 'sogo-sidebar-compose';
                        sideComposeBtn.type = 'button';
                        sideComposeBtn.innerHTML = '<span>➕ ' + (isArabic ? 'إنشاء بريد جديد' : 'Compose Message') + '</span>';
                        sideComposeBtn.onclick = window.sogoComposeMessage;

                        toolbarPadded.parentNode.insertBefore(sideComposeBtn, toolbarPadded.nextSibling);
                    }
                }
            }

            // C. Replace speed-dial FAB with direct compose button
            // SOGo's speed dial opens sub-actions (hidden by our CSS) = clicking does nothing.
            // Solution: Replace the speed-dial with a simple button that calls compose directly.
            var speedDial = document.querySelector('md-fab-speed-dial.sg-fab-bottom-center');
            if (speedDial && !speedDial._sogoReplaced) {
                speedDial._sogoReplaced = true;
                var replacementBtn = document.createElement('button');
                replacementBtn.className = 'md-fab md-accent sg-fab-bottom-center sogo-direct-compose';
                replacementBtn.setAttribute('aria-label', 'Write a new message');
                replacementBtn.type = 'button';
                replacementBtn.innerHTML = '<md-icon class="material-icons" role="img" aria-hidden="true">edit</md-icon>';
                replacementBtn.onclick = function (ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    window.sogoComposeMessage(ev);
                };
                speedDial.parentNode.insertBefore(replacementBtn, speedDial);
                speedDial.style.display = 'none';
            }

            // Also handle standalone FAB (when composeWindowEnabled) — just clean it up
            var standaloneFab = document.querySelector('md-button.md-fab.md-accent.sg-fab-bottom-center');
            if (standaloneFab) {
                standaloneFab.removeAttribute('title');
            }

            // Remove any leftover text labels
            var fabTexts = document.querySelectorAll('.sg-fab-text');
            for (var t = 0; t < fabTexts.length; t++) {
                try { fabTexts[t].remove(); } catch (e) {}
            }
        } catch (err) {
            console.warn('SOGo UI enhancement error:', err);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderEnhancements);
    } else {
        renderEnhancements();
    }

    // Run periodically only if missing elements
    setInterval(function () {
        if (!document.getElementById('sogo-lang-toggle-btn') || !document.getElementById('sogo-sidebar-compose-btn')) {
            renderEnhancements();
        }
    }, 1500);
})();
