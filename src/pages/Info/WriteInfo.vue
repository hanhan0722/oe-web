<template>
  <div class="write-info content-center">
    <ul :class="'step-list clear '+($store.state.lang=='en'?'en':'')">
      <li :class="step==1?'active':''">
        <i class="icon-file-active" v-show="step==1"></i>
        <i class="icon-file-default" v-show="step!=1"></i>
        <span>{{$t("Info.title1")}}</span>
        <img src="@/assets/img/user/icon_right.png">
      </li>
      <li :class="step==2?'active':''">
        <i class="icon-identity-active" v-show="step==2"></i>
        <i class="icon-identity-default" v-show="step!=2"></i>
        <span>{{$t("Info.title2")}}</span>
        <img src="@/assets/img/user/icon_right.png">
      </li>
      <li :class="step==3?'active':''">
        <i class="icon-camera-active" v-show="step==3"></i>
        <i class="icon-camera-default" v-show="step!=3"></i>
        <span>{{$t("Info.title3")}}</span>
        <img src="@/assets/img/user/icon_right.png">
      </li>
      <li :class="step==4?'active':''">
        <i class="icon-video-active" v-show="step==4"></i>
        <i class="icon-video-default" v-show="step!=4"></i>
        <span>{{$t("Info.title4")}}</span>
      </li>
    </ul>
    <div class="info-content" v-loading="loading">
      <router-view ref="child" :userInfo="$store.state.userInfo"></router-view>
      <div class="handle">
        <!-- next -->
        <button class="btn-primary" @click="goNextStep" v-show="step==1">{{$t("Info.button1")}}</button>
        <!-- complete -->
        <button class="btn-primary" @click="goNextStep" v-show="step==4">{{$t("Info.button2")}}</button>
        <!-- skip -->
        <a v-if="step==4" @click="goNextStep('skip')">{{$t("Info.button3")}}</a>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Encrypt,
  PostData,
  Decrypt,
  AesEncrypt
} from "@/assets/utils/secret.js";
export default {
  name: "WriteInfo",
  data() {
    return {
      step: 1,
      video: null,
      loading: false
    };
  },
  mounted() {
    if (this.$store.state.userInfo.userstep >= 4) {
      this.$router.push("/");
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.step < 5) {
      this.$message(this.$t("Info.prompt3"));
    } else {
      next();
    }
  },
  methods: {
    getUserInfo(cb) {
      this.$ajax(
        PostData(this.$store.state.host + "user/getUserInfo", {
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token
        })
      ).then(res => {
        var body = JSON.parse(Decrypt(res.data.body));
        console.log(body);
        if (res.data.code == 0) {
          var obj = body.user;
          obj.iLikeUnreadCount = body.iLikeUnreadCount;
          obj.likeMeUnreadCount = body.likeMeUnreadCount;
          obj.userAllowChatNum = body.userAllowChatNum;
          obj.visitMeUnreadCount = body.visitMeUnreadCount;
          obj.token = body.token;
          sessionStorage.setItem("user", AesEncrypt(JSON.stringify(obj)));
          this.$store.commit(
            "newUserInfo",
            JSON.parse(Decrypt(sessionStorage.getItem("user")))
          );
          console.log(JSON.parse(Decrypt(sessionStorage.getItem("user"))));
          typeof cb == "function" && cb();
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    goNextStep(skip) {
      switch (this.step) {
        case 1:
          for (var i in this.$refs.child.step1) {
            console.log(this.$refs.child.step1);
            if (this.$refs.child.step1[i] === "") {
              this.$refs.child.showError = true;
              console.log(i);
              return false;
            }
          }
          if (this.$refs.child.unameL > 20 || this.$refs.child.jobL > 8) {
            this.$refs.child.showError = true;
            return false;
          }
          this.loading = true;
          this.$refs.child.step1.birthday = new Date(
            this.$refs.child.step1.birthday
          ).getTime();
          console.log("_______");
          console.log(this.$refs.child.step1);
          this.$ajax(
            PostData(
              this.$store.state.host + "user/updateUserDetail",
              this.$refs.child.step1
            )
          ).then(res => {
            console.log(res);
            console.log(res.data);
            this.loading=false;
            if (res.data.code == 0) {
              this.getUserInfo(() => {
                setTimeout(() => {
                  this.$router.push("/info/step2");
                }, 1000);
              });
            } else {
              this.$message(res.data.msg);
            }
          });
          break;
        case 4:
          this.loading = true;
          //用户点击完成
          if (skip !== "skip") {
            if (this.$refs.child.video) {
              var obj = Encrypt({
                id: this.$store.state.userInfo.id,
                token: this.$store.state.userInfo.token
              });
              var data = new FormData();
              data.append("video", this.$refs.child.video);
              data.append("sign", obj.sign);
              data.append("data", obj.data);
              var headers = {
                headers: { "Content-Type": "multipart/form-data" }
              };
              this.$ajax
                .post(
                  this.$store.state.host + "fileUpLoad/uploadVideo",
                  data,
                  headers
                )
                .then(res => {
                  console.log(res.data);
                  if (res.data.code == 0) {
                    this.$message({ message: this.$t("Info.prompt4"),type:"success" });
                    this.step = 5;
                    this.getUserInfo(() => {
                      setTimeout(() => {
                        this.$router.push("/");
                      }, 1000);
                    });
                  } else {
                    this.loading = false;
                    this.$message(res.data.msg);
                  }
                });
            } else {
              this.loading = false;
              this.$message(this.$t("Info.prompt1"));
            }
          } else {
            //用户点击跳过
            this.$ajax(
              PostData(this.$store.state.host + "fileUpLoad/uploadVideo", {
                id: this.$store.state.userInfo.id,
                token: this.$store.state.userInfo.token,
                skip: 1
              })
            ).then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.$message({ message: this.$t("Info.prompt4"),type:"success"  });
                this.step = 5;
                this.getUserInfo(() => {
                  setTimeout(() => {
                    this.$router.push("/");
                  }, 1000);
                });
              } else {
                this.loading = false;
                this.$message(res.data.msg);
              }
            });
          }
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.write-info {
  .step-list,
  .info-content {
    background: #fff;
    border-radius: 10px;
    padding: 24px 0;
  }
  .step-list {
    margin: 16px 0;
    display: flex;
    width: 100%;
    li {
      width: 25%;
      box-sizing: border-box;
      font-size: 14px;
      color: #b9b9b9;
      padding-left: 50px;
      &.active {
        color: @oePink;
        font-weight: bold;
      }
      img {
        width: 24px;
        height: 24px;
        float: right;
        margin: 16px 0;
      }
    }
    &.en > li {
      padding-left: 25px;
    }
  }
  .info-content {
    padding: 24px 32px;
    margin-bottom: 20px;
  }
}
.icon-file-active {
  .icon-sprite(57px, 57px, -561px, -212px);
}
.icon-file-default {
  .icon-sprite(57px, 57px, -562px, -142px);
}
.icon-identity-active {
  .icon-sprite(57px, 57px, -665px, -212px);
}
.icon-identity-default {
  .icon-sprite(57px, 57px, -665px, -142px);
}
.icon-video-active {
  .icon-sprite(57px, 57px, -769px, -212px);
}
.icon-video-default {
  .icon-sprite(57px, 57px, -769px, -142px);
}
.icon-camera-active {
  .icon-sprite(57px, 57px, -873px, -212px);
}
.icon-camera-default {
  .icon-sprite(57px, 57px, -873px, -142px);
}
</style>
<style lang="less">
.write-info {
  .handle {
    text-align: center;
  }
  a {
    text-decoration: underline;
  }
  .btn-primary {
    width: 200px;
    margin: 60px auto 30px auto;
  }
}
</style>
