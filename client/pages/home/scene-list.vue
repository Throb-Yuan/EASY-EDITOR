<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" >
      <el-form-item label="场景名称" prop="sceneName">
        <el-input
          v-model="queryParams.sceneName"
          placeholder="请输入场景名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
	    <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['content:scene:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="sceneList"
      row-key="sceneId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="场景名称" prop="sceneName" >
        <template slot-scope="scope">
          <router-link :to="'/home/program-list?id=' + scope.row.sceneId" class="link-type">
            <span>{{ scope.row.sceneName }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="父级场景" align="center" prop="parentName" />
      <!--<el-table-column label="删除状态" align="center" prop="delStatus" >
        <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_del_status" :value="scope.row.delStatus"/>
        </template>
      </el-table-column>-->
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-grid"
            @click="handleProgramList(scope.row)"
            v-hasPermi="['content:resource:query']"
          >节目列表</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['content:scene:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['content:scene:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['content:scene:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改场景管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="场景名称" prop="sceneName">
          <el-input v-model="form.sceneName" placeholder="请输入场景名称" maxlength="120" show-word-limit/>
        </el-form-item>
        <el-form-item label="父级场景" prop="parentId">
          <treeselect v-model="form.parentId" :options="sceneOptions" :normalizer="normalizer" placeholder="请选择父级场景主键" />
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
// import { listScene, getScene, delScene, addScene, updateScene } from "@/api/content/scene";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  dicts: ['sys_del_status'],
  name: "Scene",
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 场景管理表格数据
      sceneList: [],
      // 场景管理树选项
      sceneOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        sceneName: null,
        parentId: null,
        delStatus: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleProgramList(row){
      this.$router.push({ path: '/home/program-list?id=' + row.sceneId });
    },
    /** 查询场景管理列表 */
    getList() {
      this.loading = true;
      this.$API.listScene(this.queryParams).then(response => {
        this.sceneList = this.handleTree(response.data, "sceneId", "parentId");
        this.loading = false;
      });
    },
    /** 转换场景管理数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.sceneId,
        label: node.sceneName,
        children: node.children
      };
    },
	/** 查询场景管理下拉树结构 */
    getTreeselect() {
      this.$API.listScene().then(response => {
        this.sceneOptions = [];
        const data = { sceneId: '', sceneName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "sceneId", "parentId");
        this.sceneOptions.push(data);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        sceneId: null,
        sceneName: null,
        parentId: null,
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
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null && row.sceneId) {
        this.form.parentId = row.sceneId;
      } else {
        this.form.parentId = '';
      }
      this.open = true;
      this.title = "添加场景管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.sceneId;
      }
      getScene(row.sceneId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改场景管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.sceneId != null) {
            this.$API.updateScene(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addScene(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal.confirm('是否确认删除场景为"' + row.sceneName + '"的数据项？').then(function() {
        return this.$API.delScene(row.sceneId);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    }
  }
};
</script>
