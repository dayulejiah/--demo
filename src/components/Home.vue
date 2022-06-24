<template>
  <el-container>
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_btn" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
          router
        >
          <!-- 一级菜单 -->
          <!-- 此处index需要的是数值，直接“index”为字符串，后加入+'' -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      menulist: [],
      iconObj: {
        125: "el-icon-user-solid",
        103: "el-icon-s-tools",
        101: "el-icon-s-shop",
        102: "el-icon-s-order",
        145: "el-icon-s-data",
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: "",
    };
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res);
    },
    // 点击按钮，折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    //
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
};
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  background: #363d40;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header span {
  margin-left: 15px;
}
.el-header img {
  height: 40px;
  width: 40px;
  /* display: inline-block; */
  line-height: 40px;
  /* position: absolute; */
  margin-top: 10px;
}
.el-aside {
  background: #313743;
}
.el-aside .el-menu {
  border-right: none;
  box-sizing: border-box;
  padding: 0;
  margin-left: 10px;
}
.el-menu .el-submenu__title i {
  padding-right: 20px;
  margin-left: 0px;
}
.el-menu .el-submenu__title span {
  padding-right: 30px;
}

.el-aside .el-menu {
  margin-left: -70px;
  width: 200px;
}

.el-main {
  background: #eaedf1;
  margin: 0;
}

.toggle_btn {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
