<template>
  <div class="image-upload">
    <el-upload
      class="avatar-uploader"
      action
      :auto-upload="false"
      :show-file-list="false"
      :on-change="onChange"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <div class="cropper-content" v-show="cropperVisible && !noCropper">
      <div class="cropper" style="text-align:center">
        <vueCropper
          ref="cropper"
          :img="option.img"
          :outputSize="option.size"
          :outputType="option.outputType"
          :info="true"
          :full="option.full"
          :canMove="option.canMove"
          :canMoveBox="option.canMoveBox"
          :original="option.original"
          :autoCrop="option.autoCrop"
          :fixed="option.fixed"
          :fixedNumber="option.fixedNumber"
          :centerBox="option.centerBox"
          :infoTrue="option.infoTrue"
          :fixedBox="option.fixedBox"
        ></vueCropper>
      </div>
      <div class="handle-btn">
        <!-- confirm -->
        <button class="btn-default" @click="onCropperFinish">{{$t("Components.button1")}}</button>
        <!-- cancel -->
        <button class="btn-default" @click="onCancel">{{$t("Components.button2")}}</button>
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  name: "imageUpload",
  props: ["noCropper", "id"],
  components: { VueCropper },
  data() {
    return {
      imageUrl: "",
      cropperVisible: false,
      // 裁剪组件的基础配置option
      option: {
        img: "", // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 0.8, // 裁剪生成图片的质量
        outputType: "jpeg", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 260, // 默认生成截图框宽度
        autoCropHeight: 260, // 默认生成截图框高度
        fixedBox: true, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: false, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: false, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    };
  },
  mounted() {},
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG && !isPNG) {
        this.$message.error(this.$t("Components.image_upload.prompt1"));
      }
      if (!isLt3M) {
        this.$message.error(this.$t("Components.image_upload.prompt2"));
      }
      return (isJPG || isPNG) && isLt3M;
    },
    onChange(file) {
      if (this.beforeAvatarUpload(file.raw)) {
        if (!this.noCropper) {
          this.$nextTick(() => {
            this.option.img = window.URL.createObjectURL(file.raw);
            this.cropperVisible = true;
          });
        } else {
          this.imageUrl = window.URL.createObjectURL(file.raw);
          var id = this.id || "file";
          var obj = { id: id, file: file.raw };
          this.$emit("onChange", obj);
        }
      }
    },
    onCropperFinish() {
      this.$refs.cropper.getCropBlob(data => {
        console.log(data);
        this.imageUrl = window.URL.createObjectURL(data);
        var avatarFile = new File(
          [data],
          "msr-" + new Date().toISOString().replace(/:|\./g, "-") + ".jpg",
          {
            type: data.type || "image/png"
          }
        );
        console.log(avatarFile);
        this.$emit("onFinish", avatarFile);
      });
    },
    onCancel() {
      this.cropperVisible = false;
      this.$emit("onCancel", false);
    }
  }
};
</script>

<style lang="less">
.image-upload {
  color: #b9b9b9;
  .avatar-uploader .el-upload {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    background: #f6f6f6;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 260px;
    height: 260px;
    line-height: 260px;
    text-align: center;
  }
  .avatar {
    width: 260px;
    height: 260px;
    display: block;
  }
  .cropper-content {
    margin-top: 20px;
    .cropper {
      width: auto;
      height: 260px;
    }
  }
  .handle-btn {
    button {
      display: inline-block;
      margin: 20px 10px;
      width: 80px;
    }
  }
}
</style>
