/* Funciones para V3 */


landbotScope.onLoad(function () {
    if (typeof (calendar) != "undefined") {
        console.log("defined " + typeof (calendar));
        landbotScope.setCustomData({ businessisopen: isBusinessOpen() });
    }
    else console.log("undefined " + typeof (calendar));
    landbotScope.setCustomData({ mobile: isMobile() });
});
