<template>
  <div class="clearfix app-container">
    <el-scrollbar class="scroll-wrapper page-list-wrapper">
      <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
        <el-form-item label="节目名称" prop="programName">
          <el-input v-model="queryParams.programName" placeholder="请输入节目名称" clearable
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="场景">
          <el-select v-model="queryParams.sceneId" placeholder="请选择场景" clearable>
            <el-option v-for="(dict, index) in sceneList" :key="dict.sceneId" :label="dict.sceneName"
              :value="dict.sceneId" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
            v-hasPermi="['content:program:add']">新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
            v-hasPermi="['content:program:edit']">修改</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
            v-hasPermi="['content:program:remove']">删除</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
            v-hasPermi="['content:program:export']">导出</el-button>
        </el-col>
        <!-- <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar> -->
      </el-row>

      <el-table v-loading="loading" :data="programList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="节目主键" align="center" prop="programId">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" :content="scope.row.programId" placement="top-start">
              <div @click="copyOther(scope.row.programId, '节目主键')">{{ scope.row.programId.substring(0, 8) }}... <i
                  class="el-icon-copy-document"></i></div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="节目名称" align="center" prop="programName" />
        <el-table-column label="场景" align="center" prop="sceneName" />
        <el-table-column label="节目内容HTML" align="center" width="500px" prop="html">
          <template slot-scope="scope">
            <el-button-group>
              <el-button type="primary" icon="el-icon-view">预览</el-button>
              <el-button type="primary" @click="copyOther(scope.row.html, 'HTML代码')">复制<i class="el-icon-copy-document el-icon--right"></i></el-button>
            </el-button-group>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-mobile-phone"
              @click="handlePull(scope.row)">下发到终端</el-button>
            <el-button size="mini" type="text" icon="el-icon-download"
              @click="handleExportProgram(scope.row)">导出节目</el-button>
            <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
              v-hasPermi="['content:program:edit']">修改</el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
              v-hasPermi="['content:program:remove']">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
        @pagination="getList" />

    </el-scrollbar>
    <!-- 添加或修改节目管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="节目名称" prop="programName">
          <el-input v-model="form.programName" placeholder="请输入节目名称" maxlength="120" show-word-limit />
        </el-form-item>
        <el-form-item label="场景">
          <el-select v-model="form.sceneId" placeholder="请选择场景" clearable>
            <el-option v-for="(dict, index) in sceneList" :key="dict.sceneId" :label="dict.sceneName"
              :value="dict.sceneId" />
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

export default {
  dicts: ['sys_del_status'],
  name: "Program",
  data() {
    return {
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
      loading: true,
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
        pageSize: 10,
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
    this.queryParams.sceneId = this.$route.query.id || null;
    this.getList();
    this.getSceneList();
    this.getTreeData();
  },
  methods: {
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
      this.loading = true;
      this.$API.listProgram(this.queryParams).then(response => {
        this.programList = response.rows;
        this.total = response.total;
        this.loading = false;
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
      this.openPull = true
      this.programId = row.programId
      this.programName = row.programName
      this.$refs.tree.setCheckedKeys([]);
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
        this.getList();
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const programIds = row.programId || this.ids;
      let message = row.programName ? '是否确认删除节目为"' + row.programName + '"的数据项？' : '是否确认删除节目管理编号为"' + programIds + '"的数据项？'
      this.$modal.confirm(message).then(function () {
        return this.$API.delProgram(programIds);
      }).then(() => {
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
    }
  }
};
</script>
<style lang="scss">
// .sidebar-wrapper .el-scrollbar__wrap {
//   overflow-x: hidden;
// }
</style>
