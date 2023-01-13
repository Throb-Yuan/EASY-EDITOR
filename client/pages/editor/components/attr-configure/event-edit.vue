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
          <el-collapse accordion  @change="handleChange"> 
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
                    <el-select v-model="value" filterable placeholder="请选择"  @change="checkProgram($event,item)">
                      <el-option v-for="item in programList" :key="item.programId" :label="item.programName" :value="'../'+item.sceneName+'/'+item.programId+'.html'">
                      </el-option>
                    </el-select>
                  </div>
                </div>
                <div class="attr-item-edit-wrapper" v-show="(item.type == 'linkBack')">
                  <p class="attr-item-title">*请确保该页面为子页面</p>
                  <!-- <div class="col-1  attr-item-edit-input">
                    <el-input type="textarea" :rows="3" placeholder="请输入url" v-model="item.url" />
                  </div> -->
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
      value: '',
      
      eventTypeList: [{
        label: '节目跳转',
        value: 'linkLoacl'
      }, {
        label: '链接跳转',
        value: 'link'
      }]
      //  {
      //   label: '分享',
      //   value: 'share'
      // }, {
      //   label: '表单提交',
      //   value: 'submitForm'
      // }
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
    this.getList()
  },
  watch:{
    activeElement(){
      if(!this.activeElement) return false;
      let a = JSON.parse(JSON.stringify(this.activeElement))
      if(a.events.length&&a.events[0].type=='linkLoacl'&&a.events[0].url){
        this.value == a.events[0].url ? '' :  this.value = a.events[0].url
      }
    }
  },
  methods: {
    // init 匹配项展示
    handleChange(){
     
      let a = JSON.parse(JSON.stringify(this.activeElement))
      if(a.events.length&&a.events[0].type=='linkLoacl'&&a.events[0].url&&!this.value){
        console.log("事件组件===",a.events[0]);
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
        this.programList = response.rows;
      });
    },
    /**
     * 节目选中，拼接URL,透传
     * @param e 节目ID,html名称
     * @param item 单个事件本身
     */
    checkProgram(e,item){
      // console.log("选中值===",e,this.value);
      // let a = this.activeElement
      // console.log("事件组件===",a);
      // item.url = './' + e + '.html'
      item.url = e
      console.log("选中值===>",item);
    },
    /**
     * 添加事件
     * @param type 事件名称
     */
    addEvent(type) {
      if(this.activeElement&&this.activeElement.events.length) {
        this.$message.warning('请勿添加多个事件');
        return false;
      }
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
