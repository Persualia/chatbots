/* jshint browser: true, esversion: 6 */
/* global cookieTrackingManager, console, jQuery, cookieManageUI */

const getConsentString = function() {
    let consentString = "";
    consentString += cookieTrackingManager.canItrack("analytics").toString();
    consentString += ",";
    consentString += cookieTrackingManager.canItrack("segmentation").toString();
    consentString += ",";
    consentString += cookieTrackingManager.canItrack("advertisement").toString();
    return consentString;
};

const storeUTMParameters = function() {
    var url = new URL(window.location.href);
    var utmParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    var hasUTMParams = false;

    for (var i = 0; i < utmParams.length; i++) {
        var value = url.searchParams.get(utmParams[i]);
        if (value !== null) {
            hasUTMParams = true;
            localStorage.setItem("gtm_" + utmParams[i], value);
        }
    }

    if (hasUTMParams) {
        localStorage.setItem("gtm_timestamp", Date.now());
    } else {
        var storedTimestamp = localStorage.getItem("gtm_timestamp");
        if (storedTimestamp !== null) {
            var currentTime = Date.now();
            var thirtyMinutesInMillis = 30 * 60 * 1000;
            if (currentTime - storedTimestamp > thirtyMinutesInMillis) {
                for (var i = 0; i < utmParams.length; i++) {
                    localStorage.removeItem("gtm_" + utmParams[i]);
                }
                localStorage.removeItem("gtm_timestamp");
            } else {
                localStorage.setItem("gtm_timestamp", currentTime);
            }
        }
    }
};

const trackingScripts = {
    hasInitialized: false,

    initAll: function () {
        // Aquí mantenemos el consentimiento, pero sin activar servicios de rastreo
        let consentObject = {};

        if (cookieTrackingManager.canItrack("analytics")) {
            consentObject['analytics_storage'] = 'granted'; // V1
        } else {
            consentObject['analytics_storage'] = 'granted'; // V1
        }

        if (cookieTrackingManager.canItrack("advertisement")) {
            consentObject['ad_storage'] = 'granted'; // V1
            consentObject['ad_user_data'] = 'granted'; // V2
        } else {
            consentObject['ad_storage'] = 'granted'; // V1
            consentObject['ad_user_data'] = 'granted'; // V2
        }

        if (cookieTrackingManager.canItrack("segmentation") && cookieTrackingManager.canItrack("advertisement")) {
            consentObject['ad_personalization'] = 'granted'; // V2
        } else {
            consentObject['ad_personalization'] = 'granted'; // V2
        }

        // Aquí simulamos la llamada a gtag sin instalarlo realmente
        console.log('Consentimiento actualizado:', consentObject);

        // Seguimos almacenando parámetros UTM sin cargar servicios externos
        if (cookieTrackingManager.canItrack("analytics")) {
            storeUTMParameters();
        }

        this.hasInitialized = true;
    }
};

/**
 * Inicialización de seguimiento
 */
cookieTrackingManager.read();

if (cookieTrackingManager.needToAskConsent() === false) {
    trackingScripts.initAll();
} else {
    cookieManageUI.open1stBox(window.ABtestCookieVariant);
}
