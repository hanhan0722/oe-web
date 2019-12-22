import Vue from "vue";

const loadimg = Vue.directive('loadimg', {
  inserted:function(el){
    el.style.background =
    "rgba(" +
    Math.round(Math.random() * 255) +
    "," +
    Math.round(Math.random() * 255) +
    "," +
    Math.round(Math.random() * 255) +
    ",0.3)";
  },
  componentUpdated: function (el) {
    if (el.style.background.indexOf("url") !== -1) return false;
    if (
      el.getAttribute("data-img") &&
      el.offsetTop <
      document.querySelector(".user-img-ul").offsetTop +
      document.querySelector(".user-img-ul").clientHeight
    ) {
      let src = el.getAttribute("data-url") + el.getAttribute("data-img");
      let newImg = new Image();
      newImg.src = src;
      newImg.onload = function () {
        el.style.background = "url(" + src + ") no-repeat 0px 0px/100% 100%";
      };
      newImg.onerror = function () {
        el.style.background = "url(../../../static/img/avatar.png) no-repeat 0px 0px/100% 100%";
      };
    }
  }
})

export { loadimg }