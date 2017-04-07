<template>
  <div id="app">
    <el-row class="tac">
      <el-col :span="4" id="sider">
        <el-menu class="sider-ul" default-active="1" @select="handelSelect">
          <el-menu-item index="1"><i class="el-icon-plus"></i>批量创建任务</el-menu-item>
          <el-menu-item index="2"><i class="el-icon-document"></i>查看任务列表</el-menu-item>
          <el-menu-item index="3"><i class="el-icon-setting"></i>预留选项</el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="20" id="main">
        <keep-alive>
          <component :is="currentView"></component>
        </keep-alive>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Util from './util.js'
  import axios from 'axios'
  import creat from './Creat.vue'
  import tasklist from './Tasklist.vue'

  export default {
    data() {
      return {
        baseurl: 'http://127.0.0.1:8001',
        // session: Util.getcookie('sc_edaice_session'),
        session: '000000261491561323.0',
        activeIndex: '1',
        currentView: 'creat',
      }
    },
    components: {
      creat,
      tasklist
    },
    created: function() {
      this.init()
    },
    methods: {
      init(){

      },
      get(api, params){
        return axios.get(this.baseurl + api, params)
      },
      handelSelect(key, keyPath){
        this.activeIndex = key
        this.currentView = (key == '1') ? 'creat':'tasklist' 
      },
      getType(){
        let _this = this
        this.get('/getKeyMap', {
          params: {
            session: this.session
          }
        }).then(data => {
          _this.typeList = data.data.data
        })
        .catch(error => {
          console.log(error);
        });
      }
    }
  }
</script>

<style scoped>
  #sider .sider-ul {
    height: 850px;
  }
</style>