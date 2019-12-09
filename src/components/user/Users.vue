<template>
  <div>
    <!--面包屑-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片内容-->
    <el-card>
      <div>
        <!--搜索框-->
        <el-row :gutter="20">
          <el-col :span="10">
            <el-input
              placeholder="请输入内容"
              v-model="params.query.username"
              clearable
              @clear="getSearchUserList"
            >
              <el-button slot="append" icon="el-icon-search" @click="getSearchUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!--表格渲染-->
        <el-table :data="userList" border stripe>
          <!--添加索引-->
          <el-table-column type="index"></el-table-column>
          <el-table-column label="姓名" prop="username"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <!--还未实现-->
          <el-table-column label="角色"></el-table-column>
          <el-table-column label="操作">
            <!--显示button作用-->
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="openDeleteMessageBox(scope.row.id)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!--分页-->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.page"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="params.per_page"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </el-card>
    <!--dialog弹框:添加用户-->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="45%" @close="addDialogClosed">
      <!--内容主题区域:form表单-->
      <el-form :model="AddUserForm" :rules="AddUserRule" ref="AddUserRef" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="AddUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="AddUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="AddUserForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!--footer按钮-->
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--编辑用户对话框-->
    <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="45%" @close="editDialogClosed">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获取用户列表数据
      params: {
        query: { username: '' },
        params: {
          // 当前的页面
          page: 1,
          // 当前每页显示几条数据
          per_page: 5
        }
      },
      userList: [],
      total: 0,
      // 添加用户的对话框布尔值
      addDialogVisible: false,
      // 编辑用户的对话框布尔值
      editDialogVisible: false,
      // 添加表单绑定数据
      AddUserForm: {
        username: '',
        email: '',
        password: ''
      },
      // 添加校验规则
      AddUserRule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3到10个字符',
            trigger: 'blur'
          }
        ],
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入密码' },
          {
            min: 3,
            max: 10,
            message: '密码长度在3到10个字符',
            trigger: 'blur'
          }
        ]
      },
      // 把获取的用户信息添加到editForm中
      editForm: {},
      // 添加编辑校验规则
      editFormRules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    // 请求users接口，获取所有的userlist列表数据
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.params.params
      })
      if (res.meta.code !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 监听每页数量改变事件
    handleSizeChange(newSize) {
      this.params.params.per_page = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.params.params.page = newPage
      this.getUserList()
    },
    // 模糊查询接口
    async getSearchUserList() {
      const { data: res } = await this.$http.get('search_users', {
        params: this.params.query
      })
      if (res.meta.code !== 200) {
        return this.$message.error('该用户不存在')
      }
      this.userList = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    // 重置表单内容事件
    addDialogClosed() {
      this.$refs.AddUserRef.resetFields()
    },
    // 创建用户
    addUser() {
      // 添加表单的预校验
      this.$refs.AddUserRef.validate(async valid => {
        if (!valid) return
        // 创建用户
        const { data: res } = await this.$http.post('users', this.AddUserForm)
        if (res.meta.code !== 200) {
          this.$message.error('创建用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加用户窗户
        this.addDialogVisible = false
        // 重新获取用户列表
        this.getUserList()
      })
    },
    // 弹出编辑对话框
    async showEditDialog(id) {
      // 根据id查询到对应的用户信息
      const { data: res } = await this.$http.get('user' + '/' + id)
      if (res.meta.code !== 200) {
        return this.$message.error('用户获取失败')
      }
      // 把表单数据存入到editForm中
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户的预验证并且提交修改用户
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起用户请求
        const { data: res } = await this.$http.put(
          'users' + '/' + this.editForm.id,
          { email: this.editForm.email }
        )
        if (res.meta.code !== 200) {
          return this.$message.error('修改用户失败')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('修改用户成功')
      })
    },
    // 删除id对应的用户
    async openDeleteMessageBox(id) {
      // 弹框messageBox
      const resConfirm = await this.$confirm(
        '此操作将永久删除该用户，是否继续',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(error => error)
      // 如果确认返回confirm
      // 如果取消删除返回cancel
      if (resConfirm !== 'confirm') {
        return this.$message.info('已经取消了删除')
      }
      const { data: res } = await this.$http.delete('users' + '/' + id)
      if (res.meta.code !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
