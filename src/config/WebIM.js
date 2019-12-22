/* eslint-disable */
import "script-loader!easemob-websdk/dist/strophe-1.2.8.js"
/* eslint-enable */
// import webrtc from "easemob-webrtc"
// import emedia from "easemob-emedia"
import config from "./WebIMConfig"
import WebIM from "easemob-websdk"
import emoji from "./emoji"
import Api from "axios"
import { Message } from 'element-ui'
// import loglevel from "@/utils/loglevel"
console = console || {}
console.group = console.group || function () { }
console.groupEnd = console.groupEnd || function () { }
// init DOMParser / document for strophe and sdk

WebIM.config = config
// WebIM.loglevel = loglevel
// replace all console.log with loglevel.info
// console.log = loglevel.info

WebIM.conn = new WebIM.connection({
    isHttpDNS: WebIM.config.isHttpDNS,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    isAutoLogin: false,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    isStropheLog: WebIM.config.isStropheLog,
    delivery: WebIM.config.delivery
})

// for downward compatibility 
if (!WebIM.conn.apiUrl) {
    WebIM.conn.apiUrl = WebIM.config.apiURL
}
WebIM.debug(true)

const appKeyPair = WebIM.config.appkey.split("#")
export let api = Api.create({
    baseURL: `${WebIM.config.apiURL}/${appKeyPair[0]}/${appKeyPair[1]}`,
    validateStatus: function (status) {
        return true
    }
})

function requestFail(data) {
    if (data.data && data.data.error_description) {
        data.msg = data.data.error_description
    } else if (data.data && data.data.data && data.data.data.error_description) {
        data.msg = data.data.data.error_description
    }
    Message.error("Error:" + data.status + ", " + data.msg)
    setTimeout(() => { window.location.href = "/"; }, 3000);
    return Promise.reject(data)
}

api.interceptors.response.use(
    function (resp) {
        if (resp.status >= 300) {
            return requestFail(resp)
        }
        if (resp.data && resp.data.status && resp.data.status !== 200) {
            return requestFail(resp.data)
        }
        if (resp.data && resp.data.data) {
            resp.data = resp.data.data
        }
        return resp
    },
    function (error) {
        console.log(error)
    }
)

WebIM.api = api
WebIM.emoji = emoji
// WebIM.WebRTC = webrtc
// WebIM.EMedia = emedia
window.WebIM=WebIM
console.log(WebIM)
export default WebIM
