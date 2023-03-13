<template>
  <div class="components-attr-edit">
    <el-scrollbar class="components-attr-edit">
      <div class="attr-edit-inner" v-if="activeElementUUID">
        <div class="animate-edit-btn-wrapper">
          <el-dropdown>
            <el-button type="primary" size="small">
              添加事件<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="(item, index) in eventTypeList" :key="index">
                <div @click="addEvent(item.value)">{{ item.label }}</div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <p class="gray inline-block fontsize-12 marginL10">事件在编辑模式下无效果</p>
        </div>
        <div class="el-animate-list-wrapper paddingT20" v-show="activeElement.events.length">
          <el-collapse accordion @change="handleChange">
            <el-collapse-item v-for="(item, index) in activeElement.events" :key="index">
              <template slot="title">
                <span class="el-animate-title-name">事件 {{ index + 1 }}</span>
                <div class="el-animate-title-type-wrapper">
                  <span class="el-animate-title-type">{{ item.type | getLabelText(eventTypeList) }}</span>
                </div>
                <span class="el-animate-title-btn" @click.stop.prevent="deleteEvent(index)"><i
                    class="el-icon-delete"></i></span>
              </template>
              <div class="el-animate-item">
                <div class="attr-item-edit-wrapper" v-show="(item.type == 'link')">
                  <p class="attr-item-title">链接url：</p>
                  <div class="col-1  attr-item-edit-input">
                    <el-input type="textarea" :rows="3" placeholder="请输入url" v-model="item.url" />
                  </div>
                </div>
                <div class="attr-item-edit-wrapper" v-show="item.type == 'linkLoacl'">
                  <p class="attr-item-title">选择节目：</p>
                  <div class="col-1  attr-item-edit-input">
                    <el-select v-model="value" filterable placeholder="请选择" @change="checkProgram($event, item)">
                      <el-option v-for="item in programList" :key="item.programId" :label="item.programName"
                        :value="'../' + item.sceneName + '/' + item.programId + '.html'">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="attr-item-edit-wrapper" v-show="item.type == 'openApp'">
                  <p class="attr-item-title">选择应用：</p>
                  <div class="col-1  attr-item-edit-input">
                    <el-select v-model="apkValue" filterable placeholder="请选择" @change="checkApk($event, item)">
                      <el-option v-for="(its, index) in apkList" :key="its.resourceId" :label="its.resourceName"
                        :value="its.resourceId">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="attr-item-edit-wrapper" v-show="(item.type == 'goback')">
                  <p class="" style="color: #E6A23C;padding-top: 10px;">*请确保该页面为子页面</p>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div v-else>
        <p class="gray paddingT30 text-center">请在画板上选择需要编辑得元素</p>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: "event-edit",
  data() {
    return {
      programList: [],
      apkList: [],
      apkValue: '',
      value: '',
      programIsGet: false,
      apkIsGet: false,
      eventTypeList: [{
        label: '节目跳转',
        value: 'linkLoacl'
      }, {
        label: '返回上一页',
        value: 'goback'
      }, {
        label: '链接跳转',
        value: 'link'
      }, {
        label: '打开/安装应用',
        value: 'openApp'
      }]
    }
  },
  computed: {
    ...mapState({
      projectData: state => state.editor.projectData,
      activePageUUID: state => state.editor.activePageUUID,
      activeElementUUID: state => state.editor.activeElementUUID
    }),
    ...mapGetters([
      'currentPageIndex',
      'activeElementIndex',
      'activeElement',
      'activePage'
    ])
  },
  created() {
    // this.getList()
  },
  watch: {
    activeElement() {
      console.log("activeElementIndex",this.activeElementIndex);
      if (!this.activeElement) return false;
      let a = JSON.parse(JSON.stringify(this.activeElement))
      if (a.events.length && a.events[0].type == 'linkLoacl') {
        this.value == a.events[0].url ? '' : this.value = a.events[0].url||''
        !this.programList.length ? this.getList() : ''
      }else if (a.events.length && a.events[0].type == 'openApp') {
       this.apkValue == a.events[0].resourceId ? '' : this.apkValue = a.events[0].resourceId||''
       console.log("this.apkValue",this.apkValue,a.events[0]);
       !this.programList.length ? this.getApkList() : ''
      }else{
        this.value ? this.value = '' : ''
        this.apkValue ? this.apkValue = '' : ''
      }
      
    }
  },
  methods: {
    // init 匹配项展示
    handleChange() {

      let a = JSON.parse(JSON.stringify(this.activeElement))
      if (a.events.length && a.events[0].type == 'linkLoacl' && a.events[0].url && !this.value) {
        let b = a.events[0].url
        this.value = b
      }
    },
    /**
     * 获取节目列表
     */
    getList() {
      let queryParams = {
        pageNum: 1,
        pageSize: 100
      }
      this.$API.listProgram(queryParams).then(response => {
        this.programIsGet = true
        this.programList = response.rows;
      });
    },
    /**
     * 获取应用apk列表
     */
    getApkList() {
      let queryParams = {
        pageNum: 1,
        pageSize: 100,
        resourceTypeId: '5'
      }
      this.$API.listResource(queryParams).then(response => {
        if (response.rows.length) {
          this.apkList = response.rows
          this.apkIsGet = true
        } else {
          // me.children[0].resourceTypeName = "暂无资源"
        }

      });
    },
    /**
     * 节目选中，拼接URL,透传
     * @param e 节目ID,html名称
     * @param item 单个事件本身
     */
    checkProgram(e, item) {
      item.url = e
    },
    /**
 * 节APK选中，拼接URL,透传
 * @param e apk resourceIdID,
 * @param item 单个事件本身 
 */
    checkApk(e, item) {
      // item.info = item
      // 需存储安卓--》 mdk+'.apk',接口--》resourceId
      let objData = this.apkList.find(cur=>cur.resourceId==e) 
      // item.resourceName = e.resourceName
      item.mdkName = objData.resourceMd5 + '.apk'
      item.resourceId = e
    },
    /**
     * 添加事件
     * @param type 事件名称
     */
    addEvent(type) {
      if (this.activeElement && this.activeElement.events.length) {
        this.$message.warning('请勿添加多个事件');
        return false;
      }
      if (type == 'linkLoacl') this.programIsGet ? '' : this.getList()
      if (type == 'openApp') this.apkIsGet ? '' : this.getApkList()
      this.$store.dispatch('addElementEvent', type)
    },
    /**
     * 删除事件
     * @param index
     */
    deleteEvent(index) {
      this.$store.dispatch('deleteElementEvent', index)
    },
  }
}
</script>

<style lang="scss" scoped>
.components-attr-edit {
  height: 100%;
}

.components-attr-animate-edit {
  position: relative;
}

.attr-title {
  font-weight: bold;
}

.attr-item-edit-wrapper {
  padding-left: 4px;
  display: flex;
  width: 100%;
  text-align: center;
  padding-bottom: 10px;

  .attr-item-title {
    text-align: left;
    width: 80px;
    font-size: 12px;
    line-height: 28px;
  }

  .attr-item-edit-input {
    text-align: left;
    flex: 1;
  }
}

.el-animate-list-wrapper {
  .el-animate-title-name {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    font-weight: bold;
    width: 55px;
  }

  .el-animate-title-type-wrapper {
    display: inline-block;
    width: 190px;
  }

  .el-animate-title-type {
    display: inline-block;
    vertical-align: middle;
    max-width: 140px;
    height: 24px;
    color: #333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    background: #fafafa;
    border-radius: 60px;
    padding: 4px 20px;
    border: none;
    cursor: pointer;
    margin: 0 20px 0 10px;
    line-height: 14px;
  }

  .el-animate-title-btn {
    display: inline-block;
    vertical-align: middle;
    text-align: center;
    line-height: 24px;
    font-size: 14px;
    color: #666;
    width: 24px;
    height: 24px;
    cursor: pointer;
    border-radius: 4px;
    background: rgba(37, 165, 137, 0.08);
    margin-left: 6px;

    &:hover {
      color: white;
      background: $primary;
    }
  }
}
</style>
