<template>
  <div class="content-center clear" v-loading="loading">
    <div class="article-list lf">
      <ul>
        <li class="clear" v-for="(item,idx) in articleList" @click="goDetail(item)">
          <img :src="item.coverImg">
          <div>
            <p class="main-title">{{item.title}}</p>
            <p>{{item.des}}</p>
            <div class="article-share clear">
              <!-- 阅读数 -->
              <p class="lf">
                {{$t("ArticleList.title1")}}
                <span>{{item.browse}}</span>
              </p>
              <!-- 收藏 -->
              <!-- <p class="lf">
                <i
                  class="icon-star-default"
                  v-show="!item.collect"
                  @click="item.collect=!item.collect"
                ></i>
                <i class="icon-star" v-show="item.collect" @click="item.collect=!item.collect"></i>
                <span class="collect-num">{{item.collectNum}}</span>
              </p>-->
              <!-- 分享 -->
              <!-- <share class="rt"></share> -->
            </div>
          </div>
        </li>
      </ul>
      <oe-pagination :pageSize="pageSize" :total="total" @changePage="changePage"></oe-pagination>
    </div>
    <right-nav class="rt" page="article"></right-nav>
  </div>
</template>

<script>
import RightNav from "@/components/RightNav";
import OePagination from "@/components/UI/OePagination";
import Share from "@/components/Share";
import { Decrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name: "articleList",
  components: { RightNav, OePagination, Share },
  data() {
    return {
      articleList: [],
      pageSize: 5,
      total: 1,
      loading: false
    };
  },
  mounted() {
    for (var i = 0; i < this.pageSize; i++) {
      this.articleList.push({
        coverImg: "../../../static/img/cover.jpg",
        browse: 0
      });
    }
    this.changePage(1);
  },
  methods: {
    changePage(pno) {
      this.loading = true;
      this.$ajax(
        PostData(this.$store.state.host + "teaching/listTeachingInfos", {
          page: pno,
          pageSize: this.pageSize
        })
      ).then(res => {
        console.log(res.data);
        this.loading = false;
        if (res.data.code == 0) {
          var body = JSON.parse(Decrypt(res.data.body));
          this.total = body.teachings.totalCount;
          this.articleList = body.teachings.list;
          //阅读数+500
          this.articleList.map((item, index, arr) => {
            item.browse = (Number(item.browse) || 0) + 500;
          });
          console.log(body);
        } else {
          this.$message(res.data.msg);
        }
      });
    },
    goDetail(item) {
      this.$router.push({ name: 'ArticleDetail', params: { id: item.id } });
    }
  }
};
</script>

<style lang="less" scoped>
.content-center {
  padding: 20px 0 50px 0;
}
.article-list {
  width: 760px;
  li {
    .wrapper;
    padding: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    img {
      width: 255px;
      height: 170px;
      border-radius: 10px;
      float: left;
      & + div {
        float: left;
        width: 465px;
        height: 170px;
        padding-left: 20px;
        box-sizing: border-box;
        position: relative;
        .main-title {
          margin: 10px 0 12px 0;
        }
        .article-desc {
          height:40px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .article-share {
          width: 445px;
          border-top: 1px solid @borderGray;
          position: absolute;
          bottom: 10px;
          left: 20px;
          padding-top: 10px;
          box-sizing: border-box;
          line-height: 20px;
          color: #909090;
          .collect-num {
            vertical-align: middle;
            margin-left: 3px;
          }
          p:first-child {
            margin-right: 50px;
          }
        }
      }
    }
  }
}
</style>
