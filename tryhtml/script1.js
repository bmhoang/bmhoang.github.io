
if (window.addEventListener) {
    window.addEventListener("resize", browserResize);
} else if (window.attachEvent) {
    window.attachEvent("onresize", browserResize);
}
var xbeforeResize = window.innerWidth;

function browserResize() {
    var afterResize = window.innerWidth;
    if ((xbeforeResize < (970) && afterResize >= (970)) || (xbeforeResize >= (970) && afterResize < (970)) ||
        (xbeforeResize < (728) && afterResize >= (728)) || (xbeforeResize >= (728) && afterResize < (728)) ||
        (xbeforeResize < (468) && afterResize >= (468)) ||(xbeforeResize >= (468) && afterResize < (468))) {
        xbeforeResize = afterResize;
    }
    if (window.screen.availWidth <= 768) {
      restack(window.innerHeight > window.innerWidth);
    }
    fixDragBtn();
    showFrameSize();    
}

// ucs-2 string to base64 encoded ascii
function utoa(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}
// base64 encoded ascii to ucs-2 string
function atou(str) {
  return decodeURIComponent(escape(window.atob(str)));
}

function loadLocalStorageData() {
  var data = localStorage.getItem("@tryhtml");
  if (data != null) {
    try {
      document.getElementById('textareaCode').innerHTML = atou(data);
    } catch (err) {
      console.log('base64 to text has error');
      document.getElementById('textareaCode').innerHTML = data;
    }
  }
}
function saveLocalStorageData(text) {
  var data = utoa(text);
  console.log("Data:\n" + data);
  localStorage.setItem('@tryhtml', data);
}
