<template>
  <div>
    <div>
      <!--搜索条件-->
      <div class="">
        <el-input
          placeholder="请输入部门名称进行搜索..."
          prefix-icon="el-icon-search"
          v-model="filterText"
        ></el-input>
      </div>
      <!--展示部门数据-->
      <el-tree
        :data="deptData"
        :props="defaultProps"
        ref="tree"
        :expand-on-click-node="false"
        :filter-node-method="fnFilterNode"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
        >
          <span>{{ data.name }}</span>
          <span>
            <el-button
              @click="fnShowAddDept(data)"
              type="text"
              icon="el-icon-circle-plus"
            ></el-button>
            <el-button
              @click="fnDeleteDept(data)"
              type="text"
              style="color: #ff0000"
              icon="el-icon-delete"
            ></el-button>
          </span>
        </span>
      </el-tree>
    </div>

    <!--添加页面-->
    <div>
      <el-dialog
        title="添加部门"
        @cancel="this.dialogVisible = false"
        :visible="dialogVisible"
        width="30%"
      >
        <div>
          <table>
            <tr>
              <td><el-tag>上级部门</el-tag></td>
              <td>{{ pname }}</td>
            </tr>
            <tr>
              <td><el-tag>部门名称</el-tag></td>
              <td>
                <el-input v-model="dep.name" placeholder="请输入部门名称..." />
              </td>
            </tr>
          </table>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button @click="fnAddDept" type="primary">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "DeptMana",
  data() {
    return {
      filterText: "",
      deptData: [],
      dialogVisible: false,
      dep: {
        name: "",
        parentId: -1,
      },
      pname: "",
      defaultProps: {
        children: "children",
        label: "name",
      },
    };
  },
  watch: {
    filterText(val) {
      return this.$refs.tree.filter(val);
    },
  },
  mounted() {
    this.fnInitDepts();
  },
  methods: {
    /**
     * 初始化部门信息
     */
    fnInitDepts() {
      this.getRequest("/system/basic/department/list").then((res) => {
        if (res) {
          this.deptData = res.obj.list;
        }
      });
    },
    /**
     * 打开添加部门对话框
     */
    fnShowAddDept(data) {
      this.dialogVisible = true;
      this.pname = data.name;
      this.dep.parentId = data.id;
    },
    /**
     * 添加部门
     */
    fnAddDept() {
      this.postRequest("/system/basic/department/save", this.dep).then(
        (res) => {
          if (res) {
            this.fnAddDeptToTree(this.deptData, res.data);
            this.dialogVisible = false;
            this.dep.name = "";
            this.dep.parentId = -1;
            this.pname = "";
          }
        }
      );
    },
    /**
     * 将添加的部门加入到部门列表中
     */
    fnAddDeptToTree(depts, dep) {
      for (let i = 0; i < depts.length; i++) {
        let d = depts[i];
        if (d.id == dep.parentId) {
          d.children = d.children.concat(dep);
          if (d.children > 0) {
            d.isParent = true;
          }
          return;
        } else {
          this.fnAddDeptToTree(d.children, dep);
        }
      }
    },
    /**
     * 删除部门
     */
    fnDeleteDept(data) {
      if (data.isParent) {
        this.$message.error("父部门删除失败！");
      } else {
        this.$confirm(
          "此操作将永久删除[" + data.name + "]部门, 是否继续？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
          }
        )
          .then(() => {
            this.postRequest(
              "/system/basic/department/delete/" + data.id
            ).then((res) => {
              this.fnRemoveDepFromTree(null, this.deptData, data.id);
            });
          })
          .catch(() => {
            this.$message.info("已取消删除！");
          });
      }
    },
    fnRemoveDepFromTree(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == id) {
          deps.splice(i, 1);
          if (deps.length === 0) {
            p.isParent = false;
          }
          return;
        } else {
          this.fnRemoveDepFromTree(d, d.children, id);
        }
      }
    },
    /**
     * 树形控件搜索
     * @param value
     * @param data
     * @returns {boolean}
     */
    fnFilterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
  },
};
</script>

<style scoped>
.custom-tree-node{
      flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
}
</style>
