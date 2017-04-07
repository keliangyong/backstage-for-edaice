<template>
    <div id="main">
        <div class="title">
            <h3>岗位类别和岗位级别</h3>
            <el-select class="type" v-model="type" multiple placeholder="请选择岗位类别">
                <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select class='type' v-model="level" multiple placeholder="请选择岗位级别">
                <el-option v-for="item in levelList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="title">
            <h3>岗位技能关键字</h3>
            <el-select class="skill" v-model="skill" multiple filterable allow-create placeholder="请选择或自行输入技能关键词">
                <el-option v-for="item in skillList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
        </div>
        <div class="title">
            <h3>筛选条件</h3>
            <el-select class="con-filter" v-model="city" clearable placeholder="请选择城市">
                <el-option v-for="item in cityList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-select class="con-filter" v-model="edu" clearable placeholder="请选择学历">
                <el-option v-for="item in eduList" :key="item" :label="item" :value="item"></el-option>
            </el-select>
            <el-select class="con-filter" v-model="year" clearable placeholder="请选择工作经验">
                <el-option v-for="item in yearList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-select class="con-filter" v-model="updTime" clearable placeholder="请选择更新时间">
                <el-option v-for="item in updTimeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </div>
        <div class="title">
            <h3>渠道</h3>
            <el-checkbox class="channel" v-model="job51"><img src="./assets/channel-51job.png" alt=""></el-checkbox>
            <el-checkbox class="channel" v-model="zhilian"><img src="./assets/channel-zhilian.png" alt=""></el-checkbox>
        </div>
        <div class="start">
            <el-button type="primary" size="large" @click="start">批量创建任务</el-button>
        </div>

        <el-dialog title="提示" v-model="dialogSuc" size="tiny">
            <span>操作完成</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogSuc = false">取 消</el-button>
                <el-button type="primary" @click="dialogSuc = false">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import Util from './util.js'
    import axios from 'axios'
    export default {
        data() {
            return {
                baseurl: 'http://127.0.0.1:8001',
                session: Util.getcookie('sc_edaice_session'),
                dialogSuc: false,
                typeList: [],
                levelList: [],
                type: [],
                level: [],
                skillList: ['Node.js', 'Vue.js', 'React.js', '后端', 'Mysql', 'Hadoop'],
                skill: [],
                cityList: ['深圳', '广州', '北京', '上海', '杭州', '天津', '武汉', '成都', '西安'],
                city: '深圳',
                eduList: ['大专', '本科', '硕士', '博士'],
                edu: '',
                updTimeList: [
                    {label:'最近一周', value: '1'},
                    {label:'最近两周', value: '2'},
                    {label:'最近一个月', value: '3'},
                    {label:'最近两个月', value: '4'},
                    {label:'最近半年', value: '5'}
                ],
                updTime: '',
                yearList: [
                    {label:'一年以上', value: '1'},
                    {label:'两年以上', value: '2'},
                    {label:'三年以上', value: '3'},
                    {label:'五年以上', value: '5'}
                ],
                year: '',
                job51: false,
                zhilian: false
            }
        },
        created() {
            this.init()
        },
        activated(){

        },
        methods: {

            init(){
                this.getType()
                this.getLevel()
            },
            get(api, params){
                return axios.get(this.baseurl + api, params)
            },
            getType(){
                let _this = this
                this.get('/getKeyMap', {
                    params: {
                        session: this.session
                    }
                })
                .then(data => {
                    _this.typeList = data.data.data
                })
                .catch(error => {
                    console.log(error);
                });
            },
            getLevel(){
                let _this = this
                this.get('/getRankMap', {
                    params: {
                        session: this.session
                    }
                }).then(data => {
                  _this.levelList = data.data.data
              })
                .catch(error => {
                  console.log(error);
              });
            },
            getSelectChannel(){
                let arr = []
                if(this.zhilian){
                    arr.push("2")
                }
                if(this.job51){
                    arr.push("3")
                }
                return JSON.stringify(arr)
            },
            start(){
                var _this = this
                function request(type, level){
                    return new Promise((resolve, reject)=>{
                        var requestData = {
                            'posId': type,
                            'specSet':"",
                            'parameters': `{"liveCity":"${_this.city}","updateTime":"${_this.updTime}","workYearLower":"${_this.year}","fulltime":0,"professional":0,"s985":0,"s211":0,"same":0,"title":${level}}`,
                            'channelMap': _this.getSelectChannel(),
                            'session': _this.session
                        }
                        console.log(requestData)
                        _this.get('/createPositionTask', {
                            params: requestData
                        }).then(val => {
                            resolve()
                        })
                    })
                }
                function* requestGenerator() {
                    for(let type of _this.type){
                        for(let level of _this.level){
                            yield request(type, level)
                        }
                    }
                    _this.dialogSuc = true
                }
                function run(gen){
                  var g = gen()
                  function next(data){
                    var result = g.next(data)
                    if (result.done) return result.value
                        result.value.then(function(data){
                          next(data)
                      })
                }
                next()
            }
            run(requestGenerator)
        }
    }
}
</script>

<style scoped>
    #main {
        padding: 30px;
    }
    
    #main .title:nth-of-type(1) h3 {
        margin-top: 0;
    }
    
    #main .title h3 {
        margin-top: 50px;
        margin-bottom: 30px;
        font-weight: 600;
        color: #1f2f3d;
        font-size: 18px;
    }
    
    #main .type {
        width: 352px;
        margin-left: 50px;
    }
    
    #main .skill {
        width: 760px;
        margin-left: 50px;
    }
    
    #main .con-filter {
        width: 150px;
        margin-left: 45px;
    }
    
    #main .con-filter:nth-of-type(1) {
        width: 150px;
        margin-left: 50px;
    }
    
    #main .channel {
        margin-left: 52px;
    }
    
    #main .channel img {
        vertical-align: middle;
    }
    
    #main .start {
        margin-top: 50px;
        text-align: center;
    }
</style>