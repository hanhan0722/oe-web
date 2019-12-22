<template>
  <div class="contact">
    <p class="menu-title">{{$t("Layout.title2")}}</p>
    <div>
      <p>{{$t("Layout.connect.title1")}}</p>
      <p><span>{{$t("Layout.connect.title2")}}</span>010-5849 6315</p>
      <p><span>{{$t("Layout.connect.title3")}}</span>service@ouimeet.com</p>
      <p><span>{{$t("Layout.connect.title4")}}</span>ouyixiaohongniang</p>
      <p><span>{{$t("Layout.connect.title5")}}</span>欧亿全球婚恋</p>
      <p><span>{{$t("Layout.connect.title6")}}</span>www.ouimeet.com</p>
      <p><span>{{$t("Layout.connect.title7")}}</span>100020</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Contact",
  data() {
    return {};
  },
  mounted() {
    this.$parent.active = 1;
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.menu-title+div{
  p{
    margin-bottom: 30px;
  }
}
</style>
