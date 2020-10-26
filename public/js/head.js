/* Check if is Iframe */
function isIframe() {
    return (window.self !== window.top) || (!window.location.href.includes("landbot.io"));
}

/* Check Mobile or Desktop */
function isMobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

/* Get Random from Int to Int */
function randomNumber(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/* Check For Business Hours */
function isBusinessOpen(key = null) {
    var nowDateTime = new Date();
    var offset = 0;
    var nowYear = nowDateTime.getFullYear();
    var nowMonth = nowDateTime.getMonth();
    var nowDate = nowDateTime.getDate();
    var nowDay = nowDateTime.getDay()
    var currentStatus = 'close';
    if (key == null) var openDay = calendar[nowDay];
    else var openDay = calendar[key][nowDay];
    if (openDay) {
        openDay.forEach(function (item, index) {
            var trackDate = new Date(nowYear, nowMonth, nowDate, item.h, item.m);
            if (nowDateTime > trackDate) currentStatus = item.status;
        });
    }
    return (currentStatus == 'open');
}

/*send to Datalayer even is in iframe */
function dataLayerEvent(data) {
    dataLayer.push(data);
}

/* jump to URL */
function goToURL(data, keepSession = true, tab = "_self") {
    var url = new URL(data);
    var params = url.searchParams;
    if (typeof ga === 'function' && keepSession) {
        var linkerParam = ga.getAll()[0].get('linkerParam').split("=");
        params.set(linkerParam[0], linkerParam[1]);
    }
    window.open(url, tab);
}

function init(landbotScope, variables = null) {
    if (isIframe()) {
        landbotScope.core.events.on('widget_open', function () {
            if (typeof landbotName !== 'undefined') {                       
                dataLayerEvent({ 'event': 'Ace', 'action': 'LPV Bot', 'landbotName': landbotName });
            }
        });
        landbotScope.window.addEventListener('click', function (e) {                        
            window.dataLayer.push({
                "event": "gtm.click",
                'gtm.element': e.target,
                'gtm.elementClasses': e.target.className || '',
                'gtm.elementId': e.target.id || '',
                'gtm.elementTarget': e.target.target || '',
                'gtm.elementUrl': e.target.href || e.target.action || e.target.src || '',
                //'domEvent': e
            });
        });        
    }
    saveVariables(landbotScope, variables);
}
/* save variables */
function saveVariables(landbotScope, variables = null) {
    if (typeof (calendar) != "undefined") {
        landbotScope.setCustomData({ businessisopen: isBusinessOpen() });
        for (const key in calendar) {
            let isnum = /^\d+$/.test(key);
            if (!isnum) {                
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

function isGTM(id) {
    var gtmScripts = document.querySelectorAll('script[src*="googletagmanager"]');
    for (var i = 0; i < gtmScripts.length; i++) {
        if (gtmScripts[i].getAttribute("src").includes(id)) {
            return true;
        }
    }
    return false;
}

/* Google Tag Manager */
if (typeof gtmID !== 'undefined' && !isGTM(gtmID)) {
    console.log("gtmID " + gtmID);
    (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({
            'gtm.start':
                new Date().getTime(), event: 'gtm.js'
        }); var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', gtmID);
} else {
    console.log(`gtm ${gtmID} already installed`);
}
/* End Google Tag Manager */

if (!isIframe()) {
    console.log("landbotName " + landbotName);
    if (typeof landbotName !== 'undefined') {        
        dataLayerEvent({ 'event': 'Ace', 'action': 'LPV Bot', 'landbotName': landbotName });
    }
}
