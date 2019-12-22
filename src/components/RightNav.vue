<template>
  <div>
    <div class="right-nav">
      <div v-if="user.id">
        <div class="user-info-one">
          <router-link :to="{name: 'UserDetail',params: { id: $store.state.userInfo.id, type: 1 }}">
            <img
              :src="user.avatar?this.$store.state.imageHost+user.avatar:'../../../static/img/avatar.png'"
              class="user-avatar"
            >
          </router-link>
          <p class="user-uname">
            {{user.nickname||$t("Layout.prompt1")}}
            <i class="icon-diamond-active" v-if="user.isVip==1"></i>
          </p>
          <p>ID: {{user.id}}</p>
        </div>
        <ul class="user-info-two" :style="{textAlign:$store.state.lang=='en'?'left':'center'}">
          <!-- 心动 -->
          <li>
            <i class="icon-heart-active"></i>
            <span class="list-item" @click="goUserList(0)">{{$t("Components.right_nav.title1")}}</span>
            <span
              class="tag-primary"
              @click="goUserList(0)"
              v-show="user.likeMeUnreadCount>0"
            >{{user.likeMeUnreadCount > 99 ? "99+" : user.likeMeUnreadCount}}</span>
          </li>
          <!-- 访客 -->
          <li>
            <i class="icon-eye"></i>
            <span class="list-item" @click="goUserList(2)">{{$t("Components.right_nav.title2")}}</span>
            <span
              class="tag-primary"
              @click="goUserList(2)"
              v-show="user.visitMeUnreadCount>0"
            >{{user.visitMeUnreadCount > 99 ? "99+" : user.visitMeUnreadCount}}</span>
          </li>
          <!-- 消息 -->
          <li>
            <i class="icon-talk"></i>
            <span class="list-item" @click="goChat">{{$t("Components.right_nav.title3")}}</span>
            <span
              class="tag-primary"
              @click="goChat"
              v-show="this.unReadMessageNum>0"
            >{{this.unReadMessageNum > 99 ? "99+" : this.unReadMessageNum}}</span>
          </li>
          <!-- <li>
            <i class="icon-star"></i>
            <span class="list-item">收藏</span>
            <router-link to="/article">
              <span class="tag-primary">{{user.collectNum>99?"99+":user.collectNum}}</span>
            </router-link>
          </li>-->
        </ul>
        <div class="user-info-three">
          <!-- 开通vip -->
          <div class="btn-vip" v-if="user.isVip != 1" @click="buyVip">
            <i class="icon-diamond"></i>
            <span>{{$t("Components.right_nav.button1")}}</span>
          </div>
          <div class="btn-vip" v-else @click="buyVip">
            <i class="icon-diamond"></i>
            <span>{{user.lastVipTime}}</span>
          </div>
          <ul class="clear">
            <!-- 添加照片 -->
            <li class="lf" @click="goUserCenter">
              <i class="icon-camera"></i>
              <p>{{$t("Components.right_nav.button2")}}</p>
            </li>
            <!-- 编辑资料 -->
            <li class="rt" @click="goUserCenter">
              <i class="icon-edit"></i>
              <p>{{$t("Components.right_nav.button3")}}</p>
            </li>
          </ul>
        </div>
      </div>
      <div v-else>
        <img src="@/assets/img/right_nav/user.png" class="user-avatar">
        <!-- 注册 -->
        <button class="btn-default" @click="showLogin(0)">{{$t("Components.right_nav.button4")}}</button>
        <!-- 登录 -->
        <button class="btn-primary" @click="showLogin(1)">{{$t("Components.right_nav.button5")}}</button>
      </div>
    </div>
    <img src="@/assets/img/layout/code.png" class="image-code">
    <!-- <div class="hot-tag right-nav" v-if="page=='article'">
      <div class="info-title">
        <div>
          热门标签
          <div></div>
        </div>
      </div>
      <ul class="tag-list">
        <li :class="current==idx?'active':''" v-for="(tag,idx) in tagList" @click="current=idx">{{tag}}</li>
      </ul>
    </div>-->
  </div>
</template>

<script>
import bus from "@/assets/utils/bus.js";
import { AesEncrypt } from "@/assets/utils/secret.js";
export default {
  name: "RightNav",
  props: ["page"],
  data() {
    return {
      tagList: [
        "情感",
        "美女",
        "相亲",
        "分手",
        "婚姻",
        "约会",
        "交友",
        "技巧",
        "星座",
        "婚恋",
        "好感"
      ],
      current: -1
    };
  },
  computed: {
    user() {
      return this.$store.state.userInfo;
    },
    unReadMessageNum() {
      return this.$store.getters.GET_IM_CHART_DIALOG_ALL_UN_READ_LENGTH();
    }
  },
  mounted() {},
  methods: {
    goUserList(current) {
      if(current==0)this.$store.state.userInfo.likeMeUnreadCount=0;
      else if(current==2)this.$store.state.userInfo.visitMeUnreadCount=0;
      sessionStorage.setItem('user',AesEncrypt(JSON.stringify(this.$store.state.userInfo)))
      this.$router.push({ path: "/user/list", query: { current: current } });
    },
    goChat() {
      this.$router.push("/chat");
    },
    showLogin(data) {
      bus.$emit("showLogin", data);
    },
    buyVip() {
      if (
        this.$store.state.userInfo.isVip != 1 &&
        this.$store.state.userInfo.authStatus != 1
      ) {
        //未认证 弹认证
        this.$message("请您先开通认证");
        bus.$emit("showBuy", "identify");
      } else if (this.$store.state.userInfo.isVip != 1) {
        //认证后未购买vip 弹vip
        bus.$emit("showBuy", "vip");
      }
    },
    goUserCenter() {
      this.$router.push({
        name: "UserDetail",
        params: { id: this.user.id, type: 1 }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.right-nav {
  .wrapper;
  width: 220px;
  padding: 25px;
  box-sizing: border-box;
  text-align: center;
  margin-bottom: 20px;
  button {
    margin: 0 auto;
    min-width: 90px;
  }
  .user-avatar {
    width: 86px;
    height: 86px;
    border-radius: 50%;
    margin-bottom: 18px;
  }
  .user-info-one {
    border-bottom: 1px solid @borderGray;
    padding-bottom: 18px;
    .user-uname {
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 5px;
      i {
        margin-left: 5px;
      }
    }
  }
  ul.user-info-two {
    border-bottom: 1px solid @borderGray;
    padding: 30px 0;
    font-size: 14px;
    li {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      .list-item {
        padding: 0 10px;
        width: 65px;
        cursor: pointer;
      }
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
  .user-info-three {
    .btn-vip {
      width: 150px;
      background: #c0a37c;
      height: 33px;
      color: #fff;
      border-radius: 10px;
      line-height: 33px;
      cursor: pointer;
      font-size: 13.333px;
      margin: 22px auto 0 auto;
    }
    ul {
      margin-top: 32px;
      padding: 0 12px;
      li {
        cursor: pointer;
        color: #7b7b7b;
        i {
          margin-bottom: 12px;
        }
      }
    }
  }
  .btn-default {
    margin-bottom: 10px;
  }
  .icon-diamond {
    .icon-sprite(20px, 20px, -254px, -212px, 1, "../");
  }
  .icon-camera {
    .icon-sprite(36px, 30px, -111px, -270px, 1, "../");
  }
  .icon-edit {
    .icon-sprite(30px, 30px, -174px, -271px, 1, "../");
  }
}
.hot-tag {
  padding-top: 10px;
  .info-title {
    margin-bottom: 15px;
    & > div {
      padding: 0;
      margin: 0 auto;
      & > div {
        margin-left: 10px;
      }
    }
  }
  .tag-list {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding-left: 8px;
    li {
      display: inline-block;
      padding: 3px 11px;
      border: 1px solid #d5d5d5;
      border-radius: 8px;
      margin: 0 6px 8px 0;
      cursor: pointer;
      &.active {
        background: @oePink;
        color: #fff;
      }
    }
  }
}
</style>
