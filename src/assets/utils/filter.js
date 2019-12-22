import Vue from "vue";

const timeFormat = Vue.filter('timeFormat', function (value) {
  if (!value) return "";
  function famat(val) {
    val = Number(val);
    val < 10 && (val = "0" + val);
    return val
  }
  var time = new Date(value);
  var Y = time.getFullYear();
  var M = famat(time.getMonth() + 1);
  var D = famat(time.getDate());
  var h = famat(time.getHours());
  var m = famat(time.getMinutes());
  var s = famat(time.getSeconds());
  return Y + '/' + M + "/" + D + " " + h + ":" + m + ":" + s;
})

const dateFormat = Vue.filter('timeFormat', function (value) {
  if (!value) return "";
  function famat(val) {
    val = Number(val);
    val < 10 && (val = "0" + val);
    return val
  }
  var time = new Date(value);
  var Y = time.getFullYear();
  var M = famat(time.getMonth() + 1);
  var D = famat(time.getDate());
  return Y + '/' + M + "/" + D;
})

export { timeFormat,dateFormat }