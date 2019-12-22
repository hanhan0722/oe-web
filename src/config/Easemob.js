import store from '@/vuex/store'
import { alert, dotData } from '@/config'
import moment from 'moment'
import axios from 'axios'
import { PostData } from "@/assets/utils/secret.js";

export const Easemob = class Easemob {
  // 初始化
  constructor() {
    if (Easemob.instance) {
      return Easemob.instance
    }
    this.WebIM = window.WebIM;
    this.config = window.WebIM.config
    Easemob.instance = this
  }

  // 获取当前时间
  _getTimeString() {
    return moment().format('YYYY-MM-DD HH:mm:ss')
  }

  // 获取连接
  getConnection() {
    if (!this.connection) {
      const Connection = window.WebIM.connection
      this.connection = new Connection({
        isMultiLoginSessions: this.config.isMultiLoginSessions,
        https: typeof this.config.https === 'boolean' ? this.config.https : location.protocol === 'https:',
        url: this.config.xmppURL,
        isAutoLogin: true,
        heartBeatWait: this.config.heartBeatWait,
        autoReconnectNumMax: this.config.autoReconnectNumMax,
        autoReconnectInterval: this.config.autoReconnectInterval,
        apiUrl: this.config.apiURL
      })
    }
    return this.connection
  }

  // 发送时追加信息
  appendMessage(message, className = 'in') {
    message = this.createClassNameAndTime(message, className)
    message = this._setExt(message)
    return message
  }

  // 添加时间和来源
  createClassNameAndTime(message, className = 'in') {
    message.className = className
    message.timeStr = message.timeStr || this._getTimeString()
    message.loginUserName = this.username
    return message
  }

  // 设置追加信息
  _setExt(message) {
    return message
  }

  // 发送已阅回执
  readMessage(message) {
    let ImMessage = this.WebIM.message
    const id = this.getConnection().getUniqueId()
    let msg = new ImMessage('read', id)
    msg.set({
      id: message.id,
      to: message.from
    })
    this.getConnection().send(msg.body)
  }

  // 登陆
  login(username, password) {
    this.getConnection().open({
      apiUrl: this.config.apiURL,
      user: username,
      pwd: password,
      appKey: this.config.appkey
    })

    const that = this

    this.connection.listen({
      onOpened(message) {
        that.username = username
        console.log("login")
        // 获取好友
        this.getRoster({
          success: roster => {
            store.dispatch('SET_IM_CHART_ROSTERLIST', roster)
          },
          error: e => {
            console.log(e)
          }
        })
        // 获取群组
        this.getGroup({
          success: group => {
            store.dispatch('SET_IM_CHART_GROUPLIST', group.data)
          },
          error: e => {
            console.log(e)
          }
        })
      },
      // 文本消息
      onTextMessage(message) {
        message = that.createClassNameAndTime(message)
        console.info(message, 'message', that.config)
        // 处理表情
        if (typeof message.sourceMsg === 'string') {
          Object.keys(that.config.emoConfig.map).forEach(v => {
            message.data = message.sourceMsg = message.sourceMsg.replace(new RegExp(v, 'g'), `<img src="${that.config.emoConfig.path + that.config.emoConfig.map[v]}" />`)
          })
        }
        let type = dotData(message, 'type')
        if (type === 'groupchat') { // 群组消息
          message.groupId = message.to
          if (store.getters.GET_IM_CHART_DIALOG_GROUP_ID !== message.groupId || store.getters.GET_IM_CHART_DIALOG_VISIBLE === false) {
            message.isRead = false
          }
        } else {
          message.groupId = message.from
          message.isRead = false
        }
        store.dispatch('PUSH_IM_CHART_DIALOG_GROUP_MESSAGE', message)
      },
      // 穿透消息
      onCmdMessage(message) {
        message.sourceMsg = '发起对话'
        message.data = '发起对话'
        message = that.createClassNameAndTime(message)
        let type = dotData(message, 'type')
        if (type === 'groupchat') {
          message.from = message.to
        } else {
          message.groupId = message.from
        }
        message.isRead = false
        store.dispatch('PUSH_IM_CHART_DIALOG_GROUP_MESSAGE', message)
      },
      // 图片消息
      onPictureMessage(message) {
        message = that.createClassNameAndTime(message)
        message.fileType = 'image'
        let type = dotData(message, 'type')
        if (type === 'groupchat') { // 群组消息
          message.groupId = message.to
          if (store.getters.GET_IM_CHART_DIALOG_GROUP_ID !== message.groupId || store.getters.GET_IM_CHART_DIALOG_VISIBLE === false) {
            message.isRead = false
          }
        } else {
          message.groupId = message.from
          message.isRead = false
        }
        store.dispatch('PUSH_IM_CHART_DIALOG_GROUP_MESSAGE', message)
      },
      // 音频消息
      onAudioMessage(message) {
        let options = { url: message.url }

        options.onFileDownloadComplete = (response) => {
          message.objectURL = that.WebIM.utils.parseDownloadResponse.call(that.getConnection(), response)
          message = that.createClassNameAndTime(message)
          message.fileType = 'audio'
          let type = dotData(message, 'type')
          if (type === 'groupchat') { // 群组消息
            message.groupId = message.to
            if (store.getters.GET_IM_CHART_DIALOG_GROUP_ID !== message.groupId || store.getters.GET_IM_CHART_DIALOG_VISIBLE === false) {
              message.isRead = false
            }
            store.dispatch('PUSH_IM_CHART_DIALOG_GROUP_MESSAGE', message)
          }
        }

        options.onFileDownloadError = () => {
          // 音频下载失败
        }

        // 通知服务器将音频转为mp3
        options.headers = {
          'Accept': 'audio/mp3'
        }

        that.WebIM.utils.download.call(that.getConnection(), options)
      },
      onEmojiMessage: (message) => {
        let data = message.data
        for (let i = 0, l = data.length; i < l; i++) {
        }
      },
      onError(message) {
        that.handError(message)
      }
    })
    return this.connection
  }

  // 处理报错
  handError(error) {
    let err = 'im报错：'
    console.error(error)
    switch (error.type) {
      case 7:
        break
      case 8:
        alert(err + '多端登录，请重新登录')
        axios(PostData(this.$store.state.host + "user/logout", {
          id: this.$store.state.userInfo.id,
        })).then(res=>{
          if(res.data.code==0){
            sessionStorage.removeItem('user')
            store.commit("newUserInfo", {});
          }
        });
        break
      case 16:
        console.log(err + '服务端关闭了链接')
        break
      case 31:
        alert(err + '处理下行消息出错，try/catch抛出异常')
        window.location.href!="/"&&setTimeout(() => { window.location.href = "/"; }, 3000)
        break
      case 32:
        alert(err + '客户端断线')
        window.location.href!="/"&&setTimeout(() => { window.location.href = "/"; }, 3000)
        break
      case 33:
        console.log(err + '客户端退出登录')
        break
      case 34:
        alert(err + '同一浏览器打开标签页超过上限')
        window.location.href!="/"&&setTimeout(() => { window.location.href = "/"; }, 3000)
        break
      case 402:
        alert(err + '取到token 但是没有连上xmpp server')
        window.location.href!="/"&&setTimeout(() => { window.location.href = "/"; }, 3000)
        break
      default:
        alert(err + JSON.stringify(error))
        window.location.href!="/"&&setTimeout(() => { window.location.href = "/"; }, 3000)
    }
  }

  // 登出
  logout() {
    if (this.connection) {
      this.connection.close()
    }
  }

  // 发送消息
  sendMessage(message, to, config = {
    type: 'txt',
    success() {
      console.log("send success")
    },
    fail() {
    },
    chatType: ''
  }) {
    const that = this
    const id = this.getConnection().getUniqueId()
    const type = config.type
    const chatType = config.chatType
    let msg = new WebIM.message(type, id)
    var option = {
      msg: message,
      to,
      roomType: false,
      ext: {
        source: "web"
      },
      success: (messageId, msgId) => {
        let temp = {
          id: messageId,
          type,
          from: that.username,
          to,
          data: message,
          sourceMsg: message,
          error: false,
          msgId
        }
        if (config.isGroup) {
          temp.groupId = to
        } else {
          temp.groupId = temp.to
        }
        temp = that.appendMessage(temp, 'out')
        store.dispatch('PUSH_IM_CHART_DIALOG_GROUP_MESSAGE', temp)
        config.success()
      },
      fail: () => {
        config.fail()
      }
    }
    if (chatType === 'chatRoom') {
      option.chatType = 'chatRoom'
    }
    option = this._setExt(option)
    msg.set(option)
    if (chatType === 'chatRoom') {
      msg.setGroup('groupchat')
    }
    this.getConnection().send(msg.body)
  }
  /**
   * 发送图片
   * @param input
   * @param to
   */
  sendImageMessage(input, to, config = {
    type: 'img',
    success() {
      console.log("send image success")
    },
    fail() {
    },
    chatType: ''
  }) {
    const conn = this.getConnection()
    const id = conn.getUniqueId() // 生成本地消息id
    const type = config.type
    const chatType = config.chatType
    let ImMessage = this.WebIM.message
    const msg = new ImMessage('img', id) // 创建图片消息
    // var input = document.getElementById('image')  // 选择图片的input
    const file = this.WebIM.utils.getFileUrl(input) // 将图片转化为二进制文件
    const allowType = {
      'jpg': true,
      'gif': true,
      'png': true,
      'bmp': true,
      'jpeg': true
    }
    const that = this
    if (file.filetype.toLowerCase() in allowType) {
      let option = {
        apiUrl: this.config.apiURL,
        file: file,
        to, // 接收消息对象
        roomType: false,
        chatType,
        onFileUploadError: (err) => { // 消息上传失败
          alert("图片发送失败")
          config.fail()
        },
        onFileUploadComplete: (file) => { // 消息上传成功
          if (Array.isArray(file.entities)) {
            for (let v of file.entities) {
              let url = file.uri + '/' + v.uuid
              let temp = {
                id,
                type: 'chat',
                from: that.username,
                to,
                url,
                error: false,
                groupId: to
              }
              temp = that.appendMessage(temp, 'out')
              temp.fileType = 'image'
              store.dispatch('PUSH_IM_CHART_DIALOG_GROUP_MESSAGE', temp)
              config.success()
            }
          }
        },
        flashUpload: this.WebIM.flashUpload
      }
      option = this._setExt(option)
      msg.set(option)
      if (chatType === 'chatRoom') {
        msg.setGroup('groupchat')
      } else {
        msg.body.chatType = chatType
      }
      conn.send(msg.body)
    } else {
      alert('只支持：' + allowType.join(',') + '的图片格式')
    }
  }
  // 添加消息
  unShiftMessage(message) {
    const className = message.from === this.username ? 'out' : 'in'
    console.log(message.from, this.username, className)
    const temp = this.appendMessage(message, className)
    store.dispatch('UN_SHIFT_IM_CHART_DIALOG_GROUP_MESSAGE', temp)
  }

  // 发送文本消息
  sendTextMessage(message, to, success = () => {
  }, fail = () => {
  }) {
    this.sendMessage(message, to, { type: 'txt', success, fail })
  }

  // 发送组消息
  sendTextMessageGroup(message, groupId, success) {
    this.sendMessage(message, groupId, { type: 'txt', success, chatType: 'chatRoom', isGroup: true })
  }

  // 发送cmd 消息
  sendCmdMessage(message, to, success = () => {
  }, fail = () => {
  }, action = '[CMDMessage]') {
    // todo
  }
}

export default Easemob
