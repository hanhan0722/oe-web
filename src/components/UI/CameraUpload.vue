<template>
  <div class="camera-upload">
    <div class="trigger-area" @click="openCamera" v-show="!showVideo">
      <img src="@/assets/img/info/camera.jpg">
      <p class="main-title">{{$t("Components.camera_upload.title1")}}</p>
      <p>{{$t("Components.camera_upload.title2")}}</p>
    </div>
    <div v-show="showVideo">
      <video ref="video" :width="editAvartar?500:600" style="background:#000"></video>
      <div v-if="type=='takePhoto'">
        <div class="handle-btn">
          <!-- take photo -->
          <button
            class="btn-default"
            @click="takePhoto"
            style="width:110px"
          >{{$t("Components.camera_upload.button1")}}</button>
        </div>
        <canvas :width="editAvartar?500:600" ref="canvas" style="display:none"></canvas>
        <!-- cropper -->
        <div class="cropper-content">
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
      <div v-else-if="type=='recordeVideo'">
        <button
          :class="(status==0?'':'btn-disabled')+' btn-primary recorde'"
          @click="recordeVideo"
          :disabled="status==1"
        >{{status==0?$t("Components.camera_upload.button2"):$t("Components.camera_upload.button3")+videoTime+"s"}}</button>
        <video ref="recordeVideo" :width="editAvartar?500:600" controls></video>
      </div>
    </div>
  </div>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  name: "CameraUpload",
  props: ["type","editAvartar"],
  components: { VueCropper },
  data() {
    return {
      showVideo: false,
      mediaRecorder: null,
      recorderFile: null,
      mediaStreamTrack: null,
      chunks: [],
      videoSrc: "",
      status: 0,
      videoTime: 3,
      videoFile: null,
      cavasData: null,
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
  beforeDestroy() {
    this.mediaStreamTrack && this.mediaStreamTrack.stop();
  },
  methods: {
    openCamera() {
      this.showVideo = true;
      this.$emit("onCameraChange", this.showVideo);
      var _this = this;
      //媒体对象
      navigator.getMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      window.URL =
        window.URL || window.webkitURL || window.mozURL || window.msURL;
      navigator.getMedia(
        {
          video: true, //使用摄像头对象
          audio: false //不适用音频
        },
        function(stream) {
          _this.mediaRecorder = new window.MediaRecorder(stream);
          _this.mediaStreamTrack = stream.getTracks()[0];
          console.log(_this.mediaRecorder);
          _this.mediaRecorder.ondataavailable = function(e) {
            _this.mediaRecorder.blobs.push(e.data);
            _this.chunks.push(e.data);
          };
          _this.mediaRecorder.blobs = [];

          _this.mediaRecorder.onstop = function(e) {
            _this.recorderFile = new Blob(_this.chunks, {
              type: _this.mediaRecorder.mimeType
            });
            _this.chunks = [];
            _this.onRecordeStop();
          };
          try {
            if (_this.$refs.video.srcObject !== undefined) {
              _this.$refs.video.srcObject = stream;
            } else {
              _this.$refs.video.src =
                (window.URL && window.URL.createObjectURL(stream)) || stream;
            }
          } catch (error) {
            _this.$refs.video.src = window.URL.createObjectURL(stream);
          }
          _this.$refs.video.play();
        },
        function(error) {
          console.log(error);
        }
      );
    },
    takePhoto() {
      var _this = this;
      this.$refs.canvas.height = this.$refs.video.clientHeight;
      var w=this.editAvartar?500:600;
      this.$refs.canvas
        .getContext("2d")
        .drawImage(this.$refs.video, 0, 0, w, this.$refs.video.clientHeight);
      this.$refs.canvas.toBlob(function(blob) {
        let blobFile = new window.File(
          [blob],
          "msr-" + new Date().toISOString().replace(/:|\./g, "-") + ".png",
          {
            type: "image/png"
          }
        );
        _this.option.img = window.URL.createObjectURL(blobFile);
      });
    },
    onCropperFinish() {
      this.$refs.cropper.getCropBlob(data => {
        console.log(data);
        this.option.img = window.URL.createObjectURL(data);
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
      this.showVideo = false;
      this.$emit("onCancel", false);
    },
    recordeVideo() {
      this.status = 1;
      this.mediaRecorder.start();
      console.log(this.mediaRecorder.state);
      var _this = this;
      setTimeout(() => {
        _this.mediaRecorder.stop();
      }, 4000);
      var timer = setInterval(() => {
        if (this.videoTime > 0) this.videoTime -= 1;
        else {
          this.videoTime = 3;
          clearInterval(timer);
        }
      }, 1000);
    },
    onRecordeStop() {
      this.status = 0;
      console.log("recorde end");
      console.log(this.recorderFile);
      this.videoFile = new File(
        [this.recorderFile],
        "msr-" + new Date().toISOString().replace(/:|\./g, "-") + ".mp4",
        {
          type: "video/mp4"
        }
      );
      console.log(this.videoFile);
      if (this.videoFile) {
        this.$refs.recordeVideo.src = window.URL.createObjectURL(
          this.videoFile
        );
        this.$emit("onRecordeStop", this.videoFile);
      } else {
        this.$message(this.$t("Components.camera_upload.prompt"));
      }
    }
  }
};
</script>

<style lang="less" scoped>
.camera-upload {
  video {
    display: block;
    margin: 0 auto;
  }
  .recorde {
    margin: 20px auto;
  }
  .handle-btn {
    button {
      display: inline-block;
      margin: 20px 10px;
      width: 80px;
    }
  }
  .cropper-content {
    margin-top: 20px;
    .cropper {
      width: auto;
      height: 260px;
    }
  }
}
</style>
