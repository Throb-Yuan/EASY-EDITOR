<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" >
      <el-form-item label="资源类型名称" prop="resourceTypeName">
        <el-input
          v-model="queryParams.resourceTypeName"
          placeholder="请输入资源类型名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
     <!-- <el-form-item label="删除状态" prop="delStatus">
        <el-select v-model="queryParams.delStatus" placeholder="请选择删除状态" clearable>
          <el-option
            v-for="dict in dict.type.sys_del_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>-->
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
          v-hasPermi="['content:resourcetype:add']"
        >新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="resourcetypeList"
      row-key="resourceTypeId"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="资源类型名称" prop="resourceTypeName" align="center">
        <template slot-scope="scope">
          <router-link :to="'/home/resource-list?id=' + scope.row.resourceTypeId" class="link-type">
            <span>{{ scope.row.resourceTypeName }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="父级类型" align="center" prop="parentName" />
      <!--<el-table-column label="删除状态" align="center" prop="delStatus">
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
            @click="handleResourceList(scope.row)"
            v-hasPermi="['content:resource:query']"
          >资源列表</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['content:resourcetype:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['content:resourcetype:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['content:resourcetype:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改资源类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型名称" prop="resourceTypeName">
          <el-input v-model="form.resourceTypeName" placeholder="请输入资源类型名称" maxlength="120" show-word-limit/>
        </el-form-item>
        <el-form-item label="父级类型" prop="parentId">
          <treeselect v-model="form.parentId" :options="resourcetypeOptions" :normalizer="normalizer" placeholder="请选择父级类型主键" />
        </el-form-item>
        <!--<el-form-item label="删除状态" style="display: none">
          <el-radio-group v-model="form.delStatus">
            <el-radio
              v-for="dict in dict.type.sys_del_status"
              :key="dict.value"
:label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { listResourcetype, getResourcetype, delResourcetype, addResourcetype, updateResourcetype } from "@/api/content/resourcetype";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Resourcetype",
  dicts: ['sys_del_status'],
  components: {
    Treeselect
  },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 资源类型表格数据
      resourcetypeList: [],
      // 资源类型树选项
      resourcetypeOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        resourceTypeName: null,
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
    handleResourceList(row)
    {
      console.log(row)
      console.log(row.resourceTypeId)
      this.$router.push({ path: '/home/resource-list?id=' + row.resourceTypeId });
    },
    /** 查询资源类型列表 */
    getList() {
      this.loading = true;
      this.$API.listResourcetype(this.queryParams).then(response => {
        this.resourcetypeList = this.handleTree(response.data, "resourceTypeId", "parentId");
        this.loading = false;
      });
    },
    /** 转换资源类型数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.resourceTypeId,
        label: node.resourceTypeName,
        children: node.children
      };
    },
	/** 查询资源类型下拉树结构 */
    getTreeselect() {
      this.$API.listResourcetype().then(response => {
        this.resourcetypeOptions = [];
        const data = { resourceTypeId: '', resourceTypeName: '顶级节点', children: [] };
        data.children = this.handleTree(response.data, "resourceTypeId", "parentId");
        this.resourcetypeOptions.push(data);
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
        resourceTypeId: null,
        resourceTypeName: null,
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
      if (row != null && row.resourceTypeId) {
        this.form.parentId = row.resourceTypeId;
      } else {
        this.form.parentId = '';
      }
      this.open = true;
      this.title = "添加资源类型";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.parentId = row.resourceTypeId;
      }
      this.$API.getResourcetype(row.resourceTypeId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改资源类型";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.resourceTypeId != null) {
            this.$API.updateResourcetype(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$API.addResourcetype(this.form).then(response => {
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
      this.$alert('是否确认删除资源类型为"' + row.resourceTypeName + '"的数据项？', '操作提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.$API.delResourcetype(row.resourceTypeId).then(() => {
					this.$message.success('删除成功！');
					this.getList();
				})
			})
    }
  }
};
</script>
