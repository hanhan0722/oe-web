<template>
  <div class="photo-album">
    <div class="info-title">
      <div>
        {{$t("UserDetail.title1")}}
        <div></div>
      </div>
      <!-- eidt -->
      <i class="icon-edit" v-if="type==1" @click="edit=!edit"></i>
    </div>
    <!-- 展示相册 -->
    <div v-if="type==0 ||(type==1 && !edit)">
      <div v-if="photoList && photoList.length>0" class="photo-list">
        <div class="prev" @click="onChangePhoto(-1)" v-if="photoList.length>4">
          <img src="@/assets/img/user/icon_left.png">
        </div>
        <div class="photo-view">
          <ul :style="{width:(w||200)*photoList.length+'px',transform:'translateX('+moveX+'px)'}">
            <li
              v-for="(item,idx) in photoList"
              :style="{width: (w-15||185)+'px',height: (w-15||185)+'px',margin: (200-(w||200))/2+'px 7.5px',overflow:'hidden',background:'#000'}"
              @click="onPreview(item)"
            >
            <img :src="$store.state.imageHost + item.imgurl" style="width:100%;transform: translateY(-50%);margin-top:50%">
            </li>
          </ul>
        </div>
        <div class="next" @click="onChangePhoto(1)" v-if="photoList.length>4">
          <img src="@/assets/img/user/icon_right.png">
        </div>
      </div>
      <div class="photo-required" v-else>{{$t("UserDetail.title26")}}</div>
    </div>
    <!-- 上传相册 -->
    <div v-else>
      <picture-card :list="photoList" w="200px" max="9" ref="picCard"></picture-card>
      <!-- complete -->
      <button class="btn-primary" v-if="type==1" @click="uploadImage">{{$t("UserDetail.button3")}}</button>
    </div>
    <div class="shadow-fixed" v-show="preview">
      <div>
        <i class="icon-close-white" @click="preview=false"></i>
        <img :src="photoUrl">
      </div>
    </div>
  </div>
</template>

<script>
import PictureCard from "@/components/UI/PictureCard";
import { Encrypt, PostData, Decrypt } from "@/assets/utils/secret.js";
export default {
  name: "Photo-Album",
  props: ["photoList", "type","w"],
  components: { PictureCard },
  data() {
    return {
      moveX: 0,
      photoUrl: "",
      preview: false,
      edit: false
    };
  },
  watch:{
    photoList:{
      handler:val=>{},
      deep:true,
      immediate:true
    },
    $route() {
      this.moveX=0;
    }
  },
  mounted() {},
  methods: {
    onChangePhoto(direction) {
      if (direction == -1) {
        if (this.moveX < (0-this.w||-200)) {
          this.moveX += this.w||200;
        } else {
          this.moveX = 0;
        }
      } else if (direction == 1) {
        if (this.moveX > (this.w*4||800) - this.photoList.length * (this.w||200)) {
          this.moveX -= (this.w||200);
        } else {
          this.moveX = (this.w*4||800) - this.photoList.length * (this.w||200);
        }
      }
    },
    onPreview(item) {
      this.preview = true;
      this.photoUrl = this.$store.state.imageHost + item.imgurl;
    },
    uploadImage() {
      var list = this.$refs.picCard.fileList;
      if (list.length == 0) {
        this.edit=false;
      } else {
        console.log(list);
        var obj = Encrypt({
          id: this.$store.state.userInfo.id,
          token: this.$store.state.userInfo.token
        });
        var data = new FormData();
        data.append("sign", obj.sign);
        data.append("data", obj.data);
        for (var i = 0; i < list.length; i++) {
          data.append("imgurl", list[i]);
        }
        var headers = {
          headers: { "Content-Type": "multipart/form-data" }
        };
        this.$ajax
          .post(
            this.$store.state.host + "fileUpLoad/spacePhotos",
            data,
            headers
          )
          .then(res => {
            console.log(res.data);
            if (res.data.code == 0) {
              this.$message(res.data.msg);
              this.edit=false;
              var body = JSON.parse(Decrypt(res.data.body));
              console.log(body);
              this.$store.commit("newPhotoList",body.listAlbum)
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
.photo-album {
  .photo-list {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    .photo-view {
      width: 800px;
      overflow-x: hidden;
    }
    .prev,
    .next {
      border: 1px solid @borderGray;
      width: 45px;
      height: 100px;
      margin: 42.5px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      cursor: pointer;
      img {
        width: 32px;
        height: 32px;
      }
    }
    ul {
      flex-wrap: nowrap;
      margin-bottom: 0;
      padding: 0;
      transition: transform 0.3s linear;
      li {
        display: inline-block;
        border-radius: 6px;
      }
    }
  }
  .photo-required {
    width: 100%;
    text-align: center;
    font-size: 14px;
  }
  .shadow-fixed {
    display: flex;
    justify-content: center;
    align-items: center;
    & > div {
      position: relative;
    }
    img {
      border-radius: 6px;
      max-height: 70vh;
    }
  }
  .btn-primary {
    margin: 30px auto 20px auto;
    width: 220px;
  }
}
.icon-edit {
  .icon-sprite(30px, 30px, -174px, -271px, 0.8, "../");
  cursor: pointer;
  float: right;
}
.icon-camera {
  .icon-sprite(36px, 30px, -111px, -270px, 1, "../");
  margin-bottom: 20px;
}

</style>
