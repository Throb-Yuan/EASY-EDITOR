<template>
  <div class="clearfix app-container">
    <el-scrollbar class="scroll-wrapper page-list-wrapper">
      <el-form :inline="true" label-position="right">
        <el-form-item label="终端信息：">
          <el-input v-model.trim="searchVal" placeholder="搜索终端名称或ID" @keyup.enter.native="$event.target.blur()"
            @blur="getGroupList"></el-input>
        </el-form-item>
        <el-form-item label="终端创建时间：">
          <el-date-picker v-model="timeOptions" type="daterange" unlink-panels :picker-options="pickerOptions"
            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd"
            @change="getGroupList">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" size="mini" @click="cancleSearch">重置</el-button>
          <el-button type="primary" Icon="el-icon-plus" size="mini" @click="getTerminalDialog()">新增终端组</el-button>
        </el-form-item>

      </el-form>
      <div class="app-wrap-body">
        <el-table :data="tableData" :show-header="false" default-expand-all style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table :data="props.row.terminalList" style="width: 100%">
                <el-table-column prop="terminalId" label="终端ID" width="300" align="center" />
                <el-table-column prop="terminalName" label="终端名称" align="center" />
                <el-table-column prop="freeSpace" label="使用空间" align="center" width="240">
                  <template slot-scope="scope">
                    <div>
                      <el-progress :stroke-width="8" :show-text="false" status="warning" :text-inside="true"
                        :percentage="scope.row.percentage" color="#909399"></el-progress>
                      <div style="color:#999;">{{ scope.row.freeSpaceData }}</div>
                    </div>

                  </template>
                </el-table-column>
                <el-table-column prop="ip" label="IP" align="center" />
                <el-table-column prop="osVersion" label="系统版本" align="center" />
                <el-table-column prop="terminalUpdateTime" width="180" label="设备状态" align="center">
                  <template slot-scope="scope">
                    <el-tag effect="dark" :type="tagList[scope.row.onLinestatus].type">{{
                      tagList[scope.row.onLinestatus].text }}</el-tag>
                  </template>
                </el-table-column>
                <el-table-column align="center" width="200" label="操作">
                  <template slot-scope="scope">
                    <el-button size="mini" type="text" icon="el-icon-s-operation"
                      @click="controlTerminalList(scope.row)">记录查询</el-button>
                    <el-button size="mini" type="text" icon="el-icon-c-scale-to-original"
                      @click="openShutdownPlanDialog(scope.row)">开关机</el-button>
                    <el-dropdown size="mini" @command="(command) => handleCommand(command, scope.row)">
                      <span class="el-dropdown-link" style="color: #1ab194">
                        <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="controlTerminal" icon="el-icon-s-tools">控制 </el-dropdown-item>
                        <el-dropdown-item command="detailTerminal" icon="el-icon-magic-stick">详情 </el-dropdown-item>
                        <el-dropdown-item command="addTerminal" icon="el-icon-edit">编辑</el-dropdown-item>
                        <el-dropdown-item command="deleteTerminal" icon="el-icon-delete">删除 </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>

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
                    <i v-show="scope.row.terminalGroupId" class="el-icon-edit" style="color:#AEAEAE;font-size: 18px"
                      @click="getTerminalDialog(scope.row)"></i>
                    <i v-show="scope.row.terminalGroupId" class="el-icon-delete" style="color:#AEAEAE;font-size: 18px"
                      @click="deleteTerminalItem(scope.row)"></i>
                  </div>
                  <div v-show="scope.row.terminalGroupId">创建时间: {{ scope.row.createTime }}</div>
                </div>
                <el-button size="mini" type="primary" v-show="scope.row.terminalGroupId" icon="el-icon-plus"
                  @click="addTerminal(scope.row)">新增终端 </el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

    </el-scrollbar>
    <el-dialog v-if="terminalGroupVisible" :title="terminalGroupDialogTitle" :visible.sync="terminalGroupVisible"
      width="650px" :close-on-click-modal="false">
      <div class="content">
        <el-form :model="terminalGroupForm" :rules="rulesTerminalGroup" ref="terminalGroupForm" label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="终端组名称" prop="terminalGroupName">
            <el-input v-model.trim="terminalGroupForm.terminalGroupName" show-word-limit maxlength="15"
              placeholder="15个字以内"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model.trim="terminalGroupForm.remark" :autosize="{ minRows: 8 }" show-word-limit
              maxlength="300" placeholder="请输入300字以内备注..."></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTerminalGroupForm()">确 定</el-button>
        <el-button @click="terminalGroupVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog v-if="terminalVisible" :title="terminalDialogTitle" :visible.sync="terminalVisible" width="650px"
      :close-on-click-modal="false">
      <div class="content">
        <el-form :model="terminalForm" :rules="rulesTerminal" ref="terminalForm" label-width="100px"
          class="demo-ruleForm">
          <el-form-item label="终端ID" prop="terminalId">
            <el-input v-model.trim="terminalForm.terminalId" show-word-limit maxlength="40" placeholder="40个字以内"
              :disabled="isDisabled"></el-input>
          </el-form-item>
          <el-form-item label="终端名称" prop="terminalName">
            <el-input v-model.trim="terminalForm.terminalName" show-word-limit maxlength="100"
              placeholder="100个字以内"></el-input>
          </el-form-item>
          <el-form-item label="终端密码" prop="pwd">
            <el-input v-model.trim="terminalForm.pwd" type="password" maxlength="16" placeholder="最少输入6位数字/字母/特殊字符" />
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPwd">
            <el-input v-model.trim="terminalForm.confirmPwd" type="password" maxlength="16"
              placeholder="最少输入6位数字/字母/特殊字符" />
          </el-form-item>
          <el-form-item label="所属终端组" prop="terminalGroup">
            <el-select class="custom-select-wrap" collapse-tags v-model="terminalForm.terminalGroupId" clearable
              placeholder="请选择所属终端组">
              <el-option v-for="(item, index) in terminalGroupList" :key="index" :label="item.terminalGroupName"
                :value="item.terminalGroupId"> </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitTerminalForm()">确 定</el-button>
        <el-button @click="terminalVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog v-if="terminalControlVisible" title="终端控制" :visible.sync="terminalControlVisible" width="400px"
      :close-on-click-modal="false">
      <el-form ref="form" :model="controlForm" label-width="80px">
        <el-form-item label="终端名称" prop="terminalId">
          {{ controlForm.terminalName }}
        </el-form-item>
        <el-form-item label="控制指令" prop="controlCommand">
          <el-select v-model="controlForm.controlCommand">
            <el-option v-for="item in dict.type.content_control_command" :key="item.value" :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="音量" prop="volume" v-if="controlForm.controlCommand == 6">
          <el-slider v-model="controlForm.volume"></el-slider>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitControlForm">确 定</el-button>
        <el-button @click="terminalControlVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog v-if="terminalControlListVisible" :title="terminalControlDialogTitle"
      :visible.sync="terminalControlListVisible" width="1150px" :close-on-click-modal="false">

      <el-tabs v-model="activeName">
        <el-tab-pane label="终端控制记录" name="first">
          <el-table v-loading="loading" :data="controlList">
            <el-table-column label="控制指令" align="center" prop="controlCommand" :formatter="controlCommandFormat" />
            <el-table-column label="截图时节目名称" align="center" prop="programName" />
            <el-table-column label="远程截图" align="center" prop="screenshotId">
              <template slot-scope="scope">
                <el-image v-if="scope.row.screenshotId" style="width: 100px; height: 100px" :src="scope.row.screenshotId"
                  :preview-src-list="[scope.row.screenshotId]">
                </el-image>
              </template>
            </el-table-column>
            <el-table-column label="音量" align="center" prop="volume" :formatter="volumeFormat" />
            <el-table-column label="下发时间" align="center" prop="createTime" width="160" />
            <el-table-column label="同步状态" align="center" prop="syncStatus" :formatter="syncStatusFormat" width="80" />

          </el-table>

          <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getTerminalControlList" />
        </el-tab-pane>

        <el-tab-pane label="节目推送记录" name="second">
          <el-table v-loading="loading" :data="programTerminalList">
            <el-table-column label="节目名称" align="center" prop="programName" />
            <el-table-column label="操作类型" align="center" prop="businessType" :formatter="businessTypeFormat" />
            <el-table-column label="推送时间" width='150px' align="center" prop="createTime" :formatter="createTimeFormat" />
            <el-table-column label="日程日期" width='180px' align="center" prop="beginDate" :formatter="beginDateFormat" />
            <el-table-column label="日程时间" width='160px' align="center" prop="beginTime" :formatter="beginTimeFormat" />
            <el-table-column label="日程星期" align="center" prop="week" :formatter="weekFormat" />
            <el-table-column label="同步状态" align="center" prop="status" :formatter="statusFormat" />
          </el-table>
          <pagination v-show="ptTotal > 0" :total="ptTotal" :page.sync="queryProgramTerminalParams.pageNum"
            :limit.sync="queryProgramTerminalParams.pageSize" @pagination="getProgramTerminalList" />
        </el-tab-pane>

        <el-tab-pane label="字幕推送记录" name="third">
          <el-table v-loading="loading" :data="subtitleTerminalList">
            <el-table-column label="字幕内容" align="center" prop="content" width="220px">
              <template slot-scope="scope">
                <el-tooltip class="item" effect="dark" :content="scope.row.content" placement="top-start">
                  <span>{{ scope.row.content.substring(0, 25) }}<span
                      v-if="scope.row.content.length > 25">...</span></span>
                </el-tooltip>
              </template>
            </el-table-column>

            <el-table-column label="定位" align="center" width="50px" prop="location" :formatter="contentLocationFormat" />
            <el-table-column label="滚动方向" align="center" width="80px" prop="rollingDirection"
              :formatter="rollingDirectionFormat" />
            <el-table-column label="速度" align="center" width="80px" prop="speed" />
            <el-table-column label="字幕日期" align="center" width='180px' prop="beginDate" :formatter="beginDateFormat" />
            <el-table-column label="字幕时间" align="center" width='160px' prop="beginTime" :formatter="beginTimeFormat" />
            <el-table-column label="星期" align="center" prop="week" :formatter="weekFormat" />
            <el-table-column label="操作类型" align="center" prop="businessType" width="105px"
              :formatter="subtitleBusinessTypeFormat" />
            <el-table-column label="同步状态" align="center" width="80px" prop="status" :formatter="statusFormat" />
          </el-table>
          <pagination v-show="stTotal > 0" :total="stTotal" :page.sync="querySubtitleTerminalParams.pageNum"
            :limit.sync="querySubtitleTerminalParams.pageSize" @pagination="getSubtitleTerminalList" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>


    <el-dialog title="设置开关机时间" :visible.sync="shutdownPlanDialogOpen" width="1150px" append-to-body>
      <el-button type="primary" Icon="el-icon-plus" size="small" @click="getShutdownPlanAddDialog(undefined)"
        style="margin-bottom: 10px">新增开关机时间</el-button>
      <el-table v-loading="loading" :data="shutdownPlanList">
        <el-table-column label="开机时间" align="center" prop="bootTime" />
        <el-table-column label="关机时间" align="center" prop="shutdownTime" />
        <el-table-column label="星期" align="center" width="400px" prop="week" :formatter="weekFormat" />
        <el-table-column label="是否启用" width='150px' align="center" prop="enable" :formatter="enableFormat" />
        <el-table-column label="创建时间" width='180px' align="center" prop="createTime" :formatter="createTimeFormat" />
        <el-table-column align="center" width="200" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" icon="el-icon-edit" @click="getShutdownPlanAddDialog(scope.row)">编辑
            </el-button>
            <el-button size="mini" type="text" icon="el-icon-delete" @click="deleteShutdownPlan(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="sppTotal > 0" :total="sppTotal" :page.sync="queryShutdownPlanParams.pageNum"
        :limit.sync="queryShutdownPlanParams.pageSize" @pagination="getShutdownPlanList" />

    </el-dialog>


    <!-- 添加或修改开关机计划对话框 -->
    <el-dialog :title="shutdownPlanTitle" :visible.sync="shutdownPlanOpen" width="750px" append-to-body>
      <el-form ref="shutdownPlanForm" :model="shutdownPlanForm" :rules="rules" label-width="80px">
        <el-form-item label="开机时间" prop="bootTime">
          <el-time-picker clearable v-model="shutdownPlanForm.bootTime" value-format="HH:mm" format="HH:mm"
            placeholder="请选择开机时间">
          </el-time-picker>
        </el-form-item>
        <el-form-item label="关机时间" prop="shutdownTime">
          <el-time-picker clearable v-model="shutdownPlanForm.shutdownTime" value-format="HH:mm" format="HH:mm"
            placeholder="请选择关机时间">
          </el-time-picker>
        </el-form-item>

        <el-form-item label="星期" prop="week">
          <el-checkbox-group v-model="shutdownPlanForm.week">
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
          <el-tooltip :content="shutdownPlanForm.enable == '0' ? '启用' : '禁用'" placement="top">
            <el-switch v-model="shutdownPlanForm.enable" active-value="0" inactive-value="1" active-color="#13ce66"
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


    <!-- 添加或修改开关机计划对话框 -->
    <el-dialog title="终端详情" :visible.sync="detailVisible" width="800px" append-to-body>
      <el-form label-position="right" size="medium" label-width="100px" :model="terminalDetailForm"
        ref="terminalDetailForm">
        <div class="indent pad">
          <el-row>
            <el-col :span="12">
              <el-form-item label="终端主键：">{{ terminalDetailForm.terminalId }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="终端名称：">{{ terminalDetailForm.terminalName }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="总空间：">{{ terminalDetailForm.totalSpace }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="剩余空间：">{{ terminalDetailForm.freeSpace }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="IP地址：">{{ terminalDetailForm.ip }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="MAC地址：">{{ terminalDetailForm.mac }}
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="系统：">{{ terminalDetailForm.os }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="系统版本：">{{ terminalDetailForm.osVersion }}
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设备版本号：">{{ terminalDetailForm.terminalVersion }}
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="最后上报时间：">{{ terminalDetailForm.terminalUpdateTime }}
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>


export default {
  name: "terminal",
  dicts: ['content_control_command', 'content_rolling_direction', 'content_location'],
  data() {

    var validatePass = (rule, value, callback) => {
      if (value !== this.terminalForm.pwd) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      tagList: [
        {
          type: 'info',
          text: '已离线'
        }, {
          type: 'success',
          text: '运行中'
        }
      ],
      activeName: 'first',
      shutdownPlanTitle: '新增开关机时间',
      shutdownPlanDialogOpen: false,
      shutdownPlanOpen: false,
      shutdownPlanForm: {
        bootTime: '',
        shutdownTime: '',
        terminalId: '',
        week: [],
        enable: '0'
      },
      rules: {
        bootTime: [
          { required: true, message: '请选择开机时间', trigger: 'blur' },
          { max: 5, message: '开机时间长度在5个以内', trigger: 'blur' }
        ],
        shutdownTime: [
          { required: true, message: '请选择关机时间', trigger: 'blur' }
        ],
        week: [
          { required: true, message: '请选择星期', trigger: 'blur' }
        ]
      },

      total: 0,
      ptTotal: 0,
      sppTotal: 0,
      stTotal: 0,
      // 遮罩层
      loading: true,
      terminalControlDialogTitle: '',
      // 终端控制记录表格数据
      controlList: [],
      programTerminalList: [],
      subtitleTerminalList: [],
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
      }, queryShutdownPlanParams: {
        pageNum: 1,
        pageSize: 10,
        terminalId: null
      },
      querySubtitleTerminalParams: {
        pageNum: 1,
        pageSize: 10,
        terminalId: null
      },
      terminalGroupList: [],
      appList: [],
      viewVisible: false,
      terminalControlVisible: false,
      terminalControlListVisible: false,
      detailVisible: false,
      searchVal: '',
      startTime: '',
      endTime: '',
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
      timeOptions: [],
      terminalDialogTitle: '新增终端',
      isDisabled: false,
      terminalGroupDialogTitle: '新增终端组',
      terminalGroupVisible: false,
      terminalVisible: false,
      terminalGroupForm: {
        terminalGroupName: '',
        appIds: '',
        remark: ''
      },
      controlForm: {

      },
      terminalForm: {
        terminalGroupId: '',
        terminalId: '',
        terminalName: '',
        pwd: '',
        confirmPwd: ''
      },
      conmitTerminalForm: {
        terminalId: '',
        terminalName: '',
        pwd: ''
      },
      rulesTerminalGroup: {
        terminalGroupName: [
          { required: true, message: '请输入终端组名称', trigger: 'blur' },
          { max: 15, message: '名称长度在15个以内', trigger: 'blur' }
        ]
      },
      rulesTerminal: {
        terminalId: [
          { required: true, message: '请输入终端Id', trigger: 'blur' },
          { max: 40, message: 'ID长度在40个以内', trigger: 'blur' }
        ],
        terminalName: [
          { required: true, message: '请输入终端名称', trigger: 'blur' },
          { max: 100, message: '名称长度在100个以内', trigger: 'blur' }
        ],
        pwd: [
          { required: true, message: '请输入终端密码\n', trigger: 'blur' },
          { min: 6, message: '终端密码在6-16个字符以内', trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ]
      },
      tableData: [],
      terminalDetailForm: {}
    }
  },
  mounted() {
    this.getGroupList()
  },

  methods: {
    /** 表单展示数据转换start */
    rollingDirectionFormat(row) {
      return this.selectDictLabel(this.dict.type.content_rolling_direction, row.rollingDirection);
    },
    beginDateFormat(row) {
      if (row.beginDate && row.endDate) {
        return row.beginDate + '~' + row.endDate;
      }
    },
    beginTimeFormat(row) {
      if (row.beginTime && row.endTime) {
        return row.beginTime + '-' + row.endTime;
      }
    },
    contentLocationFormat(row) {
      return this.selectDictLabel(this.dict.type.content_location, row.location);
    },

    weekFormat(row) {
      if (row.week == undefined || row.week == null || row.week == "") {
        return ''
      } else {
        let weekArr = row.week.split(',')
        let result = ''
        for (let i = 0; i < weekArr.length; i++) {
          switch (weekArr[i]) {
            case '7':
              result = result + (i > 0 ? '，星期日' : '星期日');
              break;
            case '6':
              result = result + (i > 0 ? '，星期六' : '星期六');
              break;
            case '5':
              result = result + (i > 0 ? '，星期五' : '星期五');
              break;
            case '4':
              result = result + (i > 0 ? '，星期四' : '星期四');
              break;
            case '3':
              result = result + (i > 0 ? '，星期三' : '星期三');
              break;
            case '2':
              result = result + (i > 0 ? '，星期二' : '星期二');
              break;
            case '1':
              result = result + (i > 0 ? '，星期一' : '星期一');
              break;
          }
        }
        return result
      }
    },
    enableFormat(row) {
      switch (row.enable * 1) {
        case 0:
          return '启用'
        case 1:
          return '禁用'
        default:
          break
      }
    },
    createTimeFormat(row) {
      let datetime = new Date(row.createTime)
      let year = datetime.getFullYear();
      let month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) : datetime.getMonth() + 1;
      let date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
      let hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
      let minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
      let second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second
    },
    controlCommandFormat(row) {
      return this.selectDictLabel(this.dict.type.content_control_command, row.controlCommand);
    },
    volumeFormat(row) {
      if (row.controlCommand == 6) {
        return Math.round(row.volume * 100) + "%";
      } else {
        return '';
      }
    },
    syncStatusFormat(row) {
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
    },
    statusFormat(row) {
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
    businessTypeFormat(row) {
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
    subtitleBusinessTypeFormat(row) {
      switch (row.businessType) {
        case 'INSERT':
          return '新增紧急字幕'
        case 'UPDATE':
          return '修改紧急字幕'
        case 'DELETE':
          return '删除紧急字幕'
        default:
          break
      }
    },
    /** 表单展示数据转换摁掉 */
    /** 更多下拉框选择触发 */
    handleCommand(command, row) {
      switch (command) {
        case "addTerminal":
          this.addTerminal(row);
          break;
        case "deleteTerminal":
          this.deleteTerminal(row);
          break;
        case "controlTerminal":
          this.controlTerminal(row);
          break;
        case "detailTerminal":
          this.detailTerminal(row);
          break;
        default:
          break;
      }
    },
    /** 新增/编辑终端组打开弹窗
     * @item 编辑时传入
    */
    getTerminalDialog(item) {
      this.terminalGroupForm = {}
      this.terminalGroupDialogTitle = item ? '编辑终端组' : '新增终端组'
      if (item) {

        let params = { terminalGroupId: item.terminalGroupId }
        this.$API
          .terminalGroupAppListGet(params)
          .then(res => {
            let appIds = []
            for (var i = 0; i < res.data.length; i++) {
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
      this.$API.appListGet()
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
    /**提交终端控制操作 */
    submitControlForm() {
      if (this.controlForm.controlCommand == 6) {
        this.controlForm.volume = this.controlForm.volume / 100;
      } else {
        this.controlForm.volume = 0;
      }
      this.$API.addControl(this.controlForm).then(() => {
        this.$modal.msgSuccess("操作成功");
        this.terminalControlVisible = false;
      });
    },
    /**打开终端控制弹窗 */
    controlTerminal(item) {
      this.controlForm = {
        terminalId: item.terminalId,
        terminalName: item.terminalName,
        controlCommand: '1'
      }
      this.terminalControlVisible = true
    },
    /**查看终端详情弹窗 */
    detailTerminal(item) {
      this.detailVisible = true
      this.$API.terminalDetailGet({ terminalId: item.terminalId }).then(response => {
        this.terminalDetailForm = response.data;
        this.terminalDetailForm.totalSpace = this.changeFileSize(this.terminalDetailForm.totalSpace)
        this.terminalDetailForm.freeSpace = this.changeFileSize(this.terminalDetailForm.freeSpace)
      });
    },
    /**转换字节单位
     * @limit 字节大小
     * @e 是否强制转换为GB
     */
    changeFileSize(limit, e) {
      let size = "";
      if (e) {
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
      } else if (limit < 1024) {                            //小于1KB，则转化成B
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
    /**打开开关机操作弹窗
     * @item 查看项数据
     */
    openShutdownPlanDialog(item) {
      this.queryShutdownPlanParams = {
        pageNum: 1,
        pageSize: 10,
        terminalId: item.terminalId
      }
      this.getShutdownPlanList()
      this.shutdownPlanForm.terminalId = item.terminalId
      this.shutdownPlanDialogOpen = true;
    },
    /**打开记录查询弹窗
     * @item 查看项数据
     */
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
      this.querySubtitleTerminalParams = {
        pageNum: 1,
        pageSize: 10,
        terminalId: item.terminalId
      }
      this.getTerminalControlList()
      this.getProgramTerminalList()
      this.getSubtitleTerminalList()

    },
    /**查询字幕下发记录*/
    getSubtitleTerminalList() {
      this.loading = true;
      this.$API.listSubtitlTerminal(this.querySubtitleTerminalParams).then(response => {
        this.subtitleTerminalList = response.rows;
        this.stTotal = response.total;
        this.loading = false;
      });
    },
    /**查询节目终端列表*/
    getProgramTerminalList() {
      this.loading = true;
      this.$API.listProgramterminal(this.queryProgramTerminalParams).then(response => {
        this.programTerminalList = response.rows;
        this.ptTotal = response.total;
        this.loading = false;
      });
    },
    /**查询开关机计划列表*/
    getShutdownPlanList() {
      this.loading = true;
      this.$API.listShutdownPlan(this.queryShutdownPlanParams).then(response => {
        this.shutdownPlanList = response.rows;
        this.sppTotal = response.total;
        this.loading = false;
      });
    },
    /** 查询终端控制记录列表*/
    getTerminalControlList() {
      this.loading = true;
      this.$API.listControl(this.queryParams).then(response => {
        this.controlList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**打开新增/编辑终端弹窗*/
    addTerminal(item) {

      this.terminalDialogTitle = item.terminalId ? '编辑终端' : '新增终端'
      this.isDisabled = item.terminalId ? true : false
      if (item.terminalId) {
        this.terminalForm.terminalId = item.terminalId
        this.terminalForm.terminalGroupId = item.terminalGroupId
        this.terminalForm.terminalName = item.terminalName
        this.terminalForm.pwd = item.pwd
        this.terminalForm.confirmPwd = item.pwd
      } else {
        this.terminalForm.terminalGroupId = item.terminalGroupId
        this.terminalForm.terminalId = ''
        this.terminalForm.terminalName = ''
        this.terminalForm.pwd = ''
        this.terminalForm.confirmPwd = ''
      }
      this.terminalVisible = true
      // 重置表单校验
      this.$nextTick(() => {
        this.$refs.terminalForm.resetFields()
      })

      this.$API.terminalGroupListGet()
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
    /**提交修改终端组*/
    submitTerminalGroupForm() {
      this.$refs.terminalGroupForm.validate(valid => {
        if (valid) {
          const { terminalGroupId, terminalGroupName, remark } = this.terminalGroupForm
          let param = {
            terminalGroupName: terminalGroupName
          }
          if (terminalGroupId) {
            param.remark = remark
            param.terminalGroupId = terminalGroupId
            this.$API.terminalGroupUpdate(param)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '修改终端组成功'
                })
                this.addTerminalGroupApp(this.terminalGroupForm.terminalGroupId, this.terminalGroupForm.appIds);
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
            this.$API.terminalGroupAdd(param)
              .then(res => {
                this.$message({
                  type: 'success',
                  message: '新增终端组成功'
                })
                this.terminalGroupVisible = false
                this.addTerminalGroupApp(res.data.terminalGroupId, this.terminalGroupForm.appIds)
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
    /**添加终端组与应用的关系*/
    addTerminalGroupApp(terminalGroupId, appIds) {
      let params = {
        terminalGroupId: terminalGroupId,
        appIds: appIds
      }
      this.$API.terminalGroupAppAdd(params)
        .then(() => {
          this.getGroupList()
        })
    },
    /**提交新增/编辑终端操作*/
    submitTerminalForm() {
      console.log(this.terminalForm)
      this.$refs.terminalForm.validate(valid => {
        if (valid) {
          const { terminalId, terminalGroupId, terminalName, pwd } = this.terminalForm
          console.log(this.terminalForm)
          let param = {
            terminalName: terminalName,
          }
          if (terminalId) {
            param.terminalId = terminalId
            param.terminalGroupId = terminalGroupId
            if (pwd == null || pwd.length != 32) {
              param.pwd = pwd;
            }
            this.$API.terminalUpdate(param)
              .then(() => {
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
            this.$API
              .terminalAdd(param)
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '新增终端成功'
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
    /**预删除终端租操作
     * @item 预删除项
     */
    deleteTerminalItem(item) {
      if (!item.terminalList.length) {
        this.$confirm('确认删除当前终端组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        }).then(() => {
          this.deleteGroup(item)
        })
      } else {
        this.$alert('当前终端组下有终端，不允许删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          showCancelButton: true,
          type: 'warning'
        })
      }
    },
    /**确定删除终端租操作
     * @item 删除项
     */
    deleteGroup(item) {
      this.$API
        .terminalGroupDelete({ terminalGroupId: item.terminalGroupId })
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
    /**删除单个终端操作.
     * @item 预删除项
     */
    deleteTerminal(item) {
      let terminalName = item.terminalName == null || item.terminalName == '' ? '未命名终端' : item.terminalName;
      this.$confirm('确认删除【' + terminalName + '】终端？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        this.$API
          .terminalDelete({ terminalId: item.terminalId })
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
    /**重置搜索条件 */
    cancleSearch() {
      this.startTime ? this.startTime = '' : ''
      this.endTime ? this.endTime = '' : ''
      this.timeOptions.length ? this.timeOptions = [] : ''
      this.searchVal ? this.searchVal = '' : ''
      this.getGroupList()
    },
    /**获取终端列表
     * @e 选择时间条件时传入
     */
    getGroupList(e) {
      if (e) {
        this.startTime = e[0]
        this.endTime = e[1]
      }
      // return false;
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
      const nowTime = new Date().getTime()
      this.$API.terminalDetailListGet(params).then(res => {

        res.data.forEach(element => {
          element.terminalList.forEach(cru => {
            cru.percentage = Math.floor(((cru.totalSpace - cru.freeSpace) / cru.totalSpace) * 100) || 1
            cru.freeSpaceData = this.changeFileSize(cru.totalSpace - cru.freeSpace, 1) + "/" + this.changeFileSize(cru.totalSpace, 1)
            if (cru.terminalUpdateTime == null || nowTime - 60000 > Date.parse(cru.terminalUpdateTime)) {
              cru.onLinestatus = 0
            } else {
              cru.onLinestatus = 1
            }
          })
        });

        this.tableData = res.data
      })
        .catch(e => {
          this.$message({
            type: 'error',
            message: e.msg
          })
        })
    },
    /** 提交新增/编辑开关机时间 */
    submitShutdownPlanForm() {
      this.$refs["shutdownPlanForm"].validate(valid => {
        if (valid) {
          if (this.shutdownPlanForm.week) {
            this.shutdownPlanForm.week = this.shutdownPlanForm.week.toString()
          }

          if (this.shutdownPlanForm.terminalShutdownPlanId) {
            this.$API.updateShutdownPlan(this.shutdownPlanForm).then(() => {
              this.shutdownPlanOpen = false;
              this.getShutdownPlanList();
            })

          } else {
            this.$API.addShutdownPlan(this.shutdownPlanForm).then(() => {
              this.shutdownPlanOpen = false;
              this.getShutdownPlanList();
            })
          }
        }
      })

    },
    /** 关闭设置开关机时间弹窗 */
    cancel() {
      this.shutdownPlanForm = { week: [] }
      this.shutdownPlanOpen = false;
    },
    /** 删除已设置的开关机时间，重拉开关机时间列表 */
    deleteShutdownPlan(item) {
      let shutdownPlanName = item.bootTime + '-' + item.shutdownTime
      this.$confirm('确认删除【' + shutdownPlanName + '】的开关机时间？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton: true,
        type: 'warning'
      }).then(() => {
        this.$API.delShutdownPlan(item.terminalShutdownPlanId)
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
    },
    /** 打开新增/编辑开关机时间弹窗，init数据 */
    getShutdownPlanAddDialog(item) {
      this.shutdownPlanOpen = true;
      if (item != undefined && item.terminalShutdownPlanId) {
        this.shutdownPlanTitle = '编辑开关机时间'
        this.shutdownPlanForm = {
          terminalShutdownPlanId: item.terminalShutdownPlanId,
          terminalId: item.terminalId,
          bootTime: item.bootTime,
          shutdownTime: item.shutdownTime,
          enable: item.enable,
          week: item.week ? item.week.split(',') : []
        }
      } else {
        this.shutdownPlanTitle = '新增开关机时间'
        this.shutdownPlanForm.shutdownTime = ''
        this.shutdownPlanForm.bootTime = ''
        this.shutdownPlanForm.enable = '0'
        this.shutdownPlanForm.week = ['1', '2', '3', '4', '5', '6', '7']
      }
    }
  }
}
</script>

<style lang="scss">
//main-container全局样式
.app-container {
  padding: 20px;
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

    >span {
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
</style>
