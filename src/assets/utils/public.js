import country_zh from "@/assets/lang/zh_country";
import country_en from "@/assets/lang/en_country";
import store from "@/vuex/store";

export function computeLength(str) {
  var l = 0;
  str.split("").forEach(function (letter) {
    var code = letter.charCodeAt(0);
    code > 256 ? (l += 1) : (l += 0.5);
  });
  return l;
}

export function getCountry(code) {
  var countryList = store.state.lang == "en" ? country_en : country_zh;
  var result = "";
  for (var country of countryList) {
    if (country["-Code"] == code) {
      result = country["-Name"];
    }
  }
  return result;
}

export function getCity(countryCode, cityCode) {
  var countryList = store.state.lang == "en" ? country_en : country_zh;
  var result = "";
  for (var country of countryList) {
    if (country["-Code"] == countryCode) {
      if (country.State) {
        for (var city of country.State) {
          if (city["-Code"] == cityCode) {
            result = city["-Name"];
          }
        }
      } else if (country.StateOnly) {
        for (var city of country.StateOnly.City) {
          if (city["-Code"] == cityCode) {
            result = city["-Name"];
          }
        }
      }
    }
  }
  return result;
}

export function setCountryLang() {
  var country = store.state.lang == "en" ? country_en : country_zh;
  var countryOption=[];
  country.map((elem, index, arr) => {
    countryOption.push({
      label: elem["-Name"],
      value: elem["-Code"],
      index: index
    });
  });
  return countryOption;
}

export function getLabel(optionList,value){
  var result="";
  for(var p of optionList){
    if(value!==undefined && p.value==value){
      result=p.label;
    }
  }
  return result;
}

export function timeFormat(time){
  return new Date(time).toLocaleDateString().replace(/[/]/g,"-");
}

export function formatDate (time, fmt) {
  const date = new Date(+time)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').slice(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

function padLeftZero (str) {
  return ('00' + str).slice(str.length)
}

export function loginRepeat(res){
  if(res.data.data.code==6){
    sessionStorage.removeItem("user");
      store.commit("newUserInfo", {});
  }
}