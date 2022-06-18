<template>
  <div>
    <!--输入框-->
    <div>
      <el-input
        placeholder="添加职位..."
        class="nameInput"
        prefix-icon="el-icon-input"
        v-model="pos.name"
      ></el-input>
    <!--添加按钮-->
      <el-button @click="fnAddPos" icon="el-icon-plus" type="primary"
        >添加</el-button
      >
      <el-button
        @click="fnBatchDeletePos"
        type="danger"
        :disabled="multipleSelection.length == 0"
        >批量删除</el-button
      >
    </div>
    <!--信息展示-->
    <div class="posManaMain">
      <el-table
        stripe
        border
        :data="tableData"
        @selection-change="fnSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="id" label="编号" width="55"></el-table-column>
        <el-table-column prop="name" label="职位名称" width="120">
        </el-table-column>
        <el-table-column prop="createDate" label="创建时间" width="200">
        </el-table-column>
        <el-table-column prop="enabled" label="是否启用" width="120">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.enabled">启用</el-tag>
            <el-tag type="danger" v-if="!scope.row.enabled">未启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="fnShowEditPosView(scope.$index, scope.row)"
              >编辑
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="fnDeletePos(scope.$index, scope.row)"
              >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="编辑职位" :visible.sync="dialogVisible" width="30%">
      <div>
        <el-tag>职位名称</el-tag>
        <el-input v-model="updatePos.name" class="editName"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="fnUpdatePos">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        name: "",
      },
      updatePos: {
        name: "",
      },
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
    };
  },
  mounted() {
    this.fnInitPositions();
  },
  methods: {
    /**
     * 初始化职位数据
     */
    fnInitPositions() {
      this.getRequest("/system/basic/pos/list").then((res) => {
        if (res) {
          this.tableData = res.obj.list;
        }
      });
    },
    /**
     * 多选框变化时回调函数
     */
    fnSelectionChange(val) {
      this.multipleSelection = val;
    },
    /**
     * 更新职位信息
     */
    fnUpdatePos() {
      this.putRequest("/system/basic/pos/update", this.updatePos).then(
        (res) => {
          if (res) {
            this.fnInitPositions();
            this.dialogVisible = false;
          }
        }
      );
    },
    /**
     * 打开修改对话框
     * @param index
     * @param data
     */
    fnShowEditPosView(index, data) {
      this.dialogVisible = true;
      // 将data数据复制到updatePos中
      Object.assign(this.updatePos, data);
      this.updatePos.createDate = "";
    },
    /**
     * 删除职位
     * @param index
     * @param data
     */
    fnDeletePos(index, data) {
      this.$confirm(
        "此操作将永久删除[" + data.name + "]职位，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          this.deleteRequest("/system/basic/pos/delete" + data.id).then(
            (res) => {
              if (res) {
                this.fnInitPositions();
              }
            }
          );
        })
        .catch(() => {
          this.$message.info("已取消删除！");
        });
    },
    /**
     * 批量删除职位信息
     */
    fnBatchDeletePos() {
      this.$confirm(
        "此操作将永久删除[" +
          this.multipleSelection.length +
          "]个职位，是否继续",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let ids = "?";
          this.multipleSelection.forEach((item) => {
            ids += "ids=" + item.id + "&";
          });
          this.deleteRequest("/system/basic/pos/" + ids).then((res) => {
            if (res) {
              this.fnInitPositions();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除！");
        });
    },
    /**
     * 添加职位
     */
    fnAddPos() {
      if (this.pos.name) {
        this.postRequest("/system/basic/pos/save", this.pos).then((res) => {
          if (res) {
            this.fnInitPositions();
            this.pos.name = "";
          }
        });
      } else {
        this.$message.error("职位名称不能为空！");
      }
    },
  },
};
</script>

<style scoped>
.nameInput {
  width: 1200px;
  margin-left: 0%;
  margin-right: 20px;
}

.posManaMain {
  height: 90%;
  margin-top: 20px;
}

.editName {
  width: 200px;
  margin-left: 10px;
}
</style>
