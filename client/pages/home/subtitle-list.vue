<template>
  <div class="app-container">
    <el-scrollbar class="scroll-wrapper page-list-wrapper">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="字幕内容" prop="content">
        <el-input
            v-model="queryParams.content"
            placeholder="请输入字幕内容"
            @keyup.enter.native="$event.target.blur()"
            @blur="handleQuery" 
        />
      </el-form-item>
      <el-form-item label="字幕播放日期：">
        <el-date-picker
            v-model="date"
            unlink-panels
            :picker-options="pickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            @change="handleQuery"
            :clearable="false"
            end-placeholder="结束日期"  value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button> -->
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

    <el-table v-loading="loading" :data="subtitleList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="字幕内容" align="center" prop="content" >
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top-start">
            <span>{{scope.row.content.substring(0,84)}}<span v-if="scope.row.content.length>84">...</span></span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="定位" align="center" width="100px" prop="location" :formatter="contentLocationFormat"/>
      <el-table-column label="滚动方向" align="center" width="100px" prop="rollingDirection" :formatter="rollingDirectionFormat"/>
      <el-table-column label="速度" align="center" width="50px" prop="speed" />
      <el-table-column label="开始日期" align="center" width="100px" prop="beginDate" />
      <el-table-column label="结束日期" align="center" width="100px" prop="endDate" />
      <el-table-column label="开始时间" align="center" width="75px" prop="beginTime" />
      <el-table-column label="结束时间" align="center" width="75px" prop="endTime" />
      <el-table-column label="星期" align="center" width="400px" prop="week" :formatter="weekFormat"/>
      <el-table-column label="操作" align="center" width="200px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-mobile-phone" @click="handlePull(scope.row)">下发到终端</el-button>
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)" >修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)" >删除</el-button>
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
    <!-- 添加或修改紧急字幕对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="720px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字幕内容" prop="content">
          <el-input  type="textarea" v-model="form.content" cols="80" rows="5"  maxlength="2000" placeholder="请输入紧急字幕内容，2000字以内">
          </el-input>
        </el-form-item>
        <el-form-item label="定位" prop="location">
          <el-select v-model="form.location" >
            <el-option
                v-for="item in dict.type.content_location"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="滚动方向" prop="rollingDirection">
          <el-select v-model="form.rollingDirection" >
            <el-option
                v-for="item in dict.type.content_rolling_direction"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="速度" prop="speed">
          <el-input-number  v-model="form.speed" controls-position="right" :min="1"/><span>  在此时间内播完，单位为秒</span>
        </el-form-item>

        <el-form-item label="起始日期" prop="beginDate">
          <el-date-picker
              v-model="form.beginDate"
              type="daterange"
              align="right"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format = 'yyyy-MM-dd'>
          </el-date-picker>
        </el-form-item>
        <el-form-item label="起始时间" prop="beginTime">
          <el-time-picker
              is-range
              v-model="form.beginTime"
              format = 'HH:mm:ss' value-format = 'HH:mm:ss'
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              placeholder="起始时间">
          </el-time-picker>
        </el-form-item>

        <el-form-item label="星期" prop="week">
          <el-checkbox-group v-model="form.week">
            <el-checkbox-button key="1" label="1" style="margin-top: 2px;margin-left: 2px">星期一</el-checkbox-button>
            <el-checkbox-button key="2" label="2" style="margin-top: 2px;margin-left: 2px">星期二</el-checkbox-button>
            <el-checkbox-button key="3" label="3" style="margin-top: 2px;margin-left: 2px">星期三</el-checkbox-button>
            <el-checkbox-button key="4" label="4" style="margin-top: 2px;margin-left: 2px">星期四</el-checkbox-button>
            <el-checkbox-button key="5" label="5" style="margin-top: 2px;margin-left: 2px">星期五</el-checkbox-button>
            <el-checkbox-button key="6" label="6" style="margin-top: 2px;margin-left: 2px">星期六</el-checkbox-button>
            <el-checkbox-button key="7" label="7" style="margin-top: 2px;margin-left: 2px">星期日</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 下发到终端 -->
    <el-dialog title="下发紧急字幕到终端" :visible.sync="openPull" width="500px" append-to-body>
      <el-form ref="form" :model="pullform" label-width="80px">
        <el-tree
            :data="treeData"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
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
  name: "Subtitle",
  dicts: ['content_rolling_direction','content_location'],
  data() {
    return {
      subtitleId: null,
      openPull: false,
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
      // 紧急字幕表格数据
      subtitleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      date: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        content: null,
        location: null,
        rollingDirection: null,
        speed: null,
        beginDate: null,
        endDate: null,
        beginTime: null,
        endTime: null,
        week: null,
        creatorId: null,
        creator: null,
        modifyId: null,
        modifier: null,
        modifyTime: null,
        version: null,
        delStatus: null
      },
      // 表单参数
      form: {},
      pullform: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一年',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      // 表单校验
      rules: {
        content: [
          {required: true, message: '请输入紧急字幕内容', trigger: 'blur'},
          {max: 2000, message: '紧急字幕内容在2000字以内', trigger: 'blur'}
        ],location: [
          {required: true, message: '请选择定位', trigger: 'blur'}
        ],
        rollingDirection: [
          {required: true, message: '请选择滚动方向', trigger: 'blur'}
        ],
        speed: [
          {required: true, message: '请输入速度', trigger: 'blur'}
        ],
        week: [
          {required: true, message: '请选择星期', trigger: 'blur'}
        ],beginDate: [
          {required: true, message: '请选择起始日期', trigger: 'blur'}
        ],
        beginTime: [
          {required: true, message: '请选择起始时间', trigger: 'blur'}
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询紧急字幕列表 */
    getList() {
      this.loading = true;
      this.$API.listSubtitle(this.queryParams).then(response => {
        this.subtitleList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    rollingDirectionFormat(row)
    {
      return this.selectDictLabel(this.dict.type.content_rolling_direction, row.rollingDirection);
    },
    contentLocationFormat(row)
    {
      return this.selectDictLabel(this.dict.type.content_location, row.location);
    },
    weekFormat(row)
    {
      if( row.week==undefined || row.week==null || row.week=="")
      {
        return ''
      }else {
        let weekArr = row.week.split(',')
        let result = ''
        for(let i = 0; i < weekArr.length; i++)
        {
          switch (weekArr[i]) {
            case '7':
              result=result+ ( i>0?'，星期日':'星期日' );
              break;
            case '6':
              result=result+( i>0?'，星期六':'星期六' );
              break;
            case '5':
              result=result+( i>0?'，星期五':'星期五' );
              break;
            case '4':
              result=result+( i>0?'，星期四':'星期四' );
              break;
            case '3':
              result=result+( i>0?'，星期三':'星期三' );
              break;
            case '2':
              result=result+( i>0?'，星期二':'星期二' );
              break;
            case '1':
              result=result+( i>0?'，星期一':'星期一' );
              break;
          }
        }
        return result
      }
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        subtitleId: null,
        content: null,
        location: null,
        rollingDirection: null,
        speed: null,
        beginDate: null,
        endDate: null,
        beginTime: null,
        endTime: null,
        week: [],
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
      if(this.date)
      {
        this.queryParams.beginDate=this.date[0]
        this.queryParams.endDate=this.date[1]
      }
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.date.length ? this.date = [] : ''
      this.queryParams.beginDat ?  this.queryParams.beginDat = '' : ''
      this.queryParams.endDate ?  this.queryParams.endDate = '' : ''
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.subtitleId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加紧急字幕";
      this.form.week = ['1','2','3','4','5','6','7']
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const subtitleId = row.subtitleId || this.ids
      this.$API.getSubtitle(subtitleId).then(response => {
        this.form = response.data;
        let dates = []
        let times = []
        dates[0] = response.data.beginDate
        dates[1] = response.data.endDate
        this.form.beginDate=dates
        times[0] = response.data.beginTime
        times[1] = response.data.endTime
        this.form.beginTime=times

        if(this.form.week)
        {
          this.form.week = this.form.week.split(',');
        }else
        {
          this.form.week = []
        }

        if( parseInt(this.form.insertFlag)==0)
        {
          this.form.insertFlag=true;
        }else
        {
          this.form.insertFlag=false;
        }

        this.form = response.data;
        this.open = true;
        this.title = "修改紧急字幕";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {

          let param = JSON.parse(JSON.stringify(this.form));
          if(this.form.week.length==0)
          {
            this.$message.error("星期至少选择一个");
            return
          }else
          {
            param.week=this.form.week.toString()
          }

          if( this.form.beginTime==null || this.form.beginTime.length == 0)
          {
            this.$message.error("请选择起始时间");
            return
          }else
          {
            let times = this.form.beginTime;
            param.beginTime=times[0];
            param.endTime=times[1];
          }

          if(this.form.beginDate==null || this.form.beginDate.length == 0)
          {
            this.$message.error("请选择起始日期");
            return
          }else{
            let dates = this.form.beginDate;
            param.beginDate=dates[0];
            param.endDate=dates[1];
          }


          if (this.form.subtitleId != null) {
            this.$API.updateSubtitle(param).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$API.addSubtitle(param).then(() => {
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
      const subtitleIds = row.subtitleId || this.ids;
      this.$modal.confirm('是否确认删除紧急字幕？').then(() =>{
        this.$API.delSubtitle(subtitleIds).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('content/subtitle/export', {
        ...this.queryParams
      }, `subtitle_${new Date().getTime()}.xlsx`)
    } ,
    /**下发到终端操作 */
    handlePull(row)
    {
      this.$API.terminalTreeListGet({}).then(response => {
        this.treeData = response.data;
      });
      this.subtitleId = row.subtitleId
      this.openPull = true
      this.$refs.tree.setCheckedKeys([]);
    },
    submitPull()
    {
      let terminalIds = this.$refs.tree.getCheckedKeys();
      if(terminalIds.length==0)
      {
        this.$message.error("请选择终端进行下发");
        return
      }
      for(let i = 0;i<terminalIds.length;i++){
        if(terminalIds[i]==''||terminalIds[i]==null||typeof(terminalIds[i])==undefined){
          terminalIds.splice(i,1);
          i=i-1;
        }
      }
      let param = {subtitleId: this.subtitleId, terminalIds: terminalIds}
      this.$API.batchAddSubtitlTerminal(param).then(() => {
        this.$modal.msgSuccess("下发紧急字幕到终端成功");
        this.openPull = false;
        this.getList();
      });
    },
    // 取消按钮
    cancelPull() {
      this.$refs.tree.setCheckedKeys([]);
      this.openPull = false;
    },
  }
};
</script>
