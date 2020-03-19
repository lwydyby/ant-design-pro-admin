<template>
  <a-drawer
    title="配置路由"
    :width="720"
    @close="onClose"
    :visible="visible"
    :bodyStyle="{paddingBottom: '80px'}"
  >
    <a-form :form="form" ref="form" layout="vertical" hideRequiredMark>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="路由路径">
            <a-input
              v-model="form.path"
              placeholder="请输入路由路径"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="路由名称">
            <a-input
              v-model="form.name"
              placeholder="请输入路由名称"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item label="路由标题">
            <a-input
              v-model="form.title"
              placeholder="请输入路由标题"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="组件名称">
            <a-input
              v-model="form.component"
              placeholder="请输入组件名称"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <div
      :style="{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e9e9e9',
          padding: '10px 16px',
          background: '#fff',
          textAlign: 'right',
          zIndex: 1,
        }"
    >
      <a-button :style="{marginRight: '8px'}" @click="onClose">
        Cancel
      </a-button>
      <a-button @click="handleOk" type="primary">Submit</a-button>
    </div>
  </a-drawer>
</template>

<script>
  import {saveRoute, getRouteInfo} from '@/api/manage'

  export default {
    name: "RouteModal",
    data() {
      return {
        visible: false,
        confirmLoading: false,
        form: {
          name: null,
          title: null,
          path: null,
          component: null
        },
      }
    },
    methods: {
      add(route) {
        this.showDrawer(route)
      },
      showDrawer(route) {
        this.visible = true;
        if (route) {
          this.form.id=route.id
          this.form.name = route.name
          this.form.title = route.title
          this.form.path = route.path
          this.form.component = route.component
        } else {
          this.form.id=null
          this.form.name = null
          this.form.title = null
          this.form.path = null
          this.form.component = null
        }


      },
      onClose() {
        this.visible = false;
        this.$emit('close')
      },
      handleOk() {
        saveRoute(this.form).then(res => {
          this.$message.success('保存成功')
          this.$emit('ok')
        }).finally(() => {
          this.onClose()
        })


      },
    },
  }
</script>

<style scoped>

</style>