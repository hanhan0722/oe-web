<template>
  <div class="chat-message" ref="chatMessage">
    <div
      class="x-message-group"
      v-for="(item,idx) in chats"
      :class="item.from==user.id?'x-message-right':''"
      v-if="item.from==user.id||item.to==user.id"
    >
      <div class="x-message-time">{{item.timeStr}}</div>
      <div class="x-message-content">
        <div class="x-message-user">
          <img
            :src="target.avatar?imageHost+target.avatar:'../../../static/img/avatar.png'"
            v-if="item.from==target.id"
            :onerror="$store.state.defaultAvatar"
          >
          <img
            :src="user.avatar?imageHost+user.avatar:'../../../static/img/avatar.png'"
            v-else-if="item.from==user.id"
            :onerror="$store.state.defaultAvatar"
          >
        </div>
        <!-- 图片消息 -->
        <div class="x-message-img" v-if="item.fileType=='image'">
          <img :src="item.url" style="maxWidth:320px">
        </div>
        <div v-else>
          <div class="x-message-text-wrapper">
            <i class="x-message-arrow"></i>
            <p class="x-message-text" v-html="item.data"></p>
          </div>
        </div>
      </div>
      <!-- 翻译 -->
      <div
        class="x-message-text-wrapper translate-message"
        v-if="item.from!=user.id"
        v-show="translate && messages[target.id][idx] && messages[target.id][idx].translate && messages[target.id][idx].translate!=item.data"
      >
        <p class="x-message-text">{{messages[target.id][idx]&&messages[target.id][idx].translate}}</p>
      </div>
    </div>
    <!-- 翻译按钮 -->
    <button class="btn-default btn-translate" v-show="!translate" @click="changeTranslate">
      <i class="icon-translate-active"></i>
      {{$t("OeChat.button1")}}
    </button>
    <button class="btn-grad-blue btn-translate" v-show="translate" @click="changeTranslate">
      <i class="icon-translate-default"></i>
      {{$t("OeChat.button1")}}
    </button>
  </div>
</template>
<script>
import emoji from "@/config/emoji";
import WebIM from "@/config/WebIM";
import { formatDate } from "@/assets/utils/public";
import { Decrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name: "ChatMessage",
  props: ["target"],
  data() {
    return {
      messages: {},
      translate: false,
      chats: []
    };
  },
  watch: {
    chats(val) {
      for (let i = 0; i < val.length; i++) {
        if (val[i].fileType != "image") {
          val[i].sourceMsg = val[i].data;
          val[i].data = this.renderTxt(val[i].data);
        }
      }
      this.$nextTick(() => {
        this.$parent.scrollToBottom();
      });
    },
    target: {
      handler(val) {
        val && val.id && (this.chats =
            this.$store.getters.GET_IM_CHART_DIALOG_GROUP_MESSAGE(val.id) ||[]);
      },
      deep: true,
      immediate: true
    },
    groupMessageMap: {
      handler(val) {
        for (var i in val) {
          this.messages[i] = this.messages[i] || [];
          this.$set(this.messages, i, this.messages[i]);
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    rosterList() {
      return this.$store.getters.GET_IM_CHART_ROSTERLIST || [];
    },
    user() {
      return this.$store.state.userInfo;
    },
    imageHost() {
      return this.$store.state.imageHost;
    },
    groupMessageMap() {
      return this.$store.state.im.groupMessageMap;
    }
  },
  mounted() {},
  methods: {
    renderTxt(txt) {
      let rnTxt = [];
      let match = null;
      const regex = /(\[.*?\])/g;
      let start = 0;
      let index = 0;
      while ((match = regex.exec(txt))) {
        index = match.index;
        if (index > start) {
          rnTxt.push(txt.substring(start, index));
        }
        if (match[1] in emoji.map) {
          const v = emoji.map[match[1]];
          rnTxt.push(
            "<img key=" +
              WebIM.conn.getUniqueId() +
              ' width="20" height="20" style="vertical-align:-4px;padding:0 1px;" src="' +
              `${emoji.path}${v}` +
              '" />'
          );
        } else {
          rnTxt.push(match[1]);
        }
        start = index + match[1].length;
      }
      rnTxt.push(txt.substring(start, txt.length));
      return rnTxt.join("");
    },
    changeTranslate() {
      this.translate = !this.translate;
      if (this.translate) {
        var lang = this.$store.state.lang == "en" ? "en" : "zh";
        var translateArr = [];
        this.chats.map((item, index, arr) => {
          if (item.to == this.user.id) {
            translateArr.push({
              src: item.data ? item.data.replace(/(\<.*?\>)/g, "") : "",
              to: lang
            });
          }
        });
        console.log(this.chats);
        this.$set(this.messages, this.target.id, this.chats.slice(0));
        this.onTranslate(translateArr, data => {
          console.log(data.result);
          for (var i = 0; i < data.result.length; i++) {
            for (var j = 0; j < this.messages[this.target.id].length; j++) {
              if (
                data.result[i].trans_result &&
                this.messages[this.target.id][j].data.replace(
                  /(\<.*?\>)/g,
                  ""
                ) == data.result[i].trans_result[0].src
              ) {
                this.$set(
                  this.messages[this.target.id][j],
                  "translate",
                  data.result[i].trans_result[0].dst
                );
              }
            }
          }
          this.$set(
            this.messages,
            this.target.id,
            this.messages[this.target.id]
          );
        });
      }
    },
    onTranslate(arr, cb) {
      if (Array.isArray(arr) && arr.length > 0) {
        //请求翻译接口
        this.$ajax(
          PostData(this.$store.state.host + "translate/bulkTeanslate", {
            id: this.user.id,
            part: arr
          })
        ).then(res => {
          if (res.data.code == 0) {
            var body = JSON.parse(Decrypt(res.data.body));
            console.log(body);
            typeof cb == "function" && cb(body);
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
@imgPath: "../../../assets/img/chat/";
.x-message-group {
  overflow: hidden;
  padding-top: 6px;
  font-size: 14px;
  line-height: 1.5;

  .x-message-content {
    overflow: hidden;
    .x-message-user {
      float: left;
      width: 35px;
      height: 35px;
      margin: 0 4px;
      border-radius: 50%;
      vertical-align: top;

      img {
        display: block;
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .x-message-img {
      float: left;
      width: auto;
      max-width: 70%;
    }
  }
  .translate-message {
    display: block;
    margin: 5px 8px 5px 50px !important;
  }
  .x-message-text-wrapper {
    float: left;
    position: relative;
    width: auto;
    max-width: 70%;
    margin: 0 8px;
    padding: 6px 10px;
    background: rgba(247, 247, 247, 1);
    border-radius: 10px;

    .x-message-arrow {
      position: absolute;
      top: 50%;
      left: -18px;
      width: 0;
      height: 0;
      margin-top: -10px;
      border-width: 10px;
      border-color: transparent #f7f7f7 transparent transparent;
      border-style: solid;
    }

    .x-message-text {
      color: #333;
      > img {
        width: 20px;
        height: 20px;
        vertical-align: -4px;
      }
    }
  }
  .x-message-time {
    margin: 6px 0;
    font-size: 12px;
    color: #cacaca;
    text-align: center;
  }

  &.x-message-right {
    .x-message-content {
      overflow: hidden;
      .x-message-user {
        float: right;
      }

      .x-message-text-wrapper {
        float: right;
        background: #ea486d;
        .x-message-arrow {
          left: auto;
          right: -18px;
          border-color: transparent transparent transparent #ea486d;
        }
        .x-message-text {
          color: #fff;
        }
      }
      .x-message-img {
        float: right;
      }
    }
  }
}
.chat-message {
  padding-bottom: 44px;
}
.btn-translate {
  position: absolute;
  right: 16px;
  bottom: 190px;
  &.btn-default {
    color: #0596ff;
  }
}
.icon-translate-default {
  .icon(20px, 20px, url("@{imgPath}/icon_translate_default.png"));
  margin-right: 16px;
}
.icon-translate-active {
  .icon(20px, 20px, url("@{imgPath}/icon_translate_active.png"));
  margin-right: 16px;
}
</style>

