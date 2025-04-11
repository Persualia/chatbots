/* Check if is Iframe */
function isIframe() {
    return (window.self !== window.top) || (!window.location.href.includes("landbot.io"));
}

/* Check Mobile or Desktop */
function isMobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

/* Get Random from Int to Int */
function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Check For Business Hours */
function isBusinessOpen(key = null) {
    var nowDateTime = new Date();
    var nowYear = nowDateTime.getFullYear();
    var nowMonth = nowDateTime.getMonth();
    var nowDate = nowDateTime.getDate();
    var nowDay = nowDateTime.getDay();
    var currentStatus = 'close';
    var openDay = key == null ? calendar[nowDay] : calendar[key][nowDay];
    if (openDay) {
        openDay.forEach(function (item) {
            var trackDate = new Date(nowYear, nowMonth, nowDate, item.h, item.m);
            if (nowDateTime > trackDate) currentStatus = item.status;
        });
    }
    return currentStatus === 'open';
}

/* Enviar al DataLayer (evitando 'LPV Bot') */
function dataLayerEvent(data) {
    if (data.event === 'Ace' && data.action === 'LPV Bot') {
        return; // Bloqueamos este evento si viene de Landbot
    }
    if (data.event.match(/survey/i) && !data.category) {
        data.category = window.landbotName;
    }
    if (window.partner) {
        data.partner = window.partner;
    }
    dataLayer.push(data);
}

/* Ir a URL */
function goToURL(data, keepSession = true, tab = "_self") {
    var url = new URL(data);
    var params = url.searchParams;
    if (typeof ga === 'function' && keepSession) {
        var linkerParam = ga.getAll()[0].get('linkerParam').split("=");
        params.set(linkerParam[0], linkerParam[1]);
    }
    window.open(url, tab);
}

/* Obtener parámetros de URL */
function getUrlParam(name) {
    var url = new URL(window.location.href);
    return url.searchParams.get(name);
}

/* Obtener cookies */
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

/* Guardar variables personalizadas */
function saveVariables(landbotScope, variables = null) {
    if (typeof calendar !== "undefined") {
        landbotScope.setCustomData({ businessisopen: isBusinessOpen() });
        for (const key in calendar) {
            if (!/^\d+$/.test(key)) {
                landbotScope.setCustomData({ [`${key}_businessisopen`]: isBusinessOpen(key) });
            }
        }
    }

    landbotScope.setCustomData({ mobile: isMobile() });

    if (variables) {
        for (const [key, value] of Object.entries(variables)) {
            landbotScope.setCustomData({ [key]: value });
        }
    }
}

/* Verificar si GTM ya está instalado */
function isGTM(id) {
    var gtmScripts = document.querySelectorAll('script[src*="googletagmanager"]');
    for (var i = 0; i < gtmScripts.length; i++) {
        if (gtmScripts[i].getAttribute("src").includes(id)) {
            return true;
        }
    }
    return false;
}

/* Inicialización principal */
function init(landbotScope, variables = null) {
    // Inyectar landbotName como variable persistente en el dataLayer
    if (window.landbotName) {
        dataLayer.push({ landbotName: window.landbotName });
        landbotScope.setCustomData({ landbot_name: window.landbotName });
    }

    if (isIframe()) {
        landbotScope.core.events.on('widget_open', function () {
            if (typeof landbotName !== 'undefined') {
                dataLayerEvent({ event: 'Ace', action: 'LPV Bot', landbotName: landbotName, uag: window.navigator.userAgent });
            }
        });

        if ((landbotScope.MODE === "Popup" || landbotScope.MODE === "Fullpage" || landbotScope.MODE === "Container") && typeof landbotName !== 'undefined') {
            dataLayerEvent({ event: 'Ace', action: 'LPV Bot', landbotName: landbotName, uag: window.navigator.userAgent });
        }

        landbotScope.window.addEventListener('click', function (e) {
            if (/input-button(?!s)|input-button-label/.test(e.target.className)) {
                dataLayer.push({
                    event: "gtm.click",
                    'gtm.element': e.target,
                    'gtm.elementClasses': e.target.className || '',
                    'gtm.elementId': e.target.id || '',
                    'gtm.elementTarget': e.target.target || '',
                    'gtm.elementUrl': e.target.href || e.target.action || e.target.src || ''
                });
            }
        });
    }

    saveVariables(landbotScope, variables);

    fetch('https://www.cloudflare.com/cdn-cgi/trace.js')
        .then(res => res.text())
        .then((out) => {
            var arr = out.match(/(\w+)=\s*([^\n]*)/gm);
            var json = {};
            arr.map(function (pair) {
                json[pair.split("=")[0]] = pair.split("=")[1];
            });
            saveVariables(landbotScope, {
                user_ip: json.ip,
                user_country: json.loc,
                user_agent: json.uag
            });
        })
        .catch(err => { throw err });

    setTimeout(function () {
        if (typeof ga === 'function') {
            landbotScope.setCustomData({ clientid: ga.getAll()[0].get('clientId') });
        } else {
            landbotScope.setCustomData({ clientid: 'noga' });
        }
    }, 8000);

    let fbp = getCookie('_fbp');
    if (fbp) landbotScope.setCustomData({ fbp: fbp });

    let fbc = getCookie('_fbc');
    if (fbc) landbotScope.setCustomData({ fbc: fbc });
}

/* Cargar GTM si no existe */
if (typeof gtmID !== 'undefined' && !isGTM(gtmID)) {
    (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', gtmID);
}

/* Solo Landbot (no iframe): enviar LPV Bot (será bloqueado por dataLayerEvent) */
if (!isIframe()) {
    if (typeof landbotName !== 'undefined') {
        dataLayerEvent({ event: 'Ace', action: 'LPV Bot', landbotName: landbotName });
    }
}
