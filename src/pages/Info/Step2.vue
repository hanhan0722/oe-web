<template>
  <div class="step2" v-loading="loading">
    <div class="photo-front clear">
      <image-upload class="lf" :noCropper="true" id="file1" @onChange="onImageChange"></image-upload>
      <!-- 关于隐私安全声明 -->
      <div class="upload-prompt lf">
        <div class="prompt-title">
          <img src="@/assets/img/info/icon_success.jpg">
          <p class="main-title">{{$t("Info.step2.title1")}}</p>
        </div>
        <p>{{$t("Info.step2.title2")}}</p>
        <!-- 姓名和身份证号 -->
        <el-form :model="form" :rules="rules" ref="form" label-width="80px" class="card-info">
          <el-form-item :label="$t('Info.step1.title1')" prop="idcard_name">
            <el-input
              v-model="form.idcard_name"
              style="width:200px"
              clearable
              :placeholder="$t('Info.step1.placeholder1')"
            ></el-input>
          </el-form-item>
          <el-form-item :label="$t('Info.step2.title6')" prop="idcard">
            <el-input
              v-model="form.idcard"
              style="width:200px"
              clearable
              :placeholder="$t('Info.step2.placeholder1')"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="photo-back clear">
      <image-upload class="lf" :noCropper="true" id="file2" @onChange="onImageChange"></image-upload>
      <!-- 请务必按照样例上传身份证、护照或绿卡 -->
      <div class="upload-prompt lf">
        <p class="main-title">{{$t("Info.step2.title3")}}</p>
        <ul>
          <li>
            <img src="@/assets/img/info/demo1.jpg">
            <p>{{$t("Info.step2.title4")}}</p>
          </li>
          <li>
            <img src="@/assets/img/info/demo2.jpg">
            <p>{{$t("Info.step2.title5")}}</p>
          </li>
        </ul>
      </div>
    </div>
    <div class="handle">
      <!-- next -->
      <button class="btn-primary" @click="goNext">{{$t("Info.button1")}}</button>
      <!-- skip -->
      <a @click="goNext('skip')">{{$t("Info.step2.button")}}</a>
    </div>
  </div>
</template>

<script>
import ImageUpload from "@/components/UI/ImageUpload";
import { computeLength } from "@/assets/utils/public.js";
import { Encrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name: "Step2",
  components: { ImageUpload },
  data() {
    var validateName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("Info.step2.prompt1")));
      }else if(computeLength(value)>20){
        return callback(new Error(this.$t("Info.step1.prompt1")));
      }else{
        callback()
      }
    };
    var validateID = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("Info.step2.prompt2")));
      }else{
        callback()
      }
    };
    return {
      form: {
        idcard_name: "",
        idcard: "",
        loading: false
      },
      file1: null,
      file2: null,
      rules: {
        idcard_name: [
          { required: true, validator: validateName, trigger: "blur" }
        ],
        idcard: [{ required: true, validator: validateID, trigger: "blur" }]
      },
      loading: false
    };
  },
  mounted() {
    this.$parent.step = 2;
  },
  methods: {
    onImageChange(data) {
      console.log(data);
      this[data.id] = data.file;
    },
    goNext(skip) {
      //用户点击下一步
      if (skip !== "skip") {
        this.$refs.form.validate(valid => {
          if (!valid) {
            return false;
          }
          if (!this.file1 || !this.file2) {
            this.$message(this.$t("Info.step2.prompt3"));
            return false;
          }
          this.loading = true;
          var obj = Encrypt({
            id: this.$store.state.userInfo.id,
            token: this.$store.state.userInfo.token,
            idcard: this.form.idcard,
            idcard_name: this.form.idcard_name
          });
          var data = new FormData();
          data.append("sign", obj.sign);
          data.append("data", obj.data);
          data.append("file1", this.file1);
          data.append("file2", this.file2);
          var headers = {
            headers: { "Content-Type": "multipart/form-data" }
          };
          this.$ajax
            .post(
              this.$store.state.host + "authInfo/identityProve",
              data,
              headers
            )
            .then(res => {
              console.log(res.data);
              this.loading = false;
              if (res.data.code == 0) {
                this.$router.push("/info/step3");
              } else {
                this.$message(res.data.msg);
              }
            });
        });
      } else {
        //用户点击跳过
        this.loading = true;
        this.$ajax(
          PostData(this.$store.state.host + "authInfo/identityProve", {
            id: this.$store.state.userInfo.id,
            token: this.$store.state.userInfo.token,
            skip: 1
          })
        ).then(res => {
          console.log(res.data);
          this.loading = false;
          if (res.data.code == 0) {
            this.$router.push("/info/step3");
          } else {
            this.$message(res.data.msg);
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.step2 {
  .upload-prompt {
    box-sizing: border-box;
    width: calc(100% - 260px);
    .card-info {
      width: 280px;
      margin: 20px auto;
      line-height: 32px;
      p:first-child {
        margin-bottom: 12px;
      }
    }
  }
  .photo-front {
    margin-bottom: 25px;
    .prompt-title {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0;
      & + p {
        display: block;
        width: 280px;
        margin: 0 auto;
        line-height: 20px;
      }
    }
  }
  .photo-back {
    text-align: center;
    ul {
      li {
        display: inline-block;
        &:first-child {
          margin-right: 40px;
        }
        img {
          border-radius: 6px;
          margin: 16px 0;
        }
      }
    }
  }
}
</style>
<style lang="less">
.step2 {
  .el-form-item__error {
    padding-left: 10px;
  }
  .el-form-item__label {
    font-weight: bold;
  }
  .el-input input {
    font-size: 12px;
    height: 32px;
  }
  .el-input__inner,
  .el-input__icon {
    line-height: 32px;
  }
  .el-input--suffix .el-input__inner,
  .el-range-editor.el-input__inner {
    height: 32px;
  }
}
</style>
