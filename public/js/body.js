/* Funciones para V3 */
console.log("body file");
console.log(landbotScope);
landbotScope.onLoad(function () {
    console.log("landbotScope onLoad");
    if (typeof (calendar) != "undefined") {
        console.log("defined " + typeof (calendar));
        landbotScope.setCustomData({ businessisopen: isBusinessOpen() });
    }
    else console.log("undefined " + typeof (calendar));
    landbotScope.setCustomData({ mobile: isMobile() });
});

this.onload(function (){
    console.log("file onLoad");
})