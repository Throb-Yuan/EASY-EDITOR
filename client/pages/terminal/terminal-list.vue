<template>
  <div class="app-container" style="padding:20px;">
        <el-form :inline="true" label-position="right">
          <el-form-item label="终端信息：">
            <el-input v-model.trim="searchVal" placeholder="搜索终端名称或ID" clearable @keyup.enter.native="getAppList"></el-input>
          </el-form-item>
          <el-form-item label="终端创建时间：">
            <el-date-picker v-model="startTime" type="date" value-format="yyyy-MM-dd" :picker-options="beginOptions" placeholder="开始时间"> </el-date-picker>
            <span style="padding: 0 10px">至</span>
            <el-date-picker v-model="endTime" type="date" value-format="yyyy-MM-dd" :picker-options="endOptions" placeholder="结束时间"> </el-date-picker>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" icon="el-icon-search" size="mini" @click="getGroupList">搜索</el-button>
              <el-button type="primary" Icon="el-icon-plus"  size="mini"  @click="getTerminalDialog()">新增终端组</el-button>
          </el-form-item>

        </el-form>
    <div class="app-wrap-body">
        <div>终端管理</div>
      <el-table :data="tableData" :show-header="false" default-expand-all style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.terminalList"  style="width: 100%">
              <el-table-column prop="terminalId" label="终端ID" width="200"> </el-table-column>
              <el-table-column prop="terminalName" label="终端名称"></el-table-column>>
              <el-table-column prop="terminalVersion" label="终端版本号"></el-table-column>>
              <el-table-column prop="memory" label="终端内存"> </el-table-column>
              <el-table-column prop="ip" label="IP"> </el-table-column>
              <el-table-column prop="mac" label="MAC"> </el-table-column>
              <el-table-column prop="os" label="系统"> </el-table-column>
              <el-table-column prop="osVersion" label="系统版本"> </el-table-column>
              <el-table-column prop="modifyTime" label="最后上报时间"> </el-table-column>
              <el-table-column align="center" width="200" label="操作">
                <template slot-scope="scope">
                  <el-button class="app-btn-size" type="text"  @click="controlTerminal(scope.row)">控制 </el-button>
                  <el-button class="app-btn-size" type="text"  @click="controlTerminalList(scope.row)">记录查询</el-button>
                  <el-button class="app-btn-size" type="text"  @click="addTerminal(scope.row)">编辑 </el-button>
                  <el-button class="app-btn-size" type="text"  @click="deleteTerminal(scope.row)">删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <div class="group-box">
              <div>
                <div class="group-name">
                  {{ scope.row.terminalGroupName }}
                  <i v-show="scope.row.terminalGroupId" class="el-icon-edit" style="color:#AEAEAE;font-size: 18px" @click="getTerminalDialog(scope.row)"></i>
                  <i v-show="scope.row.terminalGroupId" class="el-icon-delete" style="color:#AEAEAE;font-size: 18px" @click="deleteTerminalItem(scope.row)"></i>
                </div>
                <div v-show="scope.row.terminalGroupId">展示应用: {{ scope.row.appName }}</div>
                <div v-show="scope.row.terminalGroupId">创建时间: {{ scope.row.createTime }}</div>
              </div>
              <el-button size="mini" type="primary" v-show="scope.row.terminalGroupId"  icon="el-icon-plus" @click="addTerminal(scope.row)">新增终端 </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-if="terminalGroupVisible" :title="terminalGroupDialogTitle" :visible.sync="terminalGroupVisible" width="650px" :close-on-click-modal="false">
      <div class="content">
        <el-form :model="terminalGroupForm" :rules="rulesTerminalGroup" ref="terminalGroupForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="终端组名称" prop="terminalGroupName">
            <el-input v-model.trim="terminalGroupForm.terminalGroupName" show-word-limit maxlength="15" placeholder="15个字以内"></el-input>
          </el-form-item>
          <el-form-item label="所展示应用" prop="terminalGroup">
            <el-select class="custom-select-wrap" multiple collapse-tags v-model="terminalGroupForm.appIds">
              <el-option v-for="(item, index) in appList" :key="index" :label="item.appName" :value="item.appId"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model.trim="terminalGroupForm.remark"
              :autosize="{ minRows: 8 }"
              show-word-limit
              maxlength="300"
              placeholder="请输入300字以内备注..."
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTerminalGroupForm()">确 定</el-button>
        <el-button @click="terminalGroupVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog v-if="terminalVisible" :title="terminalDialogTitle" :visible.sync="terminalVisible" width="650px" :close-on-click-modal="false">
      <div class="content">
        <el-form :model="terminalForm" :rules="rulesTerminal" ref="terminalForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="终端ID" prop="terminalId">
            <el-input v-model.trim="terminalForm.terminalId" show-word-limit maxlength="40" placeholder="40个字以内"></el-input>
          </el-form-item>
          <el-form-item label="终端名称" prop="terminalName">
            <el-input v-model.trim="terminalForm.terminalName" show-word-limit maxlength="15" placeholder="15个字以内"></el-input>
          </el-form-item>
          <el-form-item label="所属终端组" prop="terminalGroup">
            <el-select class="custom-select-wrap" collapse-tags v-model="terminalForm.terminalGroupId">
              <el-option v-for="(item, index) in terminalGroupList" :key="index" :label="item.terminalGroupName" :value="item.terminalGroupId"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTerminalForm()">确 定</el-button>
        <el-button @click="terminalVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog v-if="terminalControlVisible" title="终端控制" :visible.sync="terminalControlVisible" width="400px" :close-on-click-modal="false">
      <el-form ref="form" :model="controlForm" label-width="80px">
        <el-form-item label="终端名称" prop="terminalId">
          {{controlForm.terminalName}}
        </el-form-item>
        <el-form-item label="控制指令" prop="controlCommand">
          <el-select v-model="controlForm.controlCommand" >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音量" prop="volume" v-if="controlForm.controlCommand==6">
          <el-slider v-model="controlForm.volume"></el-slider>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitControlForm">确 定</el-button>
        <el-button @click="terminalControlVisible=false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="terminalControlListVisible" :title="terminalControlDialogTitle" :visible.sync="terminalControlListVisible" width="1150px" :close-on-click-modal="false">

      <el-tabs v-model="activeName">
        <el-tab-pane label="终端控制记录" name="first">
          <el-table v-loading="loading" :data="controlList" >
            <el-table-column label="控制指令" align="center" prop="controlCommand" :formatter="controlCommandFormat"/>
            <el-table-column label="截图时节目名称" align="center" prop="programName" />
            <el-table-column label="远程截图" align="center" prop="screenshotId" >
              <template slot-scope="scope">
                <el-image v-if="scope.row.screenshotId"
                  style="width: 100px; height: 100px"
                  :src="scope.row.screenshotId"
                  :preview-src-list="[scope.row.screenshotId]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column label="音量" align="center" prop="volume" :formatter="volumeFormat"/>
            <el-table-column label="下发时间" align="center" prop="createTime" width="160"/>
            <el-table-column label="同步状态" align="center" prop="syncStatus" :formatter="syncStatusFormat" width="80"/>

          </el-table>

          <pagination
            v-show="total>0"
            :total="total"
            :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize"
            @pagination="getTerminalControlList"
          />
        </el-tab-pane>

        <el-tab-pane label="节目推送记录" name="second">
          <el-table v-loading="loading" :data="programTerminalList">
            <el-table-column label="节目名称" align="center" prop="programName" />
            <el-table-column label="状态" align="center" prop="status" :formatter="statusFormat"/>
            <el-table-column label="操作类型" align="center" prop="businessType" :formatter="businessTypeFormat"/>
            <el-table-column label="推送时间"  width='150px' align="center" prop="createTime" :formatter="createTimeFormat"/>
            <el-table-column label="日程日期" width='180px' align="center" prop="beginDate" :formatter="beginDateFormat"/>
            <el-table-column label="日程时间" width='160px' align="center" prop="beginTime" :formatter="beginTimeFormat"/>
            <el-table-column label="日程星期" align="center" prop="week" />
          </el-table>
          <pagination
            v-show="ptTotal>0"
            :total="ptTotal"
            :page.sync="queryProgramTerminalParams.pageNum"
            :limit.sync="queryProgramTerminalParams.pageSize"
            @pagination="getProgramTerminalList"
          />
        </el-tab-pane>

        <el-tab-pane label="开关机时间" name="third">
            <el-button type="primary" Icon="el-icon-plus"  size="small"  @click="getShutdownPlanAddDialog(undefined)" style="margin-bottom: 10px">新增开关机时间</el-button>
          <el-table v-loading="loading" :data="shutdownPlanList">
            <el-table-column label="开机时间" align="center" prop="bootTime" />
            <el-table-column label="关机时间" align="center" prop="shutdownTime" />
            <el-table-column label="星期" align="center" width="400px" prop="week" :formatter="weekFormat"/>
            <el-table-column label="是否启用"  width='150px' align="center" prop="enable" :formatter="enableFormat"/>
            <el-table-column label="创建时间" width='180px' align="center" prop="createTime" :formatter="createTimeFormat"/>
            <el-table-column align="center" width="200" label="操作">
              <template slot-scope="scope">
                <el-button class="app-btn-size" type="text"  @click="getShutdownPlanAddDialog(scope.row)">编辑 </el-button>
                <el-button class="app-btn-size" type="text"  @click="deleteShutdownPlan(scope.row)">删除 </el-button>
              </template>
            </el-table-column>
          </el-table>
          <pagination
            v-show="sppTotal>0"
            :total="sppTotal"
            :page.sync="queryShutdownPlanParams.pageNum"
            :limit.sync="queryShutdownPlanParams.pageSize"
            @pagination="getShutdownPlanList"
          />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>


    <!-- 添加或修改开关机计划对话框 -->
    <el-dialog :title="shutdownPlanTitle" :visible.sync="shutdownPlanOpen" width="750px" append-to-body>
      <el-form ref="shutdownPlanForm" :model="shutdownPlanForm" :rules="rules" label-width="80px">
        <el-form-item label="开机时间" prop="bootTime">
          <el-time-picker clearable
                          v-model="shutdownPlanForm.bootTime"
                          value-format="HH:mm"
                          format="HH:mm"
                          placeholder="请选择开机时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="关机时间" prop="shutdownTime">
          <el-time-picker clearable
                          v-model="shutdownPlanForm.shutdownTime"
                          value-format="HH:mm"
                          format="HH:mm"
                          placeholder="请选择关机时间">
          </el-time-picker>
        </el-form-item>

        <el-form-item label="星期" prop="week">
          <el-checkbox-group v-model="shutdownPlanForm.week" >
            <el-checkbox-button key="1" label="1" style="margin-top: 2px;margin-left: 2px">星期一</el-checkbox-button>
            <el-checkbox-button key="2" label="2" style="margin-top: 2px;margin-left: 2px">星期二</el-checkbox-button>
            <el-checkbox-button key="3" label="3" style="margin-top: 2px;margin-left: 2px">星期三</el-checkbox-button>
            <el-checkbox-button key="4" label="4" style="margin-top: 2px;margin-left: 2px">星期四</el-checkbox-button>
            <el-checkbox-button key="5" label="5" style="margin-top: 2px;margin-left: 2px">星期五</el-checkbox-button>
            <el-checkbox-button key="6" label="6" style="margin-top: 2px;margin-left: 2px">星期六</el-checkbox-button>
            <el-checkbox-button key="7" label="7" style="margin-top: 2px;margin-left: 2px">星期日</el-checkbox-button>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item label="是否启用" prop="enable">
          <el-tooltip :content="parseInt(shutdownPlanForm.enable)==0?'启用':'禁用'" placement="top">
            <el-switch
              v-model="shutdownPlanForm.enable" active-value="0" inactive-value="1"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </el-tooltip>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitShutdownPlanForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>

import { addControl, listControl,terminalDetailListGet } from '@/api/content/control'
import { listProgramterminal } from '@/api/content/programterminal'
import { addShutdownPlan, delShutdownPlan, listShutdownPlan, updateShutdownPlan } from '@/api/content/shutdown-plan'

export default {
  name: "terminal",
  dicts: ['sys_yes_no'],
  data() {
    return {
      activeName: 'first',
      shutdownPlanTitle: '新增开关机时间',
      shutdownPlanOpen: false,
      shutdownPlanForm: {
        terminalId: '',
        week: [],
        enable: '0' },
      rules: {
        bootTime: [
          {required: true, message: '请选择开机时间', trigger: 'blur'},
          {max: 5, message: '开机时间长度在5个以内', trigger: 'blur'}
        ],
        shutdownTime: [
          {required: true, message: '请选择关机时间', trigger: 'blur'}
        ],
        week: [
          {required: true, message: '请选择星期', trigger: 'blur'}
        ]
      },

      total: 0,
      ptTotal: 0,
      sppTotal: 0,
      // 遮罩层
      loading: true,
      terminalControlDialogTitle: '',
      // 终端控制记录表格数据
      controlList: [],
      programTerminalList: [],
      shutdownPlanList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        terminalId: null,
        controlCommand: null,
        syncStatus: null
      },
      queryProgramTerminalParams: {
        pageNum: 1,
        pageSize: 10,
        terminalId: null
      },queryShutdownPlanParams: {
        pageNum: 1,
        pageSize: 10,
        terminalId: null
      },
      options: [{
        value: 1,
        label: '关机'
      }, {
        value: 2,
        label: '重启'
      }, {
        value: 3,
        label: '播放'
      }, {
        value: 4,
        label: '停止'
      }, {
        value: 5,
        label: '暂停'
      }, {
        value: 6,
        label: '音量'
      }, {
        value: 7,
        label: '重置'
      }, {
        value: 8,
        label: '截屏'
      }],
      terminalGroupList: [],
      appList: [],
      viewVisible: false,
      terminalControlVisible: false,
      terminalControlListVisible: false,
      searchVal: '',
      startTime: '',
      endTime: '',
      beginOptions: {
        disabledDate: time => {
          if (this.endTime) {
            return time.getTime() > new Date(this.endTime)
          }
        }
      },
      endOptions: {
        disabledDate: time => {
          if (this.startTime) {
            return time.getTime() < new Date(this.startTime).getTime() - 8.64e7
          }
        }
      },
      terminalDialogTitle: '新增终端',
      terminalGroupDialogTitle: '新增终端组',
      terminalGroupVisible: false,
      terminalVisible: false,
      terminalGroupForm: {
        terminalGroupName: '',
        appIds: '',
        remark: ''
      },
      controlForm:{

      },
      terminalForm: {
        terminalId: '',
        terminalName: ''
      },
      rulesTerminalGroup: {
        terminalGroupName: [
          {required: true, message: '请输入终端组名称', trigger: 'blur'},
          {max: 15, message: '名称长度在15个以内', trigger: 'blur'}
        ]
      },
      rulesTerminal: {
        terminalId: [
          {required: true, message: '请输入终端Id', trigger: 'blur'},
          {max: 40, message: 'ID长度在40个以内', trigger: 'blur'}
        ],
        terminalName: [
          {required: true, message: '请输入终端名称', trigger: 'blur'},
          {max: 50, message: '名称长度在50个以内', trigger: 'blur'}
        ]
      },
      tableData: []
    }
  },
  mounted() {
    this.getGroupList()
  },

  methods: {
    beginDateFormat(row){
      if(row.beginDate && row.endDate)
      {
        return row.beginDate+'~'+row.endDate;
      }
    },
    beginTimeFormat(row){
      if(row.beginTime && row.endTime)
      {
        return row.beginTime+'-'+row.endTime;
      }
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
    enableFormat(row){
      switch (parseInt(row.enable)) {
        case 0:
          return '启用'
        case 1:
          return '禁用'
        default:
          break
      }
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
    },controlCommandFormat(row){
      switch (row.controlCommand) {
        case 1:
          return '关机'
        case 2:
          return '重启'
        case 3:
          return '播放'
        case 4:
          return '停止'
        case 5:
          return '暂停'
        case 6:
          return '音量'
        case 7:
          return '重置'
        case 8:
          return '截屏'
        default:
          break
      }
    },volumeFormat(row){
      if(row.controlCommand==6)
      {
        return Math.round(row.volume *100)+"%";
      }else{
        return '';
      }
    },syncStatusFormat(row){
      switch (row.syncStatus) {
        case 0:
          return '未同步'
        case 1:
          return '同步成功'
        case 2:
          return '同步失败'
        default:
          break
      }
    },statusFormat(row){
      switch (row.status) {
        case 0:
          return '未同步'
        case 1:
          return '已忽略'
        case 2:
          return '同步中'
        case 3:
          return '同步成功'
        case 4:
          return '同步失败'
        default:
          break
      }
    },
    businessTypeFormat(row){
      switch (row.businessType) {
        case 'INSERT':
          return '新增节目'
        case 'DELETE':
          return '删除节目'
        case 'INSERT_SCHEDULE':
          return '新增日程'
        case 'DELETE_SCHEDULE':
          return '删除日程'
        default:
          break
      }
    },
    getTerminalDialog(item) {
      this.terminalGroupForm = {}
      this.terminalGroupDialogTitle = item ? '编辑终端组' : '新增终端组'
      if (item) {

        let params = { terminalGroupId: item.terminalGroupId }
        this.$request
          .terminalGroupAppListGet(params)
          .then(res => {
            let appIds = []
            for(var i=0;i<res.data.length;i++) {
              appIds[i] = res.data[i].appId;
            }
            this.terminalGroupForm = {
              terminalGroupId: item.terminalGroupId,
              terminalGroupName: item.terminalGroupName,
              remark: item.remark,
              appIds: appIds
            }
          })
          .catch(e => {
            this.$message({
              type: 'error',
              message: e.msg
            })
          })
      } else {
        this.terminalGroupForm = {
          terminalGroupName: '',
          remark: ''
        }
      }
      this.terminalGroupVisible = true
      // 重置表单校验
      this.$nextTick(() => {
        this.$refs.terminalGroupForm.resetFields()
      })
      this.$request.appListGet()
        .then(res => {
          this.appList = res.data
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.msg
          })
        })
    },
    submitControlForm() {
      if(this.controlForm.controlCommand==6)
      {
        this.controlForm.volume = this.controlForm.volume/100;
      }else
      {
        this.controlForm.volume = 0;
      }
      addControl(this.controlForm).then(response => {
        this.$modal.msgSuccess("操作成功");
        this.terminalControlVisible = false;
      });
    },
    controlTerminal(item) {
      this.controlForm = {
        terminalId: item.terminalId,
        terminalName: item.terminalName,
        controlCommand: 1
      }
      this.terminalControlVisible = true
    },
    controlTerminalList(item) {
      this.activeName = 'first'
      this.terminalControlDialogTitle = item.terminalName
      this.terminalControlListVisible = true
      this.queryParams = {
          pageNum: 1,
          pageSize: 10,
          terminalId: item.terminalId,
          controlCommand: null,
          syncStatus: null
      }
      this.queryProgramTerminalParams = {
          pageNum: 1,
          pageSize: 10,
          terminalId: item.terminalId
      }
      this.queryShutdownPlanParams = {
        pageNum: 1,
        pageSize: 10,
        terminalId: item.terminalId
      }
      this.shutdownPlanForm = {
        week: [],
        terminalId: item.terminalId
      }
      this.getTerminalControlList()
      this.getProgramTerminalList()
      this.getShutdownPlanList()
    },
    getProgramTerminalList(){
      this.loading = true;
      listProgramterminal(this.queryProgramTerminalParams).then(response => {
        this.programTerminalList = response.rows;
        this.ptTotal = response.total;
        this.loading = false;
      });
    },getShutdownPlanList(){
      this.loading = true;
      listShutdownPlan(this.queryShutdownPlanParams).then(response => {
        this.shutdownPlanList = response.rows;
        this.sppTotal = response.total;
        this.loading = false;
      });
    },
    getTerminalControlList(){
      this.loading = true;
      listControl(this.queryParams).then(response => {
        this.controlList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    addTerminal(item) {
      this.terminalForm = {}
      this.terminalDialogTitle = item.terminalId ? '编辑终端' : '新增终端'
      if (item.terminalId) {
        this.terminalForm = {
          terminalId: item.terminalId,
          terminalGroupId: item.terminalGroupId,
          terminalName: item.terminalName
        }
      } else {
        this.terminalForm = {
          terminalGroupId: item.terminalGroupId,
          terminalName: '',
          terminalId: ''
        }
      }
      this.terminalVisible = true
      // 重置表单校验
      this.$nextTick(() => {
        this.$refs.terminalForm.resetFields()
      })

      this.$request.terminalGroupListGet()
        .then(res => {
          this.terminalGroupList = res.data
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.msg
          })
        })
    },

    submitTerminalGroupForm() {
      this.$refs.terminalGroupForm.validate(valid => {
        if (valid) {
          const {terminalGroupId, terminalGroupName, remark} = this.terminalGroupForm
          let param = {
            terminalGroupName: terminalGroupName
          }
          if (terminalGroupId) {
            param.remark = remark
            param.terminalGroupId = terminalGroupId
            this.$request
              .terminalGroupUpdate(param)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '修改终端组成功'
                })
                this.addTerminalGroupApp( this.terminalGroupForm.terminalGroupId,this.terminalGroupForm.appIds);
                this.terminalGroupVisible = false

              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.msg
                })
                this.terminalGroupVisible = false

              })
          } else {
            if (remark) {
              param.remark = remark
            }
            this.$request
              .terminalGroupAdd(param)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '新增终端组成功'
                })
                this.terminalGroupVisible = false
                this.addTerminalGroupApp( res.data.terminalGroupId,this.terminalGroupForm.appIds)
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.msg
                })
                this.terminalGroupVisible = false
              })
          }


        } else {
          return false
        }
      })
    },
    addTerminalGroupApp(terminalGroupId,appIds){
      let params = {
        terminalGroupId : terminalGroupId,
        appIds : appIds
      }
      this.$request
        .terminalGroupAppAdd(params)
        .then(res => {
          this.getGroupList()
        })
    },
    submitTerminalForm() {
      this.$refs.terminalForm.validate(valid => {
        if (valid) {
          const {terminalId,terminalGroupId, terminalName} = this.terminalForm
          let param = {
            terminalName: terminalName
          }
          if (terminalId) {
            param.terminalId = terminalId
            param.terminalGroupId = terminalGroupId
            this.$request.terminalUpdate(param)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '修改终端成功'
                })
                this.getGroupList()
                this.terminalVisible = false
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.msg
                })
                this.terminalVisible = false
              })
          } else {
            this.$request
              .terminalAdd(param)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '新增终端组成功'
                })
                this.getGroupList()
                this.terminalVisible = false
              })
              .catch(e => {
                this.$message({
                  type: 'error',
                  message: e.msg
                })
                this.terminalVisible = false
              })
          }
        } else {
          return false
        }
      })
    },
    deleteTerminalItem(item) {
      if (!item.terminalList.length) {
        this.$confirm('确认删除当前终端组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.deleteGroup(item)
          })
      } else {
        this.$alert('当前终端组下有终端，不允许删除', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        })
      }
    },
    deleteGroup(item) {
      this.$request
        .terminalGroupDelete({terminalGroupId: item.terminalGroupId})
        .then(() => {
          this.$message({
            type: 'success',
            message: `删除【${item.terminalGroupName}】终端组成功!`
          })
          this.getGroupList()
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.msg
          })
        })
    },
    deleteTerminal(item) {
      let terminalName = item.terminalName==null||item.terminalName==''?'未命名终端':item.terminalName;
        this.$confirm('确认删除【'+terminalName+'】终端？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$request
            .terminalDelete({terminalId: item.terminalId})
            .then(() => {
              this.$message({
                type: 'success',
                message: `删除【${terminalName}】终端成功!`
              })
              this.getGroupList()
            })
            .catch(e => {
              this.$message({
                type: 'error',
                message: e.msg
              })
            })
        })
    },
    getGroupList() {
      let params = {}
      if (this.startTime) {
        params.startTime = this.startTime
      }
      if (this.endTime) {
        params.endTime = this.endTime
      }
      if (this.searchVal) {
        params.keyword = this.searchVal
      }
      terminalDetailListGet(params)
        .then(res => {
          this.tableData = res.data
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.msg
          })
        })
    },submitShutdownPlanForm(){

      this.$refs.shutdownPlanForm.validate(valid => {
        if(this.shutdownPlanForm.week)
        {
          this.shutdownPlanForm.week=this.shutdownPlanForm.week.toString()
        }

        if (this.shutdownPlanForm.terminalShutdownPlanId)
        {
          updateShutdownPlan(this.shutdownPlanForm).then(res => {
            this.shutdownPlanOpen = false;
            this.getShutdownPlanList();
        })

        }else {
          addShutdownPlan(this.shutdownPlanForm).then(res => {
            this.shutdownPlanOpen = false;
            this.getShutdownPlanList();
          })
        }

      })

    },cancel(){
      this.shutdownPlanForm={week:[]}
      this.shutdownPlanOpen = false;
    },deleteShutdownPlan(item)
    {
      let shutdownPlanName = item.bootTime+'-'+item.shutdownTime
      this.$confirm('确认删除【'+shutdownPlanName+'】的开关机时间？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$request.delShutdownPlan( item.terminalShutdownPlanId)
          .then(() => {
            this.$message({
              type: 'success',
              message: `删除【${shutdownPlanName}】开关机时间成功!`
            })
            this.getShutdownPlanList();
          })
          .catch(e => {
            this.$message({
              type: 'error',
              message: e.msg
            })
          })
      })
    },getShutdownPlanAddDialog(item)
    {
      this.shutdownPlanOpen = true;
      this.shutdownPlanTitle = item!=undefined && item.terminalShutdownPlanId ? '编辑开关机时间' : '新增开关机时间'
      if (item!=undefined && item.terminalShutdownPlanId) {
        this.shutdownPlanForm = {
          terminalShutdownPlanId: item.terminalShutdownPlanId,
          terminalId: item.terminalId,
          bootTime: item.bootTime,
          shutdownTime: item.shutdownTime,
          enable: item.enable,
          week: item.week?item.week.split(','):[]
        }
      } else {
        this.shutdownPlanForm.shutdownTime = ''
        this.shutdownPlanForm.bootTime = ''
        this.shutdownPlanForm.enable = 1
        this.shutdownPlanForm.week = []
      }
      console.log(this.shutdownPlanForm)

    }
  }
}
</script>
<style lang="scss">
</style>
<style lang="scss">

.app-wrap {
  padding: 20px 30px 10px 30px;
  background-color: #fff;
  border: 1px solid #e9e8e7;
  border-radius: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

  .el-dialog__header {
    border-bottom: 1px solid #eee;
  }

  .company-select-dlg {
    .el-dialog__body {
      padding: 15px 20px;
    }
  }

  .el-dialog__body {
    padding: 15px 20px 30px 20px;
  }

  /*账户列表头部*/
  &-header {
    margin: 15px 0 25px;
  }

  /*账户列表内容*/
  &-body {
    padding: 0;

    .group-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;

      .group-name {
        margin-right: 8px;
        font-size: 18px;
        color: #000;

        i {
          padding: 6px;
          font-size: 22px;
          color: #409eff;
          cursor: pointer;

          &.el-icon-delete {
            color: #f56c6c;
          }
        }
      }
    }

    .app-status {
      width: 70px;
      color: #fff;
      height: 28px;
      line-height: 28px;
      background: #bebebe;
    }

    .el-divider {
      background-color: #55bbfa;
    }

    .app-btn-size {
      color: #55bbfa;
    }

    // tabel样式覆盖
    .el-table::before,
    .el-table__fixed-right::before,
    .el-table__fixed::before {
      height: 0;
    }

    .el-table__row:last-child td {
      border: 0;
    }

    // switch样式覆盖
    .el-switch__label {
      position: absolute;
      display: none;
      color: #fff;
    }

    /*打开时文字位置设置*/

    .el-switch__label--right {
      z-index: 1;
      right: 8px;
    }

    /*关闭时文字位置设置*/

    .el-switch__label--left {
      z-index: 1;
      left: 29px;
    }

    /*显示文字*/

    .el-switch__label.is-active {
      display: block;
    }

    .el-switch__core {
      width: 70px !important;
      height: 28px !important;
      border-radius: 3px !important;
    }

    .el-switch.is-checked .el-switch__core::after {
      margin-left: -22px !important;
    }

    &.el-switch .el-switch__core,
    .el-switch .el-switch__label {
      width: 50px !important;
    }

    .el-switch__core::after {
      margin-left: 0px !important;
    }

    .el-switch {
      height: 28px !important;
    }

    .el-switch__core:after {
      width: 21px !important;
      border-radius: 2px;
      height: 24px !important;
    }
  }

  .app-el-tag {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    > span {
      font-size: 15px;
    }
  }

  .dialog-footer {
    margin-top: -30px;
  }

  .app-pagination-wrap {
    cursor: pointer;
    padding: 15px 0 5px 0;
    text-align: center;
  }

  .app-permission-el-dialog-ct {
    .top-operator {
      padding-left: 15px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .remove-slt {
        color: #0099ff;
        cursor: pointer;
      }
    }

    .el-table th {
      background: #f3f3f3 !important;
    }

    .el-dialog__body {
      padding: 15px 20px;
    }

    .company-permission-btn {
      margin-left: 40px;
      margin-top: 10px;
    }
  }

  .img-app-add .el-upload-list {
    margin-left: 0 !important;
  }
}

//main-container全局样式
.app-container {
  padding: 20px;
}

.components-container {
  margin: 30px 50px;
  position: relative;
}

.pagination-container {
  margin-top: 30px;
}

.text-center {
  text-align: center
}

.sub-navbar {
  height: 50px;
  line-height: 50px;
  position: relative;
  width: 100%;
  text-align: right;
  padding-right: 20px;
  transition: 600ms ease position;
  background: linear-gradient(90deg, rgba(32, 182, 249, 1) 0%, rgba(32, 182, 249, 1) 0%, rgba(33, 120, 241, 1) 100%, rgba(33, 120, 241, 1) 100%);

  .subtitle {
    font-size: 20px;
    color: #fff;
  }

  &.draft {
    background: #d0d0d0;
  }

  &.deleted {
    background: #d0d0d0;
  }
}

.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;

  &:hover {
    color: rgb(32, 160, 255);
  }
}

.filter-container {
  padding-bottom: 10px;

  .filter-item {
    display: inline-block;
    vertical-align: middle;
    margin-bottom: 10px;
  }
}

//refine vue-multiselect plugin
.multiselect {
  line-height: 16px;
}

.multiselect--active {
  z-index: 1000 !important;
}
</style>
