<template>
  <div class="app-container">
    <el-scrollbar class="scroll-wrapper page-list-wrapper">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="90px" @submit.native.prevent>
      <el-form-item label="模板版本号" prop="tplVersion">
        <el-input v-model="queryParams.tplVersion" placeholder="请输入模板版本号"  @clear="handleQuery" @keyup.enter.native="$event.target.blur()"
          @blur="handleQuery" />
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button> -->
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single"
          @click="handleUpdate">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple"
          @click="handleDelete">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="versionList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="模板版本号" align="center" prop="tplVersion" width="150" />
      <el-table-column label="模板大小" align="center" prop="size" :formatter="fileSizeFormat" width="150" />
      <el-table-column label="版本描述" align="center" prop="imprint" />
      <el-table-column label="下载地址" align="center" prop="downloadUrl" :formatter="downloadUrlFormat" >
        <template slot-scope="scope">
            <div class="demo-image__preview">
              <el-button @click="openUrl(downloadUrlFormat(scope.row),'D')" type="primary"
                icon="el-icon-download">下载</el-button>
            </div>
          </template>
      </el-table-column>
      <el-table-column label="更新人" align="center" prop="modifier" width="200" />
      <el-table-column label="更新时间" align="center" prop="modifyTime" width="150" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getList" />
    </el-scrollbar>
    <!-- 添加或修改模板版本信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form v-if="open" ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="版本号" prop="tplVersion">
          <el-input-number v-model="form.tplVersion" placeholder="请输入模板版本号" controls-position="right"></el-input-number>
        </el-form-item>
        <el-form-item label="模板大小" prop="size">
          <!-- <el-input-number v-model="form.size" placeholder="请输入模板大小" controls-position="right" :min="0" :disabled="true"></el-input-number>  -->
          <el-input placeholder="请上传模板文件" v-model="form.size" :disabled="true">
            <template slot="append">单位：字节（Byte）</template>
          </el-input>
        </el-form-item>
        <el-form-item label="版本描述" prop="imprint">
          <el-input v-model="form.imprint" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="模板上传" prop="downloadUrl">
          <el-upload ref="upload" drag :action="uploadAction" :on-success="handleSuccess" :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload" :auto-upload="true" :multiple="false" :limit="1">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

          </el-upload>
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
export default {
  name: "Version",
  data() {
    return {
      pageWindow:window,
      todayVersion: 0,
      uploadAction: window.ipConfig.baseUrl + '/file/upload',
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
      // 模板版本信息表格数据
      versionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tplVersion: null,
        imprint: null,
        isUpdate: null,
        downloadUrl: null,
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
    openUrl(url) {
        window.open(url, "_blank");
    },
    getNowDate() {
      const timeOne = new Date()
      const year = timeOne.getFullYear()
      let month = timeOne.getMonth() + 1
      let day = timeOne.getDate()
      month = month < 10 ? '0' + month : month
      day = day < 10 ? '0' + day : day
      const NOW_MONTHS_AGO = `${year}${month}${day}`
      return NOW_MONTHS_AGO
    },
    beforeAvatarUpload(file) {
      return new Promise(resolve => {
        this.loading = true;
        resolve(file)
      })
    },
    handleSuccess(res) {
      this.loading = false;
      this.form.downloadUrl = res.data.fileId
      this.form.size = res.data.fileSize
    },
    handleRemove() {
      this.form.downloadUrl = ''
      this.form.size = ''
    },
    fileSizeFormat(row) {
      return this.changeFileSize(row.size)
    }, downloadUrlFormat(row) {
      return window.ipConfig.baseUrl + '/file/download/' + row.downloadUrl
    },
    changeFileSize(limit) {
      limit = parseInt(limit)
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
    /** 查询模板版本信息列表 */
    getList() {
      this.loading = true;
      this.$API.listVersion(this.queryParams).then(response => {
        this.versionList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      const {userId,nickName} = this.$store.getters.userInfo
      this.form = {
        tplId: null,
        tplVersion: null,
        size: null,
        imprint: null,
        isUpdate: "0",
        downloadUrl: null,
        creatorId: userId,
        creator: nickName,
        createTime: null,
        modifyId: userId,
        modifier: nickName,
        modifyTime: null,
        version: null,
        delStatus: "0"
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
      this.ids = selection.map(item => item.tplId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加模板版本信息";
      this.form.tplVersion = parseInt(this.getNowDate() + '01')
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const tplId = row.tplId || this.ids
      this.$API.getVersion(tplId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改模板版本信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.tplId != null) {
            this.$API.updateVersion(this.form).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });

          } else {
            if (this.form.downloadUrl == null) {
              this.$modal.msgError("请先上传模板");
              return
            }

            this.$API.addVersion(this.form).then(() => {
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
      const tplIds = row.tplId || this.ids;
      let oneTmp = '是否确认删除版本号为 "' + row.tplVersion + '" 的数据项？'
      let moreTmp = '是否确认删除已选中的' + this.ids.length + '个数据项？'
      this.$modal.confirm(row.tplId ? oneTmp : moreTmp).then(() => {
        this.$API.delVersion(tplIds).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('content/version/export', {
        ...this.queryParams
      }, `version_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
