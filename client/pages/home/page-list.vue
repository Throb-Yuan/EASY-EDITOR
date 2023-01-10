<template>
  <div class="clearfix my-page-list">




    <el-scrollbar class="scroll-wrapper page-list-wrapper" ref="celia" id="resultScroll">
      <div class="page-content">
        <div class="my-page-nav-list">
          <div class="my-page-nav-item" @click="doSearch('my')" :class="{active: searchParams.type === 'my'}">
            我的节目({{ myCount }})
          </div>
          <!-- <div class="my-page-nav-item" @click="doSearch('cooperation')" :class="{active: searchParams.type === 'cooperation'}">
            参与作品({{shareCount}})
          </div> -->
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
            label-width="68px">
            <el-form-item label="节目名称" prop="programName">
              <el-input v-model="queryParams.programName" placeholder="请输入节目名称" clearable
                @keyup.enter.native="handleQuery" />
            </el-form-item>
            <el-form-item label="场景">
              <el-select v-model="queryParams.sceneId" placeholder="请选择场景" clearable>
                <el-option v-for="(dict, index) in sceneList" :key="index" :label="dict.sceneName"
                  :value="dict.sceneId" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!--页面列表-->
        <div class="yrj_ccc" ref="yrjccc" style="overflow: hidden;">
          <div class="page-item-wrapper"  ref="content" v-loading="loadingHui">
          <div class="page-item">
            <thumbnailPanel :pageType="searchParams.pageMode" />
          </div>
          <div class="page-item" v-for="(item, index) in pageList" :key="index">
            <thumbnailPanel @refresh="getList" @showPreview="showPreviewFn" @terminalFun="terminalFun" :pageData="item"
              :btnList="operationBtn(item.isPublish)" />
          </div>
        </div>
        </div>
    
      </div>
    </el-scrollbar>
    <!-- 添加或修改节目管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="节目名称" prop="programName">
          <el-input v-model="form.programName" placeholder="请输入节目名称" maxlength="120" show-word-limit />
        </el-form-item>
        <el-form-item label="场景">
          <el-select v-model="form.sceneId" placeholder="请选择场景" clearable>
            <el-option v-for="(dict, index) in sceneList" :key="index" :label="dict.sceneName" :value="dict.sceneId" />
          </el-select>
        </el-form-item>
        <el-form-item label="原始HTML">
          <!-- <editor v-model="form.html" :min-height="192"/>-->
          <textarea v-model="form.html" cols="50" rows="20"></textarea>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 下发节目到终端 -->
    <el-dialog title="下发节目" :visible.sync="openPull" width="500px" append-to-body>
      <el-form ref="form" :model="pullform" label-width="80px">
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
import previewPage from './components/preview'
export default {
  dicts: ['sys_del_status'],
  name: "Program",
  components: {
    thumbnailPanel,
    previewPage
  },
  data() {
    return {
      loading: false,
      pageList: [],
      myCount: 0,
      shareCount: 0,
      pageModeList: [],
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
      open: false,
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
    // const sceneId = this.$route.params && this.$route.params.sceneId;
    this.pageModeList = this.$config.pageModeList;
    // this.getList();
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
    handleScroll() {
      let high = this.$refs.celia.$refs.wrap.scrollTop;//距离顶部的距离
      let contentHeight = this.$refs.yrjccc.offsetHeight
      let crrHeight = this.$refs.yrjccc.clientHeight
      //.clientHeight - 滚动条外容器的高度
      //.scrollHeight - 滚动条高度
      console.log("滚动监听==",high+window.innerHeight-200,contentHeight);
      if (high+window.innerHeight-200 > contentHeight&&!this.loadingHui&&this.myCount>this.pageList.length) {
        //自行定义
        this.queryParams.pageNum++
        this.getList()
      }
    },
      copyOther(value, name) {
      this.$copyText(value).then(() => {
        this.$message.success(`${name}已复制!`);
      })
    },
    getTreeData() {
      this.$API.terminalTreeListGet({}).then(response => {
        this.treeData = response.data;
      });
    },
    /** 查询节目管理列表 */
    getList() {
      this.loadingHui = true;
      this.$API.listProgram(this.queryParams).then(response => {
        // this.programList = response.rows;
        this.queryParams.pageNum == 1 ? this.pageList = response.rows||[] :this.pageList = this.pageList.concat(response.rows)
        
        // this.total = response.total;
        this.myCount = response.total;
        this.loadingHui = false;
      });
    },
    getSceneList() {
      this.$API.listScene().then(response => {
        this.sceneList = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 取消按钮
    cancelPull() {
      this.$refs.tree.setCheckedKeys([]);
      this.openPull = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.programId = ''
      this.programName = ''
      this.form = {
        programId: null,
        programName: null,
        sceneId: null,
        afterHtml: null,
        html: null,
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
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.programId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加节目管理";
    },
    /**下发到终端操作 */
    handlePull(row) {
      console.log("下发数据==", row);
      this.openPull = true
      this.programId = row.programId
      this.programName = row.programName
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
      });
      // this.$refs.tree.setCheckedKeys([]);
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const programId = row.programId || this.ids
      this.$API.getProgram(programId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改节目管理";
      });
    },
    handleExportProgram(row) {
      this.$modal.msgSuccess("正在生成节目，请勿关闭页面");
      this.$API.programDownload(row.programId).then(
        response => {
          console.log(response)
          // if (!response.data.size) {
          //   this.$message({
          //     message: "没有可下载文件",
          //     type: "warning"
          //   })
          //   return
          // }
          const url = window.URL.createObjectURL(new Blob([response.data]))
          const link = window.document.createElement("a")
          link.style.display = "none"
          link.href = url
          link.setAttribute("download", row.programName + "-unzip.zip")
          document.body.appendChild(link)
          this.$modal.msgSuccess("正在下载节目，请勿关闭页面");
          link.click()
        },
        err => {
          this.$message.error(err);
        }
      )
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.programId != null) {
            this.$API.updateProgram(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$API.addProgram(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
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
      this.$API.batchAddProgramterminal(param).then(response => {
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
          // if (!response.data.size) {
          //   this.$message({
          //     message: "没有可下载文件",
          //     type: "warning"
          //   })
          //   return
          // }
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
      // this.download('content/program/export', {
      //   ...this.queryParams
      // }, `program_${new Date().getTime()}.xlsx`)
    },
    // 操作按钮类型，分为我的，我的协作，和已发布的三种状态
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
    /**
     * 搜索我的页面，type: my时搜索我的作品， type: share搜索我参与的作品
     */
    doSearch(type) {
      // this.searchParams.type = type;
      // this.getList()
    },
    /**
     * 获取所有页面
     */
    // getList() {
    // 	this.$API.getMyPages(this.searchParams).then(res => {
    // 		// this.pageList = res.body.pages || []
    //     this.myCount = res.body.myPageCount;
    //     this.shareCount = res.body.myCooperationPageCount;
    // 	})
    // },
    showPreviewFn(id) {
      this.previewId = id;
      this.showPreview = true;
    },
    terminalFun(data) {
      this.handlePull(data)
    }
  },

};
</script>

<style lang="scss" scoped>
.my-page-list {
  height: 100%;
}

.page-list-wrapper {
  height: calc(100% - 48px);
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
