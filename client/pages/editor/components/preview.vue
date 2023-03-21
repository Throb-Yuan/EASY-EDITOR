<template>
  <previewWrapper :pageId="pageId" @closePreview="closePreview">
    <p class="page-title paddingL30">节目基础设置</p>
    <div class="preview-info-wrapper">
      <div class="page-info">
        <div class="page-cover">
          <el-upload ref="upload" :action="uploadAction" :show-file-list="false" :on-success="handleSuccess"
            :multiple="false"
            style="border:1px dashed #909399;width: 122px;height: 122px;border-radius: 6px;box-sizing: border-box;">
            <img v-if="!coverImage" src="../../../common/images/quark--pagecover-image.png" alt="">
            <img v-else :src="coverImage" alt="">
          </el-upload>
        </div>
        <div class="page-title-des">
          <div class="info-form-wrapper">
            <div class="info-form-l">节目名称：</div>
            <div class="info-form-r">
              <el-input :maxlength="24" v-model="pageData.title" />
            </div>
          </div>
          <div class="info-form-wrapper">
            <div class="info-form-l">节目场景：</div>
            <div class="info-form-r" v-show="!addScene">
              <el-select v-model="pageData.sceneId" placeholder="请选择场景" :disabled="!!pageId">
                <el-option v-for="(dict, index) in sceneList" :key="index" :label="dict.sceneName"
                  :value="dict.sceneId" />
              </el-select>
              <el-button icon="el-icon-plus" type="text" style="margin-left: 12px;" @click="addScenes">新增场景</el-button>
            </div>
            <div class="info-form-r" v-show="addScene">
              <el-input :maxlength="10" v-focus ref="sceneName" v-model="newScene" style="width:210px;" />
              <el-button icon="el-icon-close" type="text" style="margin-left: 12px;"
                @click="addScene = false"></el-button>
              <el-button icon="el-icon-check" type="text" style="margin-left: 12px;" @click="submitForm"></el-button>
            </div>
          </div>

          <div class="info-form-wrapper">
            <div class="info-form-l">节目描述：</div>
            <div class="info-form-r">
              <el-input type="textarea" :rows="3" :maxlength="200" v-model="pageData.description" />
            </div>
          </div>
        </div>
      </div>
      <div class="foot-btn-wrapper">
        <el-button type="primary" @click="publishFn">保存节目</el-button>
        <el-button @click="preview">预览节目</el-button>
        <el-button @click="closePreview">取 消</el-button>
      </div>
    </div>
  </previewWrapper>
</template>

<script>
import previewWrapper from '@client/components/preview-wrapper'
const baseURL = process.env.VUE_APP_BASE_API
export default {
  components: {
    previewWrapper
  },
  props: {
    pageId: String,
    sceneList: {
      type: Array,
      require: true
    },
    pageData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      addScene: false,
      newScene: '',
      uploadAction: baseURL + '/file/upload',
      coverImage: '',
    }
  },
  directives: {
    /**
     * 注册一个局部的自定义指令
     * 解决el-input源码嵌套问题导致的自动focus无效
     */
    focus: {
      inserted: function (el) {
        el.querySelector('input').focus()
      }
    }
  },
  created() {
    // 拼接节目封面
    if (this.pageData.pages[0].coverResourceId) {
      this.coverImage = baseURL + "/file/download/" + this.pageData.pages[0].coverResourceId
    }
  },
  methods: {
    /**
     * 新增场景，输入框自动聚焦
     */
    addScenes() {
      this.addScene = true
      this.$nextTick(() => this.$refs.sceneName.focus());

    },
    /**
     * 关闭弹窗事件
     */
    closePreview() {
      this.$emit('closePreview', false);
    },
    publishFn() {
      this.$emit('publishFn')
    },
    saveFn() {
      this.$emit('saveFn')
    },
    saveHtmlFn() {
      this.$emit('saveHtmlFn')
    },
    // 预览
    preview() {
      if (process.env.NODE_ENV == 'production') {
        // 暂只支持测试环境
        localStorage.setItem("previewPageData", JSON.stringify(this.pageData))
        window.open('http://192.168.101.250:8887/previews/html/index/preview.html')
      } else {
        this.$message.warning('暂只支持在测试环境预览')
      }

    },
    // 上传节目封面成功
    handleSuccess(res, file) {
      this.coverImage = URL.createObjectURL(file.raw);
      this.pageData.pages[0].coverResourceId = res.data.fileId
    },
    /** 新增场景
     * 成功后重新拉取新的列表
     */
    submitForm() {
      if (!this.newScene) {
        this.$message.warning('请输入场景名称')
        return false
      }
      let disableText = '/\:*?"<>|'
      for (let i = 0; i < this.newScene.length; i++) {
        if (disableText.includes(this.newScene[i])) {
          this.$message.warning('请勿携带特殊字符/\:*?"<>|');
          return false
        }
      }
      this.$API.addScene({ sceneName: this.newScene }).then(res => {
        if (res.code == 200) {
          this.$modal.msgSuccess("新增成功");
          this.$emit('getSceneList', this.newScene)
          setTimeout(() => {
            this.addScene = false;
          }, 500);
        }
      });
    },
  }
}
</script>

<style lang="scss" scoped>
.preview-info-wrapper {
  padding: 30px 30px 60px;
}

.page-info {
  display: flex;

  .page-cover {
    width: 122px;
    height: 122px;

    img {
      width: 120px;
      height: 120px;
      border-radius: 4px;
      object-fit: cover;
    }

    overflow: hidden;
  }

  .page-title-des {
    padding-left: 20px;
    flex: 1;
  }
}

.info-form-wrapper {
  display: flex;
  padding-bottom: 16px;

  .info-form-l {
    line-height: 42px;

    &.com-width {
      width: 120px;
    }
  }

  .info-form-r {
    flex: 1;
    padding-left: 10px;
  }
}

.foot-btn-wrapper {
  position: absolute;
  left: 0;
  bottom: 8px;
  height: 60px;
  padding: 8px 30px;
}

.share-wx-config-wrapper {
  margin-top: 14px;
  padding: 12px;
  background-color: #f0f3f4;
}
</style>
