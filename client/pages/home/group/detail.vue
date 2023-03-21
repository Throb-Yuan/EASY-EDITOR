<template>
  <div class="app-container">
    <!-- 排程详情对话框 -->
      <el-form :model="scheduleQueryParams" ref="scheduleQueryForm" size="small" :inline="true" label-width="68px" @submit.native.prevent>
        <el-row :gutter="1"  style="margin-bottom: 20px">
          <p style="font-size: 18px">节目排程组：{{programScheduleName}}</p>
        </el-row>
        <el-form-item label="节目名称" prop="programName">
          <el-input
            v-model="scheduleQueryParams.programName"
            placeholder="请输入节目名称"
            @keyup.enter.native="$event.target.blur()"
            @blur="handleScheduleQuery"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" icon="el-icon-search" size="mini" @click="handleScheduleQuery">搜索</el-button> -->
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
            @click="handleScheduleAdd"
          >新增</el-button>
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleScheduleDelete"
          >删除</el-button>
        </el-col>
      </el-row>

      <el-table v-loading="scheduleLoading" :data="scheduleList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="节目名称" align="center" prop="programName" />
        <el-table-column label="开始日期" align="center" prop="beginDate" />
        <el-table-column label="结束日期" align="center" prop="endDate" />
        <el-table-column label="开始时间" align="center" prop="beginTime" />
        <el-table-column label="结束时间" align="center" prop="endTime" />
        <el-table-column label="星期" align="center" prop="week" width="400px" :formatter="weekFormat"/>
        <el-table-column label="是否插播" align="center" prop="insertFlag" >
          <template slot-scope="scope">
            <span v-if="scope.row.insertFlag == 0 ">是</span>
            <span v-if="scope.row.insertFlag == 1 ">否</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-mobile-phone"
              @click="handlePull(scope.row)"
            >下发到终端</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleScheduleUpdate(scope.row)"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleScheduleDelete(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="scheduleTotal>0"
        :total="scheduleTotal"
        :page.sync="scheduleQueryParams.pageNum"
        :limit.sync="scheduleQueryParams.pageSize"
        @pagination="getScheduleList"
      />

    <!-- 添加或修改节目排程对话框 -->
    <el-dialog :title="title" :visible.sync="scheduleOptOpen" width="720px" append-to-body>
      <el-form ref="scheduleForm" :model="scheduleForm" :rules="scheduleFormRules" label-width="80px">
        <el-form-item label="节目" prop="programId">
          <el-select v-model="scheduleForm.programId" placeholder="请选择节目">
            <el-option-group
              v-for="scene in sceneProgramList"
              :key="scene.sceneName"
              :label="scene.sceneName">
              <el-option
                v-for="item in scene.program"
                :key="item.programId"
                :label="item.programName"
                :value="item.programId">
              </el-option>
            </el-option-group>
          </el-select>
        </el-form-item>
        <el-form-item label="起始日期" prop="beginDate">
          <el-date-picker
            v-model="scheduleForm.beginDate"
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
            v-model="scheduleForm.beginTime"
            format = 'HH:mm:ss' value-format = 'HH:mm:ss'
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="起始时间">
          </el-time-picker>
        </el-form-item>

        <el-form-item label="星期" prop="week">
          <el-checkbox-group v-model="scheduleForm.week">
            <el-checkbox-button key="1" label="1" style="margin-top: 2px;margin-left: 2px">星期一</el-checkbox-button>
            <el-checkbox-button key="2" label="2" style="margin-top: 2px;margin-left: 2px">星期二</el-checkbox-button>
            <el-checkbox-button key="3" label="3" style="margin-top: 2px;margin-left: 2px">星期三</el-checkbox-button>
            <el-checkbox-button key="4" label="4" style="margin-top: 2px;margin-left: 2px">星期四</el-checkbox-button>
            <el-checkbox-button key="5" label="5" style="margin-top: 2px;margin-left: 2px">星期五</el-checkbox-button>
            <el-checkbox-button key="6" label="6" style="margin-top: 2px;margin-left: 2px">星期六</el-checkbox-button>
            <el-checkbox-button key="7" label="7" style="margin-top: 2px;margin-left: 2px">星期日</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否插播" prop="insertFlag">
          <el-switch
            v-model="scheduleForm.insertFlag"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitScheduleForm">确 定</el-button>
        <el-button @click="cancelScheduleForm">取 消</el-button>
      </div>
    </el-dialog>


    <!-- 下发到终端 -->
    <el-dialog title="下发排程到终端" :visible.sync="openPull" width="500px" append-to-body>
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
  name: "Group",
  data() {
    return {
      programScheduleGroupId: null,
      programScheduleName: null,
      openPull: false,
      pullform: {},
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 遮罩层
      loading: true,
      scheduleLoading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      programScheduleId: null,
      // 总条数
      total: 0,
      scheduleTotal: 0,
      // 节目排程表格数据
      groupList: [],
      // 节目排程表格数据
      scheduleList: [],
      //场景节目列表
      sceneProgramList: [],
      // 弹出层标题
      title: "",
      scheduleTitle: "",
      // 是否显示弹出层
      open: false,
      scheduleOptOpen: false,
      // 查询参数
      scheduleQueryParams: {
        pageNum: 1,
        pageSize: 10,
        programScheduleGroupId: null,
        terminalId: null,
        programId: null,
        programName: null,
        beginDate: null,
        endDate: null,
        beginTime: null,
        endTime: null,
        week: null,
        insertFlag: null,
        status: null,
      },
      // 表单参数
      form: {},
      scheduleForm: {},
      // 表单校验
      rules: {
      },
      scheduleFormRules: {
        programId: [
          {required: true, message: '请选择节目', trigger: 'change',type: "string"}
        ],beginDate: [
          {required: true, message: '请选择起始日期', trigger: 'blur'}
        ],beginTime: [
          {required: true, message: '请选择起始时间', trigger: 'blur'}
        ],week: [
          {required: true, message: '请选择星期', trigger: 'blur'}
        ],insertFlag: [
          {required: true, message: '请选择是否插播', trigger: 'blur'}
        ],
      }
    };
  },
  created() {
    this.scheduleQueryParams.programScheduleGroupId = this.$route.query.id||null;
    this.scheduleForm.programScheduleGroupId = this.$route.query.id||null;
    this.getGroupDetail( this.scheduleForm.programScheduleGroupId );
    this.getScheduleList()
    this.getSelectList();
  },
  methods: {
    getGroupDetail(programScheduleGroupId)
    {
      this.$API.getGroup(programScheduleGroupId).then(response => {
          this.programScheduleName = response.data?response.data.programScheduleName:'';
      });
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
    submitPull() {
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
      let param = {programScheduleId: this.programScheduleId, terminalIds: terminalIds}
      this.$API.batchAddProgramterminal(param).then(() => {
        this.$modal.msgSuccess("下发日程到终端成功");
        this.openPull = false;
        this.getScheduleList();
      });

    },
    /**下发到终端操作 */
    handlePull(row)
    {
      this.$API.terminalTreeListGet({}).then(response => {
        this.treeData = response.data;
      });
      this.programScheduleId = row.programScheduleId
      this.openPull = true
      this.$refs.tree.setCheckedKeys([]);
    },
    // 取消按钮
    cancelPull() {
      this.$refs.tree.setCheckedKeys([]);
      this.openPull = false;
    },
    getSelectList(){
      this.$API.listScene().then(response => {

        this.$API.listProgramGet().then(resp => {
          let sceneList = response.data;
          let program = resp.data;

          sceneList.forEach(item =>{
            let subPorgram = [];
            program.forEach(program =>{
              if(item.sceneId === program.sceneId)
              {
                subPorgram.push(program)
              }
            })
            item.program = subPorgram;
          })
          this.sceneProgramList = sceneList;
        });

      });
    },
    /** 查询节目排程列表 */
    getScheduleList() {
      this.scheduleLoading = true;
      this.$API.listSchedule(this.scheduleQueryParams).then(response => {
        this.scheduleList = response.rows;
        this.scheduleTotal = response.total;
        this.scheduleLoading = false;
      });
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },    // 取消按钮
    cancelScheduleForm() {
      this.scheduleOptOpen = false;
      this.resetSchedule();
    },
    // 表单重置
    reset() {
      this.form = {
        programScheduleGroupId: null,
        programScheduleName: null,
        remark: null,
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
    resetSchedule() {
      let programScheduleGroupId = this.scheduleForm.programScheduleGroupId;
      this.resetForm("scheduleForm");
      this.scheduleForm = {
        programScheduleGroupId: programScheduleGroupId,
        programScheduleId: null,
        terminalId: null,
        programId: null,
        programName: null,
        beginDate: null,
        endDate: null,
        beginTime: null,
        endTime: null,
        week: [],
        insert: null,
        status: 0,
        creatorId: null,
        creator: null,
        createTime: null,
        modifyId: null,
        modifier: null,
        modifyTime: null,
        version: null,
        delStatus: 0
      };

    },
    /** 搜索按钮操作 */
    handleScheduleQuery() {
      this.scheduleQueryParams.pageNum = 1;
      this.getScheduleList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("scheduleQueryForm");
      this.resetForm("queryForm");
      this.handleScheduleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.programScheduleId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加排程";
    },
    handleScheduleAdd() {
      this.scheduleOptOpen = true;
      this.title = "添加节目排程";
      this.resetSchedule()
      this.scheduleForm.week = ['1','2','3','4','5','6','7']
      this.scheduleForm.insertFlag = '0'
      this.$forceUpdate();
    },
    /** 修改按钮操作 */
    handleScheduleUpdate(row) {
      this.resetSchedule();
      const programScheduleId = row.programScheduleId || this.ids
      this.$API.getSchedule(programScheduleId).then(response => {
        this.scheduleForm = response.data;
        let dates = []
        let times = []
        dates[0] = response.data.beginDate
        dates[1] = response.data.endDate
        this.scheduleForm.beginDate=dates
        times[0] = response.data.beginTime
        times[1] = response.data.endTime
        this.scheduleForm.beginTime=times

        if(this.scheduleForm.week)
        {
          this.scheduleForm.week = this.scheduleForm.week.split(',');
        }else
        {
          this.scheduleForm.week = []
        }

        if( parseInt(this.scheduleForm.insertFlag)==0)
        {
          this.scheduleForm.insertFlag=true;
        }else
        {
          this.scheduleForm.insertFlag=false;
        }

        this.title = "修改节目排程";
        this.scheduleOptOpen = true;
      });
    },
    /** 提交按钮 */
    submitScheduleForm() {
      this.$refs["scheduleForm"].validate(valid => {
        if (valid) {
          let param = JSON.parse(JSON.stringify(this.scheduleForm));
          if(!this.scheduleForm.programId)
          {
            this.$message.error("请选择节目");
            return
          }

          if(this.scheduleForm.week.length==0)
          {
            this.$message.error("星期至少选择一个");
            return
          }else
          {
            param.week=this.scheduleForm.week.toString()
          }

          if( this.scheduleForm.beginTime==null || this.scheduleForm.beginTime.length == 0)
          {
            this.$message.error("请选择起始时间");
            return
          }else
          {
            let times = this.scheduleForm.beginTime;
            param.beginTime=times[0];
            param.endTime=times[1];
          }

          if(this.scheduleForm.beginDate==null || this.scheduleForm.beginDate.length == 0)
          {
            this.$message.error("请选择起始日期");
            return
          }else{
            let dates = this.scheduleForm.beginDate;
            param.beginDate=dates[0];
            param.endDate=dates[1];
          }

          if(this.scheduleForm.insertFlag)
          {
            param.insertFlag = 0
          }else
          {
            param.insertFlag = 1
          }

          if (this.scheduleForm.programScheduleId != null) {
            this.$API.updateSchedule(param).then(() => {
              this.$modal.msgSuccess("修改成功");
              this.scheduleOptOpen = false;
              this.getScheduleList()
            });
          } else {
            this.$API.addSchedule(param).then(() => {
              this.$modal.msgSuccess("新增成功");
              this.scheduleOptOpen = false;
              this.getScheduleList()
            });
          }
        }
      });



    },
    handleScheduleDelete(row){
      const programScheduleIds = row.programScheduleId || this.ids;
      let message = row.programName ? '是否确认删除节目名为"' + row.programName + '"的数据项？' :'是否确认删除所勾选的节目排程数据？';
      this.$modal.confirm(message ).then(() =>{
        this.$API.delSchedule(programScheduleIds).then(() => {
          this.getScheduleList()
          this.$modal.msgSuccess("删除成功");
        })
      });
    },

  }
};
</script>
