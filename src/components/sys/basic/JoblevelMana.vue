<template>
  <div>
    <div>
      <el-input v-model="jl.name" placeholder="请输入职称..." suffix-icon="el-icon-plus" style="width: 300px"></el-input>
      <el-select v-model="jl.titleLevel" placeholder="请选择..." style="margin: 0 10px">
        <el-option
                v-for="item in titleLevels"
                :key="item.value"
                :label="item.label"
                :value="item.value">
        </el-option>
      </el-select>
      <el-button @click="fnAddJobLv" type="primary" icon="el-icon-plus">添加</el-button>
      <el-button @click="fnBatchDeleteJobLv"
                 type="danger"
                 :disabled="multipleSelection.length == 0">批量删除</el-button>
    </div>
    <div style="margin-top: 20px;">
      <el-table
              stripe
              border
              :data="tableData"
              @selection-change="fnSelectionChange"
              style="width: 70%">
        <el-table-column
                type="selection"
                width="55">
        </el-table-column>
        <el-table-column prop="id" label="编号" width="55"></el-table-column>
        <el-table-column
                prop="name"
                label="职称名称"
                width="120">
        </el-table-column>
        <el-table-column
                prop="titleLevel"
                label="职称级别"
                width="120">
        </el-table-column>
        <el-table-column
                prop="createDate"
                label="创建时间"
                width="200">
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
                    @click="fnShowEditJobLvView(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                    type="danger"
                    @click="fnDeleteJobLv(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
            title="编辑职称"
            :visible.sync="dialogVisible"
            width="30%">
      <div>
        <div style="margin-bottom: 10px">
          <el-tag>职称名称</el-tag>
          <el-input  v-model="updateJl.name" style="margin: 0 15px;width: 300px"></el-input>
        </div>
        <div style="margin-bottom: 10px">
          <el-tag>职称级别</el-tag>
          <el-select v-model="updateJl.titleLevel" placeholder="请选择..." style="margin: 0 15px;width: 300px">
            <el-option
                    v-for="item in titleLevels"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div>
          <el-tag>是否启用</el-tag>
          <el-switch
                  style="margin: 0 15px;width: 300px"
                  v-model="updateJl.enabled">
          </el-switch>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button  @click="dialogVisible = false">取 消</el-button>
          <el-button  type="primary" @click="fnUpdateJobLv">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "JoblebelMana",
    data () {
      const titleLevels = [
        {
          value: '初级',
          label: '初级'
        },
        {
          value: '中级',
          label: '中级'
        },
        {
          value: '高级',
          label: '高级'
        },
        {
          value: '副高级',
          label: '副高级'
        },
        {
          value: '正高级',
          label: '正高级'
        }
      ]
      return {
        jl: {
          name: '',
          titleLevel: ''
        },
        updateJl: {
          name: '',
          titleLevel: '',
          enabled: true
        },
        titleLevels,
        dialogVisible: false,
        multipleSelection: [],
        tableData: []
      }
    },
    mounted () {
      this.fnInitJobLv()
    },
    methods: {
      /**
       * 初始化职称数据
       */
      fnInitJobLv() {
        this.getRequest('/system/basic/joblevel/list').then(res => {
          if(res) {
            this.tableData = res.obj.list
          }
        })
      },
      /**
       * 增加职称
       */
      fnAddJobLv() {
        if(this.jl.name && this.jl.titleLevel) {
          this.postRequest('/system/basic/joblevel/save', this.jl).then(res => {
            if (res) {
              this.fnInitJobLv()
              this.jl.name = ''
              this.jl.titleLevel = ''
            } else {
              this.$message.error('职称或职称等级不能为空！')
            }
          })
        }
      },
      /**
       * 多选框变化时回调
       * @param val
       */
      fnSelectionChange (val) {
        this.multipleSelection = val
      },
      /**
       * 打开编辑职称对话框
       * @param index
       * @param data
       */
      fnShowEditJobLvView(index, data) {
        this.dialogVisible = true
        Object.assign(this.updateJl, data)
        this.updateJl.createDate = ''
      },
      /**
       * 删除职称
       * @param index
       * @param data
       */
      fnDeleteJobLv(index, data) {
        this.$confirm('此操作将永久删除[' + data.name + ']职称，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/system/basic/joblevel/delete' + data.id).then(res => {
            if (res) {
              this.fnInitJobLv()
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除！')
        })
      },
      /**
       * 批量删除职称
       */
      fnBatchDeleteJobLv() {
        this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']个职称，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = '?'
          this.multipleSelection.forEach(item => {
            ids += 'ids=' + item.id + '&'
          })
          this.deleteRequest('/system/basic/joblevel/' +ids).then(res => {
            if (res) {
              this.fnInitJobLv()
            }
          })
        }).catch(() => {
          this.$message.info('已取消删除！')
        })
      },
      /**
       * 更新职称
       */
      fnUpdateJobLv() {
        this.putRequest('/system/basic/joblevel/update', this.updateJl).then(res => {
          if(res) {
            this.fnInitJobLv()
            this.dialogVisible = false
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
