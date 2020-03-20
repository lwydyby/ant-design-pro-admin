<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="角色名称" >
              <a-input placeholder="请输入" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="create">新建</a-button>
    </div>
    <s-table
      size="default"
      ref="table"
      :columns="columns"
      :data="loadData"
    >
      <div
        slot="expandedRowRender"
        slot-scope="record"
        style="margin: 0">
        <a-row
          :gutter="24"
          :style="{ marginBottom: '12px' }">
          <a-col :span="12" v-for="(role, index) in record.permissions" :key="index" :style="{ marginBottom: '12px' }">
            <a-col :lg="4" :md="24">
              <span>{{ role.permissionName }}：</span>
            </a-col>
            <a-col :lg="20" :md="24" v-if="role.actionEntrySet.length > 0">
              <a-tag color="cyan" v-for="(action, k) in role.actionEntrySet" :key="k">{{ action.describe }}</a-tag>
            </a-col>
            <a-col :span="20" v-else>-</a-col>
          </a-col>
        </a-row>
      </div>
      <span slot="createTime" slot-scope="text, record">
        {{record.createTime | dayjs}}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical"/>
        <a-dropdown>
          <a class="ant-dropdown-link">
            更多 <a-icon type="down"/>
          </a>
          <a-menu slot="overlay">
            <a-menu-item>
              <a @click="handleDisable(record)" v-if="record.status==='USED'">禁用</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="handleEnable(record)" v-if="record.status==='UNUSED'">启用</a>
            </a-menu-item>
            <a-menu-item>
              <a @click="handleDelete(record)">删除</a>
            </a-menu-item>
          </a-menu>
        </a-dropdown>
      </span>
    </s-table>

    <a-modal
      title="操作"
      style="top: 20px;"
      :width="800"
      v-model="visible"
      @ok="handleOk"
    >
      <a-form :autoFormCreate="(form)=>{this.form = form}">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色名称"
          hasFeedback
        >
          <a-input placeholder="起一个名字" v-model="mdl.name" id="role_name"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="状态"
          hasFeedback
        >
          <a-select v-model="mdl.status">
            <a-select-option value="USED">使用</a-select-option>
            <a-select-option value="UNUSED">禁用</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="描述"
          hasFeedback
        >
          <a-textarea :rows="5" v-model="mdl.describe" placeholder="..." id="describe"/>
        </a-form-item>

        <a-divider/>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="拥有权限"
          hasFeedback
        >
          <a-row :gutter="16" v-for="(permission, index) in permissions" :key="index">
            <a-col :span="4">
              {{ permission.permissionName }}：
            </a-col>
            <a-col :span="20">
              <a-checkbox-group :options="permission.actionsOptions" v-model="permissionIds[index]"/>
            </a-col>
          </a-row>

        </a-form-item>

      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  import {STable} from '@/components'
  import {getRoleList, getPermissionsNoPager, saveRole,deleteRole,enableRole,disableRole} from '@/api/manage'

  export default {
    name: 'TableList',
    components: {
      STable
    },
    data() {
      return {
        visible: false,
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16}
        },
        form: null,
        mdl: {},

        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {
          name:null
        },
        // 表头
        columns: [
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return getRoleList(Object.assign(parameter, this.queryParam))
            .then(res => {
              console.log(res)
              this.columns=res.result.columns
              return res.result
            })
        },

        selectedRowKeys: [],
        selectedRows: [],
        permissions: [],
        permissionIds:[],
      }
    },
    created() {
      getPermissionsNoPager().then(res=>{
        this.permissions = res.result
        this.permissionIds=[]
        this.permissions.forEach(permission => {
          permission.actionsOptions = permission.actionEntrySet.map(action => {
            return {label: action.describe, value: action.id, defaultCheck: action.defaultCheck}
          })
          let data=[]
          this.permissionIds.push(data)
        })
      })

    },
    methods: {
      create(){
        this.visible = true
        this.mdl={}
      },
      handleEdit(record) {
        this.mdl = Object.assign({}, record)
        this.visible = true
      },
      handleDisable(record){
        disableRole({id:record.id}).then(res=>{
          this.$message.success('禁用成功')
          this.$refs.table.refresh(true)
        })
      },
      handleEnable(record){
        enableRole({id:record.id}).then(res=>{
          this.$message.success('启用成功')
          this.$refs.table.refresh(true)
        })
      },
      handleDelete(record){
        deleteRole({id:record.id}).then(res=>{
          this.$message.success('删除成功')
          this.$refs.table.refresh(true)
        })
      },

      handleOk() {
        this.mdl.permissions=null
        this.mdl.permissionIds=this.permissionIds
        saveRole(Object.assign({}, this.mdl)).then(res => {
          this.visible = false;
          this.$message.success('保存成功')
          this.$refs.table.refresh(true)
        })
      },
      onChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced() {
        this.advanced = !this.advanced
      }
    },
    watch: {
      /*
        'selectedRows': function (selectedRows) {
          this.needTotalList = this.needTotalList.map(item => {
            return {
              ...item,
              total: selectedRows.reduce( (sum, val) => {
                return sum + val[item.dataIndex]
              }, 0)
            }
          })
        }
        */
    }
  }
</script>
