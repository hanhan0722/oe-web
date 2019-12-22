<template>
  <div class="user-recommend content-center clear">
    <div class="left-content lf">
      <!-- 搜索框 -->
      <div class="search-bar">
        <div class="search-options" :style="{ height:more?'auto':'65px'}">
          <div
            class="search-normal"
            :style="{borderBottom: (vip && more?'1px solid #E8E8E8':'none')}"
          >
            <!-- 按国家筛选 -->
            <div class="search-item">
              <span class="search-item-name">{{$t("UserRecommend.title1")}}</span>
              <oe-select :options="countryOption" width="170px" v-model="country" ref="country"></oe-select>
            </div>
            <!-- 按年龄范围筛选 -->
            <div class="search-item">
              <span class="search-item-name">{{$t("UserRecommend.title2")}}</span>
              <oe-select :options="ageOptions" v-model="rangeMin" ref="rangeMin"></oe-select>
              <span class="search-item-range">～</span>
              <oe-select :options="ageOptions" v-model="rangeMax" ref="rangeMax"></oe-select>
              <span class="search-item-unit">{{$t("UserRecommend.title3")}}</span>
            </div>
            <div class="clear handle-button">
              <!-- 清空 -->
              <span
                class="font-primary handle-reset"
                @click="onReset"
              >{{$t("UserRecommend.button1")}}</span>
              <!-- 搜索 -->
              <span class="btn-primary handle-search" @click="onSearch">
                <i class="icon-search"></i>
                {{$t("UserRecommend.button2")}}
              </span>
            </div>
          </div>
          <!-- <div class="search-vip" v-show="vip && more">
            <div class="search-item">
              <span class="search-item-name">身高</span>
              <oe-select :options="heightOptions"></oe-select>
              <span class="search-item-range">～</span>
              <oe-select :options="heightOptions"></oe-select>
              <span class="search-item-unit">cm</span>
            </div>
            <div class="search-item">
              <span class="search-item-name">视频认证</span>
              <oe-select :options="heightOptions"></oe-select>
            </div>
            <div class="search-item">
              <span class="search-item-name">教育</span>
              <oe-select :options="heightOptions"></oe-select>
            </div>
          </div>-->
        </div>
        <!-- <div class="handle-switch" @click="onSwitchClick">
          <div v-if="!vip">
            <p>VIP会员解锁</p>
            <i class="icon-bottom-gold"></i>
          </div>
          <div v-else-if="!more">
            <p>更多</p>
            <i class="icon-bottom-gold"></i>
          </div>
          <div v-else>
            <p>收起</p>
            <i class="icon-arrow-top"></i>
          </div>
        </div>-->
      </div>
      <!-- 用户列表 -->
      <ul class="user-list" v-loading="loading">
        <li v-for="(item,idx) in userList" :class="idx%3==2?'end':''">
          <img
            :src="url_prefix+item.avatar"
            @click="goDetail(item.id)"
            :onerror="$store.state.defaultImg"
          >
          <!-- 用户信息 -->
          <div class="user-data">
            <p class="user-uname">
              <span>{{item.nickname||$t("Index.prompt1")}}</span>
              <i class="icon-diamond-active" v-if="item.isVip==1"></i>
            </p>
            <!-- 地区 -->
            <p class="user-info">{{item.workProvince}}{{item.workCity && "，"+item.workCity}}</p>
            <p class="user-info">
              {{item.age?item.age+$t("Index.unit1"):$t("Index.prompt2")}}
              <span>|</span>
              {{item.height}}cm
            </p>
            <!-- 签名 -->
            <p class="user-signature">{{item.description}}</p>
            <div class="user-handle clear">
              <!-- 心动 -->
              <div class="btn-default lf" @click="onHandleLike(idx)">
                <i class="icon-heart-default" v-if="!item.isbeckoning"></i>
                <i class="icon-heart-active" v-else></i>
                <span>{{$t("UserRecommend.button3")}}</span>
              </div>
              <!-- 聊天 -->
              <div class="btn-default rt" @click="onTalk(idx)">{{$t("UserRecommend.button4")}}</div>
            </div>
          </div>
        </li>
      </ul>
      <!-- 分页 -->
      <oe-pagination pageSize="9" :total="total" @changePage="changePage" ref="pagination"></oe-pagination>
    </div>
    <!-- 右侧导航 -->
    <right-nav class="rt"></right-nav>
  </div>
</template>

<script>
import RightNav from "@/components/RightNav";
import OePagination from "@/components/UI/OePagination";
import OeSelect from "@/components/UI/OeSelect";
import { Decrypt, PostData } from "@/assets/utils/secret.js";
import { getCountry, getCity, setCountryLang } from "@/assets/utils/public.js";
import country_zh from "@/assets/lang/zh_country.js";
import country_en from "@/assets/lang/en_country.js";
import bus from "@/assets/utils/bus.js";
export default {
  name: "UserRecommend",
  components: { RightNav, OePagination, OeSelect },
  data() {
    return {
      userList: [],
      heightOptions: [{ label: "1", value: 1 }],
      countryOption: [],
      ageOptions: [],
      vip: true,
      more: false,
      url_prefix: "",
      total: 1,
      pageSize: 9,
      loading: false,
      search: {},
      country: "",
      rangeMin: "",
      rangeMax: "",
      likeLock: false
    };
  },
  watch: {
    lang(val) {
      this.countryOption = setCountryLang();
    }
  },
  computed: {
    lang() {
      return this.$store.state.lang;
    },
    userInfo() {
      return this.$store.state.userInfo;
    }
  },
  mounted() {
    for (var i = 0; i < this.pageSize; i++) {
      this.userList.push({});
    }
    for (var i = 18; i <= 80; i++) {
      this.ageOptions.push({ label: i, value: i });
    }
    this.countryOption = setCountryLang();
    this.changePage(1);
  },
  methods: {
    valiLogin() {
      if (!this.$store.state.userInfo.id) {
        this.$message(this.$t("UserRecommend.prompt1"));
        bus.$emit("showLogin", true);
        return false;
      } else {
        return true;
      }
    },
    changePage(pno) {
      pno > 1 && this.valiLogin();
      var obj = {
        page: pno,
        pageSize: this.pageSize,
        id: this.$store.state.userInfo.id || null
      };
      if (this.search) {
        obj = $.extend(obj, this.search);
      }
      this.loading = true;
      this.$ajax(
        PostData(this.$store.state.host + "user/v2/listUser", obj)
      ).then(res => {
        this.loading = false;
        if (res.data.code == 0) {
          var body = JSON.parse(Decrypt(res.data.body));
          console.log(body);
          this.userList = body.list;
          this.userList.map((elem, index, arr) => {
            elem.workProvince = getCountry(elem.workProvince);
            elem.workCity = getCity(elem.workCity);
          });
          this.url_prefix = body.url_prefix;
          this.total = body.totalCount;
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    goDetail(id) {
      if (this.valiLogin()) {
        this.$router.push({ name: "UserDetail", params: { id: id, type: 0 } });
      }
    },
    onHandleLike(idx) {
      if (!this.likeLock && this.valiLogin()) {
        this.likeLock = true;
        this.$ajax(
          PostData(this.$store.state.host + "follow/listFollow", {
            id: this.$store.state.userInfo.id,
            token: this.$store.state.userInfo.token,
            uid: this.userList[idx].id,
            type: this.userList[idx].isbeckoning ? 1 : 0
          })
        ).then(res => {
          console.log(res.data);
          this.loading = false;
          console.log(res.data);
          if (res.data.code == 0) {
            this.$message({
              message: this.userList[idx].isbeckoning
                ? this.$t("UserDetail.prompt4")
                : this.$t("UserDetail.prompt3"),
              type: "success"
            });
            this.userList[idx].isbeckoning = !this.userList[idx].isbeckoning;
            this.$set(this.userList, idx, this.userList[idx]);
            console.log(this.userList[idx].isbeckoning);
            this.likeLock = false;
          } else {
            this.$message(res.data.msg);
          }
        });
      } else {
        if (this.likeLock) {
          this.$message(this.$t("UserRecommend.prompt3"));
        } else if (!this.valiLogin()) {
          console.log("user not login");
        }
      }
    },
    onTalk(idx) {
      if (this.valiLogin()) {
        if (this.userInfo.isVip == 1) {
          this.$store.dispatch("PUSH_IM_CHART_CHATLIST", this.userList[idx]);
          this.$router.push({ path: "/chat" });
        } else {
          // 获取用户聊天权限
          this.$ajax(
            PostData(this.$store.state.host + "userChat/chatVerify", {
              id: this.$store.state.userInfo.id,
              toUid: this.userList[idx].id
            })
          ).then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              var body = JSON.parse(Decrypt(res.data.body));
              console.log(body); //allowChatNum
              this.$store.dispatch(
                "PUSH_IM_CHART_CHATLIST",
                this.userList[idx]
              );
              this.$router.push({ path: "/chat" });
            } else {
              //没有聊天机会
              this.$message(res.data.msg);
              if (this.userInfo.isVip!=1 && this.userInfo.authStatus != 1 ) {
                bus.$emit("showBuy", "identify");
              } else if(this.userInfo.isVip!=1){
                //弹vip
                bus.$emit("showBuy", "vip");
              }
            }
          });
        }
      }
    },
    onSwitchClick() {
      if (this.vip) {
        this.more = !this.more;
      }
    },
    onReset() {
      this.country = "";
      this.rangeMin = "";
      this.rangeMax = "";
      this.$refs.country.label = "";
      this.$refs.rangeMin.label = "";
      this.$refs.rangeMax.label = "";
    },
    buyVip() {
      bus.$emit("showBuy", "vip");
    },
    buyAuth() {
      if (
        !(
          this.$store.state.userInfo.authStatus &&
          this.$store.state.userInfo.authStatus == 1
        )
      ) {
        bus.$emit("showBuy", "identify");
      }
    },
    onSearch() {
      if (this.valiLogin()) {
        if (this.$store.state.userInfo.isVip != 1 && this.$store.state.userInfo.authStatus!=1) {
          //未认证 弹认证
          this.$message(this.$t("Layout.prompt7"));
          this.buyAuth();
        } else if (this.$store.state.userInfo.isVip != 1) {
          //认证后未购买vip 弹vip
          this.$message(this.$t("Layout.prompt8"));
          this.buyVip();
        } else {
          this.search = {
            work_province: this.country,
            age_start: this.rangeMin,
            age_end: this.rangeMax
          };
          console.log(this.search);
          if (this.search.age_start <= this.search.age_end) {
            this.$refs.pagination.onPageChange(1);
          } else {
            this.$message(this.$t("UserRecommend.prompt2"));
          }
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@imgPath: "../../assets/img/user/";
.user-recommend {
  padding: 20px 0 108px 0;
  .search-bar {
    margin-bottom: 20px;
    .handle-button {
      position: absolute;
      right: 0;
      span {
        float: left;
        &.handle-reset {
          line-height: 52px;
          margin-right: 12px;
          cursor: pointer;
        }
      }
    }
    .handle-search {
      width: 110px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      margin: 9px 0;
      &:hover .icon-search {
        transform: scale(1.1);
      }
    }
    .search-item {
      display: flex;
      align-items: center;
      margin-right: 30px;
    }
    .search-options {
      background: #fff;
      border-radius: 25px;
      padding: 0 30px;
      box-sizing: border-box;
      box-shadow: @oeShadow;
      transition: height 0.3s ease;
      .search-item-name {
        margin-right: 10px;
      }
      .search-item-range {
        margin: 0 12px;
      }
      .search-item-unit {
        margin-left: 5px;
      }
      .search-normal {
        height: 65px;
        position: relative;
      }
      .search-vip {
        height: 65px;
        .search-item {
          margin-right: 50px;
        }
      }
      .search-normal,
      .search-vip {
        display: flex;
        align-items: center;
      }
    }
    .handle-switch {
      background: #fff;
      width: 130px;
      height: 32px;
      margin: 0 auto;
      text-align: center;
      color: #c0a37c;
      border-radius: 0 0 14px 14px;
      box-sizing: border-box;
      cursor: pointer;
      box-shadow: -5px 5px 10px -4px rgba(0, 0, 0, 0.06),
        5px 5px 10px -4px rgba(0, 0, 0, 0.06);
    }
  }
}
.icon-diamond-active {
  margin-left: 5px;
}
.icon-bottom-gold {
  .icon(10px, 10px, url("@{imgPath}icon_bottom_gold.png"));
  margin-top: -5px;
}
.icon-arrow-top {
  .icon(10px, 10px, url("@{imgPath}icon_arrow_top.png"));
  margin-top: -5px;
}
.icon-search {
  .icon(16px, 16px, url("@{imgPath}icon_search.png"));
  margin-right: 8px;
}
.icon-heart-default {
  .icon-sprite(36px, 36px, -397px, -471px, 0.5);
}
.icon-heart-active {
  .icon-sprite(36px, 36px, -350px, -471px, 0.5);
}
.left-content {
  width: calc(100% - 240px);
  .user-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    margin-bottom: 12px;
    li {
      width: 240px;
      background: #fff;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: @oeShadow;
      margin-right: 20px;
      &:hover {
        transform: scale(1.01);
        box-shadow: -3px 2px 3px #dddddd, 0 0 0 #dddddd, 2px 2px 5px #dddddd,
          0 10px 10px #dddddd;
        transition: transform 0.3s linear;
      }
      &.end {
        margin-right: 0;
      }
      img {
        border-radius: 10px 10px 0 0;
        width: 240px;
        height: 240px;
        cursor: pointer;
      }
    }
    .user-data {
      padding: 16px;
      .user-uname {
        font-size: 16px;
        font-weight: bold;
        padding-bottom: 10px;
      }
      .user-info {
        color: #737373;
        line-height: 20px;
      }
      .user-signature {
        color: #393939;
        font-size: 14px;
        padding: 10px 0 20px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        height: 20px;
        line-height: 20px;
      }
      .user-handle {
        .btn-default {
          width: 90px;
          padding: 0;
          font-size: 13.3333px;
          line-height: 32px;
          &:first-child {
            padding: 0 10px;
            span {
              margin-left: -5px;
              display: inline-block;
              vertical-align: center;
            }
          }
          &:last-child {
            text-align: center;
          }
        }
      }
    }
  }
}
</style>