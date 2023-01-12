<template>
  <div class="custom-tree-container" style="min-width:160px;">
    <p class="page-title text-center">媒体资源列表</p>
    <el-scrollbar class="scroll-wrapper page-list-wrapper" style="height: 1000px;padding-bottom: 120px;">
      <div class="block">
        <el-tree ref="tree" :data="resourcetypeList" node-key="resourceTypeId" :label="'resourceTypeName'"
          children="children" accordion :expand-on-click-node="true" @node-expand="openNodes">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <span v-if="node.childNodes.length || node.data.resourceTypeName == '加载中...'" draggable="true"
              @dragstart="drag($event, node)">{{ node.data.resourceTypeName }}</span>

            <img v-else-if="node.data.resourceTypeName != '加载中...' && node.data.fileType == 'I'" draggable="true" id=""
              @dragstart="drag($event, node)" style="width: 120px;height: 80px;object-fit:cover;padding-top: 5px;"
              :src="node.data.fileUrl" alt="">
            <div v-else>
              <el-tooltip v-if="node.data.resourceName && node.data.resourceName.length > 8" class="item" effect="dark"
                :content="node.data.resourceName" placement="top-start">
                <span  draggable="true" @dragstart="drag($event, node)">{{ node.data.resourceName.substring(0, 7)
                }}...</span>
              </el-tooltip>
              <span v-else-if="node.data.resourceName" draggable="true" @dragstart="drag($event, node)">{{ node.data.resourceName }}</span>
              <span v-else style="font-size: 14px;color: #888;">{{ node.data.resourceTypeName }}</span>
            </div>
          </div>
        </el-tree>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
let idx = 0;

export default {
  data() {
    return {
      resourcetypeList: []
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
        this.$API.listResource({ resourceTypeId: me.children[0].parentId, pageNum: 1, pageSize: 100 }).then(response => {
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
    drag(ev, node) {
      console.log("drag====", node);
      let nodeStr = JSON.stringify(node.data)
      ev.dataTransfer.setData("node", nodeStr);
    }
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
</style>