<template>
  <div class="oe-select">
    <div class="clear">
      <div class="select-box lf" @click.stop="onSelectClick" :style="{width:width?width:'80px'}">
        <slot name="icon"></slot>
        <p v-if="!label" class="select-holder">{{placeholder||$t("Components.oe_select.placeholder")}}</p>
        <p v-else>{{label}}</p>
        <i class="icon-arrow-bottom"></i>
      </div>
    </div>
    <transition name="fade">
      <ul
        v-show="showMenu && options.length>0"
        :style="{width:width?width:'80px'}"
        ref="optionList"
      >
        <li v-for="(item,idx) in options" @click="onSelectOption(idx)">{{item.label}}</li>
      </ul>
    </transition>
  </div>
</template>

<script>
import bus from "@/assets/utils/bus.js";
export default {
  name: "OeSelect",
  props: ["options", "width", "placeholder", "option", "scroll", "id"],
  model: {
    prop: "option",
    event: "select"
  },
  data() {
    return {
      showMenu: false,
      label: ""
    };
  },
  watch: {
    option: {
      handler: function(val) {
        for (var p of this.options) {
          if (this.option == p.value) {
            this.label = p.label;
          }
        }
      },
      deep: true
    }
  },
  mounted() {
    var _this = this;
    if (this.option) {
      for (var p of this.options) {
        if (this.option == p.value) {
          this.label = p.label;
        }
      }
    }
    $("body").click(() => {
      this.showMenu = false;
    });
    bus.$on("onHideMenu", function(cb) {
      _this.showMenu && (_this.showMenu = false);
      cb();
    });
  },
  methods: {
    onSelectClick() {
      new Promise((resolve, reject) => {
        bus.$emit("onHideMenu", function() {
          resolve();
        });
      }).then(() => {
        this.showMenu = true;
        if (this.scroll) {
          $(this.$refs.optionList).animate({ scrollTop: this.scroll }, 10);
        }
      });
    },
    onSelectOption(idx) {
      this.showMenu = false;
      this.label = this.options[idx].label;
      this.id && (this.options[idx].id = this.id);
      this.$emit("select", this.options[idx].value);
      this.$emit("change", this.options[idx]);
    }
  }
};
</script>

<style lang="less" scoped>
@imgPath: "../../assets/img/user/";
.oe-select {
  min-width: 80px;
  display: inline-block;
  vertical-align: middle;
  .select-box {
    border: 1px solid @borderGray;
    height: 32px;
    border-radius: 16px;
    background: #fff;
    padding: 8px 0;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    cursor: pointer;
    p {
      width: calc(100% - 24px);
      line-height: 15px;
      text-align: center;
      border-right: 1px solid @borderGray;
    }
    .icon-arrow-bottom {
      .icon(10px, 10px, url("@{imgPath}icon_arrow_bottom.png"));
      margin: 0 5px;
    }
    .select-holder {
      color: #999999;
    }
  }
  ul {
    position: absolute;
    min-width: 80px;
    margin-top: 5px;
    max-height: 200px;
    background: #fff;
    border: 1px solid @borderGray;
    padding: 10px 0;
    border-radius: 4px;
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.06);
    z-index: 100;
    overflow-x: hidden;
    overflow-y: auto;
    li {
      padding: 0 10px;
      line-height: 28px;
      cursor: pointer;
      &:hover {
        background: #f5f7fa;
        color: @oePink;
      }
    }
  }
}
</style>
