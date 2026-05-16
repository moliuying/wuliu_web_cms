<template>
    <div style="height: 100%;">
        <div style=" margin-top: 15px;">
            <Form ref="form_search"  inline  :label-width="80" label-position="left" style="overflow: hidden;">
                <FormItem style="float: right;">
                    <Button type="info" @click=" $router.push({name:'list'}) ">返回主页</Button>
                </FormItem>
                <FormItem style="float: right;">
                    <Button type="primary" @click=" form_reciever.status = true; ">添加新客户</Button>
                </FormItem>
            </Form>
        </div>
        <Row style="height: 100%;">
            <Table  border stripe :loading="loading" :columns="tableHead" :data="tableData">
                <template slot-scope="{ row }" slot="updateAt">
                    {{  moment(row.updateAt).format("YYYY-MM-DD HH:mm")  }}
                </template>
                <template slot-scope="{ row }" slot="status">
                    <template v-if=" row.data.status == 0 ">
                        New inquiry
                    </template>
                    <template v-else-if=" row.data.status == 1 ">
                        Shipping quoted
                    </template>
                    <template v-else-if=" row.data.status == 2 ">
                        Shipping confirmed
                    </template>
                    <template v-else-if=" row.data.status == 3 ">
                        Items Collected
                    </template>
                    <template v-else-if=" row.data.status == 4 ">
                        Shipment Dispatched
                    </template>
                    <template v-else-if=" row.data.status == 5 ">
                        POD Sent
                    </template>
                </template>
                <template slot-scope="{ row }" slot="vat_refund">
                    <Checkbox v-model=" row.data.vat_refund " size="large"></Checkbox>
                </template>
                <template slot-scope="{ row, index }" slot="action">
                    <Poptip
                            :transfer="true"
                            confirm
                            title="是否确定删除该收件人"
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


        <!--创建-->
        <Modal
                v-model="form_reciever.status"
                title="添加收件人"
                :mask-closable="false"
                class-name="vertical-center-modal"
        >
            <Form ref="form_reciever" :model="form_reciever" :rules="rule_reciever" :label-width="120">
                <FormItem label="收件⼈姓名" prop="shoujian_name">
                    <Input v-model="form_reciever.shoujian_name" placeholder="请输入收件⼈姓名"></Input>
                </FormItem>
                <FormItem label="收件⼈手机" prop="shoujian_cellphone">
                    <Input v-model="form_reciever.shoujian_cellphone" placeholder="请输入收件⼈手机"></Input>
                </FormItem>
                <FormItem label="收件⼈地址" prop="shoujian_address">
                    <Input v-model="form_reciever.shoujian_address" placeholder="请输入收件⼈地址"></Input>
                </FormItem>
                <FormItem label="收件⼈邮编" prop="shoujian_youbian">
                    <Input v-model="form_reciever.shoujian_youbian" placeholder="请输入收件⼈邮编"></Input>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="text" size="large" @click=" form_reciever.status = false;  $refs['form_reciever'].resetFields() ">取消</Button>
                <Button type="primary" size="large" @click=" sure_create('form_reciever')">确定</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'
    export default {
        data() {
            return {
                loading: true,

                form_reciever: {
                    status: false,
                    shoujian_name:'',
                    shoujian_cellphone:'',
                    shoujian_address:'',
                    shoujian_youbian:'',
                },
                rule_reciever: {
                    shoujian_name: [
                        {required: true, message: '收件⼈名称不能为空', trigger: 'blur'}
                    ],
                    shoujian_cellphone: [
                        {required: true, message: '收件⼈手机不能为空', trigger: 'blur'}
                    ],
                    shoujian_address: [
                        {required: true, message: '收件⼈地址不能为空', trigger: 'blur'}
                    ],
                    shoujian_youbian: [
                        {required: true, message: '收件⼈邮编不能为空', trigger: 'blur'}
                    ],
                },
                tableHead: [
                    {
                        title: '收件人姓名',
                        key: 'shoujian_name',
                        align: 'center'
                    },
                    {
                        title: '收件人手机',
                        key: 'shoujian_cellphone',
                        align: 'center'
                    },{
                        title: '收件人地址',
                        key: 'shoujian_address',
                        align: 'center'
                    },{
                        title: '收件人邮编',
                        key: 'shoujian_youbian',
                        align: 'center'
                    },
                    {
                        title: '添加时间',
                        key: 'updateAt',
                        align: 'center',
                        slot: 'updateAt'
                    },
                    {
                        title: '操作',
                        align: 'center',
                        slot: 'action',
                        width: 200
                    }
                ],
                tableData: [

                ],
                total: 0,
                page: 1
            }
        },
        mounted(){
            this.get_data();
        },
        methods: {
            sure_create(ref_name){
                this.$refs[ref_name].validate((valid) => {
                    if (valid) {
                           // 执行创建方法
                        this.Ajax.post(API_URL.create_reciver,this.form_reciever).then( (res)=> {
                            if(res){
                                this.$Message.success('创建成功!');
                                this.$refs[ref_name].resetFields();
                                this[ref_name].status = false;
                                this.get_data();
                            }
                        })
                    } else {
                        this.$Message.error('表单校验失败,请检查');
                    }
                })
            },
            get_data(){
                // get_list
                this.loading = true;
                this.Ajax.get(API_URL.get_reciver_list,{
                    params:{
                        page: this.page,
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
            //删除新项目
            sure_del_item(row,index){
                //    执行删除方法
                this.Ajax.post(API_URL.del_reciver,{
                    _id: row._id
                }).then( (res)=> {
                    if(res){
                        this.$Message.success('删除成功!');
                        this.total--;
                        this.tableData.splice(index,1)
                    }
                })
            },
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
