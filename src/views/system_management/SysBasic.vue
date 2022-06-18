<template>
  <!--标签导航-->
  <div>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="部门管理" name="DeptMana">
        <DeptMana></DeptMana>
      </el-tab-pane>
      <el-tab-pane label="职位管理" name="PosMana">
        <PosMana></PosMana>
      </el-tab-pane>
      <el-tab-pane label="职称管理" name="JoblevelMana">
        <JoblevelMana></JoblevelMana>
      </el-tab-pane>
      <el-tab-pane label="奖惩规则" name="EcMana">
        <EcMana></EcMana>
      </el-tab-pane>
      <el-tab-pane label="权限组" name="PermissMana">
        <PermissMana></PermissMana>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import DeptMana from "../../components/sys/basic/DeptMana.vue";
import EcMana from "../../components/sys/basic/EcMana.vue";
import JoblevelMana from "../../components/sys/basic/JoblevelMana.vue";
import PermissMana from "../../components/sys/basic/PermissMana.vue";
import PosMana from "../../components/sys/basic/PosMana.vue";
export default {
  name: "SysBasic",
  components: {
    DeptMana,
    EcMana,
    JoblevelMana,
    PermissMana,
    PosMana,
  },
  data() {
    return {
      activeName: "DeptMana",//默认打开这个选项卡
    };
  },
};
</script>
<style scoped>
</style>
