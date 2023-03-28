<template>
  <div class="clearfix my-page-list">




    <el-scrollbar class="scroll-wrapper page-list-wrapper" ref="celia" id="resultScroll">
      <div class="page-content">
        <div class="my-page-nav-list" style="display: flex;width: 86.8%;">
          <div class="my-page-nav-item" :class="{ active: searchParams.type === 'my' }">
            我的节目({{ myCount }})
          </div>
          <el-form :model="queryParams" ref="queryParams" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="节目名称" prop="programName">
              <el-input v-model="queryParams.programName" placeholder="请输入节目名称"
                @keyup.enter.native="$event.target.blur()" @blur="handleQuery" />
            </el-form-item>
            <el-form-item label="场景" prop="sceneId" label-width="52px">
              <el-select v-model="queryParams.sceneId" placeholder="请选择场景" clearable @change="handleQuery">
                <el-option v-for="(dict, index) in sceneList" :key="index" :label="dict.sceneName"
                  :value="dict.sceneId" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
              <div style="flex:1;text-align:right;">
                <el-button icon="el-icon-setting" type="primary" plain size="mini"  @click="goScene">场景管理</el-button>
              </div>
        </div>
        <!--页面列表-->
        <div class="yrj_ccc" ref="yrjccc" style="overflow: hidden;">
          <div class="page-item-wrapper" ref="content">
            <div class="page-item">
              <thumbnailPanel :pageType="searchParams.pageMode" />
            </div>
            <div class="page-item" v-for="(item, index) in pageList" :key="index">
              <thumbnailPanel @refresh="getList(1)" @terminalFun="terminalFun"
                :pageData="item" :btnList="operationBtn(item.isPublish)" />
            </div>
          </div>
        </div>

        <div class="loading_bar" @click="getList(2)">
          <div class="linel"></div>
          <div class="icon_text">
            <i :class="loadingBar[loadStatus].icon"></i>
            <span>{{ loadingBar[loadStatus].text }}</span>
          </div>
          <div class="linel"></div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 下发节目到终端 -->
    <el-dialog title="下发节目" :visible.sync="openPull" width="500px" append-to-body>
      <el-form ref="treeData" :model="pullform" label-width="80px">
        <el-tree :data="treeData" show-checkbox default-expand-all node-key="id" ref="tree" highlight-current
          :props="defaultProps">
        </el-tree>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitPull">确 定</el-button>
        <el-button @click="cancelPull">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import thumbnailPanel from '@/components/thumbnail-panel'
export default {
  dicts: ['sys_del_status'],
  name: "Program",
  components: {
    thumbnailPanel
  },
  data() {
    return {
      isQuery: false,
      loadingBar: [{
        icon: 'el-icon-arrow-down',
        text: '下拉或点击加载更多节目'
      }, {
        icon: 'el-icon-loading',
        text: '节目正在拼命加载中'
      }, {
        icon: 'el-icon-finished',
        text: '节目已全部加载完成'
      }, {
        icon: 'el-icon-finished',
        text: '暂无节目'
      }],
      loadStatus: 0,
      pageList: [],
      myCount: 0,
      shareCount: 0,
      searchParams: {
        type: 'my',
        pageMode: 'h5'
      },
      previewId: '',
      showPreview: false,
      programId: '',
      programName: '',
      data: [],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      sceneList: [],
      // 遮罩层
      loadingHui: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 节目管理表格数据
      programList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      openPull: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 20,
        programName: null,
        sceneId: null,
        delStatus: null
      },
      // 表单参数
      form: {},
      pullform: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.queryParams.sceneId = this.$route.query.id || null;
    this.getList();
    this.getSceneList();
    this.getTreeData();
  },
  mounted() {
    let that = this;
    document
      .getElementById("resultScroll")
      .addEventListener("scroll", that.handleScroll, true);

  },
  methods: {
    /** 页面滚动加载更多时间
   * @clientHeight - 滚动条外容器的高度
   * @scrollHeight - 滚动条高度
   * - 200 阈值，即距离底部还有200px时触发
   */
    handleScroll() {
      let high = this.$refs.celia.$refs.wrap.scrollTop;//距离顶部的距离
      let contentHeight = this.$refs.yrjccc.offsetHeight
      //.clientHeight - 滚动条外容器的高度
      //.scrollHeight - 滚动条高度
      if (high + window.innerHeight - 180 > contentHeight && this.loadStatus == 0 && this.myCount > this.pageList.length) {
        this.queryParams.pageNum++
        this.getList()
      }
    },
    /** 获取终端列表
    */
    getTreeData() {
      this.$API.terminalTreeListGet({}).then(response => {
        // 解决无id导致el-tree报错
        response.data.forEach((it,idx) => {
          it.id = "1000000"+idx
        });
        this.treeData = response.data;
      });
    },
    /** 查询节目管理列表
     * @ev 用户传入条件搜索时传入，重置页码
     */
    getList(ev) {
      this.loadStatus = 1//加载中
      if (ev==1) this.queryParams.pageNum = 1
      if (ev==2) this.queryParams.pageNum++
      this.$API.listProgram(this.queryParams).then(response => {
        this.myCount ? '' : this.myCount = response.total;
        if (response.rows.length < 20) {
          setTimeout(() => {
            this.queryParams.pageNum == 1 ? this.pageList = response.rows || [] : this.pageList = this.pageList.concat(response.rows)
            this.pageList.length ? this.loadStatus = 2 : this.loadStatus = 3
          }, 500);
        } else {
          setTimeout(() => {
            this.queryParams.pageNum == 1 ? this.pageList = response.rows || [] : this.pageList = this.pageList.concat(response.rows)
            this.loadStatus = 0
          }, 500);
        }
      });
    },
     /** 获取场景列表
    */
    getSceneList() {
      this.$API.listScene().then(response => {
        this.sceneList = response.data;
      });
    },
    // 取消下发终端操作
    cancelPull() {
      this.$refs.tree.setCheckedKeys([]);//重置已勾选项
      this.openPull = false;
    },

    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryParams");
      // 解决creatd赋值时scenId默认值为url id
      this.queryParams.sceneId ? this.queryParams.sceneId = null : ''
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.programId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /**下发到终端操作 弹窗*/
    terminalFun(data) {
      this.openPull = true
      this.programId = data.programId
      this.programName = data.programName
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      });
    },
    /**下发到终端操作 确定下发 */
    submitPull() {
      let terminalIds = this.$refs.tree.getCheckedKeys();
      if (terminalIds.length == 0) {
        this.$message.error('请选择终进行下发')
        return
      }
      for (let i = 0; i < terminalIds.length; i++) {
        if (terminalIds[i] == '' || terminalIds[i] == null || typeof (terminalIds[i]) == undefined) {
          terminalIds.splice(i, 1);
          i = i - 1;
        }
      }
      let param = { programId: this.programId, programName: this.programName, terminalIds: terminalIds }
      this.$API.batchAddProgramterminal(param).then(() => {
        this.$modal.msgSuccess("下发节目到终端成功");
        this.openPull = false;
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const programIds = row.programId || this.ids;
      let message = row.programName ? '是否确认删除节目为"' + row.programName + '"的数据项？' : '是否确认删除节目管理编号为"' + programIds + '"的数据项？'
      this.$modal.confirm(message).then(function () {
        return this.$API.delProgram(programIds);
      }).then(() => {
        this.queryParams.pageNum = 1
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$API.programExport(this.queryParams).then(
        response => {
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = window.document.createElement("a")
          link.style.display = "none"
          link.href = url
          link.setAttribute("download", `program_${new Date().getTime()}.xlsx`)
          document.body.appendChild(link)
          this.$modal.msgSuccess("正在导出节目，请勿关闭页面");
          link.click()
        },
        err => {
          this.$message.error(err);
        }
      )
    },
    // 操作按钮类型，分为我的，我的协作，和已发布的三种状态，暂时只有我的
    operationBtn(isPublished) {
      let baseBtn = ['edit', 'copyTemplate', 'setTemplate', 'exports', 'copys', 'copysHTML'];
      if (this.searchParams.type === 'my') {
        baseBtn = [...baseBtn, 'cooperation', 'delete']
      }
      if (this.searchParams.type === 'cooperation') {
        baseBtn = [...baseBtn, 'unCooperation']
      }
      if (isPublished) {
        baseBtn = [...baseBtn, 'copyUrl', 'viewPageData']
      } else {
        baseBtn = [...baseBtn, 'publish']
      }
      return baseBtn;
    },
    // 跳转至场景管理页
    goScene(){
      this.$router.push({name:'sceneList'})
    }
  },

};
</script>

<style lang="scss" scoped>
.my-page-list {
  height: 100%;
}

.page-list-wrapper {
  // height: calc(100% - 48px);
}

.my-page-nav-list {
  height: 40px;
  line-height: 40px;
  z-index: 2;
  margin-bottom: 20px;

  .my-page-nav-item {
    float: left;
    padding-right: 32px;
    text-align: center;
    cursor: pointer;

    &.active {
      color: $primary;
    }

    &:hover {
      color: $primary;
    }
  }
}

.full-input-w {
  width: 100%;
}

.nav-tabs-label {
  display: inline-block;
  padding: 0 16px;
  height: 60px;
  line-height: 60px;
}

.page-search-wrapper {
  padding: 0;
}

.page-item-wrapper {
  .page-item {
    float: left;
    margin-right: 20px;
    margin-bottom: 40px;
  }
}

.loading_bar {
  width: 60%;
  margin-left: 20%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #888888;

  .linel {
    flex: 1;
    height: 1px;
    background-color: #e6ebed;
  }

  .icon_text {
    padding: 0 20px;

    span {
      margin-left: 4px;
    }
  }
}
</style>
<style lang="scss">
.my-page-list {
  .page-search-wrapper {
    .el-tabs__header {
      margin: 0;
    }

    .el-tabs__nav-wrap {
      padding: 0 30px;
    }
  }
}
</style>
