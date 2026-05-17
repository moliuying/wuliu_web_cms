
<template>
    <div style="height: 100%;">
        <div style=" margin-top: 15px;">
            <Form ref="form_search"  inline  :label-width="80" label-position="left" style="overflow: hidden;">
                <FormItem label="搜索" prop="search_value">
                    <Input @keyup.enter.native=" get_data " v-model="form_search.search_value" clearable placeholder="公司名/联系人/邮箱" style="width: 200px;"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click=" get_data ">搜索</Button>
                </FormItem>
                <FormItem style="float: right;">
                    <Button type="info" @click=" $router.push({name:'list'}) ">返回主页</Button>
                </FormItem>
                <FormItem style="float: right;">
                    <Button type="primary" @click=" openModal(null) ">添加新客户</Button>
                </FormItem>
            </Form>
        </div>
        <Row style="height: 100%;">
            <Table  border stripe :loading="loading" :columns="tableHead" :data="tableData">
                <template slot-scope="{ row }" slot="company_name">
                    {{ row.company_name }}
                </template>
                <template slot-scope="{ row }" slot="contact_name">
                    {{ row.contact_name }}
                </template>
                <template slot-scope="{ row }" slot="email">
                    {{ row.email }}
                </template>
                <template slot-scope="{ row }" slot="phone">
                    {{ row.phone || '-' }}
                </template>
                <template slot-scope="{ row }" slot="credit_rating">
                    <div>
                        <Icon v-for="i in 5" :key="i" type="ios-star" :size="18"
                              :color="i <= row.credit_rating ? '#f5a623' : '#e0e0e0'"></Icon>
                    </div>
                </template>
                <template slot-scope="{ row }" slot="total_orders">
                    {{ row.total_orders || 0 }}
                </template>
                <template slot-scope="{ row }" slot="total_amount">
                    {{ row.total_amount || 0 }}
                </template>
                <template slot-scope="{ row }" slot="updateAt">
                    {{  moment(row.updateAt).format("YYYY-MM-DD HH:mm")  }}
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Button type="primary" size="small" style="margin-right: 5px" @click=" openModal(row) ">编辑
                    </Button>
                    <Button type="info" size="small" style="margin-right: 5px" @click=" viewOrders(row) ">订单
                    </Button>
                    <Poptip
                            :transfer="true"
                            confirm
                            title="是否确定删除该客户"
                            @on-ok="sure_del_item(row, index) "
                            @on-cancel=""
                            ok-text="确定"
                            cancel-text="取消" >
                        <Button type="error" size="small">删除</Button>
                    </Poptip>
                </template>
            </Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page v-if="total" :total="total"  :current="page" prev-text="上一页" next-text="下一页" @on-change="changePage"  show-elevator show-total></Page>
                </div>
            </div>
        </Row>

        <Modal
                v-model="form_customer.status"
                :title="form_customer._id ? '编辑客户' : '添加客户'"
                :mask-closable="false"
                class-name="vertical-center-modal"
                width="600"
        >
            <Form ref="form_customer" :model="form_customer" :rules="rule_customer" :label-width="120">
                <FormItem label="公司名称" prop="company_name">
                    <Input v-model="form_customer.company_name" placeholder="请输入公司名称"></Input>
                </FormItem>
                <FormItem label="联系人" prop="contact_name">
                    <Input v-model="form_customer.contact_name" placeholder="请输入联系人姓名"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="email">
                    <Input v-model="form_customer.email" placeholder="请输入邮箱"></Input>
                </FormItem>
                <FormItem label="电话" prop="phone">
                    <Input v-model="form_customer.phone" placeholder="请输入电话"></Input>
                </FormItem>
                <FormItem label="地址" prop="address">
                    <Input v-model="form_customer.address" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入地址"></Input>
                </FormItem>
                <FormItem label="信用评级" prop="credit_rating">
                    <Rate v-model="form_customer.credit_rating" allow-half :max="5"></Rate>
                    <span style="margin-left: 10px; color: #999;">{{ form_customer.credit_rating }} 星</span>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model="form_customer.remark" type="textarea" :autosize="{minRows: 2,maxRows: 3}" placeholder="请输入备注"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click=" form_customer.status = false;  $refs['form_customer'].resetFields() ">取消</Button>
                <Button type="primary" size="large" @click=" sure_create('form_customer')">确定</Button>
            </div>
        </Modal>

        <Modal
                v-model="orderModal.visible"
                :title="`客户订单记录 - ${orderModal.customer_name}`"
                :mask-closable="false"
                width="900"
        >
            <Table border stripe :loading="orderModal.loading" :columns="orderTableHead" :data="orderModal.list">
                <template slot-scope="{ row }" slot="createAt">
                    {{ moment(row.createAt).format("YYYY-MM-DD HH:mm") }}
                </template>
                <template slot-scope="{ row }" slot="status">
                    <template v-if=" row.data.status == 0 ">
                        <span>New inquiry</span>
                    </template>
                    <template v-else-if=" row.data.status == 1 ">
                        <span>Shipping quoted</span>
                    </template>
                    <template v-else-if=" row.data.status == 2 ">
                        <span>Shipping confirmed</span>
                    </template>
                    <template v-else-if=" row.data.status == 3 ">
                        <span>Items Collected</span>
                    </template>
                    <template v-else-if=" row.data.status == 4 ">
                        <span>Shipment Dispatched</span>
                    </template>
                    <template v-else-if=" row.data.status == 5 ">
                        <span>POD Sent</span>
                    </template>
                </template>
                <template slot-scope="{ row }" slot="paimai_name">
                    {{ row.data.paimai_name }}
                </template>
                <template slot-scope="{ row }" slot="total">
                    {{ row.data.total || '-' }}
                </template>
            </Table>
            <div slot="footer">
                <Button type="primary" size="large" @click=" orderModal.visible = false ">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                loading: true,
                form_search: {
                    search_value: ''
                },
                form_customer: {
                    status: false,
                    _id: '',
                    company_name: '',
                    contact_name: '',
                    email: '',
                    phone: '',
                    address: '',
                    credit_rating: 3,
                    remark: ''
                },
                rule_customer: {
                    company_name: [
                        {required: true, message: '公司名称不能为空', trigger: 'blur'}
                    ],
                    contact_name: [
                        {required: true, message: '联系人不能为空', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '邮箱不能为空', trigger: 'blur'},
                        {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
                    ]
                },
                tableHead: [
                    {
                        title: '公司名称',
                        key: 'company_name',
                        align: 'center',
                        slot: 'company_name',
                        minWidth: 150
                    },
                    {
                        title: '联系人',
                        key: 'contact_name',
                        align: 'center',
                        slot: 'contact_name',
                        width: 100
                    },
                    {
                        title: '邮箱',
                        key: 'email',
                        align: 'center',
                        slot: 'email',
                        minWidth: 180
                    },
                    {
                        title: '电话',
                        key: 'phone',
                        align: 'center',
                        slot: 'phone',
                        width: 120
                    },
                    {
                        title: '信用评级',
                        key: 'credit_rating',
                        align: 'center',
                        slot: 'credit_rating',
                        width: 120
                    },
                    {
                        title: '历史订单数',
                        key: 'total_orders',
                        align: 'center',
                        slot: 'total_orders',
                        width: 110
                    },
                    {
                        title: '累计金额',
                        key: 'total_amount',
                        align: 'center',
                        slot: 'total_amount',
                        width: 110
                    },
                    {
                        title: '更新时间',
                        key: 'updateAt',
                        align: 'center',
                        slot: 'updateAt',
                        width: 160
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 220
                    }
                ],
                tableData: [],
                total: 0,
                page: 1,
                orderModal: {
                    visible: false,
                    loading: false,
                    customer_name: '',
                    list: []
                },
                orderTableHead: [
                    {
                        title: '订单ID',
                        key: '_id',
                        align: 'center',
                        minWidth: 200
                    },
                    {
                        title: '拍卖行',
                        key: 'paimai_name',
                        align: 'center',
                        slot: 'paimai_name',
                        minWidth: 150
                    },
                    {
                        title: '状态',
                        key: 'status',
                        align: 'center',
                        slot: 'status',
                        width: 140
                    },
                    {
                        title: '总金额',
                        key: 'total',
                        align: 'center',
                        slot: 'total',
                        width: 100
                    },
                    {
                        title: '创建时间',
                        key: 'createAt',
                        align: 'center',
                        slot: 'createAt',
                        width: 160
                    }
                ]
            }
        },
        mounted(){
            this.get_data();
        },
        methods: {
            openModal(row) {
                this.form_customer.status = true;
                if (row) {
                    this.form_customer._id = row._id;
                    this.form_customer.company_name = row.company_name;
                    this.form_customer.contact_name = row.contact_name;
                    this.form_customer.email = row.email;
                    this.form_customer.phone = row.phone || '';
                    this.form_customer.address = row.address || '';
                    this.form_customer.credit_rating = row.credit_rating || 3;
                    this.form_customer.remark = row.remark || '';
                } else {
                    this.$refs['form_customer'].resetFields();
                    this.form_customer._id = '';
                    this.form_customer.credit_rating = 3;
                }
            },
            viewOrders(row) {
                this.orderModal.visible = true;
                this.orderModal.loading = true;
                this.orderModal.customer_name = row.company_name;
                this.Ajax.get(API_URL.get_customer_detail, {
                    params: {
                        _id: row._id
                    }
                }).then((ret) => {
                    this.orderModal.loading = false;
                    if (ret && ret.DATA) {
                        this.orderModal.list = ret.DATA.orders || [];
                    }
                }).catch(() => {
                    this.orderModal.loading = false;
                    this.$Message.error("获取订单记录失败");
                })
            },
            sure_create(ref_name){
                this.$refs[ref_name].validate((valid) => {
                    if (valid) {
                        let api = this.form_customer._id ? API_URL.update_customer : API_URL.create_customer;
                        this.Ajax.post(api, this.form_customer).then( (res)=> {
                            if(res){
                                this.$Message.success(this.form_customer._id ? '更新成功!' : '创建成功!');
                                this.$refs[ref_name].resetFields();
                                this.form_customer.status = false;
                                this.get_data();
                            }
                        })
                    } else {
                        this.$Message.error('表单校验失败,请检查');
                    }
                })
            },
            get_data(){
                this.loading = true;
                this.Ajax.get(API_URL.get_customer_list,{
                    params:{
                        page: this.page,
                        search_value: this.form_search.search_value
                    }
                }).then( (ret)=> {
                    this.loading = false;
                    if(ret){
                        this.total =  ret.ALL_SUM;
                        this.tableData =  ret.DATA;
                    }
                    this.loading = false;
                }).catch( ()=>{
                    this.$Message.error("请重新登录");
                    this.$router.push({name:'login'})
                })
            },
            changePage(page) {
                this.page = page;
                this.get_data()
            },
            sure_del_item(row,index){
                this.Ajax.post(API_URL.del_customer,{
                    _id: row._id
                }).then( (res)=> {
                    if(res){
                        this.$Message.success('删除成功!');
                        this.total--;
                        this.tableData.splice(index,1)
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
</style>
