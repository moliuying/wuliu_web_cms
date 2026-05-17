<template>
    <div style="height: 100%;">
        <div style=" margin-top: 15px;">
            {{paimai_huozhi_sort}}
            <Form ref="form_search" inline :label-width="90" label-position="left" style="overflow: hidden;">
                <FormItem label="receive_name" prop="value">
                    <Input @keyup.enter.native=" get_data " type="text" v-model="form_search.name" clearable
                           placeholder="receiver name" style="width: 200px;"></Input>
                </FormItem>
                <FormItem label="auction_name" prop="value">
                    <Input @keyup.enter.native=" get_data " type="text" v-model="form_search.auction_name" clearable
                           placeholder="auction name" style="width: 200px;"></Input>
                </FormItem>
                <FormItem @keyup.enter.native=" get_data " label="track_number" prop="value">
                    <Input type="text" v-model="form_search.value" clearable placeholder="Job ID/WAYBILL NUM"
                           style="width: 180px;"></Input>
                </FormItem>
                <FormItem label="order_status" prop="status">
                    <Select @keyup.enter.native=" get_data " v-model="form_search.status" :clearable="true" transfer
                            placeholder="Select your order status" style="width: 180px;">
                        <Option value="0">New inquiry</Option>
                        <Option value="1">Shipping quoted</Option>
                        <Option value="2">Shipping confirmed</Option>
                        <Option value="3">Items Collected</Option>
                        <Option value="4">Shipment Dispatched</Option>
                        <Option value="5">POD Sent</Option>
                    </Select>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click=" get_data ">搜索</Button>
                </FormItem>
                <FormItem style="float: right;">

                  <Button type="primary" @click=" $router.push({
                    name:'quotation_list',
                    params: ''
                    } ) ">报价管理
                  </Button>

                    <Button type="primary" @click=" $router.push({
                    name:'use_list',
                    params: ''
                    } ) ">收件人管理
                    </Button>

                    <Button type="primary" @click=" $router.push({
                    name:'detail',
                    params: ''
                    } )">创建新订单
                    </Button>
                </FormItem>
            </Form>
        </div>
        <Row style="height: 100%;">
            <Table border stripe :loading="loading" :columns="tableHead" :data="tableData" @on-sort-change="sortTable">
                <template slot-scope="{ row }" slot="priority">
                    <Tag v-if="row.data.priority == 2" color="red">紧急</Tag>
                    <Tag v-else-if="row.data.priority == 1" color="orange">高</Tag>
                    <Tag v-else color="default">普通</Tag>
                </template>
                <template slot-scope="{ row }" slot="invoice_nmuber">
                    {{ row.data.invoice_nmuber }}
                </template>
                <template slot-scope="{ row }" slot="kehu_name">
                    {{ row.data.kehu_name }}
                </template>
                <template slot-scope="{ row }" slot="paimai_name">
                    {{ row.data.paimai_name }}
                </template>
                <template slot-scope="{ row }" slot="paimai_date">
                    <!--                    {{ // row.data.paimai_date ? moment(row.data.paimai_date).utcOffset(-360).format("YYYY-MM-DD HH:mm"):'' }}-->
                    {{ row.data.paimai_date ? moment(row.data.paimai_date).utcOffset(0).format('YYYY-MM-DD'):'' }}
                </template>


                <template slot-scope="{ row }" slot="paimai_huozhi">
                    {{ row.data.paimai_huozhi }}
                </template>


                <template slot-scope="{ row }" slot="updateAt">
                    {{ moment(row.updateAt).format('YYYY-MM-DD') }}
                </template>

                <template slot-scope="{ row }" slot="createAt">
                    {{ moment(row.createAt).format('YYYY-MM-DD') }}
                </template>


                <template slot-scope="{ row }" slot="status">
                    <template v-if=" row.data.status == 0 ">
                        <span style="color: black;">
                            New inquiry
                        </span>
                    </template>
                    <template v-else-if=" row.data.status == 1 ">
                        <span style="color: yellow; ">
                            Shipping quoted
                        </span>
                    </template>
                    <template v-else-if=" row.data.status == 2 ">
                        <span style="color: green;">
                            Shipping confirmed
                        </span>
                    </template>
                    <template v-else-if=" row.data.status == 3 ">
                        <span style="color: blue;">
                            Items Collected
                        </span>
                    </template>
                    <template v-else-if=" row.data.status == 4 ">
                        <span style="color: blueviolet;">
                            Shipment Dispatched
                        </span>
                    </template>
                    <template v-else-if=" row.data.status == 5 ">
                        <span style="color: red;">
                            POD Sent
                        </span>
                    </template>
                </template>
                <template slot-scope="{ row }" slot="vat_refund">
                    <Checkbox v-model=" row.data.vat_refund " size="large"></Checkbox>
                </template>
                <template slot-scope="{ row }" slot="order_mark">
                    {{ row.data.order_mark }}
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click="go_detail(row,index)">详细
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
                loading: true,
                form_search: {
                    value: '',
                    auction_name: '',
                    name: '',
                    status: ''
                },
                paimai_huozhi_sort: null,
                paimai_date_sort: null,
                updateAt_sort: null,
                createAt_sort: null,
                tableHead: [
                    {
                        title: '优先级',
                        key: 'priority',
                        align: 'center',
                        slot: 'priority',
                        width: 100
                    }
                    ,
                    {
                        title: 'INVOICE NUMBER',
                        key: 'invoice_nmuber',
                        align: 'center',
                        slot: 'invoice_nmuber'
                    }
                    ,
                    {
                        title: 'CLIENT NAME',
                        key: 'kehu_name',
                        align: 'center',
                        slot: 'kehu_name'
                    },
                    {
                        title: 'AUCTION NAME',
                        key: 'paimai_name',
                        align: 'center',
                        slot: 'paimai_name'
                    },
                    {
                        title: 'Auction Date',
                        key: 'paimai_date',
                        align: 'center',
                        slot: 'paimai_date',
                        sortable: 'custom'
                    },
                    {
                        title: 'Invoice value',
                        key: 'paimai_huozhi',
                        align: 'center',
                        slot: 'paimai_huozhi',
                        sortable: 'custom'
                    },

                    {
                        title: 'Current Status',
                        key: 'status',
                        align: 'center',
                        slot: 'status'
                    },
                    {
                        title: 'VAT Refund Required',
                        key: 'vat_refund',
                        align: 'center',
                        slot: 'vat_refund'
                    },
                    {
                        title: 'prev action time',
                        key: 'updateAt',
                        align: 'center',
                        slot: 'updateAt',
                        sortable: 'custom'
                    },
                    {
                        title: 'createAt',
                        key: 'createAt',
                        align: 'center',
                        slot: 'createAt',
                        sortable: 'custom'
                    },

                    {
                        title: 'Special  Note',
                        align: 'center',
                        slot: 'order_mark'
                    },
                    {
                        title: 'action',
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
                this.Ajax.get(API_URL.get_list, {
                    params: {
                        page: this.page,
                        status: this.form_search.status,
                        search_value: this.form_search.value,
                        name: this.form_search.name,
                        auction_name: this.form_search.auction_name,
                        paimai_huozhi_sort: this.paimai_huozhi_sort,
                        paimai_date_sort: this.paimai_date_sort,
                        updateAt_sort: this.updateAt_sort,
                        createAt_sort: this.createAt_sort
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
                row.data['_id'] = row._id
                this.$router.push({
                    name: 'detail',
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
                this.Ajax.post(API_URL.del_info, {
                    _id: row._id
                }).then((res) => {
                    if (res) {
                        this.$Message.success('删除成功!')
                        this.total--
                        this.tableData.splice(index, 1)
                    }
                })
            },
            test() {

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
