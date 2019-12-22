<template>
  <div class="buy">
    <div class="shadow-fixed" v-show="showBuy">
      <!-- 购买vip或者love币 -->
      <div class="modal" v-if="(type==='vip' || type==='coin') && !showPay">
        <i class="icon-close" @click="initParam" v-show="!cannotClose"></i>
        <div class="title">{{type==='vip'? $t("Components.pay.vip.title"):$t("Components.pay.coin.title")}}</div>
        <div class="wrapper-card">
          <swiper :options="swiperOption" ref="mySwiper">
            <swiper-slide class="swiper-slide" v-for="item in cardList[type]" :key="item.id">
              <div class="card-box">
                <div class="card-img-bg"><img class="card-img" :src="item.img"></div>
                <p class="card-intro" v-if="$store.state.lang!='en'" v-html="item.zhText"></p>
                <p class="card-intro" v-if="$store.state.lang=='en'" v-html="item.enText"></p>
              </div>
            </swiper-slide>
            <div class="swiper-pagination card-pagination" slot="pagination"></div>
          </swiper>
        </div>
        <ul class="buy-list buy-vip clear" v-if="type==='vip'">
          <li
            v-for="item in buyList"
            :key="item.id"
            class="buy-item"
            :class="{'buy-vip-large':item.large}"
          >
            <p v-if="item.love" class="buy-item-love">{{$t("Components.pay.vip.love")}}</p>
            <p class="buy-item-time">{{item.goodsName}}</p>
            <p class="buy-item-money" v-if="$store.state.lang!='en'">{{item.price/item.month | toRMB}}</p>
            <p class="buy-item-money" v-if="$store.state.lang=='en'">{{item.price/item.month | toDollar}}</p>
            <p class="buy-item-every">{{$t("Components.pay.vip.text1")}}</p>
            <p v-if="item.save" class="buy-item-save">
              {{$t("Components.pay.vip.text2")}}
              <span>{{item.save}}</span>
            </p>
            <button type="button" class="btn-default" @click="buy(item,'vip')">{{$t("Components.pay.vip.btn")}}</button>
          </li>
        </ul>
        <ul class="buy-list buy-coin clear" v-if="type==='coin'">
          <li
            v-for="item in buyList"
            :key="item.id"
            class="buy-item"
            :class="{'buy-coin-large':item.large}"
          >
            <p v-if="item.love" class="buy-item-love">{{$t("Components.pay.coin.love")}}</p>
            <p class="buy-item-unit">
              {{$t("Components.pay.coin.coin")}}
              <span>{{item.goodsName}}</span>{{$t("Components.pay.coin.unit")}}
            </p>
            <p class="buy-item-money" v-if="$store.state.lang!='en'">{{item.price | toRMB}}</p>
            <p class="buy-item-money" v-if="$store.state.lang=='en'">{{item.price | toDollar}}</p>
            <button type="button" class="btn-default" @click="buy(item,'coin')">{{$t("Components.pay.vip.btn")}}</button>
          </li>
        </ul>
      </div>
      <!-- 认证 -->
      <div class="modal modal-identify" v-show="type==='identify' && !showPay">
        <i class="icon-close" @click="initParam"></i>
        <div class="lf">
          <img src="@/assets/img/modal/identify-1.jpg">
          <div class="num">
            <p>
              <span>3511323 </span>{{$t("Components.pay.identify.title1")}}
            </p>
            <p>{{$t("Components.pay.identify.title2")}}</p>
          </div>
        </div>
        <div class="rg" v-for="item in buyList" :key="item.id">
          <img class="rg-img" src="@/assets/img/modal/identify-2.jpg">
          <p class="price" v-if="$store.state.lang!='en'">
            <span class="text">{{$t("Components.pay.identify.text1")}}</span>
            {{item.price | toRMB}}
          </p>
          <p class="price" v-if="$store.state.lang=='en'">
            <span class="text">{{$t("Components.pay.identify.text1")}}</span>
            {{item.price | toDollar}}
          </p>
          <p class="old-price">
            <span class="text">{{$t("Components.pay.identify.text2")}}</span>{{$t("Components.pay.identify.price")}}
            <span class="line"></span>
          </p>
          <button type="button" class="btn-default" @click="buy(item,'renzheng')">{{$t("Components.pay.identify.btn")}}</button>
        </div>
      </div>
      <!-- 支付方式选择 -->
      <div class="modal modal-pay" v-show="showPay">
        <i class="icon-close" @click="initParam"></i>
        <div class="title">{{$t("Components.pay.pay.title")}}</div>
        <ul class="pay-list">
          <!-- <li class="li-card" @click="bankCard()">
            <span class="card-icon">
              <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="M35.146.214H1.962c-.944 0-1.898.946-1.898 1.88v18.853c0 1.88.944 2.826 2.84 2.826h32.23c1.9 0 2.843-.946 2.843-2.826V3.04c.01-1.88-.944-2.826-2.83-2.826z"
                    fill="#255697"
                  ></path>
                  <path
                    d="M31.906 11.968c0 4.437-3.586 8.033-8.01 8.033-4.425 0-8.02-3.595-8.02-8.032 0-4.438 3.585-8.034 8.01-8.034 4.424 0 8.02 3.596 8.02 8.034z"
                    fill="#DFAD19"
                  ></path>
                  <path
                    d="M13.086 3.934c-4.404.03-7.968 3.617-7.968 8.034 0 4.437 3.596 8.033 8.02 8.033 2.076 0 3.974-.79 5.4-2.088.294-.27.566-.55.818-.862H17.71c-.22-.27-.42-.54-.598-.832h2.83c.17-.28.326-.562.462-.862H16.64c-.126-.28-.24-.56-.335-.843h4.435c.272-.8.41-1.652.41-2.545 0-.593-.064-1.164-.19-1.726h-4.896c.063-.28.136-.56.23-.84h4.435c-.095-.292-.21-.583-.346-.864H16.63c.136-.29.293-.57.46-.84h2.832c-.19-.303-.4-.594-.62-.864h-1.57c.24-.29.513-.56.806-.81-1.426-1.3-3.313-2.09-5.4-2.09h-.052z"
                    fill="#BF3225"
                  ></path>
                  <path
                    d="M16.01 14.015l.106-.728c-.063 0-.146.02-.22.02-.293 0-.325-.155-.314-.28l.24-1.485h.45l.106-.8h-.43l.084-.5h-.85c-.02.022-.503 2.816-.503 3.15 0 .5.282.727.68.727.327 0 .568-.084.65-.105 0 0-.082.02 0 0zM16.284 12.622c0 1.205.796 1.497 1.478 1.497.63 0 .902-.146.902-.146l.147-.82s-.47.207-.9.207c-.913 0-.756-.685-.756-.685h1.73s.115-.55.115-.78c0-.56-.284-1.247-1.217-1.247-.86.01-1.5.935-1.5 1.974 0 0 0-1.04 0 0zm1.5-1.205c.482 0 .387.54.387.582h-.942c0-.053.094-.583.555-.583 0 0-.46 0 0 0zM23.193 14.015l.157-.936s-.42.207-.702.207c-.608 0-.85-.467-.85-.956 0-1.007.525-1.568 1.102-1.568.43 0 .786.25.786.25l.137-.905s-.514-.208-.965-.208c-.985 0-1.94.852-1.94 2.462 0 1.07.514 1.768 1.53 1.768.284 0 .745-.115.745-.115zM11.325 10.67c-.588 0-1.04.186-1.04.186l-.124.738s.367-.157.934-.157c.314 0 .556.032.556.29 0 .157-.032.22-.032.22s-.252-.02-.367-.02c-.733 0-1.51.31-1.51 1.267 0 .748.504.924.83.924.597 0 .86-.394.88-.394l-.03.322h.754l.335-2.36c-.01-.986-.88-1.017-1.185-1.017zm.178 1.91c.02.146-.095.82-.608.82-.263 0-.336-.206-.336-.32 0-.24.125-.52.754-.52.147 0 .168.02.19.02 0 0-.022 0 0 0zM13.296 14.097c.19 0 1.29.053 1.29-1.09 0-1.06-1.017-.852-1.017-1.28 0-.207.166-.28.47-.28.115 0 .587.043.587.043l.105-.76s-.304-.06-.786-.06c-.63 0-1.27.248-1.27 1.11 0 .978 1.07.884 1.07 1.29 0 .27-.293.3-.524.3-.398 0-.755-.135-.755-.135l-.115.75c0 .02.22.112.944.112 0 0-.724 0 0 0zM30.26 9.993l-.19 1.143s-.324-.446-.827-.446c-.787 0-1.437.945-1.437 2.026 0 .696.346 1.38 1.06 1.38.513 0 .796-.352.796-.352l-.042.303h.828l.65-4.064-.838.01zm-.398 2.224c0 .447-.22 1.06-.682 1.06-.304 0-.45-.26-.45-.665 0-.665.293-1.102.67-1.102.304 0 .462.208.462.707 0 0 0-.5 0 0zM6.7 14.057l.525-3.066.074 3.067h.585l1.102-3.066-.483 3.067h.87l.67-4.075h-1.35l-.84 2.495-.052-2.495H6.565l-.682 4.075H6.7M19.85 14.067c.25-1.414.293-2.567.89-2.36.105-.55.2-.758.314-.986 0 0-.052-.01-.167-.01-.388 0-.66.52-.66.52l.072-.478H19.5l-.534 3.315h.88zM25.154 10.67c-.587 0-1.038.186-1.038.186l-.126.738s.367-.157.933-.157c.315 0 .545.032.545.29 0 .157-.03.22-.03.22s-.253-.02-.368-.02c-.734 0-1.51.31-1.51 1.267 0 .748.514.924.83.924.596 0 .858-.394.88-.394l-.032.322h.755l.336-2.36c0-.986-.872-1.017-1.176-1.017zm.19 1.91c.02.146-.096.82-.61.82-.26 0-.335-.206-.335-.32 0-.24.125-.52.754-.52.147 0 .157.02.19.02 0 0-.033 0 0 0zM27.02 14.067c.252-1.414.294-2.567.89-2.36.106-.55.2-.758.316-.986 0 0-.052-.01-.168-.01-.377 0-.66.52-.66.52l.073-.478h-.796l-.535 3.315h.88z"
                    fill="#FFF"
                  ></path>
                </g>
              </svg>
            </span>
            <span class="card-icon">
              <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="M3.01 23.695c-1.844 0-2.74-.9-2.74-2.748V2.095c0-.893.91-1.803 1.805-1.803h32.893c1.845 0 2.742.903 2.742 2.76v17.895c0 1.85-.897 2.748-2.742 2.748H3.01z"
                  ></path>
                  <path
                    d="M34.968.37c1.793 0 2.664.877 2.664 2.68v17.897c0 1.797-.87 2.67-2.664 2.67H3.01c-1.79 0-2.662-.873-2.662-2.67V2.095c0-.854.87-1.725 1.727-1.725h32.893zm0-.156H2.075C1.14.214.192 1.16.192 2.094v18.853c0 1.88.936 2.826 2.82 2.826h31.956c1.883 0 2.82-.946 2.82-2.826V3.05c0-1.89-.936-2.836-2.82-2.836z"
                    fill="#D8D8D8"
                  ></path>
                  <path
                    d="M.254 2.137c0-.894.916-1.798 1.8-1.798h32.924m2.748 20.596c0 .915-.23 1.61-.687 2.058-.46.456-1.146.686-2.062.686H2.99c-.915 0-1.612-.23-2.06-.686-.457-.457-.687-1.143-.687-2.058M34.978.328c.917 0 1.614.23 2.06.686.46.457.688 1.143.688 2.058m.083 0c0-1.88-.937-2.816-2.82-2.816H2.063C1.128.256.18 1.19.18 2.136m-.01 18.8c0 1.88.937 2.817 2.82 2.817H34.98c1.884 0 2.82-.936 2.82-2.817"
                    fill="#CCCCCB"
                  ></path>
                  <g>
                    <path
                      d="M37.773 3.113c0-1.88-.937-2.816-2.82-2.816H2.08c-.936 0-1.883.935-1.883 1.87v2.817h37.576"
                      fill="#255697"
                    ></path>
                    <path
                      d="M.207 19.055v1.88c0 1.882.937 2.818 2.82 2.818h31.936c1.873 0 2.82-.936 2.82-2.818v-1.88H.207z"
                      fill="#D97C17"
                    ></path>
                    <path
                      d="M26.41 7.28c-.53-.197-1.353-.415-2.383-.415-2.622 0-4.475 1.35-4.496 3.284-.01 1.433 1.323 2.223 2.332 2.7 1.03.49 1.384.8 1.374 1.237-.01.666-.822.967-1.592.967-1.062 0-1.624-.145-2.498-.52l-.343-.156-.375 2.224c.624.28 1.77.52 2.966.53 2.8 0 4.61-1.33 4.63-3.398.01-1.133-.697-1.995-2.226-2.702-.927-.458-1.5-.77-1.49-1.237 0-.415.48-.852 1.52-.852.875-.01 1.5.177 1.988.385l.24.114.353-2.162M33.225 7.04h-2.05c-.634 0-1.113.178-1.394.822l-3.943 9.114h2.79s.457-1.226.56-1.497h3.404c.084.353.323 1.486.323 1.486h2.466L33.224 7.04zm-3.277 6.424l1.06-2.785c-.01.03.22-.573.355-.947l.176.863s.51 2.38.613 2.868h-2.205zM14.12 16.988l1.665-9.947h2.654l-1.666 9.948H14.12M11.883 7.04L9.28 13.828 9 12.445c-.49-1.59-1.998-3.314-3.683-4.177L7.7 16.966h2.81L14.69 7.03h-2.81"
                      fill="#255697"
                    ></path>
                    <path
                      d="M6.867 7.04H2.58l-.032.21c3.33.82 5.536 2.816 6.463 5.206l-.936-4.573c-.156-.633-.624-.82-1.207-.842"
                      fill="#D97C17"
                    ></path>
                  </g>
                </g>
              </svg>
            </span>
            <span class="card-icon">
              <svg width="39" height="25" viewBox="0 0 39 25" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="M35.478.932H2.243c-.946 0-1.903.955-1.903 1.9V21.88c0 1.9.946 2.855 2.85 2.855h32.288c1.902 0 2.85-.955 2.85-2.855V3.798c0-1.91-.958-2.866-2.85-2.866z"
                    fill="#3A6CAF"
                  ></path>
                  <path
                    d="M3.757 9.678L3.02 7.893l-.724 1.785h1.46zm16.108-.703c-.148.084-.316.094-.526.094h-1.294V8.07h1.314c.19 0 .378.01.505.084.136.063.22.2.22.4 0 .188-.084.345-.22.42 0 0 .136-.075 0 0zm9.262.703l-.736-1.785-.735 1.785h1.472zM11.863 11.61H10.77V8.114L9.224 11.61h-.936L6.722 8.103V11.6H4.546l-.41-.998h-2.23l-.41.998H.34l1.914-4.463H3.84l1.82 4.23v-4.23h1.746l1.398 3.024 1.282-3.023h1.777v4.473zm4.364 0h-3.565V7.137h3.565v.934h-2.503v.81h2.44v.914h-2.44v.892h2.503v.924zm5.035-3.265c0 .714-.472 1.08-.756 1.186.23.085.43.243.525.38.15.22.18.42.18.818v.872h-1.083v-.567c0-.274.02-.65-.168-.872-.16-.156-.39-.188-.78-.188h-1.145V11.6h-1.072V7.138h2.46c.546 0 .946.01 1.293.21.347.21.546.503.546.997 0 0 0-.494 0 0zm1.715 3.265h-1.094V7.137h1.094v4.473zm12.647 0H34.11l-2.03-3.35v3.35h-2.175l-.42-.998h-2.22l-.4.998h-1.25c-.515 0-1.177-.115-1.545-.493-.38-.378-.568-.893-.568-1.7 0-.663.116-1.272.578-1.744.347-.357.883-.525 1.62-.525h1.03v.955h-1.01c-.388 0-.61.063-.82.263-.178.188-.304.546-.304 1.008 0 .483.094.82.294 1.05.168.178.462.23.746.23h.484l1.503-3.507h1.6l1.807 4.22v-4.23h1.63l1.882 3.108V7.137h1.093v4.473h-.01zM.33 12.482h1.83l.41-.987h.924l.41.987H7.5v-.756l.316.756h1.86l.316-.777v.777h8.926v-1.627h.168c.116 0 .158.01.158.21v1.417h4.615v-.378c.368.2.956.378 1.713.378h1.945l.42-.987h.926l.41.987h3.743v-.945l.568.945h2.996V6.255h-2.964v.735l-.42-.735h-3.05v.735l-.378-.735h-4.11c-.684 0-1.294.095-1.788.368v-.368h-2.84v.368c-.314-.273-.735-.368-1.207-.368H9.455L8.75 7.862l-.714-1.607h-3.27v.735l-.357-.735H1.622L.33 9.217v3.265zm38.007 3.286h-1.945c-.19 0-.326.01-.43.084-.117.074-.16.178-.16.325 0 .168.096.284.233.337.115.042.23.053.41.053l.578.01c.59.01.978.115 1.21.357.04.03.073.074.093.104v-1.27h.01zm0 2.95c-.263.38-.767.568-1.45.568h-2.06v-.955h2.05c.198 0 .346-.03.43-.115.073-.073.126-.168.126-.295 0-.125-.052-.23-.126-.293-.073-.063-.19-.094-.378-.094-1.01-.032-2.262.03-2.262-1.386 0-.65.41-1.334 1.535-1.334h2.123v-.892H36.35c-.6 0-1.03.147-1.335.368v-.367h-2.923c-.463 0-1.02.116-1.272.368v-.367h-5.226v.368c-.42-.305-1.114-.367-1.44-.367h-3.45v.368c-.325-.315-1.06-.367-1.502-.367h-3.86l-.882.956-.83-.955H7.878v6.227h5.646l.904-.966.852.967h3.48v-1.47h.347c.463.01 1.01-.01 1.493-.22v1.68h2.87V18.51h.137c.18 0 .19.01.19.178v1.438h8.726c.557 0 1.135-.136 1.45-.4v.4h2.766c.577 0 1.135-.084 1.566-.284v-1.124h.03zm-4.27-1.784c.212.21.316.483.316.945 0 .965-.6 1.406-1.68 1.406H30.62v-.955h2.07c.2 0 .348-.03.442-.115.074-.073.127-.168.127-.295 0-.125-.054-.23-.128-.293-.083-.063-.188-.094-.378-.094-1-.033-2.25.03-2.25-1.386 0-.65.41-1.334 1.524-1.334h2.145v.955h-1.955c-.19 0-.316.012-.43.084-.117.073-.16.18-.16.325 0 .168.096.284.232.337.116.042.232.053.42.053l.58.02c.567 0 .967.095 1.208.347 0 0-.24-.252 0 0zm-9.64-.284c-.147.084-.315.096-.525.096H22.61v-1.01h1.313c.19 0 .378 0 .504.085.137.074.22.21.22.4 0 .2-.083.347-.22.43 0 0 .137-.083 0 0zm.652.557c.24.084.43.242.525.377.147.222.168.42.18.82v.882H24.71v-.556c0-.274.022-.662-.167-.872-.158-.158-.4-.2-.79-.2H22.61v1.628h-1.074v-4.462h2.47c.548 0 .937.02 1.283.21.336.2.546.483.546.987 0 .714-.484 1.082-.757 1.187 0 0 .272-.105 0 0zm1.345-2.383h3.564v.923h-2.503v.81h2.44v.912h-2.44v.89h2.502v.926h-3.565v-4.462zm-7.212 2.057h-1.378v-1.133h1.398c.39 0 .652.158.652.546 0 .39-.252.588-.672.588zm-2.44 1.996l-1.64-1.817 1.64-1.765v3.58zm-4.237-.525H9.908v-.89h2.344v-.915H9.908v-.81h2.68l1.168 1.303-1.22 1.313zm8.495-2.057c0 1.24-.924 1.49-1.86 1.49h-1.335v1.503h-2.07l-1.315-1.48-1.367 1.48H8.846v-4.462h4.3l1.314 1.46 1.356-1.46h3.417c.842 0 1.798.23 1.798 1.47 0 0 0-1.24 0 0z"
                    fill="#FFF"
                  ></path>
                </g>
              </svg>
            </span>
            <span class="card-icon">
              <svg width="38" height="24" viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" fill-rule="evenodd">
                  <path
                    d="M2.977 23.3c-1.824 0-2.71-.888-2.71-2.716V1.954c0-.882.9-1.78 1.784-1.78H34.56c1.823 0 2.71.89 2.71 2.725v17.684c0 1.828-.887 2.716-2.71 2.716H2.978z"
                  ></path>
                  <path
                    d="M34.558.25c1.77 0 2.632.866 2.632 2.65v17.684c0 1.776-.86 2.64-2.632 2.64H2.978c-1.773 0-2.635-.864-2.635-2.64V1.954C.343 1.11 1.205.25 2.05.25H34.56zm0-.154H2.05C1.126.096.19 1.03.19 1.954v18.63c0 1.86.924 2.794 2.787 2.794h31.58c1.86 0 2.787-.935 2.787-2.794V2.9c0-1.87-.926-2.804-2.786-2.804z"
                    fill="#D8D8D8"
                  ></path>
                  <g>
                    <path
                      d="M11.605 23.326h22.92c1.863 0 2.8-.934 2.8-2.793V9.473s-5.555 9.755-25.72 13.853z"
                      fill="#D97C17"
                    ></path>
                    <path
                      d="M12.192 11.443h.337l1.04 1.54h.01v-1.54h.257v1.88h-.32l-1.048-1.54h-.01v1.54H12.2v-1.88h-.01zm2.107 0h1.212v.237h-.956v.565h.896v.237h-.896v.605h1.008v.236H14.3v-1.88zm2.015.237h-.606v-.237h1.46v.237h-.607v1.643h-.258V11.68h.01zm.894-.237h.266l.412 1.5h.01l.442-1.5h.29l.44 1.5h.01l.413-1.5h.267l-.546 1.88h-.268l-.452-1.53h-.01l-.452 1.53h-.267l-.556-1.88zm3.66 1.93c-.144 0-.277-.02-.39-.07-.114-.05-.226-.123-.308-.206-.083-.092-.155-.195-.207-.318-.05-.124-.073-.248-.073-.39 0-.145.033-.268.073-.392.052-.123.114-.225.207-.307.082-.092.184-.154.307-.205.123-.05.256-.072.39-.072.143 0 .278.02.4.072.125.05.227.124.31.206.082.093.154.196.204.308.052.124.072.247.072.39 0 .144-.02.268-.072.39-.05.124-.112.227-.205.32-.083.092-.185.154-.31.204-.122.052-.257.072-.4.072zm0-.246c.113 0 .205-.02.287-.06.083-.042.165-.093.227-.165.063-.07.113-.144.143-.236.032-.092.052-.184.052-.288 0-.103-.02-.195-.053-.287-.03-.092-.08-.174-.143-.235-.062-.072-.134-.123-.227-.164-.082-.04-.184-.06-.286-.06-.102 0-.206.02-.29.06-.08.042-.16.093-.224.165-.062.07-.114.143-.144.236-.03.093-.05.185-.05.288 0 .104.02.196.05.288.03.092.082.175.144.236.063.072.133.123.225.164.084.05.176.06.29.06 0 0-.114 0 0 0zm1.348-1.684h.657c.124 0 .217.02.3.052.08.03.142.072.184.123.04.052.08.103.09.175.02.062.03.123.03.185 0 .06-.01.122-.03.174-.02.05-.05.103-.09.155-.044.04-.094.08-.146.112-.05.03-.123.05-.195.06l.534.854h-.32l-.472-.833h-.287v.834h-.257v-1.89zm.257.832h.338c.052 0 .104 0 .144-.01.052-.01.093-.02.135-.04.04-.022.072-.052.092-.094.02-.04.03-.09.03-.152s-.01-.114-.03-.155c-.02-.04-.052-.07-.092-.092-.042-.02-.082-.04-.135-.04-.05-.01-.102-.01-.144-.01h-.338v.595zm1.366-.832h.258v.812h.022l.832-.812h.36l-.905.864.966 1.006h-.37l-.873-.935h-.02v.935h-.257v-1.87h-.012zM3.356 5.62h1.75c.297 0 .576.042.853.134.267.093.513.226.718.41.207.186.382.412.504.7.125.277.195.606.195.985 0 .38-.07.708-.215.985-.144.278-.33.514-.556.69-.225.183-.482.317-.76.41-.278.092-.556.133-.823.133H3.368V5.62h-.012zm1.39 3.728c.247 0 .482-.03.7-.08.214-.053.41-.145.576-.27.163-.122.287-.276.38-.46.092-.196.144-.422.144-.7 0-.266-.042-.503-.124-.687-.083-.194-.195-.348-.35-.472-.155-.123-.32-.205-.524-.267-.205-.06-.432-.08-.67-.08H4.16v3.008h.587v.01zM8.108 5.62H8.9v4.448h-.792V5.62zm3.95.956c-.083-.123-.196-.206-.34-.268-.145-.06-.288-.082-.442-.082-.093 0-.185.01-.268.03-.082.022-.164.053-.237.104-.07.04-.12.103-.163.175-.04.07-.062.164-.062.257 0 .154.052.267.154.35.102.08.236.143.39.204.154.062.33.113.515.174.185.052.35.134.504.227.152.092.286.226.39.38.1.164.154.37.154.636 0 .236-.043.452-.135.627-.083.174-.206.328-.35.44-.143.114-.318.207-.515.27-.194.06-.4.09-.626.09-.278 0-.545-.04-.803-.133-.257-.092-.474-.246-.658-.462l.595-.575c.092.144.227.257.38.34.154.08.32.122.504.122.09 0 .183-.01.276-.04.094-.022.174-.063.247-.114.072-.05.134-.113.184-.195.053-.082.073-.164.073-.267 0-.165-.05-.288-.153-.38-.104-.092-.237-.165-.392-.226-.154-.06-.33-.113-.514-.174-.183-.052-.348-.124-.513-.226-.154-.093-.287-.216-.39-.38-.104-.154-.154-.37-.154-.627 0-.226.04-.43.143-.595.092-.165.217-.308.37-.422.154-.112.328-.195.525-.246.196-.05.4-.082.608-.082.237 0 .462.03.68.103.214.072.42.185.595.35 0 0-.174-.165 0 0l-.576.616zm4.482.092c-.165-.174-.317-.298-.472-.35-.155-.06-.31-.092-.464-.092-.225 0-.442.042-.627.124-.184.082-.35.195-.484.34-.132.143-.235.306-.307.502-.072.195-.114.4-.114.616 0 .237.042.462.114.657.072.206.175.37.307.524.135.143.3.256.484.348.185.082.392.124.627.124.175 0 .35-.042.524-.134.177-.082.33-.226.474-.41l.66.46c-.198.28-.443.474-.732.607-.287.124-.596.185-.926.185-.34 0-.657-.05-.946-.164-.287-.113-.534-.267-.74-.473-.206-.205-.37-.44-.483-.73-.122-.276-.184-.594-.184-.933 0-.36.063-.678.175-.966.123-.287.277-.534.484-.74.204-.204.45-.358.738-.47.29-.115.607-.166.946-.166.3 0 .587.052.844.165.257.102.494.287.72.544 0 0-.226-.257 0 0l-.618.43zm5.975-1.047h.916l1.214 3.36 1.254-3.36h.853l-1.798 4.448h-.69L22.516 5.62zm4.71 0h2.95v.72h-2.158v1.088h2.046v.72h-2.046v1.2h2.273v.72h-3.065V5.62zm3.847 0h1.542c.215 0 .422.02.617.062.195.04.38.103.535.206.155.103.28.226.37.39.094.164.134.37.134.616 0 .32-.093.596-.268.81-.175.217-.432.35-.762.39l1.184 1.963h-.956l-1.03-1.88h-.575v1.88h-.792V5.62h.002zm1.398 1.89c.112 0 .227-.01.34-.02.11-.01.216-.03.308-.072.093-.04.175-.103.225-.185.062-.082.082-.195.082-.34 0-.132-.03-.235-.082-.317-.05-.082-.122-.144-.215-.175-.092-.04-.184-.06-.3-.08-.1-.01-.204-.02-.306-.02h-.69v1.2l.638.01z"
                      fill="#000"
                    ></path>
                    <path
                      d="M20.11 5.508c1.295 0 2.343 1.048 2.343 2.34 0 1.294-1.048 2.343-2.344 2.343-1.296 0-2.345-1.048-2.345-2.34 0-1.294 1.05-2.342 2.344-2.342z"
                      fill="#D97C17"
                    ></path>
                  </g>
                </g>
              </svg>
            </span>
            <div class="arrow-r"></div>
          </li> -->
          <!-- <li class="li-paypal" @click="payPal()">
            <svg width="96" height="24" viewBox="0 0 96 24" xmlns="http://www.w3.org/2000/svg">
              <g fill="none" fill-rule="evenodd">
                <path
                  d="M35.776 5.225h-5.294c-.363 0-.67.263-.727.62l-2.142 13.578c-.042.268.165.51.437.51h2.528c.362 0 .67-.264.727-.622l.577-3.66c.056-.36.365-.623.726-.623h1.676c3.488 0 5.5-1.688 6.027-5.032.238-1.463.01-2.613-.674-3.418-.753-.884-2.088-1.352-3.86-1.352zm.61 4.96c-.288 1.9-1.74 1.9-3.144 1.9h-.8l.562-3.55c.033-.214.22-.372.436-.372h.366c.956 0 1.858 0 2.324.545.278.325.363.808.257 1.476zM51.603 10.123h-2.535c-.216 0-.403.158-.436.372l-.113.71-.178-.258c-.55-.797-1.773-1.063-2.994-1.063-2.802 0-5.195 2.122-5.66 5.1-.244 1.484.1 2.904.943 3.894.774.91 1.88 1.29 3.195 1.29 2.257 0 3.51-1.452 3.51-1.452l-.114.705c-.04.27.166.512.436.512h2.284c.363 0 .67-.264.727-.622l1.37-8.678c.044-.267-.163-.51-.434-.51zm-3.534 4.934c-.246 1.45-1.395 2.42-2.862 2.42-.736 0-1.324-.235-1.702-.682-.375-.445-.517-1.077-.398-1.782.228-1.436 1.397-2.44 2.84-2.44.72 0 1.306.24 1.692.69.386.456.54 1.093.43 1.794zM65.107 10.123H62.56c-.244 0-.473.12-.61.322l-3.515 5.177-1.49-4.975c-.093-.31-.38-.524-.705-.524h-2.504c-.304 0-.516.297-.42.583l2.808 8.236-2.64 3.725c-.206.293.003.697.36.697h2.546c.24 0 .468-.118.605-.316l8.474-12.233c.202-.292-.007-.692-.363-.692z"
                  fill="#253B80"
                ></path>
                <path
                  d="M73.542 5.225h-5.295c-.362 0-.67.263-.726.62l-2.14 13.578c-.043.268.164.51.434.51h2.718c.252 0 .468-.185.507-.436l.607-3.848c.056-.36.365-.623.726-.623h1.676c3.487 0 5.5-1.688 6.026-5.032.238-1.463.01-2.613-.676-3.418-.752-.884-2.086-1.352-3.858-1.352zm.61 4.96c-.288 1.9-1.74 1.9-3.144 1.9h-.798l.56-3.55c.035-.214.22-.372.436-.372h.367c.955 0 1.858 0 2.324.545.278.325.362.808.256 1.476zM89.368 10.123h-2.534c-.217 0-.402.158-.435.372l-.113.71-.178-.258c-.55-.797-1.773-1.063-2.995-1.063-2.802 0-5.194 2.122-5.66 5.1-.242 1.484.1 2.904.944 3.894.773.91 1.877 1.29 3.192 1.29 2.258 0 3.51-1.452 3.51-1.452l-.113.705c-.044.27.164.512.435.512h2.283c.362 0 .67-.264.727-.622l1.37-8.678c.042-.267-.165-.51-.437-.51zm-3.534 4.934c-.243 1.45-1.394 2.42-2.86 2.42-.735 0-1.325-.235-1.703-.682-.374-.445-.515-1.077-.397-1.782.23-1.436 1.397-2.44 2.84-2.44.72 0 1.307.24 1.692.69.388.456.54 1.093.43 1.794zM92.357 5.597l-2.173 13.826c-.042.268.165.51.435.51h2.184c.363 0 .67-.264.727-.622l2.144-13.576c.043-.267-.165-.51-.435-.51h-2.447c-.216 0-.402.16-.436.373z"
                  fill="#179BD7"
                ></path>
                <path
                  d="M5.625 22.57L6.03 20l-.902-.022H.82L3.815 1c.01-.057.04-.11.084-.148.044-.038.1-.06.16-.06h7.26c2.412 0 4.076.502 4.945 1.493.407.464.666.95.792 1.484.13.56.134 1.23.005 2.046l-.01.06v.523l.408.23c.343.18.616.39.825.628.348.397.573.902.668 1.5.1.616.067 1.348-.094 2.177-.186.954-.486 1.785-.892 2.465-.373.626-.848 1.146-1.413 1.548-.537.383-1.178.673-1.9.86-.703.18-1.503.274-2.38.274h-.565c-.404 0-.797.145-1.105.406-.31.266-.513.63-.576 1.028l-.042.232-.716 4.533-.032.167c-.01.053-.023.08-.045.097-.02.016-.048.027-.075.027h-3.49z"
                  fill="#253B80"
                ></path>
                <path
                  d="M17.844 5.936c-.022.138-.047.28-.075.426-.958 4.916-4.235 6.615-8.42 6.615H7.22c-.512 0-.943.372-1.023.876l-1.09 6.92-.31 1.96c-.05.33.204.63.54.63h3.778c.447 0 .827-.325.898-.767l.037-.192.71-4.515.047-.248c.07-.443.45-.768.898-.768h.565c3.66 0 6.527-1.487 7.365-5.788.35-1.797.17-3.298-.757-4.353-.28-.318-.628-.582-1.034-.797z"
                  fill="#179BD7"
                ></path>
                <path
                  d="M16.842 5.536c-.147-.042-.297-.08-.452-.116-.156-.034-.315-.064-.48-.09-.574-.093-1.203-.137-1.878-.137H8.34c-.14 0-.273.03-.392.09-.263.125-.458.373-.505.678l-1.21 7.67-.036.223c.08-.504.51-.876 1.023-.876h2.13c4.185 0 7.462-1.7 8.42-6.615.028-.146.052-.288.074-.426-.243-.13-.505-.24-.788-.332-.07-.024-.14-.046-.214-.068z"
                  fill="#222D65"
                ></path>
                <path
                  d="M7.443 5.96c.047-.304.242-.552.505-.678.12-.057.252-.09.392-.09h5.692c.675 0 1.304.045 1.878.138.165.027.324.057.48.09.155.036.305.074.452.117.073.022.145.044.215.067.283.093.545.204.787.332.285-1.817-.002-3.054-.984-4.175C15.777.53 13.822 0 11.32 0H4.058c-.51 0-.947.372-1.025.877L.008 20.05c-.06.38.233.722.615.722h4.484l1.125-7.142 1.21-7.67z"
                  fill="#253B80"
                ></path>
              </g>
            </svg>
            <div class="arrow-r"></div>
          </li> -->
          <li class="li-alipay" @click="aliPay()">
            <img class="alipay-icon" src="@/assets/img/modal/alipay.png">
            <span>{{$t("Components.pay.pay.alipay")}}</span>
            <div class="arrow-r"></div>
          </li>
          <li class="li-wechat" @click="weChat()">
            <img class="weichat-icon" src="@/assets/img/modal/wechat.png">
            <span>{{$t("Components.pay.pay.wechat")}}</span>
            <div class="arrow-r"></div>
          </li>
        </ul>
      </div>
      <!-- 银行卡支付 -->

      <div class="modal modal-bank" v-show="showBankPay && !showPay"> 
        <i class="icon-close" @click="initParam"></i>
        <div></div>
      </div>

      <!-- 微信二维码支付 -->
      <div class="modal modal-qrcode" v-show="showQRcode && !showPay"> 
        <i class="icon-close" @click="initParam"></i>
        <div class="qrcode-title">{{$t("Components.pay.pay.charge")}}
          <span class="yellow" v-if="$store.state.lang!='en'">{{buyOption.currency_price | toRMB}}</span>
          <span class="yellow" v-if="$store.state.lang=='en'">{{buyOption.currency_price | toDollar}}</span>
        </div>
        <div class="qrcode-box">
          <div class="qrcode" ref="qrCodeUrl"></div>
          <p class="qrcode-tips">{{$t("Components.pay.pay.tips")}}</p>
        </div>
        <p>
          <img class="weichat-icon" src="@/assets/img/modal/wechat.png">
          <span>{{$t("Components.pay.pay.wechat")}}</span>
        </p>
      </div>
      <!-- 跳转支付后显示的提示框 -->
      <div class="modal modal-status" v-show="verify && !showPay">
        <i class="icon-close" @click="initParam"></i>
        <div class="title">{{$t("Components.pay.tips.title")}}</div>
        <p>{{$t("Components.pay.tips.text1")}}</p>
        <p>{{$t("Components.pay.tips.text2")}}</p>
        <div class="btn-group">
          <!-- fail -->
          <button type="button" class="btn btn-default" @click="payFail">{{$t("Components.pay.tips.btn2")}}</button>
          <!-- success -->
          <button type="button" class="btn btn-primary" @click="paySuccess">{{$t("Components.pay.tips.btn1")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Encrypt,
  Decrypt,
  PostData,
  AesEncrypt
} from "@/assets/utils/secret.js";
import bus from "@/assets/utils/bus.js";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import QRCode from "qrcodejs2";
import "swiper/dist/css/swiper.css";
export default {
  name: "Buy",
  components: { swiper, swiperSlide },
  data() {
    return {
      showBuy: false,
      showQRcode: false,
      showPay: false,
      showBankPay: false,
      verify: false,
      timer: null,
      hasWechatFlag: false,
      type: "",//vip,coin,identify
      qrcode :'',
      vipText: {
        zh_Hans: {
          'vip1_1': '一个月',
          'vip1_12': '一年',
          'vip1_6': '半年'
        },
        en: {
          'vip1_1':'Monthly',
          'vip1_12':'1 year',
          'vip1_6':'6 months'
        }
      },
      cardList: {
        vip: [
          {
            img: "../../../static/img/modal/buy-wechart.png",
            zhText: '与<span style="font-weight:600">心动的TA</span>无限畅聊',
            enText: 'Unlimited chat with <span style="font-weight:600">the heart of the TA</span>'
          },
          {
            img: "../../../static/img/modal/buy-review.png",
            zhText: 'VIP用户信息<span style="font-weight:600">优先审核</span>特权',
            enText: 'VIP user information <span style="font-weight:600">limited audit</span> privileges'
          },
          {
            img: "../../../static/img/modal/buy-push.png",
            zhText: '获得系统<span style="font-weight:600">优先推送</span>特权',
            enText: 'Get system <span style="font-weight:600">priority</span> push privilege'
          },
          {
            img: "../../../static/img/modal/buy-exposure.png",
            zhText: '比普通用户增加<span style="font-weight:600">8倍</span>以上的曝光机会',
            enText: 'More than <span style="font-weight:600">8 times</span> more exposure than regular users'
          },
          {
            img: "../../../static/img/modal/buy-video.png",
            zhText: '无限解锁<span style="font-weight:600">视频浏览</span>',
            enText: 'Unlimited unlocked <span style="font-weight:600">video browsing</span>'
          },
          {
            img: "../../../static/img/modal/buy-search.png",
            zhText: '<span style="font-weight:600">高级搜索</span>让你更精准找到TA',
            enText: '<span style="font-weight:600">Advanced search</span> allows you to find TA more accurately'
          }
        ],
        coin: [
          {
            img: "../../../static/img/modal/buy-dynamic.png",
            zhText: '<span style="font-weight:600">24小时</span>关注对方动态',
            enText: "<span style=\"font-weight:600\">24-hour</span> attention to each other's dynamics"
          },
          {
            img: "../../../static/img/modal/buy-search2.png",
            zhText: '解锁<span style="font-weight:600">24小时</span>高级筛选',
            enText: 'Unlock <span style="font-weight:600">24-hour</span> advanced screening'
          },
          {
            img: "../../../static/img/modal/buy-msg.png",
            zhText: '<span style="font-weight:600">24小时</span>解锁每条消息',
            enText: 'Unlock every message <span style="font-weight:600">24 hours</span>'
          }
        ]
      },
      condition: {
        vip: ["vip1_1", "vip1_12", "vip1_6"],
        coin: ["lovecoin_250", "lovecoin_1350", "lovecoin_450"],
        identify: ["rezheng1_f"]
      },
      buyList: [],
      buyOption: {
        product_id: '',
        currency_price: 0,
      },
      cannotClose:false,
      swiperOption: {
        autoplay: true,
        speed: 1000,
        loop: true,
        autoHeight: true,
        observeParents: true,
        pagination: {
          el: ".swiper-pagination",
          type: "custom",
          clickable: true,
          renderCustom: function(swiper, current, total) {
            const activeColor = "#1D9BD7";
            const normalColor = "#DEDEDE";
            let color = "";
            let paginationStyle = "";
            let html = "";
            for (let i = 1; i <= total; i++) {
              if (i === current) {
                color = activeColor;
              } else {
                color = normalColor;
              }
              paginationStyle = `background:${color};opacity:1;cursor:pointer;margin-right:0.5rem;`;
              html += `<span class="swiper-pagination-bullet" style=${paginationStyle}></span>`;
            }
            return html;
          }
        }
      },
    };
  },
  watch:{
    language(){
      this.buyList.forEach(item => {
        this.type === "vip" && (item.goodsName = this.vipText[this.$store.state.lang][item.purchaseId]);
      });
    }
  },
  computed: {
    language: function(){
      return this.$store.state.lang;
    }
  },
  mounted() {
    var _this = this;
    bus.$on('showBuy', value => {
      _this.showBuy = true;
      _this.type = value;
      this.getVipCoin();
    });
    bus.$on('cannotClose', value => {
      this.cannotClose=value;
      if(!value) _this.showBuy = false;
    });
    this.creatQrCode();
  },
  methods: {
    buy(param, buyType) {
      this.showPay = true;
      this.buyOption.product_id = param.purchaseId;
      this.buyOption.currency_price = param.price;
      this.buyOption.buyType = buyType;
    },
    payPal(){
      this.$ajax(
        PostData(this.$store.state.host + "/paypal/pay", {
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token,
          product_id: this.buyOption.product_id
        })
      ).then(res => {
        if(res.data.code === 0) {
          const body = JSON.parse(Decrypt(res.data.body));
          if (!body) return;
          const payPalUrl = body.return_url;
          window.open(payPalUrl);
          this.showVerify();
        } else {
          this.showBuy = false;
          this.$message(res.data.msg);
        }
      });
    },
    aliPay() {
      this.$ajax(
        PostData(this.$store.state.host + "pay/alipay/webPayment", {
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token,
          product_id: this.buyOption.product_id
        })
      ).then(res => {
        if(res.data.code === 0) {
          const newTab = window.open();
          const body = JSON.parse(Decrypt(res.data.body));
          if (!body) return;
          const { alipayModel } = body;
          const div = document.createElement("div");
          div.innerHTML = alipayModel; // html code
          newTab.document.body.appendChild(div);
          newTab.document.forms[0].acceptCharset = "utf-8";
          newTab.document.forms["alipaysubmit"].submit();
          newTab.document.forms.alipaysubmit.submit();
          this.showVerify();
        } else {
          this.showBuy = false;
          this.$message(res.data.msg);
        }
      });
    },
    weChat() {
      this.showPay = false;
      this.type = "";
      this.showQRcode = true;
      this.qrcode.clear(); // 清除代码
      
      this.$ajax(
        PostData(this.$store.state.host + "pay/weixin/webPayment", {
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token,
          product_id: this.buyOption.product_id
        })
      ).then(res => {
        if(res.data.code === 0) {
          const body = JSON.parse(Decrypt(res.data.body));
          const weChatUrl = body.code_url;
          // this.creatQrCode(weChatUrl); //2min更新
          this.qrcode.makeCode(weChatUrl); 
          this.hasWechatFlag = false;
          clearInterval(this.timer);
          this.timer = setInterval(()=>{
            this.judgeFee(body.order_number);
          },2000);
          
          setTimeout(()=>{
            if(!this.hasWechatFlag){
              clearInterval(this.timer);
              this.initParam();
              }
          },1000*120)
         
        } else {
          this.showBuy = false;
          this.showQRcode = false;
          this.$message(res.data.msg);
        }
      });
    },
    judgeFee(orderid) {
      this.$ajax(PostData(this.$store.state.host + 'pay/orderquery', {
        order_id: orderid,
      })).then(res=>{
        const body = JSON.parse(Decrypt(res.data.body));
        if(body.status === 2) {
          this.hasWechatFlag = true;
          location.href = location.origin + '/pay/tips?wechat=1';
        }
      })
    },
    creatQrCode() {
      this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
        text: '',
        width: 150,
        height: 150,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
    },
    getVipCoin() {
      this.$ajax(PostData(this.$store.state.host + "shop/listShops", {})).then(
        res => {
          const body = JSON.parse(Decrypt(res.data.body));
          const condition = this.condition[this.type];
          this.buyList = body.shops.filter(item => {
            return condition.indexOf(item.purchaseId) > -1;
          });
          //如果是VIP，加month参数，价钱除month
          //如果推荐的，需要加一些特殊字，且需要判断是英语还是汉语
          this.buyList.forEach(item => {
            this.type === "vip" && (item.month = item.purchaseId.split("_")[1]);
            this.type === "vip" && (item.goodsName = this.vipText[this.$store.state.lang][item.purchaseId]);
            this.type === "coin" &&
              (item.goodsName = item.goodsName.substring(
                0,
                item.goodsName.length - 1
              ));
            if (condition[1] && item.purchaseId === condition[1]) {
              item.love = true;
              item.large = true;
              this.type === "vip" && (item.save = "59%");
            }
          });
          this.buyList.sort((a, b) => {
            return (
              condition.indexOf(a.purchaseId) - condition.indexOf(b.purchaseId)
            );
          });
        }
      );
      return this.buyList;
    },
    showVerify(){
      this.showPay = false;
      this.type = "";
      this.verify = true;
    },
    payFail() {
      this.showPay = true;
    },
    paySuccess(){
      this.initParam();
      this.getUserInfo();
    },
    getUserInfo() {
      this.$ajax(
        PostData(this.$store.state.host + "user/getUserInfo", {
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token,
        })
      ).then(res => {
        if (res.data.code == 0) {
          const body = JSON.parse(Decrypt(res.data.body));
          body.user.iLikeUnreadCount = body.iLikeUnreadCount;
          body.user.likeMeUnreadCount = body.likeMeUnreadCount;
          body.user.userAllowChatNum = body.userAllowChatNum;
          body.user.visitMeUnreadCount = body.visitMeUnreadCount;
          body.user.token = body.token;
          sessionStorage.setItem(
            "user",
            AesEncrypt(JSON.stringify(body.user))
          );
          this.$store.commit(
            "newUserInfo",
            JSON.parse(Decrypt(sessionStorage.getItem("user")))
          );
        }
      });
    },
    initParam() {
      this.showBuy = false;
      this.showQRcode = false;
      this.showPay = false;
      this.showBankPay = false;
      this.verify = false;
    }
  },
  filters: {
    toRMB(value) {
      return (value||value===0) && "¥" + (value * 1).toFixed(0);
    },
    toDollar(value){
      return (value||value===0) && "$" + (value * 0.15).toFixed(2);
    }
  }
};
</script>

<style lang="less" scoped>
.buy {
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 440px;
    height: 440px;
    margin-left: -440px/2;
    margin-top: -440px/2;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 29px 0px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    text-align: center;

    .title {
      margin-top: 14px;
      font-size: 18px;
      font-weight: 600;
      color: rgba(0, 0, 0, 1);
    }

    .wrapper-card {
      width: 100%;
      height: 180px;
      text-align: center;

      .swiper-pagination-custom {
        bottom: 0;
      }

      .card-box {
        width: 100%;
        height: 180px;
      }

      .card-img-bg {
        height: 140px;
        background: url("../../assets/img/modal/buy-card-bg.png") center center
          no-repeat;
      }

      .card-img {
        margin-top: 10px;
        width: 260px * 0.65;
        height: 200px * 0.65;
      }

      .card-intro {
        margin-top: -5px;
        font-size: 16px;
      }
    }

    .buy-list {
      width: 132px * 2+146px;
      margin: 186px-156px auto 0;

      .buy-item {
        float: left;
        width: 130px;
        height: 156px;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(236, 236, 236, 1);
        border-radius: 10px;
        text-align: center;

        p {
          font-weight: 600;
          color: rgba(0, 0, 0, 1);
        }

        .buy-item-love {
          font-size: 14px;
          font-weight: 600;
          color: rgba(221, 56, 104, 1);
        }

        .buy-item-unit {
          margin-top: 30px;
          font-size: 12px;
          font-weight: normal;

          span {
            font-size: 14px;
            color: #dd3868;
          }
        }
        .buy-item-time {
          margin-top: 14px;
          font-size: 14px;
        }

        .buy-item-money {
          margin-top: 6px;
          font-size: 22px;
          font-family: PingFangSC-Semibold;
        }

        .buy-item-every {
          margin-top: 6px;
          font-size: 12px;
          font-weight: 400;
        }

        .btn-default {
          width: 100px;
          margin: 10px auto 0;
          font-size: 12px;
          font-weight: 600;
          color: #dd3868;

          &:hover {
            background: #dd3868;
            color: #fff;
          }
        }
      }

      .buy-vip-large {
        .buy-item-love {
          margin-top: 8px;
        }

        .buy-item-time {
          margin-top: 6px;
        }

        .buy-item-money {
          margin-top: 2px;
        }

        .buy-item-every {
          margin-top: 1px;
        }

        .buy-item-save {
          font-size: 12px;
          font-weight: 400;
          color: rgba(17, 17, 17, 1);

          span {
            color: #dd3868;
          }
        }

        .btn-default {
          margin-top: 10px;
        }
      }

      .buy-coin-large {
        .buy-item-love {
          margin-top: 12px;
        }

        .buy-item-unit {
          margin-top: 12px;
        }

        .buy-item-money {
          margin-top: 8px;
          font-size: 28px;
        }

        .btn-default {
          margin-top: 25px;
        }
      }

      .buy-vip-large,
      .buy-coin-large {
        position: relative;
        width: 146px;
        height: 190px;
        margin-left: -1px;
        margin-right: -1px;
        margin-top: (187px-223px)/2;
        box-shadow: 0px 0px 9px 1px rgba(0, 0, 0, 0.13);
      }
    }
    .buy-coin {
      .buy-item {
        .buy-item-money {
          margin-top: 10px;
        }

        .btn-default {
          margin-top: 16px;
        }
      }  
    }
  }

  .modal-identify {
    height: 306px;
    margin-top: -306px/2;

    .lf {
      position: relative;
      float: left;
      width: 50%;
      height: 100%;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      overflow: hidden;

      img {
        width: 100%;
      }

      .num {
        position: absolute;
        top: 15px;
        left: 15px;
        font-size: 14px;
        color: #fff;
        line-height: 26px;
        text-align: left;
        text-shadow: 0 0 3px rgba(0, 0, 0, 0.3);

        span {
          color: #fd125e;
          font-size: 20px;
          font-style: italic;
        }
      }
    }

    .rg {
      float: left;
      width: 50%;

      .rg-img {
        width: 156px;
        margin: 28px auto;
      }

      .price {
        font-size: 22px;
        font-weight: 500;
        color: rgba(221, 56, 104, 1);

        .text {
          font-size: 18px;
          font-family: PingFangSC-Semibold;
        }
      }

      .old-price {
        position: relative;
        margin-top: 10px;
        font-size: 18px;
        color: #636363;

        .text {
          font-size: 14px;
          font-family: PingFangSC-Semibold;
          vertical-align: 1px;
        }

        .line {
          position: absolute;
          left: 50%;
          top: 11px;
          width: 100px;
          margin-left: -100px/2;
          height: 0;
          border-top: 1px solid #636363;
          transform: rotate(3deg);
        }
      }

      .btn-default {
        width: 180px;
        margin: 25px auto;
        font-size: 14px;
        color: #dd3868;

        &:hover {
          background: rgba(221, 56, 104, 1);
          border: 1px solid rgba(221, 56, 104, 1);
          color: #fff;
        }
      }
    }
  }

  .modal-pay {
    height: 200px;
    margin-top: -260px/2;

    .pay-list {
      width: 400px;
      margin: 10px auto 0;
      text-align: left;
      li {
        padding: 15px 5px 13px 5px;
        border-bottom: 1px solid #ddd;
        cursor: pointer;
        overflow: hidden;

        .card-icon {
          margin-right: 10px;
        }

        .arrow-r {
          position: relative;
          top: 6px;
          float: right;

          &::before,&::after {
            content: '';
            position: absolute;
            right: 3px;
            border: 8px solid transparent;
            border-left: 8px solid #fff;
          }

          &::before {
            border-left-color: rgba(0,0,0,0.54);
            right: 0;
          }
        }

        img {
          height: 26px;
          margin-right: 8px;
        }

        &.li-alipay,&.li-wechat {
          span {
            display: inline-block;
            font-size: 18px;
            vertical-align: 6px;
          }
        }
        &:last-child {
          border-bottom: none;
        }
      }
    }
  }

  .modal-qrcode {
    position: fixed;
    top: 50%;
    left: 50%;
    height: 340px;
    margin-top: -340px/2;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 29px 0px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    text-align: center;
    color: rgba(0, 0, 0, 1);
    text-align: center;

    .qrcode-title {
      margin-top: 14px;
      font-size: 18px;
      color: #616161;
    }

    .qrcode-box {
      position: relative;
      box-sizing: border-box;
      width: 194px;
      height: 194px;
      margin: 40px auto 20px;
      padding: 20px;
      border: 2px solid #99cf7d;
    }

    .qrcode-tips {
      position: absolute;
      top: -24px;
      left: 0;
      margin-top: 0;
      font-size: 14px;
      color: #979797;
    }

    .yellow {
      color: #f47900;
    }

    

    p {
      margin-top: 20px;
      img {
        height: 26px;
      }
      span {
        display: inline-block;
        font-size: 16px;
        vertical-align: 6px;
      }
    }
  }

  .modal-status {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 320px;
    height: 200px;
    margin-left: -320px/2;
    margin-top: -200px/2;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 29px 0px rgba(0, 0, 0, 0.15);
    border-radius: 10px;
    text-align: center;
    color: rgba(0, 0, 0, 1);


    p {
      margin-top: 6px;
      padding: 0 20px;
      font-size: 14px;
      line-height: 22px;
    }

    .btn-group {
      margin-top: 30px;
      text-align: center;

      .btn {
        display: inline-block;
        width: 118px;
        margin: 0 8px;
        font-size: 12px;
      }

      .btn-default {
        &:hover {
          background: #f1f1f1;
        }
      }

      .btn-primary {
        &:hover {
          background: #d62e5f;
        }
      }
    }
  }
}
</style>



