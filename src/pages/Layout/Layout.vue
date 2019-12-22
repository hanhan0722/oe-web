<template>
  <div class="layout">
    <layout-header ref="myheader"></layout-header>
    <div class="content">
      <keep-alive include="UserRecommend">
        <router-view ref="child"></router-view>
      </keep-alive>
    </div>
    <layout-footer></layout-footer>
  </div>
</template>

<script>
import LayoutHeader from "./LayoutHeader";
import LayoutFooter from "./LayoutFooter";
export default {
  name: "Layout",
  components: { LayoutHeader, LayoutFooter },
  data() {
    return {};
  },
  mounted() {
    var search = window.location.href.split("?")[1];
    if (search) {
      var arr = search.split("&");
      arr.map((item, index, arr) => {
        localStorage.setItem(item.split("=")[0], item.split("=")[1]);
      });
    }
  }
};
</script>

<style lang="less" scoped>
.layout {
  padding-top: 64px;
}
.content {
  min-height: calc(100vh - 284px);
}
</style>
