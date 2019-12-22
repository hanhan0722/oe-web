<template>
  <div class="oe-pagination" v-show="total>0">
    <button class="btn-default" @click="goPrevPage">{{$t("Components.oe_pagination.button1")}}</button>
    <ul class="pno-list" v-if="cno<=10">
      <li v-for="item in cno" :class="item==pno?'active':''" @click="onPageChange(item)">{{item}}</li>
    </ul>
    <ul class="pno-list" v-else-if="pno<8">
      <li v-for="item in 8" :class="item==pno?'active':''" @click="onPageChange(item)">{{item}}</li>
      <li class="points">...</li>
      <li :class="cno==pno?'active':''" @click="onPageChange(cno)">{{cno}}</li>
    </ul>
    <ul class="pno-list" v-else-if="pno>cno-7">
      <li :class="pno==1?'active':''" @click="onPageChange(1)">1</li>
      <li class="points">...</li>
      <li
        v-for="item in pageArr"
        :class="item==pno?'active':''"
        @click="onPageChange(item)"
      >{{item}}</li>
    </ul>
    <ul class="pno-list" v-else>
      <li :class="pno==1?'active':''" @click="onPageChange(1)">1</li>
      <li class="points">...</li>
      <li
        v-for="item in pageArr"
        :class="item==pno?'active':''"
        @click="onPageChange(item)"
      >{{item}}</li>
      <li class="points">...</li>
      <li :class="cno==pno?'active':''" @click="onPageChange(cno)">{{cno}}</li>
    </ul>
    <button class="btn-default" @click="goNextPage">{{$t("Components.oe_pagination.button2")}}</button>
  </div>
</template>

<script>
export default {
  name: "OePagination",
  props: ["pageSize", "total"],
  data() {
    return {
      pno: 1,
      cno: 1,
      pageArr: [3, 4, 5, 6, 7, 8]
    };
  },
  watch: {
    pno() {
      if (this.cno > 10 && this.pno >= 8) {
        this.pageArr = [];
        if (this.pno < this.cno - 6) {
          for (var i = 0; i < 6; i++) {
            this.pageArr.push(this.pno - 2 + i);
          }
        } else if (this.pno >= this.cno - 6) {
          for (var i = 0; i < 8; i++) {
            this.pageArr.push(this.cno - 7 + i);
          }
        }
      }
    },
    total: {
      handler(val) {
        this.cno = Math.ceil(this.total / this.pageSize);
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    onPageChange(pno) {
      if (pno != this.pno) {
        this.pno = pno;
        this.$emit("changePage", pno);
      }
    },
    goPrevPage() {
      if (this.pno > 1) {
        this.onPageChange(this.pno-1);
      }
    },
    goNextPage() {
      if (this.pno < this.cno) {
        this.onPageChange(this.pno+1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.oe-pagination {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}
.pno-list {
  margin: 0 5px;
  li {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    display: inline-block;
    cursor: pointer;
    margin: 0 5px;
  }
  li.points {
    cursor: default;
  }
}
.active {
  background: @oePink;
  color: #fff;
  font-size: 14px;
}
</style>
