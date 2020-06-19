<template>
  <el-pagination
    class="pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="page"
    :page-sizes="pageSizes"
    :page-size="per_page"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    v-if="total>10">
  </el-pagination>
</template>

<script lang="ts">
  import { Component, Vue, Prop } from "vue-property-decorator";
  import {
    domain,
    client_id,
    client_secret,
    grant_type,
    scope
  } from "@/config/config";

  @Component
  export default class Paginations extends Vue {

    @Prop({ 
      type: String,
      required: true,
      default: '' 
    }) url!: string;

    @Prop({ default: 10 }) per_page!: number;
    
    @Prop({
      type: Array,
      required: false,
      default: () => [10, 20, 50]  
    }) pageSizes!: any

    private data: any = []
    private page: number = 1
    private total: number = 0
    private search: any = {}

    private created() {
      this.getData()
    }

    private async getData(str?: any) {
      let searchStr: string = ''
      this.search = str || ''
      if (this.search) {
        for (let key in this.search) {
          searchStr += '&' + key + '=' + str[key]
        }
      }
      const result = await window.$request({
        url: `${domain}/${this.url}?page=${this.page}&per_page=${this.per_page}${searchStr ? searchStr : ''}`
      });
      this.data = result.data.data.result;
      this.total = result.data.data.total
      this.$emit('getData', this.data)
    }

    private handleCurrentChange(val: any) {
      this.page = val
      this.getData(this.search)
    }
    private handleSizeChange(val: any) {
      this.per_page = val
      this.getData(this.search)
    }
  }
</script>

<style lang="scss" scoped>
  .pagination {
    float: right;
    padding: 18px 60px;
    margin-right: 80px;
  }
</style>