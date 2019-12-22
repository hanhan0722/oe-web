<template>
  <div class="pay-tips">
    <div class="title">{{$t("Pay.title")}}</div>
      <div class="success">
        <img src="@/assets/img/modal/success.png">
      </div>
      <div class="text">
        <p v-if="payOption.type=='alipay'">{{$t("Pay.text1")}}<span>{{$t("Pay.alipay")}}</span>{{$t("Pay.text2")}}</p>
        <p v-else-if="payOption.type=='paypal'">{{$t("Pay.text1")}}<span>paypal</span>{{$t("Pay.text2")}}</p>
        <p v-else-if="payOption.type=='wechat'">{{$t("Pay.text1")}}<span>{{$t("Pay.wechat")}}</span>{{$t("Pay.text2")}}</p>
        <p><span>{{time}}</span> {{$t("Pay.text3")}} {{$t("Pay.text4")}}</p>
      </div>
      <div>
        <a class="btn" href="javascript:;" @click="gobackhome">{{$t("Pay.text5")}}</a>
      </div>
  </div>
</template>
<script>
import { AesEncrypt, Decrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name:'PaySuccess',
  data(){
    return {
      payOption: {
        price : 0,
        type:'paypal',
        status :'success'
      },
      homeUrl:'',
      time: 10,
      timer: null,
    };
  },
  mounted(){
    const curUrl = location.href;
    const newUrl = curUrl.indexOf('?') >-1 ? curUrl.split('?')[0] : curUrl;
    if(curUrl.split('?')[1]){
      const params = curUrl.split('?')[1].split('&').map(item => {
        return [item.split('=')[0],item.split('=')[1]];
      });
      for(let i = 0; i < params.length; i++){
        if(params[i][0]==='total_fee'){
          location.href =  newUrl + '?alipay=1';
        }else if(params[i][0]==='wechat'){
          this.payOption.type = 'wechat';
        }else if(params[i][0]==='alipay'){
          this.payOption.type = 'alipay';
        }else {
          this.payOption.type = 'paypal';
        }
      }
    }
    this.count();
    this.getUserInfo();
  },
  methods:{
    gobackhome(){
      location.href = location.origin;
    },
    count(){
      this.timer = setInterval(()=>{
        this.time--;
        if(this.time == 0){
          clearInterval(this.timer)
          location.href = location.origin;
        }
      },1000)
    },
    getUserInfo() {
      this.$ajax(
        PostData(this.$store.state.host + "user/getUserInfo", {
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token,
        })
      ).then(res => {
        if (res.data.code == 0) {
          const body = JSON.parse(Decrypt(res.data.body));
          body.user.iLikeUnreadCount = body.iLikeUnreadCount;
          body.user.likeMeUnreadCount = body.likeMeUnreadCount;
          body.user.userAllowChatNum = body.userAllowChatNum;
          body.user.visitMeUnreadCount = body.visitMeUnreadCount;
          body.user.token = body.token;
          sessionStorage.setItem(
            "user",
            AesEncrypt(JSON.stringify(body.user))
          );
          this.$store.commit(
            "newUserInfo",
            JSON.parse(Decrypt(sessionStorage.getItem("user")))
          );
        }
      });
    },
  }
}
</script>
<style lang="less" scoped>
  .pay-tips {
    width: 80%;
    margin: 0 auto;
    padding: 127px 0;
    background: #fff;
    text-align: center;

    .title {
      font-size: 22px;
      color: #010101;
      font-weight: 600;
    }

    .success {
      img {
        width: 50px;
        margin-top: 20px;
      }
    }

    .text {
      display: inline-block;
      margin-top: 20px;
      font-size: 16px;
      text-align: left;

      span {
        color: #df4572;
      }
    }

    .btn {
      display: inline-block;
      width:120px;
      margin-top: 20px;
      border-radius: 8px;
      background: #dd3868;
      font-size: 16px;
      color: #fff;
      line-height: 36px;
    }
  }
  
</style>


