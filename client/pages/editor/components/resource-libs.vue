<template>
  <div class="custom-tree-container" style="min-width:160px;">
    <p class="page-title text-center">媒体资源列表</p>
    <el-scrollbar class="scroll-wrapper page-list-wrapper" style="height: 1000px;padding-bottom: 120px;">
      <div class="block">
        <el-tree ref="tree" :data="resourcetypeList" node-key="resourceTypeId" :label="'resourceTypeName'"
          children="children" accordion :expand-on-click-node="true" @node-expand="openNodes">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <!-- 自定义节点信息start -->
            <span v-if="node.childNodes.length || node.data.resourceTypeName == '加载中...'" draggable="true"
              @dragstart="drag($event, node)">{{ node.data.resourceTypeName }}</span>
            <el-tooltip v-else-if="node.data.resourceTypeName != '加载中...' && node.data.fileType == 'I'" draggable="true"
              id="" class="item" effect="dark" :content="node.data.resourceName" placement="top-start">
              <img @dragstart="drag($event, node, data)"
                style="width: 120px;height: 80px;object-fit:cover;padding-top: 5px;" v-lazy="node.data.fileUrl"
                :key="node.data.fileUrl" alt="">
            </el-tooltip>
            <div v-else>
              <el-tooltip v-if="node.data.resourceName && node.data.resourceName.length > 8" class="item" effect="dark"
                :content="node.data.resourceName" placement="top-start">
                <span draggable="true" @dragstart="drag($event, node)">{{
                  node.data.resourceName.substring(0, 7)
                }}...</span>
              </el-tooltip>
              <span v-else-if="node.data.resourceName" draggable="true" @dragstart="drag($event, node)">{{
                node.data.resourceName
              }}</span>
              <span v-else style="font-size: 14px;color: #888;">{{ node.data.resourceTypeName }}</span>
            </div>
            <!-- 尾部状态 查看更多 -->
            <!-- <div v-if="total>node.childNodes&&"></div> -->
            <!-- 自定义节点信息end -->
          </div>
        </el-tree>
        <!-- <el-pagination small layout="prev, pager, next" :total="50">
        </el-pagination> -->
      </div>
    </el-scrollbar>
    <div class="fixbom-add">
      <el-button type="primary" plain icon="el-icon-plus" @click="handleAdd">添加资源</el-button>
    </div>
    <el-dialog :title="'添加资源'" :visible.sync="addOpen" width="450px" append-to-body>
      <el-form ref="form">
        <el-form-item label="资源类型">
          <el-select v-model="resourceTypeId" placeholder="请选择资源类型" clearable>
            <el-option v-for="(dict, index) in resourcetypeList" :key="index" :label="dict.resourceTypeName"
              :value="dict.resourceTypeId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload ref="upload" drag :action="uploadAction" :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess" :file-list="fileList" :auto-upload="false" multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

          </el-upload>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
const baseURL = process.env.VUE_APP_BASE_API
let idx = 0;

export default {
  data() {
    return {
      resourcetypeList: [],
      resourceTypeId: '',
      uploadAction: baseURL + '/file/upload',
      fileList: [],
      resourceTypes: [],
      addOpen: false,
      total: 0
    }
  },
  created() {
    this.getList();
  },
  methods: {
    /**
    * 节点展开事件
    * @param me 节点所对应的对象
    * @param child 节点对应的 Node
    * @param self 节点组件本身
    */
    openNodes(me, child, self) {
      if (me.children && me.children.length == 1 && me.children[0].resourceTypeName.includes('加载中')) {
        // 获取对应资源文件列表
        this.$API.listResource({ resourceTypeId: me.children[0].parentId, pageNum: 1, pageSize: 200 }).then(response => {
          if (response.rows.length) {
            response.rows.forEach(cur => {
              cur.resourceTypeId = cur.resourceId
            })
            this.$nextTick(() => {
              this.$refs["tree"].updateKeyChildren(me.resourceTypeId, response.rows);
            })
          } else {
            me.children[0].resourceTypeName = "暂无资源"
          }

        });
      }
    },
    /**
    * 获取获取资源类型列表转为tree结构
    * @function handleTree 一维转二维tree
    * @function forEach 追加伪节点
    */
    getList() {
      this.$API.listResourcetype({}).then(response => {

        let resourcetypeList = this.handleTree(response.data, "resourceTypeId", "parentId");
        resourcetypeList.forEach(cur => {
          idx++
          if (cur.children) {
            cur.children.forEach(ele => {
              if (!ele.children) ele.children = [{ resourceTypeId: ele.resourceTypeId + idx, resourceTypeName: "加载中2...", parentId: ele.resourceTypeId }]
            })
          }
          if (!cur.children) cur.children = [{ resourceTypeId: cur.resourceTypeId + idx, resourceTypeName: "加载中...", parentId: cur.resourceTypeId }]
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
      let nodeStr = JSON.stringify(node.data)
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
        resourceTypeId: this.resourceTypeId,
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
}
.fixbom-add{
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
</style>