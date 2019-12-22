<template>
  <div class="index" @click="valiLogin">
    <!-- 第一屏 start -->
    <div class="wrapper-first">
      <div class="index-subtitle">
        {{$t("Index.title1")}}
        <span class="index-title">
          {{$t("Index.title2")}}
          <sup v-if="$store.state.lang=='zh_Hans'">+</sup>
        </span>
        {{$t("Index.title3")}}
      </div>
      <ul class="user-img-ul">
        <li
          v-for="(user,idx) in userList"
          @mouseover="onMouseOver(idx)"
          :data-img="user.avatar"
          :data-url="url_prefix"
          v-loadimg
        >
          <transition name="stretch">
            <div
              class="user-info"
              v-show="user.showDesc"
              :style="{background:'rgba('+(user.sex==1?'91,134,231,0.7':'231,28,102,0.7')+')'}"
              @mouseleave="onMouseLeave(idx)"
            >
              <p>{{user.nickname||$t("Index.prompt1")}}</p>
              <p>{{user.age?user.age+$t("Index.unit1"):$t("Index.prompt2")}}</p>
              <p>{{user.occupation||$t("Index.prompt3")}}</p>
              <p>
                <i class="icon-location"></i>
                <span>{{user.workProvince||$t("Index.prompt4")}}</span>
              </p>
            </div>
          </transition>
        </li>
      </ul>
    </div>
    <!-- 第一屏 end -->

    <!-- 第二屏 start -->
    <div class="wrapper-second content-center">
      <div class="second-desc">
        <p class="index-title">{{$t("Index.title4")}}</p>
        <p class="index-subtitle">{{$t("Index.title5")}}</p>
        <p>{{$t("Index.title6")}}</p>
      </div>
      <img src="@/assets/img/index/auth.png">
    </div>
    <!-- 第二屏 end -->

    <!-- 第三屏 start -->
    <div class="wrapper-third">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide class="swiper-slide games">
          <div class="content-center clear">
            <img src="@/assets/img/index/phone.png" class="lf">
            <div class="rt">
              <p class="index-title">{{$t("Index.title7")}}</p>
              <p class="index-subtitle">{{$t("Index.title8")}}</p>
              <img src="@/assets/img/index/chat.png">
            </div>
          </div>
        </swiper-slide>
        <swiper-slide class="swiper-slide games">
          <div class="content-center clear">
            <img src="@/assets/img/index/phone1.png" class="lf">
            <div class="rt">
              <p class="index-title">{{$t("Index.title9")}}</p>
              <p class="index-subtitle">{{$t("Index.title10")}}</p>
              <img src="@/assets/img/index/chat1.png">
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>
    <!-- 第三屏 end -->

    <!-- 第四屏 start -->
    <div class="wrapper-fourth">
      <div class="index-subtitle">
        {{$t("Index.title11")}}
        <span class="index-title">{{$t("Index.title12")}}</span>
        {{$t("Index.title13")}}
        <div class="red-line" :class="$store.state.lang=='en'?'line-en':'line-zh'"></div>
      </div>
      <div>
        <p>{{$t("Index.title14")}}</p>
        <img src="@/assets/img/index/guojia.png">
      </div>
    </div>
    <!-- 第四屏 end -->

    <!-- 第五屏 start -->
    <div class="wrapper-fifth">
      <p class="index-subtitle">{{$t("Index.title15")}}</p>
      <p class="index-title">{{$t("Index.title16")}}</p>
      <div class="user-list">
        <ul>
          <li>
            <img src="@/assets/img/index/avatar1.jpg">
          </li>
          <li>
            <img src="@/assets/img/index/avatar2.jpg">
          </li>
          <li>
            <img src="@/assets/img/index/avatar3.jpg">
          </li>
          <li>
            <img src="@/assets/img/index/avatar4.jpg">
          </li>
          <li>
            <img src="@/assets/img/index/avatar5.jpg">
          </li>
        </ul>
        <img src="@/assets/img/index/xin.png" class="xinImg heartBeat">
      </div>
    </div>
    <!-- 第五屏 end -->

    <!-- 第六屏 start -->
    <div class="wrapper-sixth">
      <p class="index-title">{{$t("Index.title17")}}</p>
      <ul>
        <li>
          <div>
            <img
              :src="'../../../static/img/'+($store.state.lang=='en'?'googlePlay.png':'android.png')"
            >
            <div>
              <p>Android</p>
              <p>{{$t("Index.title18")}}</p>
            </div>
            <img src="@/assets/img/index/android_qr.png">
          </div>
        </li>
        <li>
          <div>
            <img src="@/assets/img/index/apple.png">
            <div>
              <p>App Store</p>
              <p>{{$t("Index.title18")}}</p>
            </div>
            <img src="@/assets/img/index/apple_qr.png">
          </div>
        </li>
        <!-- <li>
          <div>
            <img src="@/assets/img/index/wechat.png">
            <div>
              <p>{{$t("Index.title19")}}</p>
            </div>
            <img src="@/assets/img/index/code.jpg">
          </div>
        </li> -->
      </ul>
    </div>
    <!-- 第六屏 end -->
    <div class="image-code" v-show="showCode">
       <i class="icon-close" @click.stop="showCode=false"></i>
      <img src="@/assets/img/layout/code.png">
    </div>
  </div>
</template>

<script>
import { Decrypt, PostData } from "@/assets/utils/secret.js";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import { getCountry } from "@/assets/utils/public.js";
import bus from "@/assets/utils/bus.js";
export default {
  name: "Index",
  components: { swiper, swiperSlide },
  data() {
    return {
      swiperOption: {
        autoplay: true,
        speed: 1000,
        loop: true,
        autoHeight: true,
        observer: true,
        observeParents: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        }
      },
      url_prefix: "",
      userList: [],
      showCode:true
    };
  },
  mounted() {
    for (var i = 0; i < 50; i++) {
      this.userList.push({});
    }
    window.addEventListener("scroll", this.onHandleScroll);
    this.$ajax(PostData(this.$store.state.host + "user/photoWall", {})).then(
      res => {
        this.userList = [];
        var body = JSON.parse(Decrypt(res.data.body));
        this.url_prefix = body.url_prefix;
        console.log(body);
        for (var i = 0; i < Math.floor(body.list.length / 2); i++) {
          this.userList.push(body.list[i]);
          this.userList.push(body.list[Math.floor(body.list.length / 2) + i]);
        }
        for (var user of this.userList) {
          user.workProvince = getCountry(user.workProvince);
        }
      }
    );
    var _this = this;
  },
  methods: {
    onHandleScroll() {
      try {
        var scrollTop =
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop;
        var windowHeight = $(window).height();
        var scrollList = [$(".wrapper-second"), $(".wrapper-fifth")];
        for (var i = 0; i < scrollList.length; i++) {
          if (scrollTop + windowHeight / 4 > scrollList[i].offset().top) {
            scrollList[i].addClass("animate");
          }
        }
      } catch (err) {}
    },
    onMouseOver(idx) {
      clearInterval(this.timer);
      for (var i in this.userList) {
        this.userList[i].showDesc = false;
      }
      this.userList[idx].showDesc = true;
      this.$set(this.userList, idx, this.userList[idx]);
    },
    onMouseLeave(idx) {
      for (var i in this.userList) {
        this.userList[i].showDesc = false;
        this.$set(this.userList, i, this.userList[i]);
      }
    },
    valiLogin() {
      if (!this.$store.state.userInfo.id) {
        this.$message(this.$t("UserRecommend.prompt1"));
        bus.$emit("showLogin", 0);
        return false;
      } else {
        return true;
      }
    },
    goDetail(id) {
      if (this.valiLogin())
        this.$router.push({ name: "UserDetail", params: { id: id, type: 0 } });
    }
  }
};
</script>

<style lang="less" scoped>
@imgPath: "../../assets/img/index/";
.index {
  background: #fff;
  .wrapper-second,
  .wrapper-fourth,
  .wrapper-fifth,
  .wrapper-sixth {
    padding: 50px 0;
  }
  .index-title {
    font-size: 26px;
    font-weight: bold;
  }
  .index-subtitle {
    font-size: 22px;
  }
  .wrapper-first {
    .index-subtitle {
      padding: 60px 0px;
      text-align: center;
    }
    .user-img-ul {
      width: 100%;
      height: 522px;
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      li {
        display: inline-block;
        width: 150px;
        height: 150px;
        margin: 12px;
        border-radius: 15px;
        overflow: hidden;
        animation: scaleIn 0.5s ease;
        .user-info {
          width: 100%;
          height: 100%;
          padding: 24px;
          box-sizing: border-box;
          color: #fff;
          border-radius: 15px;
          p {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          p:first-child {
            width: 100%;
            font-size: 22px;
            height: 26px;
            margin-bottom: 16px;
          }
          p:not(first-child) {
            line-height: 20px;
          }
        }
      }
    }
  }
  .wrapper-second {
    display: flex;
    justify-content: center;
    align-items: center;
    div:first-child {
      width: 400px;
      transition: transform 0.5s ease;
      margin-right: 10px;
      transform: translateX(-150px);
      .index-title {
        padding: 5px 0;
      }
      .index-subtitle + p {
        font-size: 14px;
        margin-top: 50px;
        line-height: 24px;
        width: 300px;
      }
    }
    img {
      width: 360px;
      height: 360px;
      transition: transform 0.5s ease;
      transform: translateX(150px);
    }
  }
  .animate {
    .second-desc,
    .second-desc + img {
      transform: translateX(0) !important;
    }
  }
  .wrapper-third {
    .grad(#ee8677, @oePink);
    .content-center {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 330px;
        margin: 30px 0;
      }
      .rt {
        margin-left: 85px;
        color: #fff;
        p {
          padding-left: 20px;
        }
        p.index-title {
          padding: 70px 0 5px 20px;
        }
      }
    }
  }
  .wrapper-fourth {
    background-image: url("@{imgPath}xian.jpg");
    .index-subtitle {
      width: 700px;
      margin: 0 auto;
      padding-bottom: 15px;
      text-align: center;
      margin-bottom: 30px;
      position: relative;
      span {
        padding: 0 10px;
      }
      .red-line {
        position: absolute;
        height: 3px;
        margin-left: -30px;
        bottom: 0;
        width: 40px;
        background-color: @oePink;
      }
      .line-en {
        left: 490px;
      }
      .line-zh {
        left: 345px;
      }
    }
    .index-subtitle + div {
      width: 700px;
      margin: 0 auto;
      p {
        font-size: 16px;
        line-height: 30px;
        padding: 0px 70px;
      }
      img {
        margin-top: 40px;
        width: 100%;
        height: 300px;
      }
    }
  }
  .wrapper-fifth {
    text-align: center;
    .index-subtitle {
      margin-bottom: 5px;
    }
    .index-title {
      margin-bottom: 80px;
    }
    .user-list {
      position: relative;
      width: 505px;
      height: 511px;
      display: inline-block;
      background-image: url("@{imgPath}xinBg.png");
      background-size: 100% 100%;
      li {
        display: inline-block;
        border: 8px solid #fff;
        border-radius: 50%;
        position: absolute;
        overflow: hidden;
        box-shadow: #b0b0b0 0 0 10px;
        img {
          width: 100%;
        }
      }
      ul {
        li {
          opacity: 0;
          transition: all 1s linear;
        }
        li:nth-child(1) {
          width: 180px;
          height: 180px;
          left: 163px;
          top: 174px;
          transform: rotate(-5deg);
        }
        li:nth-child(2) {
          width: 148px;
          height: 148px;
          left: 183px;
          top: 184px;
          transform: rotate(15deg);
        }
        li:nth-child(3) {
          width: 180px;
          height: 180px;
          left: 164px;
          top: 174px;
          transform: rotate(-5deg);
        }
        li:nth-child(4) {
          width: 165px;
          height: 165px;
          left: 174px;
          top: 174px;
          transform: rotate(-10deg);
        }
        li:nth-child(5) {
          width: 135px;
          height: 135px;
          left: 191px;
          top: 188px;
        }
      }
      .xinImg {
        position: absolute;
        top: 190px;
        left: 190px;
        animation: heartBeat 1s infinite;
        animation-delay: 1s;
      }
    }
  }
  .animate {
    .user-list > ul {
      li {
        opacity: 1;
      }
      li:nth-child(1) {
        left: -100px;
        top: 226px;
      }
      li:nth-child(2) {
        left: 0px;
        top: 0px;
      }
      li:nth-child(3) {
        left: 400px;
        top: 21px;
      }
      li:nth-child(4) {
        left: 415px;
        top: 278px;
      }
      li:nth-child(5) {
        left: 200px;
        top: 335px;
      }
    }
  }
  .wrapper-sixth {
    background-color: #f6f6f6;
    .index-title {
      text-align: center;
      margin-bottom: 60px;
    }
    ul {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
      li {
        width: 400px;
        border-right: 1px solid @borderGray;
        display: flex;
        justify-content: center;
        &:last-child {
          border: none;
        }
        img {
          &:first-child {
            height: 50px;
            vertical-align: middle;
            & + div {
              display: inline-block;
              vertical-align: middle;
              color: #676767;
              p:last-child {
                font-size: 16px;
                text-align: center;
              }
              p:first-child {
                font-size: 20px;
                margin-bottom: 5px;
              }
            }
          }
          &:last-child {
            display: block;
            width: 180px;
            margin: 50px auto 0 auto;
          }
        }
      }
    }
  }
}
.image-code {
  position: fixed;
  right: 30px;
  bottom: 30px;
}
.icon-location {
  .icon-sprite(20px, 26px, -312px, -144px, 0.7);
  margin-left: -3px;
  & + span {
    vertical-align: middle;
  }
}
.stretch-enter-active,
.stretch-leave-active {
  transition: transform 0.25s ease-out;
}

.stretch-enter,
.stretch-leave-to {
  transform: translateY(150px);
}
@keyframes scaleIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes rightIn {
  0% {
    opacity: 0;
    transform: translateX(150px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes heartBeat {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  14% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  28% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }

  42% {
    -webkit-transform: scale(1.3);
    transform: scale(1.3);
  }

  70% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
