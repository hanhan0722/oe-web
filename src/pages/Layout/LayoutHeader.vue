<template>
  <div class="layout-header">
    <div class="header">
      <div class="content-center">
        <router-link to="/">
          <img
            class="lf logo"
            :src="'../../../static/img/'+($store.state.lang=='en'?'logo_en':'logo_zh')+'.png'"
          >
        </router-link>
        <!-- 导航 -->
        <ul class="nav-menu clear">
          <li
            v-for="(item,idx) in navList"
            :class="active==idx?'active':''"
            @click="onNavClick(idx)"
          >
            <div>
              {{$store.state.lang=="en"?item.name_en:item.name_zh}}
              <div :class="$store.state.lang=='en'?'active-en':''"></div>
            </div>
          </li>
        </ul>
        <!-- 充值 -->
        <div class="handle-setting">
          <el-dropdown trigger="click" @click.native="judgeLogin" ref="messageDrop">
            <p class="quick-recharge">
              <i class="icon-lightning"></i>
              <span>{{$t("Layout.button2")}}</span>
            </p>
            <el-dropdown-menu slot="dropdown">
              <!-- vip -->
              <el-dropdown-item @click.native="showBuy('vip')" v-show="userInfo.authStatus==1">{{$t("Layout.button3")}}</el-dropdown-item>
              <!-- 认证 -->
              <el-dropdown-item
                @click.native="showBuy('identify')"
                v-show="userInfo.authStatus!=1"
              >{{$t("Layout.button4")}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <!-- 登陆/用户信息 -->
          <button
            class="btn-grad-pink"
            @click="onLogin"
            v-show="!userInfo.id"
          >{{$t("Layout.button6")}}</button>
          <div class="user-info" v-show="userInfo.id">
            <!-- 消息 -->
            <el-badge
              :value="unReadMessageNum>99?'99+':unReadMessageNum"
              class="user-avatar"
              @click="goChat"
            >
              <span class="icon-clock" @click="goChat"></span>
            </el-badge>
            <el-dropdown trigger="click">
              <div>
                <img
                  :src="userInfo.avatar?this.$store.state.imageHost+userInfo.avatar:'../../../static/img/avatar.png'"
                >
                <p>{{userInfo.nickname||$t("Layout.prompt1")}}</p>
              </div>
              <el-dropdown-menu slot="dropdown">
                <!-- user center -->
                <el-dropdown-item @click.native="goUserDetail">{{$t("Layout.button5")}}</el-dropdown-item>
                <!-- logout -->
                <el-dropdown-item @click.native="logoutLogin">{{$t("Layout.button1")}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- 语言 -->
          <oe-select v-model="lang" width="110px" :options="langList">
            <i class="icon-earth" slot="icon"></i>
          </oe-select>
        </div>
      </div>
    </div>
    <login ref="login" @getUserInfo="getUserInfo"></login>
    <buy></buy>
    <public v-show="false" ref="public"></public>
  </div>
</template>

<script>
import OeSelect from "@/components/UI/OeSelect";
import Login from "@/components/Login";
import Public from "@/components/Public";
import Buy from "@/components/Modal/Buy";
import bus from "@/assets/utils/bus.js";
import { Encrypt, Decrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name: "LayoutHeader",
  components: { OeSelect, Login, Buy, Public },
  data() {
    return {
      active: 0,
      navList: [
        {
          path: "/",
          name_zh: "首页",
          name_en: "Index"
        },
        {
          path: "/user",
          name_zh: "推荐",
          name_en: "Recommend"
        },
        {
          path: "/article",
          name_zh: "社区",
          name_en: "Community"
        }
      ],
      langList: [
        { label: "简体中文", value: "zh_Hans" },
        { label: "English", value: "en" }
      ],
      lang: "en"
    };
  },
  watch: {
    lang(val) {
      localStorage.setItem("lang", val);
      this.$store.commit("newLang", val);
      this.$i18n.locale = this.$store.state.lang;
      console.log(this.$store.state.lang);
    }
  },
  computed: {
    im() {
      return this.$store.state.im.im;
    },
    userInfo() {
      return this.$store.state.userInfo;
    },
    unReadMessageNum() {
      return this.$store.getters.GET_IM_CHART_DIALOG_ALL_UN_READ_LENGTH()>0?this.$store.getters.GET_IM_CHART_DIALOG_ALL_UN_READ_LENGTH():"";
    }
  },
  mounted() {
    if (localStorage.getItem("lang")) {
      this.$store.commit("newLang", localStorage.getItem("lang"));
      this.lang = this.$store.state.lang;
      this.$i18n.locale = this.$store.state.lang;
    } else {
      this.$ajax(PostData(this.$store.state.host + "common/getuserIP")).then(
        res => {
          if (res.data.code == 0) {
            console.log(JSON.parse(Decrypt(res.data.body)).ipflag);
            if (JSON.parse(Decrypt(res.data.body)).ipflag == 0) {
              localStorage.setItem("lang", "zh_Hans");
            } else {
              localStorage.setItem("lang", "en");
            }
            this.$store.commit("newLang", localStorage.getItem("lang"));
            this.lang = this.$store.state.lang;
            console.log(this.lang);
            this.$i18n.locale = this.$store.state.lang;
          } else {
            this.$message(res.data.msg);
          }
        }
      );
    }
    this.getUserInfo();
    this.matchNav();
  },
  methods: {
    onNavClick(idx) {
      this.active = idx;
      this.$router.push(this.navList[idx].path);
    },
    onLogin() {
      this.$refs.login.showLogin = true;
    },
    getUserInfo(data) {
      if (sessionStorage.getItem("user")) {
        this.$store.commit(
          "newUserInfo",
          JSON.parse(Decrypt(sessionStorage.getItem("user")))
        );
        if (this.userInfo.userstep == 0) {
          this.onLogin();
          this.$refs.login.elem = "registerSuccess";
        }
        this.im.logout();
        this.im.login(this.userInfo.id, "zqzx2017");
        this.$store.commit(
          "SET_IM_CHART_CHATLIST",
          JSON.parse(localStorage.getItem("chatList")) || []
        );
        console.log(JSON.parse(localStorage.getItem("groupMessageMap")) || {});
        this.$store.commit(
          "SET_IM_GROUP_MESSAGE_MAP",
          JSON.parse(localStorage.getItem("groupMessageMap")) || {}
        );
      }
    },
    goUserDetail() {
      this.$router.push({
        name: "UserDetail",
        params: { id: this.userInfo.id, type: 1 }
      });
    },
    goChat() {
      this.$router.push("/chat");
    },
    logoutLogin() {
      sessionStorage.removeItem("user");
      this.$store.commit("newUserInfo", {});
      this.$ajax(
        PostData(this.$store.state.host + "user/logout", {
          id: this.userInfo.id
        })
      ).then(res => {
        console.log(res.data);
        this.im.logout();
      });
    },
    judgeLogin() {
      if (!this.userInfo || !this.userInfo.id) {
        this.$refs.login.showLogin = true;
        this.$refs.messageDrop.hide();
        return;
      }
    },
    showBuy(type) {
      bus.$emit("showBuy", type);
    },
    matchNav() {
      this.navList.forEach((item, index) => {
        let path = this.$route.path;
        let navPath = item.path;
        if (item.path === "/") {
          navPath = "/index";
        }
        if (this.$route.path === "/") {
          path = "/index";
        }
        if (path.indexOf(navPath) > -1) {
          this.active = index;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@imgPath: "../../assets/img/layout/";
.header {
  border-bottom: 1px solid @borderGray;
  background: rgba(255, 255, 255, 0.8);
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  .content-center {
    height: 64px;
    display: flex;
    align-items: center;
    position: relative;

    .logo {
      height: 41px;
    }
  }
  .handle-setting {
    position: absolute;
    right: 0;
  }
  .icon-user {
    .icon-sprite(22px, 24px, -217px, -146px);
    margin-right: 16px;
    cursor: pointer;
  }
  .user-info {
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 5px;
      cursor: pointer;
    }
    p {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .icon-clock {
    font-size: 24px;
    vertical-align: middle;
    margin-right: 16px;
    cursor: pointer;
  }
  .icon-earth {
    .icon-sprite(23px, 18px, -268px, -149px);
    margin-left: 8px;
  }
  .icon-lightning {
    .icon-sprite(18px, 18px, -111px, -149px);
    margin-right: 5px;
  }
  ul.nav-menu {
    margin-left: 70px;
    height: 58px;
    li {
      float: left;
      font-size: 16px;
      font-weight: bold;
      margin-right: 50px;
      cursor: pointer;
      line-height: 58px;
      &.active {
        & > div {
          & > div {
            margin: 0 auto;
            width: 25px;
            border-bottom: 3px solid @oePink;
          }
        }
        .active-en {
          width: 35px;
        }
      }
    }
  }
  .quick-recharge {
    display: inline-block;
    vertical-align: middle;
    margin-right: 20px;
    color: @oePink;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
  }
  .btn-grad-pink {
    display: inline-block;
    height: 32px;
    vertical-align: middle;
    margin-right: 6px;
  }
}
</style>
<style lang="less">
.layout-header {
  .el-badge__content.is-fixed {
    top: 5px;
    right: 30px;
  }
}
</style>
