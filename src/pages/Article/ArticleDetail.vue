<template>
  <div class="content-center clear" v-loading="loading">
    <div class="lf">
      <div class="article-detail">
        <router-link to="/article">
          <p class="back-list">
            <i class="icon-left"></i>
            <span>{{$t("ArticleDetail.title1")}}</span>
          </p>
        </router-link>
        <!-- 标题 -->
        <p class="main-title">{{article.title}}</p>
        <div class="article-info clear">
          <!-- 时间 -->
          <p class="lf">{{$t("ArticleList.title3")}}{{article.publishTime | timeFormat}}</p>
          <!-- 作者 -->
          <p class="lf">{{$t("ArticleList.title2")}}{{article.author}}</p>
          <!-- <share class="rt"></share> -->
        </div>
        <!-- 内容 -->
        <div class="article-content" v-html="article.contents"></div>
        <!-- <div class="wrapper-collect">
          <i
            class="icon-collect-default"
            v-show="!article.collect"
            @click="article.collect=!article.collect"
          ></i>
          <i
            class="icon-collect"
            v-show="article.collect"
            @click="article.collect=!article.collect"
          ></i>
          <p>收藏</p>
        </div>-->
        <div class="article-prompt">
          <div class="clear">
            <!-- 阅读数 -->
            <p class="lf">
              {{$t("ArticleList.title1")}}
              <span>{{article.browse}}</span>
            </p>
            <!-- <p class="lf">
              <i
                class="icon-star-default"
                v-show="!article.collect"
                @click="article.collect=!article.collect"
              ></i>
              <i
                class="icon-star"
                v-show="article.collect"
                @click="article.collect=!article.collect"
              ></i>
              <span class="collect-num">{{article.collectNum}}</span>
            </p>-->
          </div>
          <p class="prompt">{{$t("ArticleDetail.title2")}}</p>
        </div>
      </div>
      <footer class="clear">
        <!-- 上一篇 -->
        <button
          class="lf"
          @click="changeArticle(article.previousId)"
        >{{$t("ArticleDetail.button1")}}{{article.previousTitle||$t("ArticleDetail.title3")}}</button>
        <!-- 下一篇 -->
        <button class="rt" @click="changeArticle(article.nextId)">{{$t("ArticleDetail.button2")}}{{article.nextTitle||$t("ArticleDetail.title3")}}</button>
      </footer>
    </div>
    <right-nav class="rt" page="article"></right-nav>
  </div>
</template>

<script>
import RightNav from "@/components/RightNav";
import Share from "@/components/Share";
import { Decrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name: "articleDetail",
  components: { RightNav, Share },
  data() {
    return {
      article: {
        id: "001",
        cover: "../../../static/img/cover.jpg",
        title: "",
        contents: "",
        browse: 0,
        collectNum: 0,
        collect: false,
        publishTime: "",
        author: ""
      },
      loading: false
    };
  },
  watch: {
    $route() {
      this.getArticleData();
    }
  },
  mounted() {
    this.getArticleData();
  },
  methods: {
    changeArticle(id) {
      if (id) {
        this.$router.push({ name: 'ArticleDetail', params: { id: id } });
      }
    },
    getArticleData() {
      this.loading = true;
      this.$ajax(
        PostData(this.$store.state.host + "teaching/getTeachingInfo", {
          tid: this.$route.params.id,
          language:this.$store.state.lang
        })
      ).then(res => {
        console.log(res.data);
        this.loading = false;
        if (res.data.code == 0) {
          var body = JSON.parse(Decrypt(res.data.body));
          console.log(body);
          this.article = body.teachingInfo;
          this.$set(
            this.article,
            "browse",
            (Number(this.article.browse) || 0) + 500
          );
        } else {
          this.$message(res.data.msg);
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@imgPath: "../../assets/img/user/";
.content-center {
  padding: 20px 0 50px 0;
}
.article-detail {
  .wrapper;
  width: 760px;
  padding: 30px 40px;
  box-sizing: border-box;
  margin-bottom: 20px;
  .back-list {
    cursor: pointer;
    span {
      vertical-align: middle;
    }
  }
  .main-title {
    text-align: center;
    padding: 16px 0;
  }
  .article-info {
    line-height: 20px;
    color: #909090;
    padding: 5px 0;
    border-top: 1px solid @borderGray;
    border-bottom: 1px solid @borderGray;
    margin-bottom: 16px;
    p:first-child {
      margin-right: 50px;
    }
  }
  .article-content {
    padding: 0 30px;
    margin-bottom: 30px;
    img {
      display: block;
      max-width: 80%;
      margin: 30px auto;
    }
  }
  .wrapper-collect {
    text-align: center;
    margin-bottom: 20px;
    p {
      margin-top: 5px;
    }
  }
  .article-prompt {
    color: #909090;
    .clear {
      p:first-child {
        margin-right: 50px;
      }
    }
    .collect-num {
      vertical-align: middle;
    }
    .prompt {
      text-align: center;
      padding: 30px 0;
    }
  }
}
footer {
  button {
    width: 350px;
    background: #fff;
    border-radius: 10px;
    padding: 7px;
    cursor: pointer;
    margin: 0 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.icon-left {
  .icon(16px, 16px, url("@{imgPath}icon_left.png"));
}
.icon-collect-default {
  .icon-sprite(42px, 42px, -164px, -462px);
  cursor: pointer;
}
.icon-collect {
  .icon-sprite(42px, 42px, -103px, -462px);
  cursor: pointer;
}
</style>
