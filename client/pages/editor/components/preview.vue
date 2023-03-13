<template>
  <previewWrapper :pageId="pageId" @closePreview="closePreview">
    <p class="page-title paddingL30">节目基础设置</p>
    <div class="preview-info-wrapper">
      <div class="page-info">
        <div class="page-cover">
          <!-- <imageCropper :url.sync="pageData.coverImage"/> -->
          <el-upload ref="upload" :action="uploadAction" :show-file-list="false" 
            :on-success="handleSuccess" :multiple="false" style="border:1px dashed #909399;width: 122px;height: 122px;border-radius: 6px;box-sizing: border-box;">
            <img v-if="!coverImage" src="../../../common/images/quark--pagecover-image.png" alt="">
            <img v-else :src="coverImage" alt="">
          </el-upload>

          <!-- <img src="../../../common/images/quark--pagecover-image.png" alt=""> -->
        </div>
        <div class="page-title-des">
          <div class="info-form-wrapper">
            <div class="info-form-l">节目名称：</div>
            <div class="info-form-r">
              <el-input :maxlength="24" v-model="pageData.title"/>
            </div>
          </div>
          <div class="info-form-wrapper">
            <div class="info-form-l">节目描述：</div>
            <div class="info-form-r">
              <el-input type="textarea" :rows="3" :maxlength="200" v-model="pageData.description"/>
            </div>
          </div>
        </div>
      </div>
      <!--翻页方式-->
      <!-- <div class="info-form-wrapper">
        <div class="info-form-l">
          <el-checkbox v-model="pageData.shareConfig.shareWx">设置微信分享样式</el-checkbox>
        </div>
      </div>
      <div v-show="pageData.shareConfig.shareWx" class="share-wx-config-wrapper marginB30">
        <div class="info-form-r page-info">
          <div class="page-cover">
            <imageCropper :url.sync="pageData.shareConfig.coverImage"/>
          </div>
          <div class="page-title-des">
            <div class="info-form-wrapper">
              <div class="info-form-l">分享标题：</div>
              <div class="info-form-r">
                <el-input v-model="pageData.shareConfig.title"/>
              </div>
            </div>
            <div class="info-form-wrapper">
              <div class="info-form-l">分享描述：</div>
              <div class="info-form-r">
                <el-input type="textarea" :rows="2" v-model="pageData.shareConfig.description"/>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <!--翻页方式-->
      <!-- <div class="info-form-wrapper">
        <div class="info-form-l com-width">翻页方式：</div>
        <div class="info-form-r">
          <el-select v-model="pageData.flipType">
            <el-option label="上下翻页" :value="0"/>
            <el-option label="左右翻页" :value="1"/>
            <el-option label="翻书效果" :value="2"/>
          </el-select>
        </div>
      </div> -->
      <!--翻页方式-->
      <!-- <div class="info-form-wrapper">
        <div class="info-form-l com-width"></div>
        <div class="info-form-r">
          <el-checkbox v-model="pageData.slideNumber">显示页码</el-checkbox>
        </div>
      </div> -->
      <!--作品访问状态-->
      <!-- <div class="info-form-wrapper">
        <div class="info-form-l com-width">作品访问状态：</div>
        <div class="info-form-r">
          <el-select v-model="pageData.status">
            <el-option label="允许访问" :value="1"/>
            <el-option label="不允许访问" :value="0"/>
          </el-select>
        </div>
      </div> -->
      <!--节目场景-->
      <div class="info-form-wrapper">
        <div class="info-form-l com-width">节目场景：</div>
        <div class="info-form-r">
          <el-select v-model="pageData.sceneId" placeholder="请选择场景" :disabled="!!pageId">
            <el-option v-for="(dict, index) in sceneList" :key="dict.sceneId" :label="dict.sceneName"
              :value="dict.sceneId" />
          </el-select>
        </div>
      </div> 
      <div class="foot-btn-wrapper">
        <el-button type="primary" @click="publishFn">保存节目</el-button>
        <el-button @click="preview">预览节目</el-button>
        <!-- <el-button @click="saveHtmlFn">复制HTML</el-button> -->
        <el-button @click="closePreview">取 消</el-button>
      </div>
    </div>
  </previewWrapper>
</template>

<script>
	import previewWrapper from '@client/components/preview-wrapper'
	import imageCropper from '@client/components/image-cropper'
  const baseURL = process.env.VUE_APP_BASE_API
	export default {
		components: {
			previewWrapper,
			imageCropper
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
        uploadAction: baseURL + '/file/upload',
        coverImage:''
      }
		},
    created(){
      if (this.pageData.pages[0].coverResourceId) {
        this.coverImage = baseURL+"/file/download/"+this.pageData.pages[0].coverResourceId
      }
    },
		methods: {
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
				localStorage.setItem("previewPageData",JSON.stringify(this.pageData))
				window.open('http://192.168.101.250:8887/previews/html/index/preview.html')
			}else{
				this.$message.warning('暂只支持在测试环境预览')
			}
			
		},
    handleSuccess(res,file) {
      console.log(this.pageData);
      this.coverImage = URL.createObjectURL(file.raw);
      this.pageData.pages[0].coverResourceId = res.data.fileId
      console.log("this.pageData,==",this.pageData);
      // this.loading = false;
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
      img{
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
