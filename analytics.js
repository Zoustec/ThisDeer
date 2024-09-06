(function() {
    var gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-10L5SLRRG8";
    document.head.appendChild(gaScript);
})();

window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', 'G-10L5SLRRG8');

function sendGA4Event(eventName, eventParams) {
    gtag('event', eventName, eventParams);
}
