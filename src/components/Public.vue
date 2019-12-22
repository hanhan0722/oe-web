<template>
  <div class="public">
  </div>
</template>

<script>
import { Decrypt, PostData } from "@/assets/utils/secret.js";
export default {
  name: "Public",
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    valiLogin() {
      if (!this.$store.state.userInfo.id) {
        this.$message.error(this.$t("UserRecommend.prompt1"));
        bus.$emit("showLogin", true);
        return false;
      } else {
        return true;
      }
    },
  }
};
</script>

<style lang="less" scoped>

</style>
