<template>
  <a-modal
    title="操作"
    :width="600"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">

        <a-form-item
          label="父级ID"
        >
          <a-input v-model="form.parentId" disabled/>
        </a-form-item>

        <a-form-item
          label="菜单名称"
        >
          <a-input v-model="form.permissionName"/>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
  import {saveMenu} from '@/api/manage'

  export default {
    name: 'OrgModal',
    data() {
      return {
        labelCol: {
          xs: {span: 24},
          sm: {span: 5}
        },
        wrapperCol: {
          xs: {span: 24},
          sm: {span: 16}
        },
        visible: false,
        confirmLoading: false,
        form: {
          parentId: null,
          permissionName: null
        }
      }
    },
    beforeCreate() {
      this.form = this.$form.createForm(this)
      console.log('form::', this.form)
    },
    created() {

    },
    methods: {
      add(id) {
        this.edit(id)
      },
      edit(record) {
        this.form.parentId = record
        this.visible = true
      },
      close() {
        this.$emit('close')
        this.visible = false
      },
      handleOk() {
        saveMenu(this.form).then(res => {
          this.$message.success('保存成功')
          this.$emit('ok')
        }).finally(() => {
          this.close()
        })
      },

      handleCancel() {
        this.close()
      }

    }
  }
</script>
