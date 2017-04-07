<template>
  <div>
    <el-table
      :data="filterData"
      style="width: 100%">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="任务 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.time }}</span>
            </el-form-item>
            <el-form-item label="岗位类别">
              <span>{{ props.row.type }}</span>
            </el-form-item>
            <el-form-item label="岗位级别">
              <span>{{ props.row.level }}</span>
            </el-form-item>
            <el-form-item label="筛选进度">
              <span>{{ props.row.runningStatus }}</span>
            </el-form-item>
            <el-form-item label="任务进度">
              <el-progress class="progress" :text-inside="true" :stroke-width="18" :percentage="props.row.progress"></el-progress>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        width="250"
        label="任务 ID"
        prop="id">
      </el-table-column>
      <el-table-column
        width="100"
        label="类别"
        :filters="[{ text: 'Web前端', value: 'Web前端' }, { text: 'PHP', value: 'PHP' }, { text: 'Java', value: 'Java' }, { text: 'Android', value: 'Android' }, { text: 'iOS', value: 'iOS' }, { text: 'C', value: 'C' }, { text: 'C++', value: 'C++' }]"
        :filter-method="filterType"
        prop="type">
      </el-table-column>
      <el-table-column
        width="120"
        label="级别"
        :filters="[{ text: '工程师', value: '工程师' }, { text: '架构师', value: '架构师' }, { text: '组长', value: '组长' }, { text: '经理', value: '经理' }, { 总监: 'iOS', value: '总监' }]"
        :filter-method="filterLevel"
        prop="level">
      </el-table-column>
      <el-table-column
        width="110"
        sortable
        label="进度"
        prop="progressText">
      </el-table-column>
      <el-table-column
        width="120"
        label="任务状态"
        prop="status">
      </el-table-column>
      <el-table-column
        label="操作">
        <template scope="scope">
          <el-button type="text" size="small"><a :href="'http://search.edaice.com/taskprogress.html?taskId=' + scope.row.id" target="_blank">查看</a> </el-button>
          <el-button v-if="scope.row.status!=='已终止'" @click="endtask(scope.row.id, scope.$index)" type="text" size="small">终止</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        small
        layout="prev, pager, next"
        :page-size="pageSize"
        :total="tableData.length">
      </el-pagination>
    </div>

  </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .progress{
    width: 180px;
    line-height: 36px;
  }
  .block{
    text-align: center;
  }
  .el-table{
    margin: 20px;
    margin-bottom: 20px;
  }
</style>

<script>
  import Util from './util.js'
  import axios from 'axios'
  export default {
    data() {
      return {
        baseurl: 'http://127.0.0.1:8001',
        // session: Util.getcookie('sc_edaice_session'),
        session: '000000261491561323.0',
        filterData: [],
        tableData: [],
        pageSize: 15,
      }
    },
    activated(){
      this.init()
    },
    methods: {
      init(){
        this.getAllTask()
      },
      get(api, params){
        return axios.get(this.baseurl + api, params)
      },
      getAllTask(){
        let _this = this
        this.get('/getAllTask', {
          params: {
            session: this.session
          }
        }).then(data => {
          _this.tableData = _this.infoFilter(data.data.data)
          _this.filterData = _this.infoFilter(data.data.data).slice(0, _this.pageSize)
        })
        .catch(error => {
          console.log(error);
        });
      },
      endtask(id, index){
        let _this = this
        this.get('/stopTaskExt', {
          params: {
            taskId: id,
            auto: 0,
            session: this.session
          }
        }).then(data => {
          _this.tableData[index].status = '已终止'
        })
        .catch(error => {
          console.log(error);
        });
      },
      filterType(value, row){
        return row.type === value
      },
      filterLevel(value, row){
        return row.level === value
      },
      handleCurrentChange(page){
        let start = (page-1) * this.pageSize
        let end = page * this.pageSize
        this.filterData = this.tableData.slice(start, end)
      },
      infoFilter(arr){
        let statusMap = ["已创建", "运行中", "已终止","任务失败","已完成","排队中"]
        let ssMap = ["", "等待登录", "正在搜索", "加速处理", "浏览分析", "浏览分析"]
        return arr.map(item => {
          let {create, id, precent, status, param:{postName, rankName}, info:{ss}} = item
          return {
            "id": id,
            "simid": id.slice(19),
            "type": postName,
            "level": rankName,
            "progressText": precent + '%',
            "progress": precent,
            "status": statusMap[status],
            "time": create,
            "runningStatus": ssMap[ss]
          }
        })
      }
    }
  }
</script>