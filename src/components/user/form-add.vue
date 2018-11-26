<template>
  <el-dialog
    :visible.sync="visible"
    title="新增用户"
    width="600px"
  >
    <div>
      <!--{{userForm}}-->
      <el-form ref="form" label-width="100px" :model="userForm" :rules="rules">
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="userForm.empName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item label="员工号" prop="empno">
          <el-input v-model="userForm.empno"></el-input>
        </el-form-item>
        <el-form-item label="上级领导" prop="mgr">
          <el-input v-model="userForm.mgr"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="job">
          <el-input v-model="userForm.job"></el-input>
        </el-form-item>
        <el-form-item label="部门号" prop="deptno">
          <el-input v-model="userForm.deptno"></el-input>
        </el-form-item>

      </el-form>
    </div>
    <div slot="footer">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import UserApi from '@/api/user'

  export default{
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        rules: {
          empName: [
            {required: true, trigger: 'change', message: '请输入姓名!'}
          ],
          password: [
            {required: true, trigger: 'change', message: '请输入密码!'}
          ],
          empno: [
            {required: true, trigger: 'change', message: '请输入员工号!'}
          ],
          job: [
            {required: true, trigger: 'change', message: '请输入职位!'}
          ],
          mgr: [
            {required: true, trigger: 'change', message: '请输入上级领导!'}
          ],
          deptno: [
            {required: true, trigger: 'change', message: '请输入部门号!'}
          ]

        },
        userForm: {
          empName: '',
          empno: '',
          password: '',
          job: '',
          mgr: '',
          deptno: ''
        }
      }
    },
    watch: {
      visible (val) {
        if (!val) {
          this.$emit('update:visible', false)
          this.userForm = {
            empName: '',
            empno: '',
            password: '',
            job: '',
            mgr: '',
            deptno: ''
          }
          this.$refs['form'].resetFields()
        }
      }
    },
    methods: {
      save () {
        this.$refs['form'].validate(async (valid) => {
          if (valid) {
            let resp = await UserApi.create(this.userForm)
            let msg = JSON.parse(JSON.stringify(resp))['state']
            if (msg === 0) {
              this.visible = false
              this.$emit('fail')
              this.$message({
                message: resp.message,
                type: 'fail'
              })
            } else {
              this.visible = false
              this.$emit('success')
              this.$message({
                message: resp.message,
                type: 'success'
              })
            }
          }
        })
      }
    }
  }
</script>
