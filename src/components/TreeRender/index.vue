<template>
  <span class="tree-expand" style="display: flex; justify-content: space-between; width: 90%">
    <span class="tree-label">
      <span>{{DATA.label}}</span>
    </span>
    <span class="tree-btn">
      <i :class="DATA.loading ? 'el-icon-loading' : 'el-icon-delete'" @click.stop="nodeDel(STORE,DATA,NODE)"></i>
    </span>
  </span>
</template>
<script>
  export default {
    props: ['NODE', 'DATA', 'STORE' ,'ICON'],
    methods: {
    //   nodeAdd(s, d, n) { //新增
    //     this.$emit('nodeAdd', s, d, n)
    //   },
    //   nodeEdit(s, d, n) { //编辑
    //     this.$emit('nodeEdit', s, d, n)
    //   },
      nodeDel(s, d, n) { //删除
        this.$emit('nodeDel', s, d, n)
      }
    }
  }

</script>

<style lang="scss" scoped>
  /deep/.tree-expand {
    display: flex;
    justify-content: space-between;
  }

</style>
