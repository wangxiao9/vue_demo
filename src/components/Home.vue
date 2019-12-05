<template>
    <div>
        <el-button type="info" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
  methods: {
    // 退出登录
    logout () {
      // 1.清除token
      window.sessionStorage.clear()
      // 2.跳转到登录页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
