<template>
  <div class="step3" v-loading="loading">
    <div v-show="method==0">
      <div class="trigger-area" @click="method=1">
        <img src="@/assets/img/info/computer.jpg">
        <p class="main-title">{{$t("Info.step3.title1")}}</p>
      </div>
      <p class="or">{{$t("Info.step3.title2")}}</p>
      <div class="trigger-area" @click="method=2">
        <img src="@/assets/img/info/camera.jpg">
        <p class="main-title">{{$t("Info.step3.title3")}}</p>
      </div>
    </div>
    <!-- 上传图片 -->
    <div v-show="method==1">
      <image-upload @onCancel="onCancel" @onFinish="onCropperFinish"></image-upload>
      <div class="handle">
        <!-- next -->
        <button class="btn-primary" @click="goNext('editAvartar')" v-if="editAvartar">{{$t("Info.button2")}}</button>
        <button class="btn-primary" @click="goNext" v-else>{{$t("Info.button1")}}</button>
        <!-- back -->
        <a @click="onCancel">{{$t("Info.button4")}}</a>
      </div>
    </div>
    <!-- 视频拍照 -->
    <div v-show="method==2">
      <camera-upload type="takePhoto" @onCancel="onCancel" @onFinish="onCropperFinish" :editAvartar="editAvartar||false"></camera-upload>
      <div class="handle">
        <!-- next -->
        <button
          class="btn-primary"
          @click="goNext('editAvartar')"
          v-if="editAvartar"
        >{{$t("Info.button2")}}</button>
        <button class="btn-primary" @click="goNext" v-else>{{$t("Info.button1")}}</button>
        <!-- back -->
        <a @click="onCancel">{{$t("Info.button4")}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import ImageUpload from "@/components/UI/ImageUpload";
import CameraUpload from "@/components/UI/CameraUpload";
import { Encrypt } from "@/assets/utils/secret.js";
export default {
  name: "Step3",
  components: { ImageUpload, CameraUpload },
  props: ["editAvartar"],
  data() {
    return {
      method: 0,
      avatar: null,
      loading: false
    };
  },
  mounted() {
    this.$parent.step = 3;
  },
  methods: {
    goNext(type) {
      if (this.avatar) {
        this.loading = true;
        var obj = Encrypt({
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token
        });
        var data = new FormData();
        data.append("sign", obj.sign);
        data.append("data", obj.data);
        data.append("head_img", this.avatar);
        var headers = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        this.$ajax
          .post(this.$store.state.host + "fileUpLoad/upload", data, headers)
          .then(res => {
            console.log(res.data);
            this.loading = false;
            if (res.data.code == 0) {
              console.log(type+"type")
              if (type == "editAvartar"){
                this.$message({message:this.$t("UserDetail.prompt2"),type:'success'});
                this.$parent.editAvartar=false;
              }else this.$router.push("/info/step4");
            } else {
              this.$message(res.data.msg);
            }
          });
      } else {
        this.$message(this.$t("Info.step3.prompt1"));
      }
    },
    onCancel(data) {
      this.method = 0;
    },
    onCropperFinish(data) {
      console.log(data);
      this.avatar = data;
    }
  }
};
</script>

<style lang="less" scoped>
.step3 {
  text-align: center;
  color: #b9b9b9;
  .area {
    width: 260px;
    height: 260px;
    background: #f6f6f6;
    color: #b9b9b9;
    cursor: pointer;
    margin: 0 auto;
    border-radius: 10px;
  }
  .camera-upload {
    margin: 0 auto;
  }
  p.or {
    line-height: 50px;
  }
  .handle button {
    margin: 30px auto;
    width: 200px;
  }
}
</style>
