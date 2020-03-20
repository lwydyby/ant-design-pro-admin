<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="用户名称">
              <a-input placeholder="请输入" v-model="queryParam.name"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {name:null}">重置</a-button>
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
      <a-form ref="form" :autoFormCreate="(form)=>{this.form = form}">

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="用户名"
          hasFeedback
        >
          <a-input placeholder="用户名" v-model="mdl.name"/>
        </a-form-item>

        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="密码"
          hasFeedback
        >
          <a-input-password placeholder="密码" v-model="mdl.password" id="password"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="邮箱"
          hasFeedback
        >
          <a-input placeholder="邮箱" v-model="mdl.email"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="手机号"
          hasFeedback
        >
          <a-input placeholder="手机号" v-model="mdl.phone"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="头像"
          hasFeedback

        >
          <a-input placeholder="头像" v-model="mdl.avatar"/>
        </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="角色"
          hasFeedback
        >
          <a-select v-model="mdl.roleId" style="width: 120px">
            <a-select-option v-for="item in roles" :key="item.id">{{item.name}}</a-select-option>
          </a-select>
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


      </a-form>
    </a-modal>

  </a-card>
</template>

<script>
  import {STable} from '@/components'
  import {getUserList, saveUser, deleteUser, enableUser, disableUser, getAllRole} from '@/api/manage'


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
          name: null
        },
        // 表头
        columns: [
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          return getUserList(Object.assign(parameter, this.queryParam))
            .then(res => {
              this.columns=res.result.columns
              return res.result
            })
        },

        selectedRowKeys: [],
        selectedRows: [],
        roles: [],
      }
    },
    created() {
      getAllRole().then(res => {
        this.roles = res.result
      })
    },
    methods: {
      create() {
        this.visible = true
        this.mdl = {}
      },
      handleEdit(record) {
        this.mdl = Object.assign({}, record)
        this.mdl.roleId = record.role.id
        this.visible = true
      },
      handleDisable(record) {
        disableUser({id: record.id}).then(res => {
          this.$message.success('禁用成功')
          this.$refs.table.refresh(true)
        })
      },
      handleEnable(record) {
        enableUser({id: record.id}).then(res => {
          this.$message.success('启用成功')
          this.$refs.table.refresh(true)
        })
      },
      handleDelete(record) {
        deleteUser({id: record.id}).then(res => {
          this.$message.success('删除成功')
          this.$refs.table.refresh(true)
        })
      },

      handleOk() {
        saveUser(Object.assign({}, this.mdl)).then(res => {
          this.visible = false;
          this.$message.success('保存成功')
          this.$refs.table.refresh(true)
        })
      },


    },


  }
</script>
