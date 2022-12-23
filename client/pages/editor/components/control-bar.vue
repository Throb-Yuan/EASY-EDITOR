/**
* 控制按钮
*/
<template>
  <div class="components-contrl-bar">

    <!-- <div style="display: inline-block;margin-right: 4px;">
      <div style="display: inline-block;height: 80px;line-height: 80px;vertical-align: middle;">比例:</div>
    </div> -->
    <div class="button-item" style="width:100px">
      <el-dropdown split-button size="small" type="" @command="changeSize">
        {{ ratioValue }}
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(item, index) in screenRatio" :key="index" :command="item.value">{{ item.label
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <div class="button-item scale-wrappper">
      <span class="scale-btn" @click="updateScale('reduce')">
        <i class="el-icon-zoom-out"></i>
      </span>
      <span class="scale-input">{{ parseFloat(scaleValue * 100).toFixed(0) }}%</span>
      <span class="scale-btn" @click="updateScale('plus')">
        <i class="el-icon-zoom-in"></i>
      </span>
    </div>
    <div class="button-item" :class="{ disabled: !canUndo }" @click="editorUndo">
      <i class="iconfont iconundo1"></i>
      <p>撤销</p>
    </div>
    <div class="button-item" :class="{ disabled: !canRedo }" @click="editorRedo">
      <i class="iconfont iconredo1"></i>
      <p>重做</p>
    </div>
    <!-- <UploadPsd @upload-success="uploadSuccessPsd">
      <div class="button-item">
        <i class="iconfont iconps"></i>
        <p>导入psd</p>
      </div>
    </UploadPsd> -->
    <!-- <div class="button-item" @click="returnHtml">
      <i class="el-icon-upload2"></i>
      <p>上传HTML</p>
    </div> -->
    <div class="button-item" @click="showPreview">
      <i class="iconfont iconyulan"></i>
      <p>预览保存</p>
    </div>
    <!--<div class="button-item" @click="save">-->
    <!--<i class="iconfont iconbaocun"></i>-->
    <!--<p>保存</p>-->
    <!--</div>-->
    <!--<div class="button-item" @click="publishFn">-->
    <!--<i class="iconfont iconfabu"></i>-->
    <!--<p>发布</p>-->
    <!--</div>-->
    <div class="button-item" @click="cancelFn">
      <i class="iconfont icontuichu"></i>
      <p>退出</p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import UploadPsd from '@client/components/upload-psd'
export default {
  components: {
    UploadPsd
  },
  props: {
    // 是否loading
    loading: {
      type: Boolean,
      default: false
    },
    scale: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 画板缩放
      scaleValue: 1,
      screenRatio: [{
        value: '16:9',
        label: '16:9',
        toWidth:800,
        toHeight:450
      }, {
        value: '16:10',
        label: '16:10',
        toWidth:800,
        toHeight:500
      }, {
        value: '9:16',
        label: '9:16',
        toWidth:450,
        toHeight:800
      }, {
        value: '手机端',
        label: '手机端',
        toWidth:375,
        toHeight:664
      }],
      ratioValue: '16:9'
    }
  },
  computed: {
    ...mapGetters([
      'canUndo',
      'canRedo'
    ])
  },
  created() {
    this.scaleValue = this.scale;
  },
  methods: {
    ...mapActions([
      'editorUndo',
      'editorRedo'
    ]),
    /**
     * 更改画布大小
     * @param e 画布比例
     */
    changeSize(e) {
        this.ratioValue = e
        let objTwow = {
          e,
          arr:this.screenRatio
        }
        this.$emit('changeRatio', objTwow)
      },
    /**
     * 更新画板大小
     */
    updateScale(type, value) {
      if (type === 'plus') {
        this.scaleValue = this.scaleValue + (value || 0.1) > 2 ? 2 : this.scaleValue + (value || 0.1)
      } else if (type === 'reduce') {
        this.scaleValue = this.scaleValue - (value || 0.1) > 0.5 ? this.scaleValue - (value || 0.1) : 0.5;
      } else if (type === 'reset') {
        this.scaleValue = value || 1;
      }

      this.$emit('update:scale', this.scaleValue)
    },
    /**
     * 获取psd数据
     */
    uploadSuccessPsd(dataList) {
      this.$emit('import-psd-data', dataList)
    },
    /**
     * 点击保存按钮
     */
    save() {
      this.$emit('save')
    },
    /**
     * 显示预览
     */
    showPreview() {
      this.$emit('showPreview')
    },
    /**
     * 输出复制HTML
     */
    returnHtml() {
      this.$emit('returnHtml')
    },
    /**
     * 发布
     */
    publishFn() {
      this.$emit('publish')
    },
    cancelFn() {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
.components-contrl-bar {
  display: inline-block;
  z-index: 3;
  padding: 2px 12px;
  height: 30px;

  .button-item {
    display: inline-block;
    width: 68px;
    cursor: pointer;
    text-align: center;
    vertical-align: bottom;
    font-size: 14px;
    transition: color 0.28s, transform 0.28s;
    user-select: none;

    &.scale-wrappper {
      width: 110px;
      margin-right: 10px;

      &:hover {
        color: inherit;
        transform: none;
      }

      &>.scale-btn {
        display: inline-block;
        vertical-align: middle;
        padding: 6px 2px;
        font-size: 20px;
        transition: all 0.28s;

        &:hover {
          color: $primary;
        }
      }
    }

    &:hover {
      color: $primary;
      transform: scale(1.02);
      font-weight: bold;
    }

    &.disabled {
      cursor: not-allowed;
      color: $gray !important;
    }

    &>i {
      font-size: 18px;
      display: inline-block;
      transition: all 0.28s;
    }

    &>p {
      font-size: 14px;
    }
  }
}

.scale-input {
  display: inline-block;
  position: relative;
  padding: 7px 0;
  width: 46px;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 17px;
  margin: 0 4px;

  &:hover {
    background: #dfdfdf;
  }
}
</style>
