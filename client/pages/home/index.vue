<template>
  <div class="page-home">
    <div class="home-side-bar">
      <el-menu default-active="/home/page-list" router>
        <el-menu-item index="/home/page-list">
          <img class="icon-imgs" src="../../common/images/myicons/pageli.png" alt="">
          <span slot="title">我的节目</span>
        </el-menu-item>
        <el-menu-item index="/home/terminal-list">
          <!-- <i class="el-icon-s-shop"></i> -->
          <img class="icon-imgs" src="../../common/images/myicons/terminal.png" alt="">
          <span slot="title">终端管理</span>
        </el-menu-item>
        <!-- <el-menu-item index="/home/scene-list">>
          <img class="icon-imgs icon-imgimg" src="../../common/images/myicons/scene.png" alt="">
          <span slot="title">场景管理</span>
        </el-menu-item> -->
        <el-menu-item index="/home/resource-list">
          <img class="icon-imgs icon-imgimg" src="../../common/images/myicons/sceneli.png" alt="">
          <span slot="title">资源列表</span>
        </el-menu-item>
        <el-menu-item index="/home/group-list">
          <img class="icon-imgs icon-imgimg" src="../../common/images/myicons/schedul.png" alt="">
          <span slot="title">节目排程</span>
        </el-menu-item>
        <el-menu-item index="/home/subtitle-list">
          <img class="icon-imgs icon-imgimg" src="../../common/images/myicons/program.png" alt="">
          <span slot="title">紧急字幕</span>
        </el-menu-item>
        <el-menu-item index="/home/template-version-list">
          <img class="icon-imgs icon-imgimg" src="../../common/images/myicons/version.png" alt="">
          <span slot="title">模板版本</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="clearfix my-page-list">
      <router-view class="sub-page"/>
    </div>
  </div>
</template>

<script>
	export default {
	}
</script>

<style lang="scss" scoped>
  .page-home {
    display: flex;
    width: 100%;
    height: 100%;
    background: rgb(240, 243, 244);
    .home-side-bar{
      width: 200px;
      background-color: #fff;
      border-right: 1px solid #e6ebed;
      padding-top: 8px;
      z-index: 2;
    }
    .my-page-list{
      flex: 1;
      height: 100%;
      .sub-page{
        height: 100%;
      }
    }
  }
  .icon-imgs{
    width: 18px;
    height: 18px;
    margin-right: 6px;
    box-sizing: border-box;
  }
  .icon-imgimg{
    width: 20px;
    height: 20px;
    margin-right: 4px;
  }
</style>
