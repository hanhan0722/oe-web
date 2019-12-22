<template>
  <div class="footer-menu clear content-center">
    <ul class="lf">
      <router-link to="/menu/about">
        <li :class="active==0?'active':''" @click="active=0">{{$t("Layout.title1")}}</li>
      </router-link>
      <router-link to="/menu/contact">
        <li :class="active==1?'active':''" @click="active=1">{{$t("Layout.title2")}}</li>
      </router-link>
      <!-- <router-link to="/menu/map">
        <li :class="active==2?'active':''" @click="active=2">{{$t("Layout.title3")}}</li>
      </router-link>-->
      <router-link to="/menu/explain">
        <li :class="active==3?'active':''" @click="active=3">{{$t("Layout.title4")}}</li>
      </router-link>
      <router-link to="/menu/suggest">
        <li :class="active==4?'active':''" @click="active=4">{{$t("Layout.title5")}}</li>
      </router-link>
    </ul>
    <div class="rt">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "FooterMenu",
  data() {
    return {
      active: 0
    };
  },
  mounted() {},
  methods: {}
};
</script>

<style lang="less" scoped>
.footer-menu {
  padding: 20px 0;
  a:hover {
    color: #404040;
  }
  ul:first-child {
    background: #fff;
    border-radius: 6px;
    width: 150px;
    li {
      margin: 20px 0;
      padding: 0 10px;
      border-left: 3px solid transparent;
      cursor: pointer;
      &.active {
        border-left: 3px solid @oePink;
      }
    }
    & + div {
      width: calc(100% - 170px);
      min-height: calc(100vh - 354px);
      background: #fff;
      border-radius: 6px;
      padding: 20px 30px 40px 30px;
      box-sizing: border-box;
    }
  }
}
</style>
<style lang="less">
.footer-menu {
  .menu-title {
    color: @oePink;
    font-size: 18px;
    line-height: 50px;
    border-bottom: 1px solid @borderGray;
    margin-bottom: 20px;
  }
  .main-title {
    padding: 15px 0;
  }
}
</style>

