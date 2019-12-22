<template>
  <div class="share">
    <p class="user-share" v-if="type=='userCenter'">
      <span>分享</span>
      <i class="icon-wechat"></i>
      <i class="icon-qq"></i>
      <i class="icon-sina"></i>
      <i class="icon-facebook"></i>
      <i class="icon-phone"></i>
    </p>
    <p v-else>
      <span class="share-options">分享</span>
      <i class="icon-wechat-default default"></i>
      <i class="icon-wechat-active" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"></i>
      <i class="icon-qq-default default"></i>
      <i class="icon-qq-active" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"></i>
      <i class="icon-sina-default default"></i>
      <i class="icon-sina-active" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"></i>
      <i class="icon-facebook-default default"></i>
      <i class="icon-facebook-active" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"></i>
      <i class="icon-phone-default default"></i>
      <i class="icon-phone-active" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave"></i>
    </p>
  </div>
</template>

<script>
export default {
  name: "share",
  props:["type"],
  data() {
    return {};
  },
  mounted() {},
  methods: {
    onMouseEnter(e) {
      $(e.target)
        .prev(".default")
        .hide();
    },
    onMouseLeave(e) {
      $(e.target)
        .prev(".default")
        .show();
    }
  }
};
</script>

<style lang="less" scoped>
.share-options {
  vertical-align: middle;
  margin-right: 10px;
}
.default + i {
  display: none;
  &:hover {
    display: inline-block;
  }
}
.default:hover {
  display: none;
  & + i {
    display: inline-block;
  }
}
.icon-wechat {
  .icon-sprite(24px, 24px, -107px, -409px,1,'../');
  cursor: pointer;
  margin-left: 12px;
}
.icon-qq {
  .icon-sprite(24px, 24px, -135px, -409px,1,'../');
  cursor: pointer;
}
.icon-sina {
  .icon-sprite(24px, 24px, -163px, -409px,1,'../');
  cursor: pointer;
}
.icon-facebook {
  .icon-sprite(24px, 24px, -191px, -409px,1,'../');
  cursor: pointer;
}
.icon-phone {
  .icon-sprite(24px, 24px, -219px, -409px,1,'../');
  cursor: pointer;
}
</style>
