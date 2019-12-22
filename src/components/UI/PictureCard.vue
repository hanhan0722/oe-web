<template>
  <div class="picture-card">
    <ul class="picture-list el-upload-list el-upload-list--picture-card">
      <!-- 展示的图片 -->
      <li
        class="el-upload-list__item is-success"
        v-if="list && list.length>0"
        v-for="(item,idx) in list"
      >
        <img
          :src="$store.state.imageHost + item.imgurl"
          class="picture"
          :style="{width: w||'150px',height: w||'150px'}"
        >
        <span class="el-upload-list__item-actions">
          <i
            class="icon-preview"
            @click="handlePicturePreview($store.state.imageHost + item.imgurl)"
          ></i>
          <i class="icon-delete" @click="handleRemove(idx,'image')"></i>
        </span>
      </li>
      <!-- 上传的图片 -->
      <li class="el-upload-list__item is-success" v-for="(item,idx) in imageList">
        <img :src="item" class="picture" :style="{width: w||'150px',height: w||'150px'}">
        <span class="el-upload-list__item-actions">
          <i class="icon-preview" @click="handleUploadImagePreview(fileList[idx])"></i>
          <i class="icon-delete" @click="handleRemove(idx,'file')"></i>
        </span>
      </li>
      <!-- 上传图片选择框 -->
      <li>
        <el-upload
          action
          multiple
          list-type="picture-card"
          :on-preview="handleUploadImagePreview"
          :on-remove="handleRemove"
          :auto-upload="false"
          :show-file-list="false"
          :on-change="onChange"
          :before-upload="beforeAvatarUpload"
          class="upload"
          v-if="!max||(imageList.length+((list&&list.length)||0)<max)"
          :limit="max-0||100"
          :on-exceed="onExceed"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <div class="shadow-fixed" v-show="preview">
          <div>
            <i class="icon-close-white" @click="preview=false"></i>
            <img :src="photoUrl">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { PostData } from "@/assets/utils/secret.js";
export default {
  name: "PictureCard",
  props: ["max", "list", "w"],
  data() {
    return {
      photoUrl: "",
      preview: false,
      imageList: [],
      fileList: [],
      fileNameList: []
    };
  },
  watch: {
    list: {
      handler(val) {},
      deep: true,
      immediate: true
    }
  },
  mounted() {
    console.log(this.list);
  },
  methods: {
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt3M = file.size / 1024 / 1024 < 3;

      if (!isJPG && !isPNG) {
        this.$message(this.$t("Components.image_upload.prompt1"));
      }
      if (!isLt3M) {
        this.$message(this.$t("Components.image_upload.prompt2"));
      }
      return (isJPG || isPNG) && isLt3M;
    },
    onChange(file) {
      if (this.beforeAvatarUpload(file.raw)) {
        if (this.fileNameList.indexOf(file.raw.name) == -1) {
          this.imageList.push(window.URL.createObjectURL(file.raw));
          this.fileList.push(file.raw);
          this.fileNameList.push(file.raw.name);
        } else {
          this.$message(this.$t("Components.image_upload.prompt4"));
        }
      }
    },
    onExceed(file, fileList) {
      this.$message(this.$t("Components.image_upload.prompt3"));
      this.imageList = this.imageList.slice(0, this.max || 100);
      this.fileList = this.fileList.slice(0, this.max || 100);
    },
    handleRemove(idx, type) {
      console.log(idx);
      this.$confirm("确定要删除吗", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (type == "image") {
            this.$ajax(
              PostData(this.$store.state.host + "album/deleteAlbum", {
                pid: this.list[idx].id,
                id: this.$store.state.userInfo.id
              })
            ).then(res => {
              console.log(res.data);
              if (res.data.code == 0) {
                console.log(res.data);
                this.$store.state.photoList.splice(idx, 1);
                this.$message({ message: res.data.msg, type: "success" });
              } else {
                this.$message(res.data.msg);
              }
            });
          } else {
            this.fileList.splice(idx, 1);
            this.imageList.splice(idx, 1);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        .catch(() => {});
    },
    handleUploadImagePreview(file) {
      console.log(file);
      this.photoUrl = window.URL.createObjectURL(file);
      this.preview = true;
    },
    handlePicturePreview(url) {
      this.photoUrl = url;
      this.preview = true;
    }
  }
};
</script>
<style lang="less" scoped>
.picture-list {
  li {
    display: inline-block;
    margin-right: 12px;
    &:last-child {
      margin-right: 0;
    }
    .picture {
      border-radius: 6px;
    }
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
}
.upload {
  float: left;
}
</style>
