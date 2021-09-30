<template>
  <div class="tablesearch-container">
    <template v-for="item in searchList">
      <el-button v-if="!(hideOpt&&hideOpt.includes(item.type))" @click="handleClick(item.type)" size="medium" :key="item.type" :type="item.isPrimary?'primary':''">{{item.label}}</el-button>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'TableSearch',
    props: {
      // 区分每个页面
      pageSign: String,
      hideOpt: Array
    },
    data() {
      return {
        searchList: [
          {
            label: '搜索',
            type: 'Search',
            isPrimary: true
          },
          {
            label: '重置',
            type: 'Reset'
          },
          {
            label: '创建',
            type: 'Create',
            isPrimary: true
          },
          {
            label: '导出',
            type: 'Export',
            isPrimary: true
          },
          {
            label: '删除选中',
            type: 'Delete',
            isPrimary: true
          }
        ]
      }
    },
    methods: {
      handleClick(type) {
        this.$bus.$emit(this.pageSign+`${type}Click`)
      }
    }
  }
</script>

<style lang="scss" scoped>
.tablesearch-container {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
}
</style>