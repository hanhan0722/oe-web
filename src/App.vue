<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>
<style lang="css">
body {
  width: 100%;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  color: #404040;
  font-family: PingFang-SC-Medium, PingFangSC, "Microsoft Yahei", Helvetica,
    Tahoma, Arial, "Hiragino Sans GB", "Hiragino Sans GB W3", STXihei, STHeiti,
    Heiti, SimSun, sans-serif !important;
  font-size: 12px;
  background: #f6f6f6;
}
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: rgba(144, 147, 153, 0.3);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
*,
p {
  padding: 0;
  margin: 0;
}
a {
  text-decoration: none;
  cursor: pointer;
}
li {
  list-style: none;
}
input,
select {
  outline: none;
}
option {
  border: none;
  outline: none;
}
input[type="button"],
button {
  display: block;
  border: none;
  outline: 0;
  background: #fff;
}
a,
a:visited,
a:link {
  color: #404040 !important;
}
a:hover {
  color: #0099ff;
}
.lf {
  float: left;
}
.rt {
  float: right;
}
.clear:after {
  content: ".";
  display: block;
  height: 0;
  clear: both;
  visibility: hidden;
}
.clear {
  zoom: 1;
}
.el-input__inner {
  border-radius: 20px;
}
.el-message{
  top:80px !important;
}
.swiper-pagination-bullet-active {
  background: #fff !important;
}
</style>
<style lang="less">
@imgPath: "./assets/img/";
textarea {
  border-radius: 6px;
  resize: none;
  border: 1px solid @borderGray;
  padding: 10px;
  color: #404040;
  &:focus {
    outline: none;
  }
}
.el-radio__input.is-checked .el-radio__inner {
  border-color: @oePink;
  background: @oePink;
}
.el-form-item.is-success .el-input__inner,
.el-form-item.is-success .el-input__inner:focus,
.el-form-item.is-success .el-textarea__inner,
.el-form-item.is-success .el-textarea__inner:focus {
  border-color: @borderGray;
}
.icon-heart-active {
  .icon-sprite(20px, 20px, -111px, -212px, 1, "./");
}
.icon-eye {
  .icon-sprite(20px, 20px, -145px, -212px, 1, "./");
}
.icon-talk {
  .icon-sprite(20px, 20px, -180px, -210px, 1, "./");
}
.icon-star {
  .icon-sprite(20px, 20px, -216px, -211px, 1, "./");
}
.icon-star-default {
  .icon-sprite(20px, 20px, -680px, -404px, 1, "./");
}
.icon-diamond-active {
  .icon-sprite(20px, 20px, -286px, -210px, 1, "./");
}
.icon-diamond-default {
  .icon-sprite(20px, 20px, -253px, -210px, 1, "./");
}
.icon-wechat-default {
  .icon-sprite(24px, 24px, -107px, -372px, 1, "./");
  cursor: pointer;
}
.icon-wechat-active {
  .icon-sprite(24px, 24px, -107px, -335px, 1, "./");
  cursor: pointer;
}
.icon-qq-default {
  .icon-sprite(24px, 24px, -135px, -372px, 1, "./");
  cursor: pointer;
}
.icon-qq-active {
  .icon-sprite(24px, 24px, -135px, -335px, 1, "./");
  cursor: pointer;
}
.icon-sina-default {
  .icon-sprite(24px, 24px, -163px, -372px, 1, "./");
  cursor: pointer;
}
.icon-sina-active {
  .icon-sprite(24px, 24px, -163px, -335px, 1, "./");
  cursor: pointer;
}
.icon-facebook-default {
  .icon-sprite(24px, 24px, -191px, -372px, 1, "./");
  cursor: pointer;
}
.icon-facebook-active {
  .icon-sprite(24px, 24px, -191px, -335px, 1, "./");
  cursor: pointer;
}
.icon-phone-default {
  .icon-sprite(24px, 24px, -219px, -372px, 1, "./");
  cursor: pointer;
}
.icon-phone-active {
  .icon-sprite(24px, 24px, -219px, -335px, 1, "./");
  cursor: pointer;
}
.icon-preview {
  .icon(20px, 20px, url("@{imgPath}components/icon_preview.png"));
  margin-right: 10px;
  cursor: pointer;
}
.icon-delete {
  .icon(20px, 20px, url("@{imgPath}components/icon_delete.png"));
  cursor: pointer;
}
.icon-close {
  .icon-sprite(36px, 36px, -412px, -140px, 0.8, "./");
  position: absolute;
  right: -14.4px;
  top: -14.4px;
  cursor: pointer;
}
.icon-close-white {
  .icon(24px, 24px, url("@{imgPath}user/icon_close_white.png"));
  cursor: pointer;
  position: absolute;
  right: -12px;
  top: -12px;
}
.icon-edit-white {
  .icon(16px, 16px, url("@{imgPath}user/icon_edit_white.png"));
}
</style>
