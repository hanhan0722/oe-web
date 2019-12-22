<template>
  <div class="suggest" v-loading="loading">
    <p class="menu-title">
      <span>{{$t("Layout.title5")}}</span>
      <!-- logout -->
      <!-- <button class="btn-primary rt">{{$t("Layout.complaint.button1")}}</button> -->
    </p>
    <p>
      {{$t("Layout.complaint.message1")}}
      <router-link to="/">{{$t("Layout.complaint.message2")}}</router-link>
      {{$t("Layout.complaint.message3")}}
    </p>
    <!-- content -->
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item :label="$t('Layout.complaint.title1')" prop="content">
        <el-input type="textarea" :rows="5" v-model="form.content"></el-input>
      </el-form-item>
      <!-- picture list -->
      <el-form-item :label="$t('Layout.complaint.title2')">
        <br>
        <picture-card max="6" ref="pictureCard"></picture-card>
      </el-form-item>
      <!-- phone -->
      <el-form-item :label="$t('Layout.complaint.title3')" prop="phone">
        <br>
        <el-input
          v-model="form.phone"
          :placeholder="$t('Layout.complaint.placeholder1')"
          clearable
          style="width:200px"
        ></el-input>
      </el-form-item>
      <!-- name -->
      <el-form-item :label="$t('Layout.complaint.title4')" prop="name">
        <br>
        <el-input
          v-model="form.name"
          :placeholder="$t('Layout.complaint.placeholder2')"
          clearable
          style="width:200px"
        ></el-input>
      </el-form-item>
    </el-form>
    <!-- submit -->
    <button class="btn-primary" id="submit" @click="onSubmit">{{$t("Layout.complaint.button2")}}</button>
  </div>
</template>

<script>
import PictureCard from "@/components/UI/PictureCard";
import { computeLength } from "@/assets/utils/public.js";
import { Encrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name: "Suggest",
  components: { PictureCard },
  data() {
    var validateContent = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t("Layout.prompt2")));
      } else if (computeLength(value) > 1000) {
        callback(new Error(this.$t("Layout.prompt3")));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if(!value){
        callback(new Error(this.$t("Login.prompt8")));
      }else if (value && !/^[0-9]*$/.test(value)) {
        callback(new Error(this.$t("Layout.prompt4")));
      } else {
        callback();
      }
    };
    var validateName = (rule, value, callback) => {
      if (computeLength(value) > 20) {
        return callback(new Error(this.$t("Info.step1.prompt1")));
      } else {
        callback();
      }
    };
    return {
      form: {
        content: "",
        phone: "",
        name: ""
      },
      rules: {
        content: [
          { required: true, validator: validateContent, trigger: "blur" }
        ],
        phone: [{required:true, validator: validatePhone, trigger: "blur" }],
        name: [{ validator: validateName, trigger: "blur" }]
      },
      loading: false
    };
  },
  mounted() {
    this.$parent.active = 4;
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate(valid => {
          if (!valid) {
            return false;
          }
          this.loading = true;
          var obj = Encrypt({
            id: this.$store.state.userInfo.id,
            token: this.$store.state.userInfo.token,
            feedback :this.form.content,
            mobile: this.form.phone,
            name: this.form.name
          });
          var data = new FormData();
          data.append("sign", obj.sign);
          data.append("data", obj.data);
          for(var i=0;i<this.$refs.pictureCard.fileList.length;i++){
            data.append("imgurl",this.$refs.pictureCard.fileList[i]);
          }
          var headers = {
            headers: { "Content-Type": "multipart/form-data" }
          };
          this.$ajax
            .post(
              this.$store.state.host + "feedback/userFeedback",
              data,
              headers
            )
            .then(res => {
              console.log(res.data);
              this.loading = false;
              this.$message(res.data.msg);
            });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.suggest {
  a {
    color: @oePink;
    text-decoration: underline;
  }
  .btn-primary {
    height: 24px;
    line-height: 22px;
    margin: 13px 0;
    padding: 0 12px;
  }
  #submit {
    margin: 50px auto 0 auto;
    width: 200px;
    font-size: 14px;
    height: 28px;
  }
}
</style>
<style lang="less">
.suggest {
  line-height: 20px;
  .el-input input {
    font-size: 12px;
    height: 34px;
    border-radius: 6px;
  }
  .el-input__inner,
  .el-input__icon {
    line-height: 34px;
  }
  .el-input--suffix .el-input__inner,
  .el-range-editor.el-input__inner {
    height: 34px;
  }
  .el-form-item__label {
    font-weight: bold;
  }
}
</style>

