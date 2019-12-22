<template>
  <div class="chat-input">
    <!-- tools -->
    <div class="tools-bar">
      <i class="icon-smile" @click.stop="showEmoji=!showEmoji"></i>
      <label for="uploadImage" class="file-box">
        <i class="icon-file-picture"></i>
        <input type="file" id="uploadImage" class="hide" @change="uploadImg">
      </label>
      <!-- emoji -->
      <div class="emoji-list" v-show="showEmoji">
        <ul>
          <li v-for="(value,key) in emojiObj.map" @click="checkEmoji(value,key)">
            <img :src="emojiObj.path + value">
          </li>
        </ul>
        <div class="triangle"></div>
      </div>
    </div>
    <textarea cols="50" rows="5" id="textarea" v-model="message" ref="textarea"></textarea>
    <div class="clear">
      <!-- send -->
      <button class="btn-grad-pink rt" @click="sendMessage(onSend)">{{$t("OeChat.button2")}}</button>
      <span class="rt">{{$t("OeChat.title3")}}</span>
    </div>
  </div>
</template>
<script>
import emoji from "@/config/emoji";
import Easemob from "@/config/Easemob";
import bus from "@/assets/utils/bus.js";
import { Decrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name: "ChatInput",
  props: ["target"],
  data() {
    return {
      message: "",
      emojiObj: [],
      showEmoji: false
    };
  },
  watch: {
    target: {
      handler: function() {},
      deep: true,
      immediate: true
    }
  },
  computed: {
    im() {
      return this.$store.state.im.im;
    }
  },
  created() {
    let _this = this;
    document.onkeydown = function(e) {
      if (13 == e.keyCode && e.ctrlKey) {
        _this.sendMessage(this.onSend);
      }
    };
  },
  mounted() {
    this.emojiObj = emoji;
    $("body").click(() => {
      this.showEmoji = false;
    });
  },
  methods: {
    sendMessage(cb) {
      //判断用户认证
      if (
        this.$store.state.userInfo.isVip != 1 &&
        this.$store.state.userInfo.authStatus !== 1
      ) {
        this.$message("请您开通认证");
        bus.$emit("showBuy", "identify");
        return false;
      } else {
        //判断用户是不是VIP
        if (this.$store.state.userInfo.isVip == 1) {
          typeof cb == "function" && cb();
          return true;
        } else {
          //不是VIP，已认证用户请求接口获取聊天次数
          this.$ajax(
            PostData(this.$store.state.host + "userChat/chatVerify", {
              id: this.$store.state.userInfo.id,
              toUid: this.target.id
            })
          ).then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              var body = JSON.parse(Decrypt(res.data.body));
              console.log(body); //allowChatNum
              if (body.allowChatNum > 0) {
                typeof cb == "function" && cb();
                return true;
              } else {
                //没有聊天机会
                this.$message(res.data.msg);
                //弹vip
                bus.$emit("showBuy", "vip");
                return false;
              }
            } else {
              //没有聊天机会
              this.$message(res.data.msg);
              //弹vip
              bus.$emit("showBuy", "vip");
              return false;
            }
          });
        }
      }
    },
    onSend() {
      if (this.target) {
        if ($.trim(this.message).length) {
          this.im.sendMessage(this.message, this.target.id);
          this.message = "";
        }
      }else{
        this.$message("OeChat.prompt2")
      }
    },
    checkEmoji(v, k) {
      this.message += k;
      this.showEmoji = false;
      this.$refs.textarea.focus();
    },
    uploadImg(e) {
      if (this.sendMessage()) {
        this.im.sendImageMessage(e.target.id, this.target.id);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.chat-input {
  .tools-bar {
    padding: 5px;
    .icon-smile {
      margin: 5px;
      cursor: pointer;
    }
    .emoji-list {
      position: absolute;
      left: 80px;
      top: 20px;
      &::-webkit-scrollbar {
        width: 4px;
      }
      ul {
        height: 280px;
        width: 300px;
        padding: 5px;
        background: #fff;
        box-shadow: @oeShadow;
        border-radius: 6px;
        overflow-y: auto;
        background: rgba(244, 244, 244, 0.9);
        li {
          display: inline-block;
          cursor: pointer;
          border-radius: 4px;
          &:hover {
            background: rgba(113, 134, 161, 0.1);
          }
          img {
            width: 22px;
            height: 22px;
            margin: 5px;
          }
        }
      }
      .triangle {
        width: 0;
        height: 0;
        border-width: 10px;
        border-style: solid;
        border-color: rgba(244, 244, 244, 0.9) transparent transparent
          transparent;
        margin-left: 150px;
      }
    }
  }
  #textarea {
    width: 500px;
    box-sizing: border-box;
    border: none;
    height: 90px;
  }
  .file-box {
    overflow: hidden;
    position: relative;
    display: inline-block;
    font-size: 18px;
    cursor: pointer;
    vertical-align: -6px;

    input[type="file"] {
      position: absolute;
      top: 0;
      right: 0;
      min-width: 100%;
      min-height: 100%;
      filter: alpha(opacity=0);
      opacity: 0;
      cursor: inherit;
    }
  }
  .clear {
    .btn-grad-pink {
      width: 80px;
      margin: 0 10px;
      & + span {
        line-height: 34px;
        font-size: 10px;
        color: #919191;
      }
    }
  }
}
</style>
