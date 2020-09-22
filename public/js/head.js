/* Google Tag Manager */

if (typeof gtmID !== 'undefined') {
    (function (w, d, s, l, i) {
        w[l] = w[l] || []; w[l].push({
            'gtm.start':
                new Date().getTime(), event: 'gtm.js'
        }); var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', gtmID);
}

/* End Google Tag Manager */

/* Check if is Iframe */
function isIframe() {
    return (window.self !== window.top)
}

/* Check Mobile or Desktop */  
function isMobile(){
	return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

/* Check For Business Hours */
function isBusinessOpen() {    
    var nowDateTime = new Date();
    var offset = 0;

    var nowYear = nowDateTime.getFullYear();
    var nowMonth = nowDateTime.getMonth();
    var nowDate = nowDateTime.getDate();
    var nowDay = nowDateTime.getDay()
    var currentStatus = 'close';
    var openDay = calendar[nowDay];
    if (openDay) {
        openDay.forEach(function (item, index) {
            var trackDate = new Date(nowYear, nowMonth, nowDate, item.h, item.m);
            if (nowDateTime > trackDate) currentStatus = item.status;
        });
    }    
    return (currentStatus == 'open');    
}

/* Check Mobile or Desktop */
function isMobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}

/*send to Datalayer even is in iframe */
function dataLayerEvent(data) {
    if (isIframe()) {
        Landbot.send('dataLayerEvent', data);
    } else {
        dataLayer.push(data);
    }

}
/* jump to URL */
function goToURL(data, keepSession = true) {
    var url = new URL(data);
    var params = url.searchParams;
    if (typeof ga === 'function' && keepSession) {
        var linkerParam = ga.getAll()[0].get('linkerParam').split("=");
        params.set(linkerParam[0], linkerParam[1]);
    }

    if (isIframe()) {
        Landbot.send('sendto', url);
    } else {
        window.location.href = url;
    }
} 

/* save variables */
function saveVariables(landbotScope) {    
    console.log("saveVariables");
    console.log(landbotScope);
    if (typeof (calendar) != "undefined") {
        console.log("defined " + typeof (calendar));
        landbotScope.setCustomData({ businessisopen: isBusinessOpen() });
    }
    else console.log("undefined " + typeof (calendar));
    landbotScope.setCustomData({ mobile: isMobile() });
}

if (!isIframe()) {
    dataLayerEvent({'event':'Landbot Name','landbotName':landbotName}); 
    dataLayerEvent({'event':'Ace','action':'LPV Bot'});
}