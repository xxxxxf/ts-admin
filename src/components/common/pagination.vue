<template>
  <el-pagination
    class="pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage4"
    :page-sizes="[10, 20, 50]"
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total">
  </el-pagination>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";

  @Component
  export default class Paginations extends Vue {

    @Prop({ default: 0 }) total!: number;

    private currentPage4: number = 1

    private handleCurrentChange(val: any) {
      console.log(`每页 ${val} 条`)
    }
    private handleSizeChange(val: any) {
      console.log(`每页 ${val} 条`)
    }
  }
</script>

<style lang="scss" scoped>
  .pagination {
    float: right;
    padding: 18px 60px;
  }
</style>