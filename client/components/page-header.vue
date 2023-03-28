<template>
  <div class="components-page-header">
    <div class="page-header-inner" :class="{ 'layout-container': !fullWidth, fullWidth: fullWidth }">
      <div class="inline-block logo-wrapper">
        <!-- <img class="cursor-pointer" @click="goHome" src="../common/images/logo.jpg" alt=""> -->
        <div style="display:flex;align-items: center;">
          <img class="cursor-pointer" @click="goHome" style="height:34px;" src="../common/images/hjlogo.png" alt="">
          <!-- <div style="padding-left: 12px;">慧集互联</div> -->
        </div>

        <slot name="left-slot"></slot>
      </div>
      <div class="header-center-wrapper">
        <slot></slot>
      </div>
      <div class="user-wrapper">
        <slot name="right-slot"></slot>
        <userHeadBtn />
      </div>
    </div>
  </div>
</template>

<script>
import userHeadBtn from '@/components/user-head-btn'

export default {
  props: {
    fullWidth: Boolean
  },
  components: {
    userHeadBtn
  },
  methods: {
    // 返回首页（节目列表）
    goHome() {
      if (this.$route.name == 'pageList') return false;
      if (this.$route.name == 'Editor') {
        // 编辑界面，需弹窗提示
        this.$confirm('确认退出编辑?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          this.$router.push({ name: 'Home' })
        }).catch(() => { })
      } else {
        this.$router.push({ name: 'Home' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.components-page-header {
  // height: 100%;
  height: 50px;
  background: white;
  box-shadow: 0 2px 3px 0 rgba(100, 100, 100, 0.06);
}

.page-header-inner {
  display: flex;

  &.fullWidth {
    padding: 0 18px;
  }
}

.logo-wrapper {
  // width: 360px;
  // font-size: 18px;
  // line-height: 48px;
  padding: 7px 0 0 0;
  box-sizing: border-box;

  img {
    display: inline-block;
    height: 36px;
    vertical-align: middle;
  }

  span {
    display: inline-block;
    vertical-align: middle;
  }
}

.header-center-wrapper {
  flex: 1;
  text-align: center;
}

.user-wrapper {
  // width: 360px;
  text-align: right;
  padding-top: 6px;
}
</style>
