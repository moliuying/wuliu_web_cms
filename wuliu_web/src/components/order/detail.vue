<template>
    <div style="height: 100%;">
        <div v-if="lock_info.is_locked && !is_locked_by_me" style="background: #fff3cd; padding: 10px 20px; margin-bottom: 10px; border: 1px solid #ffeeba; border-radius: 4px;">
            <Icon type="ios-lock" size="20" style="color: #856404; margin-right: 10px;"></Icon>
            <span style="color: #856404; font-weight: bold;">只读模式 - 当前由 {{ lock_info.locked_by_name }} 编辑中 ({{ formatLockTime(lock_info.locked_at) }})</span>
        </div>
        <div v-else-if="is_locked_by_me" style="background: #d4edda; padding: 10px 20px; margin-bottom: 10px; border: 1px solid #c3e6cb; border-radius: 4px;">
            <Icon type="ios-unlock" size="20" style="color: #155724; margin-right: 10px;"></Icon>
            <span style="color: #155724; font-weight: bold;">编辑模式 - 您已锁定此订单</span>
        </div>
        <div style="margin-bottom: 5px;">
            <Form ref="form_search" inline>
                <FormItem>
                    <Button type="success" style="margin: 0 5px;" @click=" submit(0) " :disabled="is_readonly">New inquiry</Button>
                    <Button type="success" style="margin: 0 5px;" @click="  submit(1) " :disabled="is_readonly">Shipping quoted</Button>
                    <Button type="success" style="margin: 0 5px;" @click="  submit(2) " :disabled="is_readonly">Shipping confirmed</Button>
                    <Button type="success" style="margin: 0 5px;" @click="  submit(3) " :disabled="is_readonly">Items Collected</Button>
                    <Button type="success" style="margin: 0 5px;" @click="  submit(4) " :disabled="is_readonly">Shipment Dispatched</Button>
                    <Button type="success" style="margin: 0 5px;" @click="  submit(5) " :disabled="is_readonly">POD Sent</Button>
                </FormItem>
                <FormItem style="float: right;">
                    <Button type="info" @click=" handleBack ">返回主页</Button>
                </FormItem>
            </Form>
        </div>
        <Row style="height: 100%;">
            <Col span="24">
                <Form ref="formValidate" :model="form_data" :rules="rule_data" :label-width="240">
                    <FormItem label="订单优先级 - order priority" prop="priority">
                        <Select v-model="form_data.priority" :disabled="is_readonly" style="width: 200px;">
                            <Option :value="2">紧急</Option>
                            <Option :value="1">高</Option>
                            <Option :value="0">普通</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="订单备注 - order remark" prop="shipping_method">
                        <Input v-model=" form_data.order_mark " type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                               placeholder="Enter order remark" :disabled="is_readonly"></Input>
                    </FormItem>
                    <FormItem label="发票号码 - invoice  nmuber" prop="shipping_method">
                        <Input v-model=" form_data.invoice_nmuber " placeholder="Enter invoice  nmuber" style="width: 100%;" :disabled="is_readonly" />
                    </FormItem>
                </Form>
            </Col>
            <Col span="12" style="padding: 15px; ">
                <div style=" border: 1px solid #ccc; padding: 15px;">
                    <div class="title">
                        Shipping request 物流询价信息
                    </div>
                    <Form ref="formValidate" :model="form_data" :rules="rule_data" :label-width="240">
                        <Upload
                                :before-upload=" export_pic "
                                :on-success=" upfile_success "
                                :data=" { key:'fspiao_file_url' }"
                                :show-upload-list=false
                                type="drag"
                                :disabled="is_readonly"
                                :action=" action_url ">
                            <div style="padding: 20px 0">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>上传发票</p>
                            </div>
                        </Upload>
                        <div style="padding: 20px 0; text-align: center; cursor: pointer;">
                            <template
                                    v-if=" form_data.fspiao_file_url && (form_data.fspiao_file_url.toUpperCase().indexOf( 'JPG' ) > -1 || form_data.fspiao_file_url.toUpperCase().indexOf( 'JPEG' ) > -1 || form_data.fspiao_file_url.toUpperCase().indexOf( 'PNG' ) > -1)  ">
                                <img style="max-height: 200px;" :src=" form_data.fspiao_file_url " alt="">
                            </template>
                            <template v-else>
                                <div>
                                    <a @click.stop=" oepn_link(form_data.fspiao_file_url) ">
                                        {{ form_data.fspiao_file_url }}
                                    </a>
                                </div>
                            </template>
                        </div>
                        <FormItem label="Auction Name - 拍卖行名称" prop="paimai_name">
                            <Input v-model="form_data.paimai_name" placeholder="Enter Auction Name" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label="Auctions Date-拍卖日期" prop="paimai_date">
                            <template v-if=" (form_data.paimai_date).includes('Z') ">
                                <Input  v-model=" moment(form_data.paimai_date).format('YYYY-MM-DD')  "   placeholder="Select Auctions Date" :disabled="is_readonly" />
                            </template>
                            <template v-else >
                                <Input  v-model="  form_data.paimai_date  " placeholder="Select Auctions Date" :disabled="is_readonly" />
                            </template>
                        </FormItem>
                        <FormItem label="Invoice value-货值" prop="paimai_huozhi">
                            <InputNumber v-model="form_data.paimai_huozhi" :disabled="is_readonly"></InputNumber>
                        </FormItem>
                        <FormItem label=" Shipping method-指定运输方式" prop="yushu">
                            <Input v-model="form_data.yushu" placeholder="Enter Shipping method" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label="Insurance-保险" prop="baoxian">
                            <Input v-model="form_data.baoxian" placeholder="Enter  Insurance" :disabled="is_readonly"></Input>
                        </FormItem>

                        <FormItem label="Receiver selsect-选择收件人信息">
                            <Select :clearable="true" placeholder="Select Receiver"
                                    @on-change=" change_receive_select  " :disabled="is_readonly">
                                <Option v-for="item in receive_list" :value="JSON.stringify(item)" :key="item._id">
                                    {{ item.shoujian_name }}_{{ item.shoujian_cellphone }}
                                </Option>
                            </Select>
                        </FormItem>

                        <FormItem label="Receiver Name-收件⼈姓名" prop="shoujian_name">
                            <Input v-model="form_data.shoujian_name" placeholder="" disabled></Input>
                        </FormItem>
                        <FormItem label="Reciever Phone number-收件⼈⼿机" prop="shoujian_cellphone">
                            <Input v-model="form_data.shoujian_cellphone" placeholder="" disabled></Input>
                        </FormItem>
                        <FormItem label="Reciever Address - 收件⼈地址" prop="shoujian_address">
                            <Input v-model="form_data.shoujian_address" placeholder="" disabled></Input>
                        </FormItem>
                        <FormItem label="Reciever Postcode - 收件⼈邮编" prop="shoujian_youbian">
                            <Input v-model="form_data.shoujian_youbian" placeholder="" disabled></Input>
                        </FormItem>


                        <FormItem label="other requirement - 其他需求" prop="other">
                            <Input v-model="form_data.other" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                   placeholder="Enter other requirement..." :disabled="is_readonly"></Input>
                        </FormItem>
                    </Form>

                    <div class="title">
                        Quote 报价信息
                    </div>
                    <Form ref="formValidate" :model="form_data" :rules="rule_data" :label-width="240">
                        <FormItem label="Shipping method - 运输方式" prop="shipping_method">
                            <Input v-model="form_data.shipping_method" placeholder="Enter Shipping method" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label="Packing method - 包装方式" prop="packing_method">
                            <Input v-model="form_data.packing_method" placeholder="Enter Packing method" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label="VAT Refund Required-需要退 VAT" prop="vat_refund">
                            <Checkbox v-model="form_data.vat_refund" size="large" :disabled="is_readonly">

                            </Checkbox>
                        </FormItem>
                        <FormItem label="Insurance fee - 保险费⽤" prop="insurance_fee">
                            <Input v-model="form_data.insurance_fee" placeholder="Enter Insurance fee" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label="Delivery Fee w/o insurance - 运费(不含保险)" prop="delivery_fee">
                            <Input v-model="form_data.delivery_fee" placeholder="Enter Delivery Fee w" :disabled="is_readonly"></Input>
                        </FormItem>

                        <FormItem label=" Total - 总费⽤ " prop="total">
                            <Input v-model="form_data.total" placeholder="Enter Total" :disabled="is_readonly"></Input>
                        </FormItem>
                    </Form>

                    <div class="title">
                        Payment ⽀付信息
                    </div>
                    <Form ref="formValidate" :model="form_data" :rules="rule_data" :label-width="240">
                        <FormItem label="Paid Amount – 已付款金额" prop="pay_amount">
                            <InputNumber v-model="form_data.pay_amount" :disabled="is_readonly"></InputNumber>
                        </FormItem>
                        <FormItem label="Payment method – 付款方式" prop="pay_method">
                            <Input v-model="form_data.pay_method" placeholder="Enter Payment method" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label=" Payment date – 付款日期" prop="date">
                            <DatePicker type="date" v-model="form_data.pay_date" placeholder="Select date" :disabled="is_readonly"></DatePicker>
                        </FormItem>
                    </Form>
                    <div class="title">
                        Order Change Record 订单变更记录
                    </div>
                    <Timeline v-if="statusList.length">
                        <template v-for="(item,index) in statusList">
                            <template v-if="index == 0">
                                <TimelineItem color="green">
                                    <template #dot>
                                        <Icon type="ios-trophy"></Icon>
                                    </template>
                                    <span>{{  status_map[item.status]}}  --  {{ moment(item.createAt).utcOffset(0).format("YYYY-MM-DD HH:mm") }}</span>
                                </TimelineItem>
                            </template>
                            <template v-else>
                                <TimelineItem>{{  status_map[item.status]}} --- {{ moment(item.createAt).utcOffset(0).format("YYYY-MM-DD HH:mm") }}</TimelineItem>
                            </template>
                        </template>
<!--                        <TimelineItem color="green">-->
<!--                            <template #dot>-->
<!--                                <Icon type="ios-trophy"></Icon>-->
<!--                            </template>-->
<!--                            <span>发布里程碑版本</span>-->
<!--                        </TimelineItem>-->
<!--                        <TimelineItem>发布1.0版本</TimelineItem>-->
<!--                        <TimelineItem>发布2.0版本</TimelineItem>-->
<!--                        <TimelineItem>发布3.0版本</TimelineItem>-->
                    </Timeline>
                    <div v-else>
                        暂无变更日志
                    </div>

                    <div class="title" style="margin-top: 20px;">
                        Auxiliary documentation  -  辅助文件记录
                    </div>
                    <Form :label-width="240">
                        <template v-for="(item,index) in form_data.markFiles">
                            <div style="border: 1px solid #00acc1; padding: 5px; margin-top: 15px; position: relative;">
                                <Icon v-if="!is_readonly" type="md-close" class="close" @click=" form_data.markFiles.splice(index,1) "/>
                                <!--                                <FormItem label="Picture - 产品图⽚" >-->
                                <Upload
                                        v-if="!item.url && !is_readonly"
                                        :before-upload=" export_pic "
                                        :on-success=" upfile_success2 "
                                        :data=" { key: index }"
                                        :show-upload-list=false
                                        type="drag"
                                        :disabled="is_readonly"
                                        :action=" action_url ">
                                    <div style="padding: 20px 0">
                                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                        <p>上传备注文件</p>
                                        <!--                                            <template  v-if=" item.picture &&  ['JPG','JPEG','PNG'].includes( item.picture.toUpperCase() ) ">-->

                                    </div>
                                </Upload>
                                <div v-else style="padding: 20px 0; text-align: center; cursor: pointer;">
                                    <a @click.stop=" oepn_link(item.url) ">
                                        {{ item.url }}
                                    </a>
                                </div>
                                <FormItem label="Description - 备注文件说明" style="margin-top: 10px;">
                                    <Input v-model=" item.desc " type="textarea" :autosize="{minRows: 5,maxRows: 5}"
                                           placeholder="Enter Description" :disabled="is_readonly"></Input>
                                    <!--                                    <Input v-model="item.desc" placeholder="Enter Description"></Input>-->
                                </FormItem>
                            </div>
                        </template>
                    </Form>
                    <div style="text-align: center; padding: 10px 0;">
                        <Button type="primary" @click=" add_one_mark " :disabled="is_readonly"> add one NotesFile</Button>
                    </div>
                </div>


            </Col>
            <Col span="12" style="padding: 15px; ">
                <div style=" border: 1px solid #ccc; padding:15px;">
                    <div class="title">
                        Order Details 订单信息
                    </div>
                    <Form ref="formValidate" :model="form_data" :rules="rule_data" :label-width="240">
                        <FormItem label="Client Name - 客户名称" prop="kehu_name">
                            <Input v-model="form_data.kehu_name" placeholder="Enter Client Name" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label="Job ID - 订单编号" prop="dingdan_num" v-if="form_data._id">
                            <Input v-model="form_data._id" placeholder="Enter Job ID" disabled></Input>
                        </FormItem>
<!--                        {{form_data.lots}}-->
                        <template v-for="(item,index) in form_data.lots">
                            <div style="border: 1px solid #00acc1; padding: 5px; margin-top: 15px; position: relative;">
                                <Icon v-if="!is_readonly" type="md-close" class="close" @click=" form_data.lots.splice(index,1) "/>
                                <FormItem label=" LOT Number ">
                                    <Input v-model="item.num" placeholder="Enter LOT Number" :disabled="is_readonly"></Input>
                                </FormItem>
                                <FormItem label=" URL ">
                                    <Input v-model="item.url" placeholder="Enter URL" :disabled="is_readonly"></Input>
                                </FormItem>
                                <!--                                <FormItem label="Picture - 产品图⽚" >-->
                                <Upload
                                        :before-upload=" export_pic "
                                        :on-success=" upfile_success "
                                        :data=" { key: index }"
                                        :show-upload-list=false
                                        type="drag"
                                        :disabled="is_readonly"
                                        :action=" action_url ">
                                    <div style="padding: 20px 0">
                                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                        <p>上传产品图片</p>
                                        <!--                                            <template  v-if=" item.picture &&  ['JPG','JPEG','PNG'].includes( item.picture.toUpperCase() ) ">-->

                                    </div>
                                </Upload>
                                <!--                                    <Input v-model="item.picture" placeholder="Enter Picture"></Input>-->
                                <!--                                </FormItem>-->


                                <div style="padding: 20px 0; text-align: center; cursor: pointer;">
                                    <div v-if="typeof item.picture === 'string'">
                                        <template
                                                v-if=" item.picture && (item.picture.toUpperCase().indexOf( 'JPG' ) > -1 || item.picture.toUpperCase().indexOf( 'JPEG' ) > -1 || item.picture.toUpperCase().indexOf( 'PNG' ) > -1)  ">
                                            <img style="max-height: 200px;" :src=" item.picture " alt="">
                                        </template>
                                        <template v-else>
                                            <a @click.stop=" oepn_link(item.picture) ">
                                                {{ item.picture }}
                                            </a>
                                        </template>
                                    </div>
                                    <div v-else>
                                        <div v-for="(pic,picIndex) in item.picture" style="display: flex; min-height: 40px; margin-bottom: 10px; border:1px solid #3370ff; position: relative; justify-content: center; align-items: center;" >
                                            <!--                                            图片{{pIndex+1}}-->
                                            <template
                                                    v-if=" pic && (pic.toUpperCase().indexOf( 'JPG' ) > -1 || pic.toUpperCase().indexOf( 'JPEG' ) > -1 || pic.toUpperCase().indexOf( 'PNG' ) > -1)  ">
                                                <img style="max-height: 200px;" :src=" pic " alt=""> <br>
                                            </template>
                                            <template v-else>
                                                <a @click.stop=" oepn_link(pic) ">
                                                    {{ pic }}
                                                </a>
                                            </template>
                                            <Icon v-if="!is_readonly" type="md-close" class="close" style="top: 10px; right: 20px; font-size: 20px; color: orangered;" @click=" form_data.lots[index].picture.splice(picIndex,1) "/>
                                        </div>
                                    </div>
                                </div>

                                <FormItem label="Description - 产品详细描述">

                                    <Input v-model=" item.desc " type="textarea" :autosize="{minRows: 5,maxRows: 5}"
                                           placeholder="Enter Description" :disabled="is_readonly"></Input>
                                    <!--                                    <Input v-model="item.desc" placeholder="Enter Description"></Input>-->
                                </FormItem>
                            </div>
                        </template>
                        <div style="text-align: center; padding: 10px 0;">
                            <Button type="primary" @click=" add_one_lot " :disabled="is_readonly"> add one LOT</Button>
                        </div>

                        <FormItem label="  T/A ENTRY CODE " prop="codee">
                            <Input v-model="form_data.codee" placeholder="Enter T/A ENTRY CODEE" :disabled="is_readonly"></Input>
                        </FormItem>
                        <!--                        <FormItem label=" Export Permit - 出⼝许可证 " prop="aaa">-->
                        <!--                            -->
                        <!--                        </FormItem>-->
                        <Upload
                                :before-upload=" export_pic "
                                :on-success=" upfile_success "
                                :data=" { key:'chukou_file_url' } "
                                :show-upload-list=false
                                type="drag"
                                :disabled="is_readonly"
                                :action=" action_url ">
                            <div style="padding: 20px 0">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>上传出⼝许可证</p>
                                <!--                                <template  v-if=" form_data.chukou_file_url && ['JPG','JPEG','PNG'].includes( form_data.chukou_file_url.toUpperCase() ) ">-->


                                <!--                                <template  v-else>-->
                                <!--                                    {{ form_data.chukou_file_url }}-->
                                <!--                                </template>-->
                            </div>
                        </Upload>

                        <div style="padding: 20px 0; text-align: center; cursor: pointer;">
                            <template
                                    v-if=" form_data.chukou_file_url && (form_data.chukou_file_url.toUpperCase().indexOf( 'JPG' ) > -1 || form_data.chukou_file_url.toUpperCase().indexOf( 'JPEG' ) > -1 || form_data.chukou_file_url.toUpperCase().indexOf( 'PNG' ) > -1)  ">
                                <img style="max-height: 200px;" :src=" form_data.chukou_file_url " alt="">
                            </template>

                            <template v-else>
                                <a @click.stop=" oepn_link(form_data.chukou_file_url) ">
                                    {{ form_data.chukou_file_url }}
                                </a>
                            </template>
                        </div>
                        <!--                        <FormItem label=" Export Permit - 出⼝许可证 " prop="aaa">-->
                        <!--                            <Input v-model="form_data" placeholder="Enter your aaa"></Input>-->
                        <!--                        </FormItem>-->
                        <FormItem label=" Picking Up Agency - 提货单位 " prop="tihuo_company">
                            <Input v-model="form_data.tihuo_company" placeholder="Enter Picking Up Agency" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label=" Storage Location - 仓储地点 " prop="cangchu_address">
                            <Input v-model="form_data.cangchu_address" placeholder="Enter Storage Location" :disabled="is_readonly"></Input>
                        </FormItem>
                    </Form>

                    <div class="title">
                        Delivery Information
                    </div>
                    <Form ref="formValidate" :model="form_data" :rules="rule_data" :label-width="240">
                        <FormItem label="Size&Packaging - 包装，货物件重尺" prop="Size">
                            重 W
                            <InputNumber v-model="form_data.weight" :disabled="is_readonly"></InputNumber>
                            KG <br>
                            <!--                            长 L <InputNumber  v-model="form_data.aaa"></InputNumber> CM <br>-->
                            <!--                            宽 W <InputNumber  v-model="form_data.aaa"></InputNumber> CM <br>-->
                            <!--                            高 H <InputNumber  v-model="form_data.aaa"></InputNumber> CM <br>-->
                        </FormItem>
                        <FormItem label="Size&Packaging - 包装，货物件重尺" prop="long">
                            长 L
                            <InputNumber v-model="form_data.long" :disabled="is_readonly"></InputNumber>
                            CM <br>
                        </FormItem>
                        <FormItem label="Size&Packaging - 包装，货物件重尺" prop="weight">
                            宽 W
                            <InputNumber v-model="form_data.width" :disabled="is_readonly"></InputNumber>
                            CM <br>
                        </FormItem>
                        <FormItem label="Size&Packaging - 包装，货物件重尺" prop="height">
                            高 H
                            <InputNumber v-model="form_data.height" :disabled="is_readonly"></InputNumber>
                            CM <br>
                        </FormItem>
                        <FormItem label=" Dispatch date-发货日期" prop="dispatch_date">
                            <DatePicker type="date" v-model="form_data.dispatch_date"
                                        placeholder="Select Dispatch date" :disabled="is_readonly"></DatePicker>
                        </FormItem>

                        <FormItem label="Carrier Name - 物流公司名称" prop="carrier_name">
                            <Input v-model="form_data.carrier_name" placeholder="Enter Carrier Name" :disabled="is_readonly"></Input>
                        </FormItem>
                        <FormItem label="Waybill Number-物流单号" prop="waybill_number">
                            <Input v-model="form_data.waybill_number" placeholder="Enter Waybill Number" :disabled="is_readonly"></Input>
                        </FormItem>
                        <!--                        <FormItem label=" Waybill & Invoice-物流文件" prop="aaa">-->
                        <!--                            <Input v-model="form_data.aaa" placeholder="Enter your aaa"></Input>-->
                        <!--                        </FormItem>-->
                        <Upload
                                :before-upload=" export_pic "
                                :on-success=" upfile_success "
                                :data=" {key:'waybill_file_url'} "
                                :show-upload-list=false
                                type="drag"
                                :disabled="is_readonly"
                                :action=" action_url ">
                            <div style="padding: 20px 0">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>上传物流文件</p>
                                <!--                                <template  v-if=" form_data.waybill_file_url && ['JPG','JPEG','PNG'].includes( form_data.waybill_file_url.toUpperCase() ) ">-->

                                <!--                                <template  v-else>-->
                                <!--                                    {{ form_data.waybill_file_url }}-->
                                <!--                                </template>-->
                            </div>
                        </Upload>

                        <div style="padding: 20px 0; text-align: center; cursor: pointer;">
                            <template
                                    v-if=" form_data.waybill_file_url && (form_data.waybill_file_url.toUpperCase().indexOf( 'JPG' ) > -1 || form_data.waybill_file_url.toUpperCase().indexOf( 'JPEG' ) > -1 || form_data.waybill_file_url.toUpperCase().indexOf( 'PNG' ) > -1)  ">
                                <img style="max-height: 200px;" :src=" form_data.waybill_file_url " alt="">
                            </template>
                            <template v-else>
                                <a @click.stop=" oepn_link(form_data.waybill_file_url) ">
                                    {{ form_data.waybill_file_url }}
                                </a>
                            </template>
                        </div>


                        <FormItem label="Delivery date-签收日期" prop="delivery_date">
                            <DatePicker type="date" v-model="form_data.delivery_date"
                                        placeholder="Delivery date" :disabled="is_readonly"></DatePicker>
                        </FormItem>
                        <FormItem label=" POD Submit Date -退税文件发送日期" prop="pod_submit_date">
                            <DatePicker type="date" v-model="form_data.pod_submit_date"
                                        placeholder="Select POD Submit Date" :disabled="is_readonly"></DatePicker>
                        </FormItem>
                        <Upload
                                :before-upload=" export_pic "
                                :on-success=" upfile_success "
                                :data=" { key:'pod_file_url' } "
                                :show-upload-list=false
                                type="drag"
                                :disabled="is_readonly"
                                :action=" action_url ">
                            <div style="padding: 20px 0">
                                <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                                <p>上传退税文件</p>
                                <!--                                <template  v-if=" form_data.pod_file_url && ['JPG','JPEG','PNG'].includes( form_data.pod_file_url.toUpperCase() ) ">-->

                                <!--                                <template  v-else>-->
                                <!--                                    {{ form_data.pod_file_url }}-->
                                <!--                                </template>-->
                            </div>
                        </Upload>


                        <div style="padding: 20px 0; text-align: center; cursor: pointer;">
                            <template
                                    v-if=" form_data.pod_file_url && (form_data.pod_file_url.toUpperCase().indexOf( 'JPG' ) > -1 || form_data.pod_file_url.toUpperCase().indexOf( 'JPEG' ) > -1 || form_data.pod_file_url.toUpperCase().indexOf( 'PNG' ) > -1)  ">
                                <img style="max-height: 200px;" :src=" form_data.pod_file_url " alt="">
                            </template>
                            <template v-else>
                                <a @click.stop=" oepn_link(form_data.pod_file_url) ">
                                    {{ form_data.pod_file_url }}
                                </a>
                            </template>
                        </div>
                    </Form>
                </div>
            </Col>


        </Row>
    </div>
</template>
<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
                status_map:[
                    'New inquiry',
                    'Shipping quoted',
                    'Shipping confirmed',
                    'Items Collected',
                    'Shipment Dispatched',
                    'POD Sent'
                ],
                statusList: [],
                lock_info: {
                    is_locked: false,
                    locked_by: null,
                    locked_by_name: '',
                    locked_at: null
                },
                is_readonly: false,
                is_locked_by_me: false,
                current_user_id: '',
                action_url: process.env.NODE_ENV == 'development' ? 'http://localhost:3333/index/upfile' : 'http://43.140.245.169:3333/index/upfile',
                form_search: {
                    value: ''
                },
                form_data: {
                    _id: '',
                    status: '',
                    priority: 0,
                    invoice_nmuber: null,
                    order_mark: '',
                    fspiao_file_url: '',
                    paimai_name: '',
                    paimai_date: '',
                    yushu: '',
                    baoxian: '',
                    shoujian_name: '',
                    shoujian_cellphone: '',
                    shoujian_address: '',
                    shoujian_youbian: '',
                    other: '',

                    kehu_name: '',
                    dingdan_num: '',
                    lots: [
                        {
                            num: '',
                            url: '',
                            picture: [],
                            desc: ''
                        }
                    ],
                    markFiles: [
                        {
                            url: '',
                            picture: [],
                        }
                    ],
                    codee: '',
                    chukou_file_url: '',
                    tihuo_company: '',
                    cangchu_address: '',

                    weight: null,
                    long: null,
                    width: null,
                    height: null,
                    dispatch_date: '',
                    carrier_name: '',
                    waybill_number: '',
                    waybill_file_url: '',
                    delivery_date: '',
                    pod_submit_date: '',
                    pod_file_url: '',

                    shipping_method: '',
                    packing_method: '',
                    vat_refund: false,
                    insurance_fee: '',
                    delivery_fee: '',
                    total: '',

                    pay_amount: null,
                    pay_method: '',
                    pay_date: ''
                },
                rule_data: {
                    // aaa: [
                    //     {required: true, message: '用户名不能为空', trigger: 'blur'}
                    // ],
                    // bbb: [
                    //     {required: true, message: '密码不能为空', trigger: 'blur'},
                    //     {type: 'string', min: 6, message: '密码不能少于6位', trigger: 'blur'}
                    // ]
                },
                receive_list: []
            }
        },
        mounted() {
            if (this.$route.params._id) {
                for (let key in this.$route.params) {
                    this.form_data[key] = this.$route.params[key];
                }
            }
            this.current_user_id = this.$store.state.user_info ? this.$store.state.user_info._id : '';
            this.get_receive_list();
            this.get_info_status_list();
            if (this.form_data._id) {
                this.tryLockOrder();
            }
            window.addEventListener('beforeunload', this.handleBeforeUnload);
        },
        beforeDestroy() {
            window.removeEventListener('beforeunload', this.handleBeforeUnload);
            this.unlockOrder();
        },
        methods: {
            formatLockTime(time) {
                if (!time) return '';
                return this.moment(time).format('YYYY-MM-DD HH:mm:ss');
            },
            handleBeforeUnload(e) {
                if (this.is_locked_by_me && this.form_data._id) {
                    navigator.sendBeacon(
                        (process.env.NODE_ENV == 'development' ? 'http://localhost:3333' : '') + API_URL.unlock_order,
                        JSON.stringify({ _id: this.form_data._id })
                    );
                }
            },
            async tryLockOrder() {
                try {
                    const ret = await this.Ajax.post(API_URL.lock_order, {
                        _id: this.form_data._id
                    });
                    if (ret && ret.DATA) {
                        this.lock_info = ret.DATA.lock_info || this.lock_info;
                        if (ret.DATA.success) {
                            this.is_locked_by_me = true;
                            this.is_readonly = false;
                        } else {
                            this.is_locked_by_me = false;
                            this.is_readonly = true;
                            this.$Message.warning(`订单正在被 ${this.lock_info.locked_by_name} 编辑中，您只能查看`);
                        }
                    }
                } catch (e) {
                    console.error('Lock order error:', e);
                }
            },
            async unlockOrder() {
                if (!this.is_locked_by_me || !this.form_data._id) return;
                try {
                    await this.Ajax.post(API_URL.unlock_order, {
                        _id: this.form_data._id
                    });
                    this.is_locked_by_me = false;
                } catch (e) {
                    console.error('Unlock order error:', e);
                }
            },
            async handleBack() {
                await this.unlockOrder();
                this.$router.push({name: 'list'});
            },
            change_receive_select(item) {
                let obj = JSON.parse(item);
                this.form_data.shoujian_name = obj["shoujian_name"];
                this.form_data.shoujian_cellphone = obj["shoujian_cellphone"];
                this.form_data.shoujian_address = obj["shoujian_address"];
                this.form_data.shoujian_youbian = obj["shoujian_youbian"];
            },
            get_info_status_list(){
                if( this.form_data._id){
                    this.Ajax.post(API_URL.get_status_list, {
                            _id: this.form_data._id
                    }).then((ret) => {
                        if (ret) {
                            this.statusList = ret.DATA;
                        }
                        this.loading = false;
                    }).catch(() => {
                        this.$Message.error("请重新登录");
                        this.$router.push({name: 'login'})
                    })
                }

            },
            get_receive_list() {
                this.Ajax.get(API_URL.get_reciver_list, {
                    params: {
                        page: 1,
                        limit: 10000
                    }
                }).then((ret) => {
                    if (ret) {
                        this.receive_list = ret.DATA;
                    }
                    this.loading = false;
                }).catch(() => {
                    this.$Message.error("请重新登录");
                    this.$router.push({name: 'login'})
                })
            },
            oepn_link(link) {
                window.open(link)
            },
            export_pic(file) {
                console.log(file);
            },
            upfile_success(res, file, fileList) {

                let key = res.DATA["key"];
                let src = res.DATA["src"];

                if (Number.isFinite(+key)) {
                    // this.form_data.lots[key].picture = src
                    this.form_data.lots[key].picture.push(src)
                } else {
                    this.form_data[key] = src
                }

            },
            upfile_success2(res){
                let key = res.DATA["key"];
                let src = res.DATA["src"];
                this.form_data.markFiles[key].url  = src
            },
            async submit(status) {
                if (this.is_readonly) {
                    this.$Message.error("只读模式下无法提交");
                    return;
                }
                this.form_data["status"] = status;
                this.Ajax.post(API_URL.submit_data, this.form_data).then(async (ret) => {
                    if (ret) {
                        this.$Message.success("提交成功");
                        await this.unlockOrder();
                        this.$router.push({name: 'list'})
                    }
                })
            },
            add_one_lot() {
                if (this.is_readonly) {
                    this.$Message.error("只读模式下无法添加");
                    return;
                }
                this.form_data['lots'].push({
                    num: '',
                    url: '',
                    picture: [],
                    desc: ''
                })
            },
            add_one_mark(){
                if (this.is_readonly) {
                    this.$Message.error("只读模式下无法添加");
                    return;
                }
                this.form_data['markFiles'].push({
                    url: '',
                    desc: ''
                })
            }
        }
    }
</script>
<style scoped>
    /deep/ .ivu-timeline-item-content{
        font-size: 14px;
    }
    .vertical-center-modal {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .vertical-center-modal .ivu-modal {
        top: 0;
    }

    .title {
        height: 50px;
        color: #333;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        line-height: 50px;
    }

    .close {
        position: absolute;
        top: -15px;
        right: -15px;
        font-size: 30px;
        z-index: 999;
        color: red;
    }
</style>
