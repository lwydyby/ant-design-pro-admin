<template>
  <a-card :bordered="false">
    <a-row :gutter="8">
      <a-col :span="5">
        <s-tree
          :dataSource="orgTree"
          :openKeys.sync="openKeys"
          :search="true"
          @editSelf="editSelf"
          @peerAdd="handlePeerAdd"
          @childAdd="handleChildAdd"
          @click="handleClick"
          @add="handleAdd"
          @titleClick="handleTitleClick"></s-tree>
      </a-col>
      <a-col :span="19">
        <a-card :body-style="{padding: '24px 32px'}" :bordered="false">
          <a-form @submit="handleSubmit">
            <a-form-item
              label="菜单标志"
              :labelCol="{lg: {span: 7}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
              <a-input
                v-model="form.permissionId"
                name="permissionId"
                placeholder="菜单标志"/>
            </a-form-item>
            <a-form-item
              label="菜单名称"
              :labelCol="{lg: {span: 7}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
              <a-input
               v-model="form.permissionName"
                name="permissionName"
                placeholder="菜单名称"/>
            </a-form-item>
            <a-form-item
              label="类型"
              :labelCol="{lg: {span: 7}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
              <a-select  style="width: 120px"  v-model="form.type" name="type">
                <a-select-option value=1>菜单</a-select-option>
                <a-select-option value=2>功能</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item
              label="排序"
              :labelCol="{lg: {span: 7}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 10}, sm: {span: 17} }">
              <a-input-number id="inputNumber" name="sort" :min="1" :max="100" v-model="form.sort"/>
            </a-form-item>
            <a-form-item
              :wrapperCol="{ span: 24 }"
              style="text-align: center"
            >
              <a-button htmlType="submit" type="primary">提交</a-button>
              <a-button style="margin-left: 8px" @click="settingRoute">配置路由</a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <org-modal ref="modal" @ok="handleSaveOk" @close="handleSaveClose"/>
    <route-modal ref="routeModal" @ok="handleSaveRouteOk" @close="handleSaveRouteClose"/>
  </a-card>
</template>

<script>
  import STree from '@/components/Tree/Tree'
  import {STable} from '@/components'
  import OrgModal from './modules/OrgModal'
  import RouteModal from './modules/RouteModal'
  import {getOrgTree, getMenuInfo,saveMenu} from '@/api/manage'

  export default {
    name: 'TreeList',
    components: {
      STable,
      STree,
      OrgModal,
      RouteModal
    },
    data() {
      return {
        openKeys: [],
        // 查询参数
        queryParam: {},
        orgTree: [],
        selectedRowKeys: [],
        selectedRows: [],
        form: {
          id: null,
          permissionId: null,
          permissionName: null,
          type: null,
          sort: 1
        },

      }
    },
    created() {
      this.getTree()
    },
    methods: {
      getTree () {
        getOrgTree().then(res => {
          this.orgTree = res.result
        })
      },
      editSelf(item){
        this.handleClick({key:item})
      },
      handleClick (e) {
        this.queryParam = {
          id: e.key
        }
        getMenuInfo(this.queryParam).then(res => {
          let data=res.result

          this.form.id = data.id;
          this.form.permissionId = data.permissionId;
          this.form.permissionName = data.permissionName;
          this.form.sort = data.sort;
          this.form.route=data.route
          this.form.type = data.type+"";
        })
      },
      settingRoute() {
        this.$refs.routeModal.add(this.form.route)
      },
      handleSubmit(){
        saveMenu(Object.assign({}, this.form)).then(res=>{
          this.$message.success('保存成功')
          this.getTree();
        })
      },
      handleAdd (item) {
        this.$refs.modal.add(item.key)
      },
      handlePeerAdd(item){
        this.$refs.modal.add(item)
      },
      handleChildAdd(item){
        this.$refs.modal.add(item)
      },
      handleTitleClick (item) {
        console.log(item)
      },
      titleClick (e) {
        console.log(e)
      },
      handleSaveOk () {
        this.getTree();
      },
      handleSaveClose () {
      },
      handleSaveRouteOk () {
      },
      handleSaveRouteClose () {

      }
    }
  }
</script>

<style lang="less">
  .custom-tree {

    /deep/ .ant-menu-item-group-title {
      position: relative;

      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .ant-menu-item {
      &:hover {
        .btn {
          display: block;
        }
      }
    }

    /deep/ .btn {
      display: none;
      position: absolute;
      top: 0;
      right: 10px;
      width: 20px;
      height: 40px;
      line-height: 40px;
      z-index: 1050;

      &:hover {
        transform: scale(1.2);
        transition: 0.5s all;
      }
    }
  }
</style>
