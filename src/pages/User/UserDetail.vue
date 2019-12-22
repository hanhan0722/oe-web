<template>
  <div class="user-detail" v-loading="loading">
    <div class="user-info" :style="{background:user.gender=='male'?'#5B86E7':'#E61665'}">
      <div class="content-center">
        <!-- 举报 -->
        <div class="icon-report" v-if="type==0" @click="onReport">
          <i></i>
          <p>{{$t("UserDetail.button1")}}</p>
        </div>
        <div>
          <div class="info-left">
            <img :src="$store.state.imageHost+user.avatar" :onerror="$store.state.defaultAvatar">
            <!-- 编辑头像 -->
            <div v-if="type==1" class="shadow">
              <div class="btn-primary" @click="editAvartar=true">
                <i class="icon-edit-white"></i>
                <span>{{$t("UserDetail.button2")}}</span>
              </div>
            </div>
          </div>
          <div class="shadow-fixed" v-show="editAvartar">
            <div class="modal">
              <i class="icon-close-white" @click="editAvartar=false"></i>
              <step3 editAvartar="true"></step3>
            </div>
          </div>
          <ul v-if="type==0" class="confirm-list">
            <!-- 身份 -->
            <li>
              <el-tooltip
                :content="authInfo.idAdopt"
                placement="bottom"
                effect="dark"
                popper-class="tip"
              >
                <div>
                  <i class="icon-user-active" v-if="user.confirm"></i>
                  <i class="icon-user-default" v-else></i>
                  <span>{{$t("UserDetail.title2")}}</span>
                </div>
              </el-tooltip>
            </li>
            <!-- 视频 -->
            <li>
              <el-tooltip
                :content="authInfo.videoAuth"
                placement="bottom"
                effect="dark"
                popper-class="tip"
              >
                <div>
                  <i class="icon-video-active" v-if="user.video"></i>
                  <i class="icon-video-default" v-else></i>
                  <span>{{$t("UserDetail.title3")}}</span>
                </div>
              </el-tooltip>
            </li>
            <!-- 教育 -->
            <li>
              <el-tooltip
                :content="authInfo.educationAuth"
                placement="bottom"
                effect="dark"
                popper-class="tip"
              >
                <div>
                  <i class="icon-edu-active" v-if="user.edu"></i>
                  <i class="icon-edu-default" v-else></i>
                  <span>{{$t("UserDetail.title4")}}</span>
                </div>
              </el-tooltip>
            </li>
          </ul>
        </div>
        <div class="info-right" :style="{height:(type==0?'260px':'auto')}">
          <!-- 昵称 -->
          <p class="user-uname">
            {{user.nickname||$t("Index.prompt1")}}
            <i
              class="icon-diamond-default"
              v-if="user.isVip==1"
            ></i>
          </p>
          <!-- id -->
          <p class="user-desc">ID:{{user.id||""}}</p>
          <!-- 年龄 -->
          <p class="user-desc">{{user.age?user.age+$t("Index.unit1"):$t("Index.prompt2")}}</p>
          <!-- 地区 -->
          <p class="user-desc">{{user.workProvince}} - {{user.workCity}}</p>
          <!-- 期望结婚时间 -->
          <p
            class="user-desc"
            v-show="user.expectMarryTime!==undefined && user.expectMarryTime!==null"
          >{{user.expectMarryTime?$t("UserDetail.title5")+user.expectMarryTime.toLowerCase()+$t("UserDetail.title6"):""}}</p>
          <!-- <share v-if="type==0" type="userCenter"></share> -->
          <ul v-if="type==0">
            <!-- 心动 -->
            <li @click="onHandleLike">
              <i class="icon-heart-default" v-if="!user.isbeckoning"></i>
              <i class="icon-heart" v-else></i>
            </li>
            <!-- 聊天 -->
            <li @click="onTalk">
              <i class="icon-chat"></i>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="content-center clear">
      <div class="lf" :style="{width:(this.type==0?'100%':'calc(100% - 240px)')}">
        <ul v-if="type==1" class="banner-list">
          <li @click="buyAuth">
            <img src="@/assets/img/user/medal.jpg" class="lf">
            <div class="lf">
              <!-- 认证 -->
              <p class="main-title">{{$t("UserDetail.title7")}}</p>
              <p v-if="user.authStatus!=1">
                <span class="font-primary">351490</span>
                {{$t("UserDetail.title8")}}
              </p>
              <p v-else class="font-primary">{{$t("UserDetail.title32")}}</p>
            </div>
          </li>
          <!-- vip -->
          <li @click="buyVip">
            <div v-if="user.isVip!=1">
              <img src="@/assets/img/user/vip_default.jpg" class="lf">
              <div class="lf">
                <p class="main-title">{{$t("UserDetail.title9")}}</p>
                <p>{{$t("UserDetail.title10")}}</p>
              </div>
            </div>
            <div v-else>
              <img src="@/assets/img/user/vip_active.jpg" class="lf">
              <div class="lf">
                <p class="main-title">{{$t("UserDetail.title30")}}</p>
                <p>{{user.lastVipTime | timeFormat}}{{$t("UserDetail.title31")}}</p>
              </div>
            </div>
          </li>
          <!-- love币 -->
          <!-- <li>
            <img src="@/assets/img/user/heart.jpg" class="lf">
            <div class="lf">
              <p class="main-title">
                {{$t("UserDetail.title11")}}
                <span class="font-primary">{{(user.coin)}}</span>
              </p>
              <p>{{$t("UserDetail.title12")}}</p>
            </div>
          </li>-->
        </ul>
        <div class="info-bottom clear" :style="{paddingTop:(type==0?'72px':'32px')}">
          <photo-album :photoList="photoList" :type="type" :w="type==0?200:155"></photo-album>
          <!-- 个人介绍 -->
          <div>
            <div class="info-title">
              <div>
                {{$t("UserDetail.title13")}}
                <div></div>
              </div>
              <i class="icon-edit" v-if="type==1" @click="editSignture=!editSignture"></i>
            </div>
            <!-- 签名 -->
            <div class="user-signture">
              <i class="icon-mark-left"></i>
              <div v-if="type==0 || !editSignture">
                <p class="signture-content" v-if="user.description">{{user.description}}</p>
                <p class="signture-content" v-else>{{$t("UserDetail.title14")}}</p>
              </div>
              <textarea cols="60" rows="5" v-model="user.description" v-else></textarea>
              <i class="icon-mark-right"></i>
            </div>
            <!-- complete -->
            <button
              class="btn-primary"
              v-if="type==1 && editSignture"
              @click="onEditSignture"
            >{{$t("UserDetail.button3")}}</button>
          </div>
          <div>
            <ul class="tab-list">
              <li
                v-for="(item,idx) in $t('UserDetail.tabList')"
                :class="current==idx?'info-title':''"
                @click="current=idx"
              >
                <div>
                  {{item}}
                  <div></div>
                </div>
              </li>
            </ul>
            <i class="icon-edit" v-if="type==1" @click="editData=!editData"></i>
            <!-- 基本资料 -->
            <step1
              v-show="current==0"
              :type="editData?'edit':'show'"
              tar="self"
              :id="$route.params.id"
              :userInfo="editData?userData:user"
              ref="user"
            ></step1>
            <!-- 择偶标准 -->
            <step1
              v-show="current==1"
              :type="editData?'edit':'show'"
              tar="mate"
              :id="$route.params.id"
              :userInfo="editData?mateData:mate"
              ref="mate"
            ></step1>
            <!-- 其他资料 -->
            <ul class="info-list" v-show="current==2">
              <!-- 朋友对我的评价 -->
              <li>
                <p>{{$t("UserDetail.title15")}}</p>
                <p
                  class="item-content"
                  v-if="type==0||!editData"
                >{{user.evaluation||$t("Info.step1.title16")}}</p>
                <textarea cols="50" rows="3" v-model="otherInfo.evaluation" v-else></textarea>
              </li>
              <!-- 家人对我的评价 -->
              <li>
                <p>{{$t("UserDetail.title16")}}</p>
                <p
                  class="item-content"
                  v-if="type==0||!editData"
                >{{user.familyevaluation||$t("Info.step1.title16")}}</p>
                <textarea cols="50" rows="3" v-model="otherInfo.familyevaluation" v-else></textarea>
              </li>
              <!-- 人生中最难忘的事 -->
              <li>
                <p>{{$t("UserDetail.title17")}}</p>
                <p
                  class="item-content"
                  v-if="type==0||!editData"
                >{{user.unforgettable||$t("Info.step1.title16")}}</p>
                <textarea cols="50" rows="3" v-model="otherInfo.unforgettable" v-else></textarea>
              </li>
              <!-- 我最喜欢做的事 -->
              <li>
                <p>{{$t("UserDetail.title18")}}</p>
                <p
                  class="item-content"
                  v-if="type==0||!editData"
                >{{user.favoritethings||$t("Info.step1.title16")}}</p>
                <textarea cols="50" rows="3" v-model="otherInfo.favoritethings" v-else></textarea>
              </li>
              <!-- 我未来伴侣的重要素质 -->
              <li>
                <p>{{$t("UserDetail.title19")}}</p>
                <p
                  class="item-content"
                  v-if="type==0||!editData"
                >{{user.qualityofpartner||$t("Info.step1.title16")}}</p>
                <textarea cols="50" rows="3" v-model="otherInfo.qualityofpartner" v-else></textarea>
              </li>
            </ul>
            <!-- complete -->
            <button
              class="btn-primary"
              v-if="type==1 && editData"
              @click="onEditData"
            >{{$t("UserDetail.button3")}}</button>
          </div>
        </div>
      </div>
      <div class="lf" v-if="type==1">
      <div class="right-nav">
        <ul>
          <li>
            <p class="main-title">{{$t("UserDetail.title20")}}</p>
            <ul class="user-data-list" :style="{textAlign:$store.state.lang=='en'?'left':'center'}">
              <!-- 心动 -->
              <li>
                <i class="icon-heart-active"></i>
                <span class="list-item" @click="goUserList(0)">{{$t("UserDetail.title21")}}</span>
                <span
                  class="tag-primary"
                  @click="goUserList(0)"
                  v-if="statistics.likeMeUnreadCount>0"
                >{{statistics.likeMeUnreadCount>99?"99+":statistics.likeMeUnreadCount}}</span>
                <span v-else class="tag-default"></span>
              </li>
              <!-- 被访 -->
              <li>
                <i class="icon-eye"></i>
                <span class="list-item" @click="goUserList(2)">{{$t("UserDetail.title22")}}</span>
                <span
                  class="tag-primary"
                  @click="goUserList(2)"
                  v-if="statistics.visitMeUnreadCount>0"
                >{{statistics.visitMeUnreadCount>99?"99+":statistics.visitMeUnreadCount}}</span>
                <span v-else class="tag-default"></span>
              </li>
              <!-- 聊天 -->
              <li>
                <i class="icon-talk"></i>
                <span class="list-item" @click="goChat">{{$t("UserDetail.title23")}}</span>
                <span
                  class="tag-primary"
                  @click="goChat"
                  v-if="unReadMessageNum>0"
                >{{unReadMessageNum>99?"99+":unReadMessageNum}}</span>
                <span v-else class="tag-default"></span>
              </li>
              <!-- <li>
                <i class="icon-star"></i>
                <span class="list-item">收藏</span>
                <router-link to="/article">
                  <span class="tag-primary">{{user.collectNum>99?"99+":user.collectNum}}</span>
                </router-link>
              </li>-->
            </ul>
          </li>
          <li>
            <p class="main-title">{{$t("UserDetail.title24")}}</p>
            <ul
              class="user-confirm-list"
              :style="{textAlign:$store.state.lang=='en'?'left':'center'}"
            >
              <!-- 身份 -->
              <li>
                <i class="icon-user-active" v-if="authInfo.userAuthState==2"></i>
                <i class="icon-user-default" v-else></i>
                <span>{{$t("UserDetail.title2")}}</span>
              </li>
              <!-- 视频 -->
              <li>
                <i class="icon-video-active" v-if="authInfo.videoAuthStatus==2"></i>
                <i class="icon-video-default" v-else></i>
                <span>{{$t("UserDetail.title3")}}</span>
              </li>
              <!-- 学历 -->
              <li>
                <i class="icon-edu-active" v-if="authInfo.educationAuthState==2"></i>
                <i class="icon-edu-default" v-else></i>
                <span>{{$t("UserDetail.title25")}}</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <img src="@/assets/img/layout/code.png" class="image-code">
      </div>
    </div>
  </div>
</template>

<script>
import PhotoAlbum from "@/components/PhotoAlbum";
import Step1 from "@/pages/Info/Step1";
import Step3 from "@/pages/Info/Step3";
import { Decrypt, PostData } from "@/assets/utils/secret.js";
import Share from "@/components/Share";
import bus from "@/assets/utils/bus.js";
import {
  getCountry,
  getCity,
  getLabel,
  timeFormat
} from "@/assets/utils/public.js";
export default {
  name: "UserDetail",
  components: { PhotoAlbum, Step1, Step3, Share },
  data() {
    return {
      user: {},
      userData: {},
      mate: {},
      mateData: {},
      authInfo: {},
      likeLock: false,
      type: 0,
      current: 0,
      editSignture: false,
      editData: false,
      statistics: {},
      editAvartar: false,
      loading: false,
      otherInfo: {}
    };
  },
  watch: {
    $route() {
      this.init();
    },
    userInfo: {
      handler(val) {
        if (this.type && this.type == 1) {
          this.init();
        }
      },
      deep: true
    }
  },
  computed: {
    photoList() {
      return this.$store.state.photoList;
    },
    unReadMessageNum() {
      return this.$store.getters.GET_IM_CHART_DIALOG_ALL_UN_READ_LENGTH();
    },
    userInfo(){
      return this.$store.state.userInfo;
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.type = this.$route.params.type;
      var api = "";
      if (this.type && this.type == 1) {
        api = "user/getPersonalCenterinfo";
      } else if (this.type == 0 && this.$route.params.id) {
        api = "user/getAnotherUserInfo";
      }
      this.$ajax(
        PostData(this.$store.state.host + api, {
          id: this.userInfo.id,
          uid: this.$route.params.id
        })
      ).then(res => {
        if (res.data.code == 0) {
          var body = JSON.parse(Decrypt(res.data.body));
          console.log(body);
          this.user = JSON.parse(JSON.stringify(body.user));
          this.statistics = {
            likeMeUnreadCount: body.likeMeUnreadCount,
            visitMeUnreadCount: body.visitMeUnreadCount,
            userAllowChatNum: body.userAllowChatNum,
            messageNum: 0
          };
          //认证信息
          this.authInfo = body.authInfo;
          switch (body.authInfo.userAuthState) {
            case 0:
              this.$set(
                this.authInfo,
                "idAdopt",
                this.$t("UserDetail.title27")
              );
              break;
            case 1:
              this.$set(
                this.authInfo,
                "idAdopt",
                this.$t("UserDetail.title28")
              );
              break;
            case 2:
              this.$set(
                this.authInfo,
                "idAdopt",
                this.$t("UserDetail.title29")
              );
              break;
          }
          switch (body.authInfo.videoAuthStatus) {
            case 0:
              this.$set(
                this.authInfo,
                "videoAuth",
                this.$t("UserDetail.title27")
              );
              break;
            case 1:
              this.$set(
                this.authInfo,
                "videoAuth",
                this.$t("UserDetail.title28")
              );
              break;
            case 2:
              this.$set(
                this.authInfo,
                "videoAuth",
                this.$t("UserDetail.title29")
              );
              break;
          }
          switch (body.authInfo.educationAuthState) {
            case 0:
              this.$set(
                this.authInfo,
                "educationAuth",
                this.$t("UserDetail.title27")
              );
              break;
            case 1:
              this.$set(
                this.authInfo,
                "educationAuth",
                this.$t("UserDetail.title28")
              );
              break;
            case 2:
              this.$set(
                this.authInfo,
                "educationAuth",
                this.$t("UserDetail.title29")
              );
              break;
          }
          //展示的基本资料
          this.$set(this.user, "birthday", timeFormat(body.user.birthday));
          this.$set(this.user, "province", getCountry(body.user.province));
          this.$set(
            this.user,
            "workProvince",
            getCountry(body.user.workProvince)
          );
          this.$set(
            this.user,
            "city",
            getCity(body.user.province, body.user.city)
          );
          this.$set(
            this.user,
            "workCity",
            getCity(body.user.workProvince, body.user.workCity)
          );
          this.$set(
            this.user,
            "income",
            getLabel(this.$t("Info.step1.incomeOption"), this.user.income)
          );
          this.$set(
            this.user,
            "expectMarryTime",
            getLabel(
              this.$t("Info.step1.marryTimeOption"),
              this.user.expectMarryTime
            )
          );
          this.$set(
            this.user,
            "marriageStatus",
            getLabel(
              this.$t("Info.step1.marriageOption"),
              this.user.marriageStatus
            )
          );
          this.$set(
            this.user,
            "faith",
            getLabel(this.$t("Info.step1.faithOption"), this.user.faith)
          );
          this.$set(
            this.user,
            "alcohol",
            getLabel(this.$t("Info.step1.alcoholOption"), this.user.alcohol)
          );
          this.$set(
            this.user,
            "smoke",
            getLabel(this.$t("Info.step1.smokeOption"), this.user.smoke)
          );
          this.$set(
            this.user,
            "haveChildern",
            getLabel(this.$t("Info.step1.childOption"), this.user.haveChildern)
          );
          this.$store.commit("newPhotoList", body.listAlbum);
          //编辑的基本资料
          this.userData = JSON.parse(JSON.stringify(body.user));
          this.$set(this.userData, "work_province", this.userData.workProvince);
          this.$set(this.userData, "work_city", this.userData.workCity);
          this.$set(this.userData, "birthCity", this.userData.city);
          this.$set(
            this.userData,
            "expect_marry_time",
            this.userData.expectMarryTime
          );
          this.$set(
            this.userData,
            "marriage_status",
            this.userData.marriageStatus
          );
          this.$set(this.userData, "have_childern", this.userData.haveChildern);
          //择偶标准展示资料
          this.mate = {
            age: body.user.mateAgeStart
              ? body.user.mateAgeStart +
                " - " +
                body.user.mateAgeEnd +
                this.$t("UserRecommend.title3")
              : "",
            height: body.user.mateHeightStart
              ? body.user.mateHeightStart + " - " + body.user.mateHeightEnd
              : "",
            weight: body.user.mateWeightStart
              ? body.user.mateWeightStart + " - " + body.user.mateWeightEnd
              : "",
            income: getLabel(
              this.$t("Info.step1.incomeOption"),
              body.user.mateIncome
            ),
            workProvince: getCountry(body.user.mateWorkProvince),
            workCity: getCity(
              body.user.mateWorkProvince,
              body.user.mateWorkCity
            ),
            expectMarryTime: getLabel(
              this.$t("Info.step1.marryTimeOption"),
              body.user.mateExpectMarryTime
            ),
            province: getCountry(body.user.mateProvince),
            city: getCity(body.user.mateProvince, body.user.mateCity),
            marriageStatus: getLabel(
              this.$t("Info.step1.marriageOption"),
              body.user.mateMarriageStatus
            ),
            faith: getLabel(
              this.$t("Info.step1.faithOption"),
              body.user.mateFaith
            ),
            alcohol: getLabel(
              this.$t("Info.step1.alcoholOption"),
              body.user.mateAlcohol
            ),
            smoke: getLabel(
              this.$t("Info.step1.smokeOption"),
              body.user.mateSmoke
            ),
            haveChildern: getLabel(
              this.$t("Info.step1.childOption"),
              body.user.mateHaveChildern
            )
          };
          //择偶标准编辑资料
          this.mateDate = {
            id: body.user.id,
            token: body.user.token,
            mate_age_start: body.user.mateAgeStart,
            mate_age_end: body.user.mateAgeEnd,
            mate_height_start: body.user.mateHeightStart,
            mate_height_end: body.user.mateHeightEnd,
            mate_weight_start: body.user.mateWeightStart,
            mate_weight_end: body.user.mateWeightEnd,
            mate_income: body.user.mateIncome,
            mate_work_province: body.user.mateProvince,
            mate_work_city: body.user.mateCity,
            mate_expect_marry_time: body.user.mateExpectMarryTime,
            mate_province: body.user.mateProvince,
            mate_city: body.user.mateCity,
            mate_marriage_status: body.user.mateMarriageStatus,
            mate_faith: body.user.mateFaith,
            mate_alcohol: body.user.mateAlcohol,
            mate_smoke: body.user.mateSmoke,
            mate_have_childern: body.user.mateHaveChildern,
            work_city:body.user.workCity
          };
          //其他资料
          this.otherInfo = {
            id: this.user.id,
            token: this.user.token,
            evaluation: this.user.evaluation,
            familyevaluation: this.user.familyevaluation,
            unforgettable: this.user.unforgettable,
            favoritethings: this.user.favoritethings,
            qualityofpartner: this.user.qualityofpartner
          };
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    goUserList(current) {
      this.$router.push({ path: "/user/list", params: { current: current } });
    },
    goChat() {
      this.$router.push("/chat");
    },
    onReport() {
      this.$message(this.$t("Layout.prompt5"));
    },
    onHandleLike() {
      if (!this.likeLock) {
        this.likeLock = true;
        this.$ajax(
          PostData(this.$store.state.host + "follow/listFollow", {
            id: this.userInfo.id,
            token: this.userInfo.token,
            uid: this.user.id,
            type: this.isbeckoning ? 1 : 0
          })
        ).then(res => {
          console.log(res.data);
          this.loading = false;
          console.log(res.data);
          if (res.data.code == 0) {
            this.$message({
              message: this.user.isbeckoning
                ? this.$t("UserDetail.prompt4")
                : this.$t("UserDetail.prompt3"),
              type: "success"
            });
            this.$set(this.user,'isbeckoning',!this.user.isbeckoning)
            this.likeLock = false;
          } else {
            this.$message(res.data.msg);
          }
        });
      }
    },
    onTalk() {
      this.$store.dispatch("PUSH_IM_CHART_CHATLIST", this.userData);
      this.$router.push({ path: "/chat" });
    },
    judgeLogin() {
      if (!this.userInfo || !this.userInfo.id) {
        bus.$emit("showLogin", true);
        return false;
      }
    },
    buyVip() {
      this.judgeLogin();
      if (
        this.user.isVip != 1 &&
        this.user.authStatus != 1
      ) {
        //未认证 弹认证
        this.$message("请您先开通认证");
        bus.$emit("showBuy", "identify");
      } else if (this.user.isVip != 1) {
        //认证后未购买vip 弹vip
        bus.$emit("showBuy", "vip");
      }
    },
    buyAuth() {
      this.judgeLogin();
      if (this.user.authStatus != 1) {
        bus.$emit("showBuy", "identify");
      }
    },
    //编辑用户签名
    onEditSignture() {
      this.loading = true;
      if (this.user.description == "") {
        this.$message(this.$t("UserDetail.prompt1"));
        return false;
      } else {
        this.$ajax(
          PostData(this.$store.state.host + "user/updateDescription", {
            id: this.user.id,
            description: this.user.description
          })
        ).then(res => {
          console.log(res.data);
          this.loading = false;
          console.log(res.data);
          if (res.data.code == 0) {
            this.$message({
              message: this.$t("UserDetail.prompt5"),
              type: "success"
            });
            this.editSignture = false;
          } else {
            this.$message(res.data.msg);
          }
        });
      }
    },
    //编辑其他资料
    onEditData() {
      var api = "";
      var data = {};
      if (this.current == 0) {
        api = "user/updateUserDetail";
        this.userData.birthday = new Date(this.userData.birthday).getTime();
        data = this.$refs.user.step1;
      } else if (this.current == 1) {
        //判断范围
        api = "user/updateUserMateSelection";
        data = this.$refs.mate.mateInfo;
        //年龄
        if(!((data.mate_age_start&&data.mate_age_end&&data.mate_age_start<=data.mate_age_end)||(!data.mate_age_start&&!data.mate_age_end))){
          this.$message(this.$t("UserDetail.prompt6"));
          return false;
        //身高
        }else if(!((data.mate_height_start&&data.mate_height_end&&data.mate_height_start<=data.mate_height_end)||(!data.mate_height_start&&!data.mate_height_end))){
          this.$message(this.$t("UserDetail.prompt7"));
          return false;
        //体重
        }else if(!((data.mate_weight_start&&data.mate_weight_end&&data.mate_weight_start<=data.mate_weight_end)||(!data.mate_weight_start&&!data.mate_weight_end))){
          this.$message(this.$t("UserDetail.prompt8"));
          return false;
        }
      } else if (this.current == 2) {
        api = "user/updateUserSelectable";
        data = this.otherInfo;
      }
      this.loading = true;
      data.id = this.$store.state.userInfo.id;
      data.token = this.$store.state.userInfo.token;
      console.log(JSON.stringify(data) + "data");
      this.$ajax(PostData(this.$store.state.host + api, data)).then(res => {
        console.log(res.data);
        this.loading = false;
        console.log(res.data);
        if (res.data.code == 0) {
          if (this.current == 0 || this.current == 1) {
            this.$message({
              message: this.$t("UserDetail.prompt5"),
              type: "success"
            });
          } else {
            this.$message({
              message: this.$t("UserDetail.prompt2"),
              type: "success"
            });
          }
          this.editData = false;
          this.init();
        } else {
          this.$message(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.user-detail {
  .user-info {
    color: #fff;
    .content-center {
      position: relative;
      padding: 50px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      .info-left {
        margin: 0 auto;
        width: 200px;
        height: 200px;
        position: relative;
        img,
        .shadow {
          border-radius: 50%;
          width: 200px;
          height: 200px;
          border: 6px solid #fff;
          box-sizing: border-box;
          position: absolute;
          top: 0;
          left: 0;
        }
        &:hover .shadow {
          display: block;
        }
        .shadow {
          background: rgba(0, 0, 0, 0.4);
          .btn-primary {
            margin: 50% 0 0 50%;
            transform: translate(-50%, -50%);
            width: 108px;
          }
          display: none;
        }
      }
      .shadow-fixed {
        z-index: 3000;
        display: flex;
        align-items: center;
        .modal {
          background: #fff;
          width: 500px;
          margin: 0 auto;
          border-radius: 4px;
          padding: 30px;
          position: relative;
          height: 630px;
          box-sizing: border-box;
        }
      }
      .confirm-list {
        margin-top: 30px;
        text-align: center;
        li {
          display: inline-block;
          height: 20px;
          width: 120px;
          border-right: 1px solid #fff;
          div {
            transform: translateY(-25%);
          }
          span {
            display: inline-block;
          }
          &:last-child {
            border-right: none;
          }
        }
      }
      .info-right {
        width: 260px;
        margin-left: 50px;
        .user-uname {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .user-desc {
          line-height: 24px;
          padding-left: 6px;
        }
        .user-share {
          font-size: 14px;
          margin-top: 10px;
          padding-left: 6px;
        }
        ul {
          position: absolute;
          bottom: -47px;
          margin-left: -10px;
          li {
            display: inline-block;
          }
        }
      }
    }
  }
  .banner-list {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    li {
      padding: 25px 65px;
      width: calc((100% - 10px) / 2);
      height: 120px;
      background: #fff;
      box-sizing: border-box;
      cursor: pointer;
      img {
        & + div {
          height: 70px;
          width: calc(100% - 75px);
          padding-top: 2px;
          p:last-child {
            margin-top: 4px;
          }
        }
      }
    }
  }
  .right-nav {
    background: #fff;
    margin: 10px;
    width: 220px;
    padding: 0 25px 15px 25px;
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    & > ul {
      & > li {
        display: block;
        border-bottom: 1px solid @borderGray;
        padding: 20px 0;
        &:last-child {
          border: none;
        }
        ul.user-data-list {
          margin-top: 20px;
          font-size: 14px;
          li {
            margin-bottom: 10px;
            .list-item {
              padding: 0 10px;
              display: inline-block;
              vertical-align: middle;
              width: 65px;
              cursor: pointer;
            }
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        ul.user-confirm-list {
          margin-top: 20px;
          li {
            margin-bottom: 10px;
            i {
              border-radius: 50%;
              background-color: #ababab;
              margin-right: 10px;
              cursor: default;
            }
          }
        }
      }
    }
  }
  .info-bottom {
    background: #fff;
    padding: 32px;
    min-height: calc(100vh - 650px);
    box-sizing: border-box;
    .user-signture {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      margin-bottom: 40px;
      padding: 0 64px;
      .signture-content {
        padding-top: 20px;
      }
    }
    .info-list {
      margin-top: 40px;
      padding: 0 32px;
      li {
        p:first-child {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        p.item-content {
          margin-bottom: 38px;
        }
        textarea {
          margin-bottom: 12px;
        }
      }
    }
    .btn-primary {
      width: 220px;
      margin: 30px auto 20px auto;
    }
  }
  .icon-report {
    position: absolute;
    right: 0;
    top: 20px;
    text-align: center;
    cursor: pointer;
    p {
      display: none;
      font-size: 12px;
    }
    i {
      .icon-sprite(32px, 32px, -326px, -406px, 0.8);
    }
    &:hover p {
      display: block;
    }
  }
  .tag-default {
    .tag-primary();
    background: #fff;
  }
  .icon-user-active {
    .icon-sprite(42px, 42px, -321px, -278px, 0.8);
    cursor: pointer;
  }
  .icon-user-default {
    .icon-sprite(42px, 42px, -322px, -337px, 0.8);
    cursor: pointer;
  }
  .icon-video-active {
    .icon-sprite(42px, 42px, -388px, -278px, 0.8);
    cursor: pointer;
  }
  .icon-video-default {
    .icon-sprite(42px, 42px, -388px, -336px, 0.8);
    cursor: pointer;
  }
  .icon-edu-active {
    .icon-sprite(42px, 42px, -458px, -278px, 0.8);
    cursor: pointer;
  }
  .icon-edu-default {
    .icon-sprite(42px, 42px, -458px, -336px, 0.8);
    cursor: pointer;
  }
  .icon-heart {
    .icon-sprite(94px, 96px, -106px, -552px, 0.8);
    cursor: pointer;
  }
  .icon-heart-default {
    .icon-sprite(94px, 96px, -349px, -551px, 0.8);
    cursor: pointer;
  }
  .icon-chat {
    .icon-sprite(94px, 96px, -227px, -553px, 0.8);
    cursor: pointer;
  }
  .icon-edit {
    .icon-sprite(30px, 30px, -174px, -271px, 0.8);
    cursor: pointer;
    float: right;
  }
  .icon-mark-left {
    .icon-sprite(36px, 36px, -391px, -399px);
  }
  .icon-mark-right {
    .icon-sprite(36px, 36px, -459px, -404px);
    margin-top: 40px;
  }
  .icon-diamond-default {
    margin-left: 10px;
  }
}
</style>
<style lang="less">
.user-detail {
  img {
    max-height: 70vh;
  }

  .el-tooltip__popper[x-placement^="bottom"] .popper__arrow::after {
    border-bottom-color: #fff;
  }

  .el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
    border-bottom-color: #fff;
  }
  .tip {
    background: #fff !important;
    color: #404040 !important;
  }
  .el-upload-list--picture-card .el-upload-list__item,
  .image-upload .avatar {
    width: 200px;
    height: 200px;
  }
  .image-upload .avatar-uploader-icon,
  .el-upload--picture-card {
    width: 200px;
    height: 200px;
    line-height: 200px;
  }
  .step1 {
    width: 85%;
  }
  .step1 .info-item {
    width: 80% !important;
    margin: 0 30px !important;
  }
  .step3 {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
</style>

