<template>
  <div class="clearfix app-container">
  <el-scrollbar class="scroll-wrapper page-list-wrapper">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" >
      <el-form-item label="资源名称" prop="resourceName">
        <el-input
          v-model="queryParams.resourceName"
          placeholder="请输入资源名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="资源类型" prop="resourceTypeId">
        <el-select v-model="queryParams.resourceTypeId" placeholder="请选择资源类型" clearable>
          <el-option
            v-for="(dict,index) in resourceTypes"
            :key="index"
            :label="dict.resourceTypeName"
            :value="dict.resourceTypeId"
          />
        </el-select>
      </el-form-item>
      <!--<el-form-item label="文件类型" prop="fileType">
        <el-select v-model="queryParams.fileType" placeholder="请选择文件类型" clearable>
          <el-option
            v-for="dict in dict.type.content_file_type"
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
          >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="resourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资源主键" align="center" prop="resourceId" />
      <el-table-column label="资源名称" align="center" prop="resourceName" />
      <el-table-column label="资源类型" align="center" prop="resourceTypeName" />
      <el-table-column label="MD5值" align="center" prop="resourceMd5" />
      <!--<el-table-column label="文件类型" align="center" width="100" prop="fileTypeName" />-->
      <el-table-column label="文件大小" align="center" width="100" prop="fileSize" :formatter="fileSizeFormat"/>
      <el-table-column label="文件预览" align="center" prop="fileUrl">
        <template slot-scope="scope">
          <div class="demo-image__preview" v-if="scope.row.fileType == 'I'">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.fileUrl"
              :fit="'cover'"
              :preview-src-list="[scope.row.fileUrl]">
            </el-image>
          </div>
<div class="demo-image__preview" v-else-if="scope.row.fileType == 'V'">
  <el-button @click="openUrl(scope.row.fileUrl,scope.row.fileType)" type="primary" icon="el-icon-caret-right">播放</el-button>
</div>
<div class="demo-image__preview" v-else>
  <el-button @click="openUrl(scope.row.fileUrl,scope.row.fileType)" type="primary" icon="el-icon-download">下载</el-button>
</div>
          </template>
      </el-table-column>
      <el-table-column label="终端文件路径" align="center" prop="filePath" />
      <el-table-column label="上传时间" align="center" prop="createTime"  :formatter="createTimeFormat"/>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

  </el-scrollbar>
    <el-dialog :title="title" :visible.sync="addOpen" width="450px" append-to-body>
      <el-form ref="form" >
        <el-form-item label="资源类型" >
          <el-select v-model="resourceTypeId" placeholder="请选择资源类型" clearable>
            <el-option
              v-for="(dict,index) in resourceTypes"
              :key="index"
              :label="dict.resourceTypeName"
              :value="dict.resourceTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-upload
            ref="upload"
            drag
            :action="uploadAction"
            :before-upload="beforeAvatarUpload"
            :on-success="handleSuccess"
            :file-list="fileList"
            :auto-upload="false" multiple>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

          </el-upload>
          <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
<!-- 预览播放视频 -->
<el-dialog title="媒体播放" :visible.sync="openMeaia" width="60%" append-to-body>
  <video
  id="video"
  width="100%"
  height="100%"
  :src="videoSrc"
  :controls="true"
  autoplay muted >
  <!-- <source :src="videoSrc" /> -->
</video>
</el-dialog>
    <!-- 添加或修改资源列表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="资源名称" prop="resourceName">
          <el-input v-model="form.resourceName" placeholder="请输入资源名称" />
        </el-form-item>

          <el-form-item label="资源类型" >
            <el-select v-model="form.resourceTypeId" placeholder="请选择资源类型" clearable>
              <el-option
                v-for="(dict,index) in resourceTypes"
                :key="index"
                :label="dict.resourceTypeName"
                :value="dict.resourceTypeId"
              />
            </el-select>
        </el-form-item>
        <el-form-item label="MD5值" prop="resourceMd5">
          {{form.resourceMd5}}
        </el-form-item>
        <el-form-item label="文件地址" prop="fileUrl">
          {{form.fileUrl}}
        </el-form-item>
        <el-form-item label="文件类型" prop="fileUrl">
          {{form.fileTypeName}}
        </el-form-item>
        <el-form-item label="文件大小" prop="fileUrl">
          {{form.fileSizeStr}}
        </el-form-item>
        <!--<el-form-item label="删除状态">
          <el-radio-group v-model="form.delStatus">
            <el-radio
              v-for="(dict,index) in dict.type.sys_del_status"
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
import * as imageConversion from 'image-conversion'
const baseURL =  process.env.VUE_APP_BASE_API

export default {
  name: "Resource",
  dicts: ['sys_del_status','content_file_type'],
  data() {
    return {
      videoSrc:"",
      openMeaia:false,
      resourceTypeId: '',
      uploadAction: baseURL+'/file/upload',
      fileList: [],
      resourceTypes: [],
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      /**这是2022年的冬天
       * 他的车贷房贷在等待
       * 他的
       *  */
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 资源列表表格数据
      resourceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      addOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        resourceName: null,
        resourceTypeId: null,
        fileType: null,
        fileUrl: null,
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
    console.log("传参==",this.$route.query);
    // const resourceTypeId = this.$route.params && this.$route.params.resourceTypeId;
    this.queryParams.resourceTypeId = this.$route.query.id||null;
    this.getList();
    this.getResourceTypeList();
  },
  methods: {
    openUrl(url,type){
      if (type=='V') {
        this.videoSrc = url
        this.openMeaia = true
      }else{
        window.open(url,"_blank");
      }
    },
    fileSizeFormat(row){
      return this.changeFileSize(row.fileSize)
    },
    createTimeFormat(row){
      let datetime = new Date(row.createTime)
      let year = datetime.getFullYear();
      let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      let hour = datetime.getHours()< 10 ? "0" + datetime.getHours() : datetime.getHours();
      let minute = datetime.getMinutes()< 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
      let second = datetime.getSeconds()< 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
      return  year + "-" + month + "-" + date+" "+hour+":"+minute+":"+second
    },
    changeFileSize(limit){
      let size = "";
      if(limit <  1024){                            //小于1KB，则转化成B
        size = limit.toFixed(2) + "B"
      }else if(limit <  1024 * 1024){            //小于1MB，则转化成KB
        size = (limit/1024).toFixed(2) + "KB"
      }else if(limit <  1024 * 1024 * 1024){        //小于1GB，则转化成MB
        size = (limit/(1024 * 1024)).toFixed(2) + "MB"
      }else{                                            //其他转化成GB
        size = (limit/(1024 * 1024 * 1024)).toFixed(2) + "GB"
      }

      var sizeStr = size + "";                        //转成字符串
      var index = sizeStr.indexOf(".");                    //获取小数点处的索引
      var dou = sizeStr.substr(index + 1 ,2)            //获取小数点后两位的值
      if(dou == "00"){                                //判断后两位是否为00，如果是则删除00
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
      }
      return size;
    },
    submitUpload() {
      this.loading = true;
      this.$refs.upload.submit();
    },
    beforeAvatarUpload(file) {
      return new Promise(resolve => {
        let isLt2M = file.size / 1024 / 1024 < 1 // 判定图片大小是否小于1MB
        if (isLt2M) {
          resolve(file)
        }
        // 可自定义kb
        let toSize = Math.round(file.size / 1024 / 8);
        imageConversion.compressAccurately(file,toSize).then(res => { // console.log(res)
         resolve(res)
        })
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
        fileType: response.fileId.substr(0,1),
        fileUrl: baseURL+'/file/download/'+response.fileId
      }

      this.$API.addResource(param).then(() => {
        this.$modal.msgSuccess("新增成功");
        this.open = false;
        this.getList();
      });
      this.loading = false;
    },
    /** 查询资源列表列表 */
    getList() {
      this.loading = true;
      this.$API.listResource(this.queryParams).then(response => {
        this.resourceList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询资源类型列表 */
    getResourceTypeList() {
      this.$API.listResourcetype().then(response => {
        this.resourceTypes = response.data;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resourceTypeId = ''
      this.fileList = []
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
      this.ids = selection.map(item => item.resourceId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.addOpen = true;
      this.title = "添加资源";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const resourceId = row.resourceId || this.ids
      this.$API.getResource(resourceId).then(response => {
        this.form = response.data;
        this.form.fileSizeStr = this.changeFileSize(this.form.fileSize);
        this.open = true;
        this.title = "修改资源";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.resourceId != null) {
            this.$API.updateResource(this.form).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$API.addResource(this.form).then(() => {
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
      const resourceIds = row.resourceId || this.ids;
      let message = row.resourceName ? '是否确认删除资源为"' + row.resourceName + '"的数据项？' :'是否确认删除资源列表编号为"' + resourceIds + '"的数据项？';
      this.$alert(message, '操作提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			}).then(() => {
				this.$API.delResource(resourceIds).then(() => {
					this.$message.success('删除成功！');
					this.getList();
				})
			})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.$API.programExport(this.queryParams).then(
        response => {
          const url = window.URL.createObjectURL(new Blob([response]))
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
    }
  }
};
</script>
<style lang="scss">
.top-right-btn {
    right: 40px;
}
</style>
