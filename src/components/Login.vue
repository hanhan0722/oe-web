<template>
  <div class="login">
    <div class="shadow-fixed" v-show="showLogin" v-loading="loading">
      <div class="modal" :style="{height:$store.state.lang=='en'?'420px':'380px'}">
        <i class="icon-close" @click.stop="showLogin=false" v-show="elem!='registerSuccess'"></i>
        <div v-show="elem=='login'">
          <ul class="tab-list clear">
            <li :class="current==0?'info-title':''" @click.stop="current=0">
              <div>
                {{$t("Login.title1")}}
                <div></div>
              </div>
            </li>
            <li :class="current==1?'info-title':''" @click.stop="current=1">
              <div>
                {{$t("Login.title2")}}
                <div></div>
              </div>
            </li>
          </ul>
          <!-- 注册 -->
          <div v-show="current==0" class="register-box">
            <el-form :model="registerForm" :rules="registerRules" ref="registerForm">
              <el-form-item prop="uname">
                <el-input
                  v-model="registerForm.uname"
                  :placeholder="$t('Login.placeholder6')"
                  clearable
                  @input="onUnameInput('register')"
                ></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="registerForm.code"
                  :placeholder="$t('Login.placeholder2')"
                  class="lf"
                  style="width:140px"
                  clearable
                ></el-input>
                <input
                  type="button"
                  :class="(regGetCode?'btn-grad-blue':'btn-disabled')+' rt'"
                  :disabled="!regGetCode"
                  @click="getCode('register')"
                  :value="$t('Login.button1')+(regCodeTime==60?'':' '+regCodeTime+'s')"
                >
              </el-form-item>
              <el-form-item prop="upwd">
                <el-input
                  v-model="registerForm.upwd"
                  :placeholder="$t('Login.placeholder3')"
                  show-password
                ></el-input>
              </el-form-item>
            </el-form>
            <button class="btn-grad-pink" @click="submitForm('registerForm')">{{$t("Login.title1")}}</button>
            <p class="register-agreement clear">
              <img
                src="@/assets/img/layout/icon_radio_active.png"
                v-show="agree"
                @click="agree=!agree"
              >
              <img
                src="@/assets/img/layout/icon_radio_default.png"
                v-show="!agree"
                @click="agree=!agree"
              >
              <span>
                {{$t("Login.title3")}}
                <a
                  target="_blank"
                  :href="'http://app.ouimeet.com//news/getNews?type=3&app_language='+($store.state.lang=='en'?'en':'zh-Hans')"
                >{{$t("Login.title4")}}</a>
              </span>
            </p>
            <p class="prompt-error" v-show="!agree && showError">{{$t("Login.prompt1")}}</p>
          </div>
          <!-- 登录 -->
          <div
            v-show="current==1"
            class="login-box"
            @keyup.enter="loginMethod=='password'?submitForm('loginForm1'):submitForm('loginForm2')"
          >
            <el-form
              :model="loginForm1"
              :rules="loginRules1"
              ref="loginForm1"
              v-show="loginMethod=='password'"
            >
              <el-form-item prop="uname">
                <el-input
                  v-model="loginForm1.uname"
                  :placeholder="$t('Login.placeholder6')"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="upwd">
                <el-input
                  v-model="loginForm1.upwd"
                  :placeholder="$t('Login.placeholder4')"
                  show-password
                ></el-input>
              </el-form-item>
            </el-form>
            <el-form
              :model="loginForm2"
              :rules="loginRules2"
              ref="loginForm2"
              v-show="loginMethod=='phone'"
            >
              <el-form-item prop="uname">
                <el-input
                  v-model="loginForm2.uname"
                  :placeholder="$t('Login.placeholder6')"
                  @input="onUnameInput('login')"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model="loginForm2.code"
                  :placeholder="$t('Login.placeholder2')"
                  class="lf"
                  style="width:140px"
                  clearable
                ></el-input>
                <input
                  type="button"
                  :class="(loginGetCode?'btn-grad-blue':'btn-disabled')+' rt'"
                  :disabled="!loginGetCode"
                  @click="getCode('login')"
                  :value="$t('Login.button1')+(loginGetCode==60?'':' '+loginCodeTime+'s')"
                >
              </el-form-item>
            </el-form>
            <!-- 忘记密码 -->
            <a @click="changeElem('findUpwd')" class="rt">{{$t("Login.button2")}}</a>
            <!-- 登录 -->
            <button
              class="btn-grad-pink"
              @click="loginMethod=='password'?submitForm('loginForm1'):submitForm('loginForm2')"
            >{{$t("Login.title2")}}</button>
            <!-- 使用手机验证码登录 -->
            <a @click="loginMethod='phone'" v-show="loginMethod=='password'">{{$t("Login.button7")}}</a>
            <!-- 使用账号密码登录 -->
            <a @click="loginMethod='password'" v-show="loginMethod=='phone'">{{$t("Login.button8")}}</a>
          </div>
        </div>
        <!-- 找回密码 -->
        <div v-show="elem=='findUpwd'" class="find-upwd">
          <p class="main-title">{{$t("Login.button5")}}</p>
          <el-form :model="findForm" :rules="findRules" ref="findForm">
            <el-form-item prop="uname">
              <el-input
                v-model="findForm.uname"
                :placeholder="$t('Login.placeholder6')"
                clearable
                @input="onUnameInput('findUpwd')"
              ></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <el-input
                v-model="findForm.code"
                :placeholder="$t('Login.placeholder2')"
                class="lf"
                style="width:140px"
                clearable
              ></el-input>
              <input
                type="button"
                :class="(findGetCode?'btn-grad-blue':'btn-disabled')+' rt'"
                :disabled="!findGetCode"
                @click="getCode('findUpwd')"
                :value="$t('Login.button1')+(findCodeTime==60?'':' '+findCodeTime+'s')"
              >
            </el-form-item>
            <el-form-item prop="upwd">
              <el-input
                v-model="findForm.upwd"
                :placeholder="$t('Login.placeholder5')"
                show-password
              ></el-input>
            </el-form-item>
          </el-form>
          <button class="btn-grad-pink" @click="submitForm('findForm')">{{$t("Login.button3")}}</button>
          <a @click="changeElem('login',1)">{{$t("Login.button4")}}</a>
        </div>
        <!-- 注册成功 -->
        <div v-show="elem=='registerSuccess'" class="register-success">
          <p class="title-success">
            <img src="@/assets/img/layout/icon_radio_active.png">
            <span>{{$t("Login.title6")}}</span>
          </p>
          <p>{{$t("Login.title5")}}</p>
          <button class="btn-grad-pink" @click="goInfo">{{$t("Login.button6")}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  AesEncrypt,
  Encrypt,
  Decrypt,
  PostData
} from "@/assets/utils/secret.js";
import bus from "@/assets/utils/bus.js";
export default {
  name: "Login",
  data() {
    /* 国外用户可以邮箱注册，国内不可以 */
    // var validatePhone = (rule, value, callback) => {
    //   if (!value) {
    //     return callback(new Error(this.$t("Login.prompt2")));
    //   }
    //   setTimeout(() => {
    //     if (
    //       !/^[0-9]*$/.test(value) &&
    //       !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)
    //     ) {
    //       callback(new Error(this.$t("Login.prompt5")));
    //     } else {
    //       callback();
    //     }
    //   }, 10);
    // };
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t("Login.prompt8")));
      } else if (value && !/^[0-9]*$/.test(value)) {
        callback(new Error(this.$t("Layout.prompt4")));
      } else {
        callback();
      }
    };
    var validatePhoneNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("Login.prompt8")));
      }
      setTimeout(() => {
        if (!/^[0-9]*$/.test(value)) {
          callback(new Error(this.$t("Login.prompt9")));
        } else {
          callback();
        }
      }, 10);
    };
    var validateCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("Login.prompt3")));
      } else {
        callback();
      }
    };
    var validateUpwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t("Login.prompt4")));
      }
      setTimeout(() => {
        if (!/^([a-z0-9\.\@\!\#\$\%\^\&\*\(\)]){6,20}$/i.test(value)) {
          callback(new Error(this.$t("Login.prompt6")));
        } else {
          callback();
        }
      }, 10);
    };
    return {
      current: 0,
      elem: "login", //显示元素，登录注册："login",找回密码："findUpwd"，注册成功："registerSuccess"
      agree: true, //是否同意注册协议
      registerForm: {
        uname: "",
        code: "",
        upwd: ""
      },
      registerRules: {
        uname: [{ required: true, validator: validatePhone, trigger: "blur" }],
        code: [{ required: true, validator: validateCode, trigger: "blur" }],
        upwd: [{ required: true, validator: validateUpwd, trigger: "blur" }]
      },
      loginForm1: {
        uname: "",
        upwd: ""
      },
      loginForm2: {
        uname: "",
        code: ""
      },
      loginRules1: {
        uname: [{ required: true, validator: validatePhone, trigger: "blur" }],
        upwd: [{ required: true, validator: validateUpwd, trigger: "blur" }]
      },
      loginRules2: {
        uname: [
          { required: true, validator: validatePhoneNum, trigger: "blur" }
        ],
        code: [{ required: true, validator: validateCode, trigger: "blur" }]
      },
      findForm: {
        uname: "",
        code: "",
        upwd: ""
      },
      findRules: {
        uname: [{ required: true, validator: validatePhone, trigger: "blur" }],
        code: [{ required: true, validator: validateCode, trigger: "blur" }],
        upwd: [{ required: true, validator: validateUpwd, trigger: "blur" }]
      },
      showLogin: false, //显示弹窗
      showError: false, //显示未同意注册协议
      regGetCode: false, //允许获取注册验证码
      regCodeTime: 60, //注册验证码倒计时时间
      findGetCode: false, //允许获取找回密码验证码
      findCodeTime: 60, //找回密码验证码倒计时时间
      loginGetCode: false, //允许获取登录验证码
      loginCodeTime: 60, //登录验证码倒计时时间
      loading: false,
      loginMethod: "password" //登录方式 账号密码登录："password"，手机号登录："phone"
    };
  },
  mounted() {
    var _this = this;
    bus.$on("showLogin", function(data) {
      _this.showLogin = true;
      if (typeof data == "number" && data < 2) {
        _this.current = data;
      }
    });
  },
  methods: {
    changeElem(elem, current) {
      this.elem = elem;
      this.current = current;
    },
    onUnameInput(elem) {
      if (elem == "register") {
        if (/^[0-9]*$/.test(this.registerForm.uname)) {
          this.regGetCode = true;
        } else {
          this.regGetCode = false;
        }
      } else if (elem == "findUpwd") {
        if (/^[0-9]*$/.test(this.findForm.uname)) {
          this.findGetCode = true;
        } else {
          this.findGetCode = false;
        }
      } else if (elem == "login") {
        if (/^[0-9]*$/.test(this.loginForm2.uname)) {
          this.loginGetCode = true;
        } else {
          this.loginGetCode = false;
        }
      }
    },
    getCode(elem) {
      var type =
        elem == "register"
          ? 1
          : elem == "findUpwd"
          ? 3
          : elem == "login"
          ? 5
          : 0;
      var uname =
        elem == "register"
          ? this.registerForm.uname
          : elem == "findUpwd"
          ? this.findForm.uname
          : elem == "login"
          ? this.loginForm2.uname
          : 0;
      console.log(type);
      console.log(uname);
      this.$ajax(
        PostData(this.$store.state.host + "common/sendCode", {
          code_type: type,
          user_name: uname
        })
      ).then(res => {
        console.log(res.data);
        if (res.data.code == 0) {
          this.$message({ message: res.data.msg, type: "success" });
          if (elem == "register") {
            this.regGetCode = false;
            var timer = setInterval(() => {
              if (this.regCodeTime > 1) this.regCodeTime -= 1;
              else {
                this.regCodeTime = 60;
                clearInterval(timer);
                this.onUnameInput("register");
              }
            }, 1000);
          } else if (elem == "findUpwd") {
            this.findGetCode = false;
            var timer = setInterval(() => {
              if (this.findCodeTime > 1) this.findCodeTime -= 1;
              else {
                this.findCodeTime = 60;
                clearInterval(timer);
                this.onUnameInput("findUpwd");
              }
            }, 1000);
          } else if (elem == "login") {
            this.loginGetCode = false;
            var timer = setInterval(() => {
              if (this.loginCodeTime > 1) this.loginCodeTime -= 1;
              else {
                this.loginCodeTime = 60;
                clearInterval(timer);
                this.onUnameInput("login");
              }
            }, 1000);
          }
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    submitForm(formName) {
      this.showError = true;
      console.log(this.$refs[formName]);
      this.$refs[formName].validate(valid => {
        if (!valid) {
          return false;
        } else if (!this.agree) {
          return false;
        } else {
          console.log("submit!!");
          this.loading = true;
          //登录
          if (formName == "loginForm1" || formName == "loginForm2") {
            var data =
              formName == "loginForm1"
                ? {
                    user_name: this.loginForm1.uname,
                    password: this.loginForm1.upwd
                  }
                : {
                    user_name: this.loginForm2.uname,
                    code: this.loginForm2.code
                  };
            this.$ajax(
              PostData(this.$store.state.host + "user/login", data)
            ).then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.showLogin = false;
                var body = JSON.parse(Decrypt(res.data.body));
                this.getUserInfo(body.id, body.token);
              } else {
                this.loading = false;
                this.$message.error(res.data.msg);
              }
            });
            //注册
          } else if (formName == "registerForm") {
            this.$ajax(
              PostData(this.$store.state.host + "user/reg", {
                user_name: this.registerForm.uname,
                password: this.registerForm.upwd,
                code: this.registerForm.code,
                package: "com.ouimeet.web.cn", //com.ouimeet.web.en
                s: localStorage.getItem("s") || "",
                m: localStorage.getItem("m") || ""
              })
            ).then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                this.elem = "registerSuccess";
                var body = JSON.parse(Decrypt(res.data.body));
                console.log(body);
                this.getUserInfo(body.id, body.token);
              } else {
                this.loading = false;
                this.$message.error(res.data.msg);
              }
            });
            //找回密码
          } else if (formName == "findForm") {
            this.$ajax(
              PostData(this.$store.state.host + "user/findpw", {
                user_name: this.findForm.uname,
                password: this.findForm.upwd,
                code: this.findForm.code
              })
            ).then(res => {
              console.log(res.data);
              this.loading = false;
              if (res.data.code == 0) {
                this.$message({
                  message: this.$t("Login.prompt7"),
                  type: "success"
                });
                this.elem = "login";
                this.current = 1;
              } else {
                this.$message.error(res.data.msg);
              }
            });
          }
        }
      });
    },
    goInfo() {
      this.$router.push("/info/step1");
      this.showLogin = false;
      this.elem = "login";
    },
    getUserInfo(id, token) {
      this.$ajax(
        PostData(this.$store.state.host + "user/getUserInfo", {
          id: id,
          token: token
        })
      ).then(res => {
        console.log(res.data);
        var body = JSON.parse(Decrypt(res.data.body));
        console.log(body);
        this.loading = false;
        if (res.data.code == 0) {
          var obj = body.user;
          obj.iLikeUnreadCount = body.iLikeUnreadCount;
          obj.likeMeUnreadCount = body.likeMeUnreadCount;
          obj.userAllowChatNum = body.userAllowChatNum;
          obj.visitMeUnreadCount = body.visitMeUnreadCount;
          obj.token = token;
          sessionStorage.setItem("user", AesEncrypt(JSON.stringify(obj)));
          this.$emit("getUserInfo", true);
          console.log(JSON.parse(Decrypt(sessionStorage.getItem("user"))));
        } else {
          this.$message.error(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login {
  a {
    text-decoration: underline;
  }
  .btn-grad-blue,
  .btn-disabled,
  .btn-grad-pink {
    height: 34px;
  }
  .btn-grad-blue,
  .btn-disabled {
    width: 132px;
    margin: 3px 0;
  }
  .btn-grad-pink {
    width: 100%;
    font-size: 16px;
  }
  .modal {
    background: #fff;
    width: 350px;
    box-sizing: border-box;
    margin: 50vh 0 0 50vw;
    transform: translate(-50%, -50%);
    border-radius: 10px;
    position: relative;
    .tab-list {
      li {
        width: 50%;
        height: 44px;
        line-height: 40px;
        font-size: 16px;
        float: left;
        background: #efefef;
        text-align: center;
        &:first-child {
          border-radius: 10px 0 0 0;
        }
        &:last-child {
          border-radius: 0 10px 0 0;
        }
        &.info-title {
          border-bottom: none;
          margin: 0;
          background: #fff;
          & > div {
            padding: 0;
            margin: 0 auto;
            & > div {
              width: 25px;
              margin: 0 auto;
            }
          }
        }
      }
      li.info-title {
        display: flex;
        & > div {
          border: none;
        }
      }
    }
    .login-box,
    .register-box,
    .find-upwd,
    .register-success {
      padding: 32px;
    }
    .register-box {
      .register-agreement {
        padding: 20px 0 0 10px;
        img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
          width: calc(100% - 25px);
          float: right;
          line-height: 20px;
        }
      }
      .prompt-error {
        padding: 5px 0 5px 20px;
      }
    }
    .login-box {
      text-align: center;
      margin-top: 20px;
      .btn-grad-pink {
        margin: 40px 0 20px 0;
      }
      a {
        margin-bottom: 20px;
      }
    }
    .find-upwd {
      text-align: center;
      .main-title {
        font-size: 16px;
        padding-bottom: 25px;
      }
      .btn-grad-pink {
        margin: 25px 0 15px 0;
      }
    }
    .register-success {
      .title-success {
        font-size: 16px;
        font-weight: bold;
        text-align: center;
        margin: 20px 0 40px 0;
        img {
          width: 20px;
          height: 20px;
          vertical-align: middle;
        }
        span {
          vertical-align: middle;
        }
        & + p {
          font-size: 14px;
          line-height: 24px;
          margin-bottom: 52px;
        }
      }
    }
  }
}
</style>
<style lang="less">
.login {
  z-index: 2001;
  .el-form-item__error {
    padding-left: 20px;
  }
  .el-input input {
    font-size: 12px;
    height: 34px;
  }
  .el-input__inner,
  .el-input__icon {
    line-height: 34px;
  }
  .el-input--suffix .el-input__inner,
  .el-range-editor.el-input__inner {
    height: 34px;
  }
  .el-input--suffix .el-input__inner {
    padding-right: 15px;
  }
}
</style>
