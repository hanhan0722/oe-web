<template>
  <div class="layout-footer">
    <div class="footer-menu">
      <ul class="footer-menu-ul">
        <li class="footer-menu-item">
          <router-link to="/menu/about">{{$t("Layout.title1")}}</router-link>
        </li>
        <li class="footer-menu-item">
          <router-link to="/menu/contact">{{$t("Layout.title2")}}</router-link>
        </li>
        <!-- <li class="footer-menu-item">
          <router-link to="/menu/map">{{$t("Layout.title3")}}</router-link>
        </li>-->
        <li class="footer-menu-item">
          <router-link to="/menu/explain">{{$t("Layout.title4")}}</router-link>
        </li>
        <li class="footer-menu-item">
          <router-link to="/menu/suggest">{{$t("Layout.title5")}}</router-link>
        </li>
      </ul>
    </div>
    <div class="footer">
      <img src="@/assets/img/layout/black_logo.png">
      <!-- <div class="footer-desc">
        {{$t("Layout.title6")}}010-68056701 (9:30-18:00)
        <br>Copyright ©2005~2013 ouimeet.com Inc.All rights reserved . 版权所有:北京欧亿文化交流有限公司
      </div> -->
      <div class="footer-desc">
        注册遇到问题，请拨打技术服务热线：010-68056701 (9:30-18:00)
        <br>Copyright ©2005~2013 pc.lol99.com Inc.All rights reserved .版权所有：北京真情在线婚姻咨询有限公司
        <br>ICP备案: 京ICP备13043600号
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LayoutFooter",
  data() {
    return {};
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.footer-menu {
  background-color: #3d3d3d;
  text-align: center;
  height: 40px;
  .footer-menu-ul {
    margin-left: 65px;
    padding: 12px 0px;
    .footer-menu-item {
      color: #a8a8a8;
      font-size: 12px;
      border-right: 1px solid #a8a8a8;
      padding: 0px 10px;
      float: left;
      cursor: pointer;
      a {
        color: #a8a8a8 !important;
        text-decoration: none;
      }
      &:last-child {
        border: none;
      }
    }
  }
}
.footer-menu,
.footer {
  display: flex;
  justify-content: center;
}
.footer {
  padding: 40px 0px;
  background-color: #2d2d2d;
  img {
    width: 155px;
    height: 100px;
  }
  .footer-desc {
    color: #737373;
    font-size: 12px;
    line-height: 30px;
    margin: 20px 0 0 54px;
  }
}
</style>
