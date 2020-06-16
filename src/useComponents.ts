/**
 *
 * @Description: 引入外部组件
 * @Author: Owen
 * @Date: 2019-07-01 10:06
 *
 */

import Vue from 'vue'
import {
  Container,
  Checkbox,
  CheckboxGroup,
  Header,
  Dialog,
  Button,
  Select,
  Table,
  Aside,
  Main,
  Input,
  Row,
  Col,
  TableColumn,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  Option,
  Form,
  FormItem,
  Message,
  MessageBox,
  Loading,
  Pagination,
  Tabs,
  TabPane,
  Radio,
  Upload,
  DatePicker,
  RadioGroup,
  RadioButton,
  Cascader,
  Steps,
  Step,
  Transfer
} from 'element-ui'

// @ts-ignore
// import { sfMenu, sfTable, sfSearch, sfPagination, sfSelect } from 'sfabric-component'

// use element-ui components start
Vue.use(Container)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Header)
Vue.use(Dialog)
Vue.use(Button)
Vue.use(Select)
Vue.use(Table)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Input)
Vue.use(Row)
Vue.use(Col)
Vue.use(TableColumn)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Dropdown)
Vue.use(Option)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Pagination)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Radio)
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Cascader)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Transfer)

window.$message = Message
window.$loading = Loading
window.$confirm = MessageBox.confirm
// use element-ui components end

// use base components start
// Vue.use(sfMenu)
// Vue.use(sfTable)
// Vue.use(sfSearch)
// Vue.use(sfPagination)
// Vue.use(sfSelect)
// use base components end
