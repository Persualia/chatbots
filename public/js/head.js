/* Google Tag Manager */

(function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
        'gtm.start':
            new Date().getTime(), event: 'gtm.js'
    }); var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', gtmID);

/* End Google Tag Manager */

/* Check if is Iframe */
function isIframe() {
    return (window.self !== window.top)
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

if (!isIframe()) {
    dataLayerEvent({'event':'Landbot Name','landbotName':landbotName}); 
    dataLayerEvent({'event':'Ace','action':'LPV Bot'});
}