/* Funciones para V3 */



landbotScope.onLoad(function () {
    landbotScope.setCustomData({ businessisopen: isBusinessOpen() });
    if (typeof (calendar) != undefined) {
        landbotScope.setCustomData({ mobile: isMobile() });
    }
});


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
    console.log('open: ' + currentStatus);
    return (currentStatus == 'open');
    //return(currentStatus);
}

/* Check Mobile or Desktop */
function isMobile() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}