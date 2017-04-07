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
        session: Util.getcookie('sc_edaice_session'),
        activeIndex: '1',
        currentView: 'creat',
      }
    },
    components: {
      creat,
      tasklist
    },
    methods: {
      handelSelect(key, keyPath){
        this.activeIndex = key
        this.currentView = (key == '1') ? 'creat':'tasklist' 
      }
    }
  }
</script>

<style scoped>
  #sider .sider-ul {
    height: 850px;
  }
</style>