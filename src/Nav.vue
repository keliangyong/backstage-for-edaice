<template>
  <div id="nav">
    <el-menu theme="dark" :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <div class="nav-ct">
        <a href="">
          <img src="./assets/logo.png" alt="">
        </a>
        <div id="nav-right">
          <el-menu-item index="1">管理中心</el-menu-item>
          <el-submenu index="2">
            <template slot="title">下拉预留</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
          </el-submenu>
          <el-menu-item index="3"><a href="" target="_blank">链接预留</a></el-menu-item>
        </div>
      </div>
    </el-menu>
  </div>
</template>


<script>
  export default {
    data() {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      };
    },
    methods: {
      handleSelect(key, keyPath) {
        console.log(key, keyPath);
      }
    }
  }
</script>

<style scoped>
  .nav-ct {
    width: 1140px;
    padding: 0 30px;
    margin: 0 auto;
  }
  .nav-ct a {
    line-height: 60px;
  }
  img {
    width: 110px;
    height: 35px;
    vertical-align: middle;
    margin-left: 20px;
  }
  #nav-right{
    float: right;
  }
</style>
