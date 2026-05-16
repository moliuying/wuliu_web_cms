<template>
    <div style="height: 100%;">
        <div style=" margin-top: 15px;">
            <Form ref="form_search" inline :label-width="90" label-position="left" style="overflow: hidden;">
                <FormItem label="auction ref" prop="value">
                    <Input @keyup.enter.native=" get_data " type="text" v-model="form_search.auction_ref" clearable
                           placeholder="auction ref" style="width: 200px;"></Input>
                </FormItem>
                <FormItem label="email" prop="value">
                    <Input @keyup.enter.native=" get_data " type="text" v-model="form_search.email" clearable
                           placeholder="email" style="width: 200px;"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click=" get_data ">搜索</Button>
                </FormItem>
                <FormItem style="float: right;">
                  <FormItem style="float: right; margin-left: 15px;">
                    <Button type="info" @click=" $router.push({name:'list'}) ">返回主页</Button>
                  </FormItem>
                  <Button type="primary" style="float: right;" @click=" $router.push({
                      name:'quotationDetail',
                      query: {
                        is_create: 1
                      }
                    })">创建报价
                  </Button>
                  <FormItem style="float: right; margin-left: 15px;">
                    客户报价链接为：<Input :value="quotationUrl" readonly style="width: 280px;"></Input>
                  </FormItem>



                </FormItem>
            </Form>
        </div>
        <Row style="height: 100%;">
            <Table border stripe :loading="loading" :columns="tableHead" :data="tableData" @on-sort-change="sortTable">

                <template slot-scope="{ row }" slot="auction_ref">
                    {{ row.auction_ref }}
                </template>
              <template slot-scope="{ row }" slot="email">
                {{ row.email }}
              </template>
              <template slot-scope="{ row }" slot="paymentMethod">
                {{ row.paymentMethod }}
              </template>
              <template slot-scope="{ row }" slot="currency">
                {{ row.currency }}
              </template>
                <template slot-scope="{ row }" slot="updateAt">
                    {{ moment(row.updateAt).format('YYYY-MM-DD') }}
                </template>
                <template slot-scope="{ row }" slot="createAt">
                    {{ moment(row.createAt).format('YYYY-MM-DD') }}
                </template>
                <template slot-scope="{ row }" slot="status">
<!--    0 新报价  1 用户已接收报价  2用户未接收报价   -->
                    <template v-if=" row.status == 1 ">
                        <span style="color: black;">
                            已创建
                        </span>
                    </template>
                    <template v-else-if=" row.status == 2 ">
                        <span style="color: green; ">
                            用户同意报价
                        </span>
                    </template>
                    <template v-else-if=" row.status == 3 ">
                        <span style="color: crimson;">
                            用户拒绝报价
                        </span>
                    </template>
                </template>
              <template slot-scope="{ row }" slot="amendMessage">
                {{ row.amendMessage }}
              </template>

                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="go_detail(row,index)">编辑
                    </Button>
                    <Poptip
                            :transfer="true"
                            confirm
                            title="是否确定删除该项内容"
                            @on-ok="sure_del_item(row, index) "
                            @on-cancel=""
                            ok-text="确定"
                            cancel-text="取消">
                        <Button type="error" size="small">删除</Button>
                    </Poptip>
                </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page v-if="total" :total="total" :current="page" prev-text="上一页" next-text="下一页"
                          @on-change="changePage" show-elevator show-total></Page>
                </div>
            </div>
        </Row>


    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        data() {
            return {
              quotationUrl: `${window.location.origin}#/quotationDetailPrev`,
                loading: true,
                form_search: {
                    auction_ref: '',
                    email: ''
                },
                paimai_huozhi_sort: null,
                paimai_date_sort: null,
                updateAt_sort: null,
                createAt_sort: null,
                tableHead: [
                    {
                        title: 'auction ref'.toUpperCase(),
                        key: 'auction ref',
                        align: 'center',
                        slot: 'auction_ref'
                    }
                    ,
                    {
                        title: 'email'.toUpperCase(),
                        key: 'email',
                        align: 'center',
                        slot: 'email'
                    },
                  {
                    title: 'payment Method'.toUpperCase(),
                    key: 'paymentMethod',
                    align: 'center',
                    slot: 'paymentMethod'
                  },
                  {
                    title: 'currency'.toUpperCase(),
                    key: 'currency',
                    align: 'center',
                    slot: 'currency'
                  },
                    {
                        title: 'status'.toUpperCase(),
                        key: 'status',
                        align: 'center',
                        slot: 'status'
                    },
                  {
                    title: 'amendMessage'.toUpperCase(),
                    key: 'amendMessage',
                    align: 'center',
                    slot: 'amendMessage'
                  },
                    {
                        title: 'action'.toUpperCase(),
                        align: 'center',
                        slot: 'action',
                        width: 200
                    }
                ],
                tableData: [],
                total: 0,
                page: 1
            }
        },
        watch:{
            'form_search':{
                handler(){
                    // console.log("值变化了")
                    this.page = 1
                    this.get_data()
                },
                deep: true
            }
        },
        mounted() {
            this.get_data()
        },
        activated() {
            this.get_data()
        },
        methods: {
            sortTable(columm) {
                this.paimai_huozhi_sort = null
                this.paimai_date_sort = null
                this.updateAt_sort = null
                this.createAt_sort = null
                this[`${columm.key}_sort`] = (columm.order == 'asc' ? 1 : -1)
                this.get_data()
            },
            get_data() {
                // get_list
                this.loading = true
                this.Ajax.get(API_URL.get_quotation_list, {
                    params: {
                        page: this.page,
                       ...this.form_search
                        // updateAt_sort: this.updateAt_sort,
                        // createAt_sort: this.createAt_sort
                    }
                }).then((ret) => {
                    this.loading = false
                    if (ret) {
                        this.total = ret.ALL_SUM
                        this.tableData = ret.DATA
                    }
                    this.loading = false
                }).catch(() => {
                    this.$Message.error('请重新登录')
                    this.$router.push({ name: 'login' })
                })
            },
            go_detail(row) {
              console.log(  row)
                row.data['_id'] = row._id
                // auction_ref, mail, _id, is_create
                this.$router.push({
                    name: 'quotationDetail',
                    query: {
                        auction_ref: row.data.auction_ref,
                        email: row.data.email,
                        _id: row._id
                    },
                    params: row.data
                })
            },
            changePage(page) {
                this.page = page
                this.get_data()
            },
            //删除新项目
            sure_del_item(row, index) {
                //    执行删除方法
                this.Ajax.post(API_URL.del_quotation_info, {
                    _id: row._id
                }).then((res) => {
                    if (res) {
                        this.$Message.success('删除成功!')
                        this.total--
                        this.tableData.splice(index, 1)
                    }
                })
            }
        }
    }
</script>
<style scoped>
    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .vertical-center-modal .ivu-modal{
        top: 0;
    }
    .title{
        height: 50px;
        color: #333;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 50px;
    }
</style>
