<template>
  <div class="oe-chat clear">
    <div class="chat-list lf">
      <div class="chat-title">
        <i class="icon-clock"></i>
        <span>{{$t("OeChat.title1")}}</span>
        <i class="icon-delete" v-if="editList"></i>
        <i class="icon-edit" v-else @click="editList=true"></i>
      </div>
      <div class="chat-content">
        <ul>
          <li
            v-for="(item,idx) in userList"
            :class="idx==current?'current':''"
            @click="changeChat(idx)"
          >
            <div>
              <!-- 新接收到的消息是否当前窗口显示未读消息数 -->
              <el-badge
                :value="current!=idx?($store.getters.GET_IM_CHART_DIALOG_UN_READ_LENGTH(item.id)>0?$store.getters.GET_IM_CHART_DIALOG_UN_READ_LENGTH(item.id):''):''"
                class="user-avatar"
              >
                <img
                  :src="$store.state.imageHost+item.avatar"
                  :onerror="$store.state.defaultAvatar"
                  @click.stop="goDetail(item.id)"
                >
              </el-badge>
              <div>
                <p class="nick-name">
                  <span class="main-title">{{item.nickname}}</span>
                  <!-- 最后一条消息的时间 -->
                  <span
                    class="rt"
                  >{{(groupMessageMap[item.id]&&(groupMessageMap[item.id].length>0))?(groupMessageMap[item.id][groupMessageMap[item.id].length-1].timeStr.split(" ")[0]==new Date().toLocaleDateString()?groupMessageMap[item.id][groupMessageMap[item.id].length-1].timeStr.split(" ")[0]:groupMessageMap[item.id][groupMessageMap[item.id].length-1].timeStr.split(" ")[1]):""}}</span>
                </p>
                <!-- 最后一条消息 -->
                <p>{{$store.getters.GET_IM_CHART_DIALOG_LAST_MESSAGE(item.id)}}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="chat-wrapper lf">
      <div class="chat-title">
        <i class="icon-notification"></i>
        <span>{{$t("OeChat.prompt")}}</span>
      </div>
      <div class="chat-content">
        <div class="message-content" ref="messageView">
          <chat-message :target="target"></chat-message>
        </div>
        <div class="input-area">
          <chat-input :target="target"></chat-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emoji from "@/config/emoji";
import WebIM from "@/config/WebIM";
import { formatDate } from "@/assets/utils/public";
import ChatMessage from "./components/ChatMessage";
import ChatInput from "./components/ChatInput";
import { Decrypt, PostData } from "@/assets/utils/secret.js";
import bus from "@/assets/utils/bus.js";
export default {
  name: "OeChat",
  components: { ChatMessage, ChatInput },
  data() {
    return {
      editList: false,
      current: 0,
      target: {}
    };
  },
  watch: {
    groupMessageMap: {
      handler(val) {
        this.listenMessage(val);
      },
      deep: true
    }
  },
  computed: {
    userList() {
      return this.$store.state.im.chatList;
    },
    groupMessageMap() {
      return this.$store.state.im.groupMessageMap;
    }
  },
  mounted() {
    this.target = this.userList[this.current]||{};
    this.userList.length>0 && this.changeChat(0);
    $(".content").height($(".oe-chat").height() + 50 + "px");
    this.listenMessage(this.groupMessageMap);
  },
  beforeDestroy() {
    $(".content").height("auto");
  },
  methods: {
    listenMessage(val){
      localStorage.setItem("groupMessageMap", JSON.stringify(val));
        var arr = [];
        for (var p of this.userList) {
          arr.push(p.id);
        }
        console.log(arr);
        for (var i in val) {
          //判断用户列表中有没有此用户
          if (typeof Number(i) == "number" && arr.indexOf(Number(i)) == -1) {
            //没有此用户获取用户信息，加入用户列表
            this.$ajax(
              PostData(this.$store.state.host + "user/getAnotherUserInfo", {
                id: this.$store.state.userInfo.id,
                uid: i
              })
            ).then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                var body = JSON.parse(Decrypt(res.data.body));
                console.log(body);
                this.$store.dispatch(
                  "PUSH_IM_CHART_CHATLIST",
                  JSON.parse(JSON.stringify(body.user))
                );
              } else {
                this.$store.dispatch(
                  "SET_IM_CHART_DIALOG_GROUP_ID",
                  i
                );
              }
            });
          }
        }
    },
    changeChat(idx) {
      this.$store.dispatch(
        "SET_IM_CHART_DIALOG_GROUP_ID",
        this.userList[idx].id
      );
      if (idx != this.current) {
        this.current = idx;
        this.target = this.userList[this.current];
      }
      this.$store.dispatch(
        "SET_IM_CHART_DIALOG_GROUP_ID",
        this.userList[this.current].id
      );
    },
    scrollToBottom() {
      this.$refs.messageView.scrollTop = this.$refs.messageView.scrollHeight;
    },
    goDetail(id) {
      this.$router.push({ name: "UserDetail", params: { id: id, type: 0 } });
    }
  }
};
</script>

<style lang="less" scoped>
.oe-chat {
  width: 720px;
  margin: 50px auto;
  position: relative;
  background: rgba(250, 250, 250, 1);
  .chat-content {
    background: #fff;
  }
  .chat-title {
    height: 30px;
    line-height: 30px;
    color: #fff;
    padding: 0 20px;
  }
  .chat-list {
    width: 220px;
    border-right: 1px solid @borderGray;
    box-sizing: border-box;
    .chat-title {
      background: linear-gradient(
        90deg,
        rgba(238, 135, 120, 1),
        rgba(229, 6, 98, 1)
      );
      border-radius: 10px 0px 0px 0px;
    }
    .chat-content {
      height: 500px;
      overflow-y: auto;
      border-radius: 0px 0px 0px 10px;
      box-sizing: border-box;
    }
    ul {
      li {
        color: #929292;
        padding: 0 8px;
        cursor: pointer;
        & > div {
          border-bottom: 1px solid @borderGray;
          padding: 10px 0;
        }
        .user-avatar {
          img {
            width: 50px;
            height: 50px;
            border-radius: 6px;
            vertical-align: middle;
            margin-right: 5px;
          }
          & + div {
            display: inline-block;
            vertical-align: middle;
            width: calc(100% - 60px);
            .nick-name {
              line-height: 21px;
              .main-title {
                display: inline-block;
                color: #404040 !important;
                width: 90px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
            }
            p:last-child {
              margin-top: 5px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              min-height: 18px;
            }
          }
        }
        &.current {
          background: rgba(113, 134, 161, 0.1);
        }
      }
    }
  }
  .chat-wrapper {
    width: 500px;
    .chat-title {
      background: #919191;
      border-radius: 0px 10px 0px 0px;
      text-align: center;
    }
    .chat-content {
      border-radius: 0px 0px 10px 0px;
      position: relative;
    }
    .message-content {
      height: 320px;
      overflow-y: auto;
      border-bottom: 1px solid @borderGray;
      box-sizing: border-box;
      padding: 10px;
    }
    .input-area {
      height: 180px;
      overflow-y: auto;
    }
  }
}
.icon-clock {
  color: #fff;
  cursor: pointer;
  & + span {
    vertical-align: middle;
  }
}
.icon-notification {
  font-size: 16px;
  & + span {
    vertical-align: middle;
  }
}
</style>
<style lang="less">
.oe-chat {
  .el-badge__content.is-fixed {
    right: 30px;
  }
}
</style>
