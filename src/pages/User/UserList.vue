<template>
  <div class="user-list content-center clear">
    <div class="list-wrapper lf">
      <div class="list-content">
        <div>
          <ul class="tab-list">
            <li
              v-for="(tab,idx) in $t('UserList.tabList')"
              :key="tab.id"
              :class="active==idx?'info-title':''"
              @click="changeTab(idx)"
            >
              <div>
                {{tab}}
                <div></div>
              </div>
            </li>
          </ul>
          <div class="total-num">
            <!-- 总心动量： -->
            <p :style="{marginRight:(user.vip?'0':'50px')}">
              <span v-show="active==0||active==1">{{$t("UserList.title1")}}</span>
              <span v-show="active==2">{{$t("UserList.title5")}}</span>
              <span class="font-primary">{{total[active]}}</span>
            </p>
            <!-- 开通会员 -->
            <p v-if="!user.vip" @click="authTest" v-show="active!=1">
              <i class="icon-diamond-active"></i>
              <span class="buy-vip">{{$t("UserList.title2")}}</span>
              <span>{{$t("UserList.title3")}}</span>
            </p>
          </div>
          <ul
            class="user-log-list"
            v-for="(tab,idx) in $t('UserList.tabList')"
            v-show="active==idx"
          >
            <li v-for="(user,index) in userList[active]">
              <img
                :src="user.headImg"
                :onerror="$store.state.defaultAvatar"
                @click="goDetail(user)"
              >
              <div class="user-info">
                <p>
                  <span class="main-title" @click="goDetail(user)">{{user.nickname}}</span>
                  <i class="icon-diamond-active" v-if="user.vip"></i>
                  <span class="rt">{{user.time}}</span>
                </p>
                <p>{{user.country}}，{{user.city}}</p>
                <p>
                  {{user.age}}{{$t("UserList.title4")}}
                  <span>|</span>
                  {{user.height}}cm
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="user.vip">
        <div v-show="active==0">
          <oe-pagination :pageSize="pageSize" :total="total[active]" @changePage="changePage"></oe-pagination>
        </div>
        <div v-show="active==1">
          <oe-pagination :pageSize="pageSize" :total="total[active]" @changePage="changePage"></oe-pagination>
        </div>
        <div v-show="active==2">
          <oe-pagination :pageSize="pageSize" :total="total[active]" @changePage="changePage"></oe-pagination>
        </div>
      </div>
      <!-- 非VIP不能换页 -->
      <div class="wrapper-prevent" v-else>
        <oe-pagination :pageSize="pageSize" :total="total[active]"></oe-pagination>
        <div @click="authTest"></div>
      </div>
    </div>
    <right-nav class="rt"></right-nav>
  </div>
</template>

<script>
import RightNav from "@/components/RightNav";
import OePagination from "@/components/UI/OePagination";
import { Encrypt, Decrypt, PostData } from "@/assets/utils/secret.js";
import {
  getCountry,
  getCity,
  timeFormat,
  formatDate
} from "@/assets/utils/public.js";
import bus from "@/assets/utils/bus.js";
export default {
  name: "UserList",
  components: { OePagination, RightNav },
  data() {
    return {
      active: 0,
      userList: [[], [], []],
      total: [0, 0, 0],
      pageSize: 8,
      pageNum: [1, 1, 1],
      user: { vip: false }
    };
  },
  watch: {
    $route() {
      this.active = this.$route.query.current;
      if (this.userList[this.active].length == 0) {
        this.getListData(this.active);
      }
    }
  },
  mounted() {
    this.user.vip = this.$store.state.userInfo.isVip == 1 ? true : false;
    if (!this.$route.query.current) {
      this.active = 0;
    } else {
      this.active = this.$route.query.current;
    }
    //获取当前tab第一页用户列表数据
    this.getListData(this.active);
  },
  methods: {
    changePage(pno) {
      if (!this.user.vip) {
        this.authTest();
        return false;
      }
      this.$set(this.pageNum, this.active, pno);
      this.getListData(this.active);
    },
    changeTab(idx) {
      if (idx < 3 && idx != this.active) {
        this.$router.push({ path: "/user/list", query: { current: idx } });
      }
    },
    getListData(active) {
      var url = "";
      if (active == 0) {
        url = "follow/listFollowForMe";
      } else if (active == 1) {
        url = "follow/listMyFollow";
      } else if (active == 2) {
        url = "recent/listRecent";
      }
      this.$ajax(
        PostData(this.$store.state.host + url, {
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token,
          pageSize: this.pageSize,
          page: this.pageNum[active]
        })
      ).then(res => {
        var body = JSON.parse(Decrypt(res.data.body));
        console.log(body);
        if (body.list && body.list.length > 0) {
          for (let i = 0; i < body.list.length; i++) {
            body.list[i].country = getCountry(body.list[i].workCountry);
            body.list[i].city = getCity(
              body.list[i].workCountry,
              body.list[i].workCity
            );
            body.list[i].time = formatDate(
              body.list[i].createdAt,
              "yyyy-MM-dd hh:ss:mm"
            );
          }
          this.$set(this.userList, active, body.list);
          this.$set(this.total, active, body.totalCount);
        }
      });
    },
    goDetail(user) {
      //To Do:按权限弹窗
      this.authTest(() => {
        this.$router.push({
          name: "UserDetail",
          params: { id: user.unionid, type: 0 }
        });
      });
    },
    authTest(cb) {
      if (
        this.$store.state.userInfo.isVip != 1 &&
        this.$store.state.userInfo.authStatus != 1
      ) {
        //未认证 弹认证
        this.$message("请您开通认证");
        bus.$emit("showBuy", "identify");
      } else if (this.$store.state.userInfo.isVip != 1) {
        //认证后未购买vip 弹vip
        this.$message("开通VIP享受VIP特权");
        bus.$emit("showBuy", "vip");
      } else {
        //vip
        typeof cb == "function" && cb();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.user-list {
  padding: 20px 0;
  .list-wrapper {
    width: 760px;
    .list-content {
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      .total-num {
        padding: 24px 0;
        text-align: center;
        p {
          display: inline-block;
          .buy-vip {
            color: #ceb077;
            margin-right: 5px;
            cursor: pointer;
          }
        }
      }
      .user-log-list {
        li {
          display: flex;
          box-shadow: @oeShadow;
          border-radius: 10px;
          margin-bottom: 10px;
          padding: 24px;
          img {
            width: 100px;
            height: 100px;
            border-radius: 10px;
            cursor: pointer;
          }
          .user-info {
            width: calc(100% - 100px);
            box-sizing: border-box;
            padding: 12px 8px 0px 32px;
            color: #737373;
            .main-title {
              cursor: pointer;
            }
            p:first-child {
              margin-bottom: 15px;
              color: #404040;
            }
            p:not(:first-child) {
              line-height: 18px;
            }
          }
        }
      }
    }
  }
  .oe-pagination {
    margin: 20px 0;
  }
  .wrapper-prevent {
    position: relative;
    div:last-child {
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
}
</style>
