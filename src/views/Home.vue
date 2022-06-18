<template>
  <div>
    <el-container>
      <!--头部导航栏-->
      <el-header class="homeHeader">
        <div class="title">云E办</div>
        <el-dropdown class="userInfo" @command="fnCommand">
          <span class="el-dropdown-link">
            <font class="fontSize">{{ user.name }}</font>
            <i><img :src="user.userFace" /></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userInfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>

      <el-container style="height: 1200">
        <!--侧边导航栏-->
        <el-aside>
          <el-menu
            default-active="1-4-1"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            :collapse="isCollapse"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
          >
            <el-submenu
              :index="index + ''"
              v-for="(item, index) in routes"
              :key="index"
              v-if="!item.hidden"
            >
              <template slot="title">
                <i
                  :class="item.iconCls"
                  style="color: #laccff; margin-right: 5px"
                >
                </i>
                <span slot="title">{{ item.name }}</span>
              </template>
              <el-menu-item
                :index="children.path"
                v-for="(children, indexj) in item.children"
                :key="indexj"
                >{{ children.name }}</el-menu-item
              >
            </el-submenu>
          </el-menu>
        </el-aside>

        <!--右侧主要内容-->
        <el-main style="height: 1200">
          <el-breadcrumb
            separator-class="el-icon-arrow-right"
            v-if="this.$router.currentRoute.path != '/home'"
          >
            <el-breadcrumb-item :to="{ path: '/home' }"
              >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>{{
              this.$router.currentRoute.name
            }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div
            class="homeWelcome"
            v-if="this.$router.currentRoute.path == '/home'"
          >
            欢迎来到云E办系统
          </div>
          <router-view class="homeRouterView" />
        </el-main>
      </el-container>
      <el-footer class="footer" >Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem("user")),
      isCollapse: false,
    };
  },
  methods: {
    // 点击按钮，切换菜单的折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },

    fnCommand(command) {
      if (command == "logout") {
        this.$confirm("你确定要退出吗？( ╯□╰ )，是否继续？", "退出提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.postRequest("/logout");
            window.sessionStorage.removeItem("tokenStr");
            window.sessionStorage.removeItem("user");
            this.$store.commit("initRoutes", []);
            this.$router.replace("/");
          })
          .catch(() => {
            this.$message.info("已取消操作！");
          });
      } else if (command == "setting") {
      }
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
  },
};
</script>

<style scoped>
.el-container.is-vertical {
  flex-direction: column;
  height: 1024px;
}
.homeHeader {
  background-color: #545f64;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}
.homeHeader .title {
  font-size: 30px;
  font-family: 华文楷体;
  color: #ffffff;
  text-align: center;
}
.homeHeader .userInfo {
  cursor: pointer;
}
.el-dropdown-link {
  color: blueviolet;
  width: 35px;
  height: 35px;
  border-radius: 24px;
  margin-left: 10px;
}

.fontSize {
  font-size: 20px;
  font-family: 华文楷体;
  color: white;
}
.homeWelcome {
  font-size: 30px;
  text-align: center;
  font-family: 华文楷体;
  color: #409eff;
  padding-top: 50px;
}
.homeRouterView {
  margin-top: 10px;
}
.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: left;
  display: block;
  overflow: hidden;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
}
</style>
