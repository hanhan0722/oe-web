<template>
  <div class="step4">
    <camera-upload type="recordeVideo" @onRecordeStop="onRecordeStop"></camera-upload>
    <p class="main-title">{{$t("Info.step4.title1")}}</p>
    <ul class="prompt-list">
      <li>{{$t("Info.step4.title2")}}</li>
      <li>{{$t("Info.step4.title3")}}</li>
      <li>{{$t("Info.step4.title4")}}</li>
      <li class="font-primary">{{$t("Info.step4.title5")}}</li>
    </ul>
  </div>
</template>

<script>
import CameraUpload from "@/components/UI/CameraUpload";
export default {
  name: "Step4",
  components: { CameraUpload },
  data() {
    return {};
  },
  mounted() {
    this.$parent.step = 4;
  },
  methods: {
    onRecordeStop(data){
      console.log(data);
      this.video=data;
    }
  },
};
</script>

<style lang="less" scoped>
.step4 {
  .main-title {
    text-align: center;
    margin: 50px 0 30px 0;
  }
  .prompt-list {
    width: 280px;
    margin: 0 auto;
    li {
      list-style: disc outside none;
      margin-bottom: 20px;
      line-height: 20px;
    }
  }
}
</style>
