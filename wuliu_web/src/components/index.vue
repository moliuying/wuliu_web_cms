<style scoped>

    body{
        margin: 0;
    }
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        /*overflow: hidden;*/
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-nav{
        /*width: 420px;*/
        margin: 0 auto;
        margin-right: 20px;
    }

    .ivu-layout-header {
        padding: 0 0 0 50px;
    }

    .layout-logo {
         width: auto;
        height: 30px;
        background: none;
        line-height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
        font-size: 20px;
        color: #fff;
    }
    .layout,.ivu-layout{
        height: 100%;
    }
    .ivu-layout-sider{
        background: #515a6e  !important;
    }


    .layout-con{
        height: 100%;
        width: 100%;
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 120px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }

</style>
<template>
    <div class="layout" >
        <Layout>
            <Header style=" background: #242f42; ">
                <Menu mode="horizontal" theme="dark" style=" background: #242f42;" @on-select=" header_menu_select ">
                    <div class="layout-logo">
                        艺术物流 管理系统
                    </div>
                    <div class="layout-nav" style="float: right; ">
                        <Submenu name="user"  >
                            <template slot="title">
                                <Icon type="md-person" />
                                欢迎您,{{ username }}
                            </template>
                            <MenuItem name="user_loginout">
                                退出登录
                            </MenuItem>
                        </Submenu>
                    </div>
                </Menu>
            </Header>
            <Layout>
<!--                <Sider collapsible :collapsed-width="78" v-model="isCollapsed">-->
<!--                    <Menu :active-name="refuse_path" ref="left" theme="dark" width="auto" :class="menuitemClasses" @on-select=" menu_select ">-->
<!--                        <MenuItem v-for=" (item,index) in menuitem_lists"  :name="item.router_name">-->
<!--                            <Icon :type="item.icon"></Icon>-->
<!--                            <span>{{ item.text }}</span>-->
<!--                        </MenuItem>-->
<!--                    </Menu>-->
<!--                </Sider>-->
                <Layout :style="{padding: '0 15px 15px'}">
<!--                    <Breadcrumb :style="{margin: '5px 0'}">-->
<!--                        <BreadcrumbItem>主页</BreadcrumbItem>-->
<!--                        <BreadcrumbItem v-for="item in $route.meta">-->
<!--                            <template v-if=" item == '盘管控制' ">-->
<!--                                {{ p_name }}-->
<!--                            </template>-->
<!--                            <template v-else>-->
<!--                                {{ item }}-->
<!--                            </template>-->
<!--                        </BreadcrumbItem>-->
<!--                    </Breadcrumb>-->
                    <Content :style="{padding: '5px',  background: '#fff', paddingBottom: '300px'}">
                        <keep-alive>
                            <router-view v-if="$route.meta.keepAlive"></router-view>
                        </keep-alive>
                        <router-view v-if="!$route.meta.keepAlive"></router-view>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    </div>
</template>
<script>
    import { mapState,mapActions } from 'vuex'
    export default {
        data () {
            return {
                isCollapsed: false,
                menuitem_lists: [
                    {
                        icon:"ios-navigate",
                        text:"新订单",
                        router_name:"new"
                    },
                    {
                        icon:"ios-navigate",
                        text:"已报价",
                        router_name:"template"
                    },
                    {
                        icon:"ios-navigate",
                        text:"客户确认报价",
                        router_name:"share"
                    },
                    {
                        icon:"ios-navigate",
                        text:"已提货",
                        router_name:"public_question"
                    },
                    {
                        icon:"ios-navigate",
                        text:"已送货",
                        router_name:"my_question"
                    }
                ],
                username:localStorage.getItem('username'),
                form_change_pwd:{
                    status: false,
                    old_pwd:"",
                    new_pwd:""
                },
                rule_change_pwd:{
                    old_pwd: [
                        { required: true, message: '原密码不能为空', trigger: 'blur' },
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ],
                    new_pwd: [
                        { required: true, message: '新密码不能为空', trigger: 'blur' },
                        {type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur'}
                    ]
                }
            };
        },
        watch: {
            '$route'(to,from){
                localStorage.setItem('refuse_path',to.path.substr(1).split('/')[0]);
                this.$store.commit('get_refuse_path');
            }
        },
        computed: {
            ...mapState(["p_name","refuse_path"]),
            menuitemClasses: function () {
                return [
                    'menu-item',
                    this.isCollapsed ? 'collapsed-menu' : ''
                ]
            }
        },
        mounted(){
            if(!this.username){
                this.$router.push(
                    {
                        path:"/login",
                        params: {  }
                    }
                )
            }
        },
        methods:{
            // ...mapActions([
            //     'test'
            // ]),
            change_pwd_ok(ref_name){
                this.$refs[ref_name].validate((valid) => {
                    if (valid) {
                        //    执行创建方法
                        this.Ajax.post(API_URL.change_pwd,this.form_change_pwd).then( (res)=> {
                            if(res){
                                this.$Message.success('修改成功');
                                this.$refs[ref_name].resetFields();
                                this.form_change_pwd.status = false;
                            }
                        })
                    } else {
                        this.$Message.error('表单校验失败,请检查');
                    }
                })
            },
            header_menu_select(name){
                if(name == 'user_loginout'){
                    localStorage.removeItem("username")
                    this.$router.push(
                        {
                            path:"/login",
                            params: { userId: 123 }
                        }
                    )
                }else if(name == 'user_info'){
                    this.$router.push(
                        {
                            path:"/user_info",
                            params: { userId: 123 }
                        }
                    )
                }else if(name == 'change_pwd'){
                    this.form_change_pwd.status = true;
                    this.$refs['form_change_pwd'].resetFields();
                }
            },
            menu_select(name){
                console.log(this.$route);
                if(document.getElementsByClassName("blocklyWidgetDiv")[0]){
                    document.getElementsByClassName("blocklyWidgetDiv")[0].style.display = 'none'
                }
                if(this.$route.name =='project_detail'){
                    this.$Modal.confirm({
                        title: '温馨提示',
                        okText: '直接离开',
                        cancelText: '回去保存',
                        content: '<p>是否保存当前编辑的项目</p>',
                        onOk: () => {
                            // this.$Message.info('Clicked ok');
                            this.$router.push(
                                {
                                    path:"/" + name,
                                    params: { userId: 123 }
                                }
                            )
                        },
                        onCancel: () => {

                        }
                    });
                }else{
                    this.$router.push(
                        {
                            path:"/" + name,
                            params: { userId: 123 }
                        }
                    )
                }

            }
        }
    }
</script>
