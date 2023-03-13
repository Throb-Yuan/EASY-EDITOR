<template>
  <div class="custom-tree-container" style="min-width:160px;">
    <p class="page-title text-center">媒体资源列表</p>
    <el-scrollbar class="scroll-wrapper page-list-wrapper" style="height: 1000px;padding-bottom: 120px;">
      <el-collapse  v-model="activeName" accordion @change="getResoureList">
        <el-collapse-item v-for="(item, index) in resourcetypeList" :key="index" :name="item.dictValue">
          <template slot="title">
            <div style="padding-left: 12px;">{{ item.dictLabel }} <span style="font-size: 12px;color:#999;"></span></div>
          </template>
          <div v-if="item.children">
            <div class="custom-tree-node" v-for="(node,idx) in item.children" >
            <!-- 自定义节点信息start -->
            <el-tooltip v-if="node.fileType == 'I'" draggable="true" id=""
              class="item" effect="dark" :content="node.resourceName" placement="top-start">

              <div class="fl_line" style="justify-content: start;" draggable="true" @dragstart="drag($event, node)">
                <img style="width: 120px;height: 80px;object-fit:cover;padding-top: 5px;" v-lazy="node.fileUrl"
                  :key="node.fileUrl" alt="">
                <div class="fl_rei fl_line_img" style="margin-left: 10px;"><i class="el-icon-edit hoverb" @click="handleUpdate(node)"></i> <i
                    class="el-icon-delete hoverb" @click="handleDelete(node, data)"></i>
                </div>
              </div>
            </el-tooltip>
            <div v-else>
              <el-tooltip v-if="node.resourceName && node.resourceName.length > 8" class="item" effect="dark"
                :content="node.resourceName" placement="top-start">
                <div class="fl_line" draggable="true" @dragstart="drag($event, node)">
                  <span class="fl_lef">{{ node.resourceName.substring(0, 7) }}...</span>
                  <div class="fl_rei"><i class="el-icon-edit hoverb" @click="handleUpdate(node)"></i> <i class="el-icon-delete hoverb"
                      style="margin-left: 6px;" @click="handleDelete(node, data)"></i> </div>
                </div>
              </el-tooltip>

              <div class="fl_line" v-else-if="node.resourceName" draggable="true" @dragstart="drag($event, node)">
                <span class="fl_lef">{{ node.resourceName }}</span>
                <div class="fl_rei"><i class="el-icon-edit hoverb" @click="handleUpdate(node)"></i> <i class="el-icon-delete hoverb"
                    style="margin-left: 6px;" @click="handleDelete(node, data)"></i> </div>
              </div>

              <span v-else style="font-size: 14px;color: #888;">{{ node.dictLabel }}</span>
            </div>
          </div>
          <div class="show-more" v-if="item.children.length<item.totalNum" @click="getListResource(index)">
            <span>查看更多</span> <i class="el-icon-arrow-down"></i>
          </div>
          </div>
          <div v-else>
            暂无数据
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>
    <div class="fixbom-add">
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加资源</el-button>
    </div>
    <el-dialog :title="title" :visible.sync="addOpen" width="410px" append-to-body @close="resetPage">
      <el-form ref="form">
        <el-form-item>
          <uploadBreakpoint v-if="addOpen" />
        </el-form-item>
        <el-form-item style="text-align: right;width:360px;">
          <el-button @click="addOpen = false">取消</el-button>
          <el-button type="primary" @click="addOpen = false">完成</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 添加或修改资源列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body :close-on-click-modal="false">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="资源名称" prop="resourceName">
          <el-input v-model="form.resourceName" placeholder="请输入资源名称" />
        </el-form-item>

        <el-form-item label="资源类型">
          <el-select v-model="form.resourceTypeId" placeholder="请选择资源类型">
            <el-option v-for="(dict, index) in resourcetypeList" :key="index" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item label="文件大小" prop="fileSizeStr">
          {{ form.fileSizeStr }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import uploadBreakpoint from '@/components/upload-breakpoint'
const baseURL = process.env.VUE_APP_BASE_API
let idx = 1;

export default {
  components: {
    uploadBreakpoint
  },
  data() {
    return {
      resourcetypeList: [
        {
          page:0,
          isGet:false,
          children:[],
          totalNum: 1
        }
      ],
      dictCode: '',
      uploadAction: baseURL + '/file/upload',
      fileList: [],
      resourceTypes: [],
      addOpen: false,
      total: 0,
      form: {},
      title: "上传资源文件",
      // 是否显示弹出层
      open: false,
      activeName:'0'
    }
  },
  created() {
    this.getList();
    // this.$axios.get('https://www.zhihu.com/rss').then(res => {
    //   console.log("zhihu", res);
    // })
  },
  methods: {
    resetPage() {
      // this.queryParams = this.$options.data().queryParams
      this.getList()
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.resourceId != null) {
            this.$API.updateResource(this.form).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.form = this.$options.data.call(this).form

              this.getList();
            });
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      // this.resourceTypeId = ''
      // this.fileList = []
      this.form = {
        resourceId: null,
        resourceName: null,
        resourceTypeId: null,
        resourceMd5: null,
        fileType: null,
        fileUrl: null,
        creatorId: null,
        creator: null,
        createTime: null,
        modifyId: null,
        modifier: null,
        modifyTime: null,
        version: null,
        delStatus: 0
      };
      this.resetForm("form");
    },
    changeFileSize(limit) {
      let size = "";
      if (limit < 1024) {                            //小于1KB，则转化成B
        size = limit.toFixed(2) + "B"
      } else if (limit < 1024 * 1024) {            //小于1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB"
      } else if (limit < 1024 * 1024 * 1024) {        //小于1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB"
      } else {                                            //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
      }

      var sizeStr = size + "";                        //转成字符串
      var index = sizeStr.indexOf(".");                    //获取小数点处的索引
      var dou = sizeStr.substr(index + 1, 2)            //获取小数点后两位的值
      if (dou == "00") {                                //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      }
      return size;
    },
    handleUpdate(node) {
      // this.reset();
      const resourceId = node.resourceId
      this.$API.getResource(resourceId).then(response => {
        this.form = response.data;
        this.form.fileSizeStr = this.changeFileSize(this.form.fileSize);
        this.open = true;
        this.title = "修改资源";
      });
    },
    /** 删除按钮操作 */
    handleDelete(node, data) {
      let row = node
      const resourceIds = row.resourceId;
      let message = row.resourceName ? '是否确认删除资源为"' + row.resourceName + '"的数据项？' : '是否确认删除资源列表编号为"' + resourceIds + '"的数据项？';
      this.$alert(message, '操作提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        type: 'warning',
      }).then(() => {
        this.$API.delResource(resourceIds).then(() => {
          this.$message.success('删除成功！');
          // this.getList();
          // const parent = node.parent;
          // const children = parent.data.children || parent.data;
          // const index = children.findIndex(d => d.id === data.id);
          // children.splice(index, 1);
        })
      })
    },
    /**
    * 节点展开事件
    * @param me 节点所对应的对象
    * @param child 节点对应的 Node
    * @param self 节点组件本身
    */
    getResoureList(code){
      if(!code || this.resourcetypeList[code-1].isGet) return false;
      this.getListResource(code-1)
    },
    getListResource(idx){
        // 获取对应资源文件列表
      this.$API.listResource({ resourceTypeId: this.resourcetypeList[idx].dictValue, pageNum: this.resourcetypeList[idx].page, pageSize: 20 }).then(response => {
          if (response.rows.length) {
            // if (response.rows.length < response.rows.total) {
            //   response.rows.push({
            //     dictLabel: '查看更多',
            //     resourceId: 'I9550B4E98972426BA8D2F54E52D',
            //     dictCode: 'I9550B4E98972426BA8D2F54E52D'
            //   })
            // }
            this.resourcetypeList[idx].totalNum = response.total
            this.resourcetypeList[idx].children = this.resourcetypeList[idx].children.concat(response.rows) 
            this.resourcetypeList[idx].isGet = true
            this.resourcetypeList[idx].page++
            this.$nextTick(() => {
              // this.$refs["tree"].updateKeyChildren(me.dictCode, response.rows);
            })
          } else {
            this.resourcetypeList[idx].children = [{
              dictLabel: '暂无资源',
            }]
          }

        });
    },
    openNodes(me, child, self) {
      if (me.children && me.children.length == 1 && me.children[0].dictLabel.includes('加载中')) {
      

      }
    },
    /**
    * 获取获取资源类型列表转为tree结构
    * @function handleTree 一维转二维tree
    * @function forEach 追加伪节点
    */
    getList() {
      this.$API.dictList({
        pageNum: 1,
        pageSize: 20,
        dictType: 'content_resource_type'
      }).then(response => {

        let resourcetypeList = response.rows
        resourcetypeList.forEach(cur => {
          // idx++
          cur.children = []
          cur.page = 1
          cur.isGet = false
        })
        this.resourcetypeList = resourcetypeList
      });
    },
    /**
    * 拖拽
    * @param ev event信息，可传递node数据
    * @param node 节点数据
    */
    drag(ev, node, data) {
      console.log("drag====", data, node);
      let nodeStr = JSON.stringify(node)
      ev.dataTransfer.setData("node", nodeStr);
    },
    /** 新增按钮操作 */
    handleAdd() {
      // this.reset();
      this.addOpen = true;
      // this.title = "添加资源";
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    beforeAvatarUpload(file) {
      return new Promise(resolve => {
        this.loading = true;
        let isLt2M = file.size / 1024 / 1024 < 1 // 判定图片大小是否小于1MB  
        const isJPG = file.type.includes('image')
        const isGif = file.type.includes('gif')
        if (isLt2M || !isJPG || isGif) {
          resolve(file)
        } else {
          // 可自定义kb
          let toSize = Math.round(file.size / 1024 / 6);
          imageConversion.compressAccurately(file, toSize).then(res => { // console.log(res)
            resolve(res)
          })
        }
      })
    },
    handleSuccess(res) {
      let response = res.data
      let param = {
        resourceId: response.fileId,
        resourceName: response.fileName,
        dictCode: this.dictCode,
        resourceMd5: response.fileHash,
        fileSize: response.fileSize,
        fileType: response.fileId.substr(0, 1),
        fileUrl: baseURL + '/file/download/' + response.fileId
      }

      this.$API.addResource(param).then(() => {
        this.$modal.msgSuccess("新增成功");
        this.addOpen = false;
        this.getList();
      });
      this.loading = false;
    },
  }
};
</script>

<style>
.el-tree-node__content {
  height: auto !important;
}

.custom-tree-node {
  /* flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px; */
  padding-left: 12px;
}

.fixbom-add {
  position: relative;
  bottom: 200px;
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  /* border-top: 0.5px solid #787878; */
}

.custom-tree-node {
  width: 100%;
}

.el-upload {
  display: block;
}
</style>
<style scoped lang="scss">
.fl_line {
  padding-right: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor:pointer;
  &:hover .fl_rei {
    display: inline-block;
  }

  &:hover .fl_line_img {
    display: flex !important;
  }

  .fl_lef {}

  .fl_rei {
    display: none;

    .hoverb:hover {
      animation: mymove 0.5s 1;
      color: #409EFF;
    }

    .el-icon-delete:hover {
      color: #F56C6C;
    }
  }
}

.fl_line_img {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  height: 80px;
  padding: 10px 2px;
}

@keyframes mymove {
  0% {
    // color: #c6e2ff;
    opacity: 0.6;
  }

  50% {
    //  color: #a0cfff;
    opacity: 0.8;
  }

  100% {
    //  color: #409EFF;
    opacity: 1;
  }
}
.show-more{
  width: 100%;
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style>
.el-collapse-item__content {
  padding-bottom: 8px;
}
</style>