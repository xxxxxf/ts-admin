<template>
  <div class="shelf">
    <div class="list-header">
      <h2 class="list-header-title">挂架分类</h2>

      <div class="block">
        <span>分类</span>
        <el-input v-model="searchStr" placeholder="请输入内容" @keyup.enter.native="searchName(searchStr)"></el-input>
        <el-button type="primary" size="mini" @click="searchName(searchStr)">搜索</el-button>
      </div>
      <div class="btn-group">
        <el-button type="primary" v-if="!isSort" size="mini" @click="handleAdd(-1)">新增</el-button>
        <el-button type="primary" v-if="!isSort" size="mini" @click="handleSort">排序</el-button>
        <el-button type="primary" v-if="isSort" size="mini" @click="handleSave">提交</el-button>
        <el-button type="primary" v-if="isSort" size="mini" @click="handleCancle">取消</el-button>
      </div>
    </div>
    <div class="shelt-title">
      <p v-for="(oItem,oIndex) in title">{{oItem}}</p>
      <div class="clear"></div>
    </div>
    <ul class="list" :id="isSort ? 'list' : ''">
      <!-- <ul class="list" id="list"> -->
      <li v-for="(item,index) in tableData" :class="isSort ? 'active' : ''">
        <div class="show-list">
          <div class="show-div">{{index+1}}</div>
          <!-- <span>{{item.name}}</span> -->
          <div class="show-div">
            <span v-show="!item.isEdit">{{ item.name }}</span>
            <el-input v-model="item.name" class v-show="item.isEdit" size="mini" />
          </div>
          <div class="show-div">
            <span v-show="!item.isEdit">{{ item.name_en }}</span>
            <el-input v-model="item.name_en" class v-show="item.isEdit" size="mini" />
          </div>
          <div class="show-div">
            <b v-if="item.status == 1" class="bg-blue">已启用</b>
            <b v-if="item.status == 2" class="bg-red">已禁用</b>
          </div>
          <div class="action show-div">
            <b v-show="item.isEdit" @click="saveShelt(index)">保存</b>
            <b v-show="item.isEdit" @click="cancelShelt(index)">取消</b>
            <b v-show="!item.isEdit" @click="editShelt(index)">编辑</b>
            <b v-show="!item.isEdit" @click="deleteShelt(index)">删除</b>
            <b
              v-show="!item.isEdit && item.status == 1"
              @click="changeStatus(index,1)"
              class="bg-red"
            >禁用</b>
            <b
              v-show="!item.isEdit && item.status == 2"
              @click="changeStatus(index,2)"
              class="bg-blue"
            >启用</b>
          </div>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
      </li>
      <div class="clear"></div>
    </ul>
    <!-- <sf-pagination :url="url" @get-list="getPaginationList"></sf-pagination> -->
  </div>
</template>
<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import {
  domain,
  client_id,
  client_secret,
  grant_type,
  scope
} from "@/config/config";
import Sortable from "sortablejs";

@Component
export default class App extends Vue {
  private title: any[] = ["#", "分类(中文)", "分类(英文)", "状态", "操作"];
  private tableData: any[] = [];
  private isEdit: boolean = false;
  private url: string = `${domain}/adminapi/category`;
  private searchStr: any = "";
  private created() {
    this.getData();
  }
  // 搜索条件配置
  private searchSource: any[] = [
    {
      type: "String",
      label: "分类",
      attribute: "name"
    }
  ];
  // 搜索
  // onSearchResult(url: any) {
  //   this.handleSearch(url);
  // }
  // 点击搜索方法
  // private async handleSearch(url?: any) {
  //   console.log("")
  // }
  private async searchName(data?: any) {
    const result = await window.$request({
      url:
        `${domain}` +
        "/adminapi/category?name=" +
        `${data}` +
        "&page=1&per_page=50"
    });
    this.searchStr = data;
    this.tableData = result.data.data;
  }
  private async getData() {
    const result = await window.$request({
      url: `${domain}` + "/adminapi/category"
    });
    this.tableData = result.data.data;
  }
  private isEditFlag: boolean = false;
  //   新建
  private handleAdd(index: number) {
    this.isEditFlag = true;
    if (this.isEdit) {
      return
    }
    let IdArr: any[] = [];
    let sameFlag: boolean = false;
    this.tableData.forEach((val, index) => {
      IdArr.push(val.id);
    });
    this.tableData.unshift({
      name: "",
      name_en: "",
      status: 1,
      isEdit: true
    });
    // 存id的数组里是否含有undefined
    if (IdArr.indexOf(undefined) > -1) {
      sameFlag = true;
    }
    // 如果含有undefined，则不给继续新增
    if (sameFlag) {
      this.tableData.splice(0, 1);
    }
  }
  // 点击分页组件重新获取数据
  // getPaginationList(data: any) {
  //   this.tableData = data.response.data;
  // }
  // 保存
  private async saveShelt(index: any) {
    if (this.isSort) {
      return;
    }
    // 判断是新建还是编辑状态的保存，新建没有id
    if (this.tableData[index].id) {
      let id = this.tableData[index].id;
      let result: any = await window.$request.put(
        `${domain}` + "/adminapi/category/" + `${id}`,
        {
          body: {
            name: this.tableData[index].name,
            name_en: this.tableData[index].name_en,
            status: this.tableData[index].status
          }
        }
      );
      window.$message({
        message: "提交成功!",
        type: "success"
      });
      this.isEdit = false;
      this.getData();
    } else {
      // 新建保存走post，编辑保存走put
      let result: any = await window.$request.post(
        `${domain}` + "/adminapi/category",
        {
          body: {
            name: this.tableData[0].name,
            name_en: this.tableData[0].name_en,
            status: this.tableData[0].status
          }
        }
      );
      window.$message({
        message: "提交成功!",
        type: "success"
      });
      // 新建保存强制刷新页面是因为走获取数据时总数不变
      // location.reload();
      this.getData();
    }

    this.tableData[index].isEdit = false;
  }
  // 取消
  private async cancelShelt(index: any) {
    // 新建时取消，删除整条数据
    if (!this.tableData[index].id) {
      this.tableData.splice(0, 1);
    } else {
      this.tableData[index].isEdit = false;
    }
    location.reload();
    // this.getData();
  }
  // 编辑
  private async editShelt(index: any) {
    this.isEdit = true;
    this.$set(this.tableData[index], "isEdit", true);
  }
  // 删除
  private async deleteShelt(index: any) {
    if (this.isSort) {
      return;
    }
    const confirm = window.$confirm;
    confirm("此操作将永久删除该数据, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      let id = this.tableData[index].id;
      await window.$request.delete(
        `${domain}` + "/adminapi/category/" + `${id}`,
        {
          method: "delete"
        }
      );
      window.$message({
        message: "删除成功!",
        type: "success"
      });
      this.tableData.splice(index, 1);
      this.getData();
    });
  }
  // 启用禁用
  private async changeStatus(index: any, type: any) {
    if (this.isSort) {
      return;
    }
    const confirm = window.$confirm;
    confirm("确定禁用/启用该条数据?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }).then(async () => {
      let changestatus: any = 0;
      if (type === 1) {
        changestatus = 2;
      } else if (type === 2) {
        changestatus = 1;
      }
      let result: any = await window.$request.post(
        `${domain}` + "/adminapi/category/status",
        {
          body: {
            id: this.tableData[index].id,
            status: changestatus
          }
        }
      );
      window.$message({
        message: "启用/禁用成功",
        type: "success"
      });
      this.getData();
    });
  }
  private isSort: boolean = false;
  private handleSort() {
    console.log(this, "this---");
    if (this.isEdit || this.isEditFlag) {
      window.$message({
        message: "请先保存新增的数据！",
        type: "warning"
      });
      return;
    } else {
      this.isSort = true;
      setTimeout(() => {
        this.sortData();
      }, 0);
    }
  }

  private sortID: any[] = [];
  private async handleSave() {
    this.tableData.forEach((val: any, index: number) => {
      this.sortID.push({
        sort: index + 1,
        id: val.id
      });
    });
    let result: any = await window.$request.post(
      `${domain}` + "/adminapi/category/sort",
      {
        body: {
          sortdata: this.sortID
        }
      }
    );
    window.$message({
        message: "保存成功!",
        type: "warning"
      });
    // this.isSort = false;
    // this.getData();
    location.reload();
  }
  private handleCancle() {
    location.reload();
  }

  private async sortData() {
    let _this = this;
    let $ul: any = document.querySelector("#list");
    let sortable = new Sortable($ul, {
      onUpdate: event => {
        // 修改items数据顺序
        let newIndex: any = event.newIndex;
        let oldIndex: any = event.oldIndex;
        let $li = $ul.children[newIndex];
        let $oldLi = $ul.children[oldIndex];
        // 先删除移动的节点
        $ul.removeChild($li);
        // 再插入移动的节点到原有节点，还原了移动的操作
        if (newIndex > oldIndex) {
          $ul.insertBefore($li, $oldLi);
        } else {
          $ul.insertBefore($li, $oldLi.nextSibling);
        }
        // 更新items数组
        let item = _this.tableData.splice(oldIndex, 1);
        _this.tableData.splice(newIndex, 0, item[0]);
        // 下一个tick就会走patch更新
      },
      animation: 150
    });
  }

  private btnUp(index: any) {
    let item = this.tableData[index];
    this.tableData.splice(index, 1);
    this.tableData.unshift(item);
  }
}
</script>
<style lang="scss" scoped>
.shelf {
  background: #fff;
}
.shelt-title {
  background: #f6f6f6;
}
.shelt-title p {
  float: left;
  width: 24%;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 14px;
  color: #606266;
}
.shelt-title p:first-child {
  width: 4%;
}
.clear {
  clear: both;
}
.list {
  background: #fff;
}
.list li {
  padding: 7px 0;
  border-bottom: 1px solid #ddd;
  font-size: 14px;
  color: #606266;
}
.show-list .show-div {
  display: block;
  float: left;
  width: 24%;
  text-align: center;
}
.show-list div:first-child {
  width: 4%;
}
.show-list b {
  font-weight: normal;
  text-decoration: none;
  outline: none;
}
.action b {
  display: inline-block;
  margin-right: 20px;
  cursor: pointer;
}
.el-input {
  width: 60%;
}
.block {
  margin: 10px 0;
  padding-left: 15px;
}
.block .el-input {
  width: 15%;
  margin: 0 20px;
}
.bg-blue {
  color: rgb(0, 204, 51);
}
.bg-red {
  color: red;
}
.btn-group {
  padding-left: 15px;
  background: #f4f7fa;
  height: 50px;
  line-height: 50px;
}
.list-header-title {
  font-size: 32px;
  font-weight: 400;
  height: 60px;
  line-height: 60px;
  padding-left: 10px;
}
.active {
  cursor: move;
}
</style>
<style>
.block .el-input .el-input__inner {
  height: 30px;
}
</style>