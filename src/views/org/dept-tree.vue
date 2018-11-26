<template>
  <div class="custom-tree-container">
    <el-button type="primary" size="size" @click="addNode" class="el-icon-plus" >添加新部门</el-button>
    <div class="grid-content bg-purple">
      <el-row :gutter="20">
        <el-col :span="16"><div class="grid-content bg-purple">

          <el-tree :props="props"
                   :load="loadDept"
                   :expand-on-click-node="false"
                   lazy>
            <span  class="custom-tree-node"  slot-scope="{ node, data }">
                <span  @click="search(data)">{{node.label}}</span>
           <span>
             <el-button  type="text"
                         size="mini"
                         @click="updateDept(data)">
               <i class="el-icon-edit"></i>修改
             </el-button>
             <el-button type="text"
                        size="mini"
                        @click="deleteDept(node, data)">
               <i class="el-icon-delete"></i>删除
          </el-button>
        </span>
        </span>
          </el-tree>

        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          <UserIndex :deptno="checkDeptno "></UserIndex>
        </div></el-col>
      </el-row>
    </div>
    <!--员工表的组件-->
    <!--操作弹框-->
    <el-dialog :title="treeTitle" :visible.sync="isShow" >
      <div>
        <el-form ref="treeForm" label-width="100px" :model="treeForm" :rules="rules">
          <el-input v-model="treeForm.deptno" type="hidden"></el-input>
          <el-form-item label="组织名" prop="deptName">
            <el-input v-model="treeForm.deptName"></el-input>
          </el-form-item>
          <el-form-item label="部门号" prop="deptno">
            <el-input v-model="treeForm.deptno"></el-input>
          </el-form-item>
          <el-form-item label="ID" prop="id"  :hidden="true">
            <el-input v-model="treeForm.id"></el-input>
          </el-form-item>
          <el-form-item label="上级部门号" prop="leader">
            <el-select :disabled="disabled" v-model="treeForm.leader" clearable placeholder="请选择">
              <el-option key="0" label="请选择" value="0"></el-option>
              <el-option
                v-for="item in treeDept"
                :value= "item.deptno">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button type="primary" @click="saveDept">保存</el-button>
        <el-button type="primary" @click="close">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import OrgApi from '@/api/org'
  import UserIndex from '@/components/org/emp-list'

  export default {
    components: {UserIndex},
    //展示数据
    data () {
      return {
        disabled: false,
        //	配置选项
        props: {
          //指定节点标签为节点对象的某个属性值
          label: 'deptName',
          id:'id',
          // 指定子树为节点对象的某个属性值
          children: 'child',
          isLeaf: 'leaf'
        },
        treeDept: {
          id:'',
          deptno: '',
          deptName: '',
          leader:''
        },
        //树形结构数据
        treeData: [],
        //弹出框标题
        treeTitle: '',
        visible: false,
        //弹出框是否展示和关闭
        isShow: false,
        //用来存放deptno
        checkDeptno:null,
        //弹出框数据
        treeForm: {
          id:'',
          deptno: '',
          deptName: '',
          leader: ''
        },
        /*提示*/
        rules: {
          deptName: {
            required: true, message: '请输入新的部门名称'},
          deptno: {
            required: true, message: '请输入部门号'}
        }
      }
    },
    async mounted () {
      //把所有的部门号都查询出来
      let list = await OrgApi.queryDepts('')
      this.treeDept = list.data

    },

    methods: {
      // 查询
      async search(data) {
        this.checkDeptno = data.deptno
      },
      // 加载
      async loadTree (flag) {
        this.visible=flag
        this.$router.push({
            name: '部门操作',
            query: {
              _t: Date.now()
            }
          }
        )
      },
      //把所有的上下树形级关系遍历到数组中
      async loadDept (node, resolve) {
        let res = []
        if (node.level === 0) {
          res = await OrgApi.queryDepts(0)//查询上级领导为0的部门
        } else {
          res = await OrgApi.queryDepts(node.data.deptno)//c查询该部门的下属部门
        }
        resolve(res.data)
      },

      addNode () {
        this.treeForm = {
          id:null,
          deptName: null,
          deptno: null,
          leader: null,
        }
        this.isShow = true
        this.treeTitle = '添加新的部门'
        this.disabled = false
      },
      updateDept (data) {
        this.isShow = true
        this.treeTitle = '修改部门信息'
        this.treeForm = {
          id: data.id,
          deptName: data.deptName,
          deptno: data.deptno,
          // leader: data.leader
        }
        this.disabled = true
      },
      saveDept(id) {
        this.$refs['treeForm'].validate(async valid => {
          if (valid) {
            let record = []
            if (this.treeForm.leader == null || this.treeForm.leader == '') {
              record = await OrgApi.modify(this.treeForm)
            } else {
              record = await OrgApi.create(this.treeForm)
            }
            if (record.data.state === 1) {
              this.isShow= false
              this.$message({
                message: record.data.message,
                type: 'success'
              })
              this.reload()
            }else{
              this.isShow= false
              this.$message({
                message: record.data.message,
                type: 'fail'
              })
            }
          }
        })

      },
      deleteDept (node, data) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let resp = await OrgApi.remove(data.deptno)
          let msg = JSON.parse(JSON.stringify(resp))['state']
          if (msg === 1) {
            this.$message({
              message: resp.message,
              type: 'success'
            })
            this.reload()
          } else {
            this.$message({
              message: resp.message,
              type: 'fail'
            })
            this.loadDept()
          }
        }).catch(() => {

        })

      },
      close () {
        this.isShow = false
      }
    }
  }
</script>

<style scoped>
  .style1{
    margin-bottom: 20px;
  }

  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: white;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
