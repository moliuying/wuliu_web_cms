<template>
    <div
        class="quotation-detail-page"
        :style="`
            padding: 10px 100px 800px 100px;
            font-size: ${baseFontSize}px;
            --input-font-size: ${inputFontSize}px;
            --button-font-size: ${buttonFontSize}px;
            --table-font-size: ${tableFontSize}px;
            --notes-font-size: ${notesFontSize}px;
            --base-font-size: ${baseFontSize}px;
        `"
    >
        <div style="margin-bottom: 5px;">
            <Form ref="form_search" inline>
<!--              {{ifCanEdit}}-->
              <FormItem style="float: right;">
                <Button type="info" @click="$router.push({name:'quotation_list'})"  v-if="ifCanEdit">返回报价列表</Button>
              </FormItem>
              <FormItem>
                <Button type="primary" style="margin: 0 5px;" @click="submit()" v-if="ifCanEdit">保存报价单</Button>
              </FormItem>
            </Form>
        </div>
        <Row style="height: 100%;">
            <Col span="24">
                <!-- Auction Information Table -->
                <div style="border: 1px solid #000; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 10px; width: 33%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Auction Name</td>
                            <td :style="`border: 1px solid #000; padding: 10px; width: 33%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Auction Date</td>
                            <td :style="`border: 1px solid #000; padding: 10px; width: 34%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Auction Ref</td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 10px;">
                                <Input v-model="form_data.auction_name" placeholder="Enter Auction Name" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                            </td>
                            <td style="border: 1px solid #000; padding: 10px;">
                                <DatePicker type="date" v-model="form_data.auction_date" placeholder="Select Date" :readonly="!ifCanEdit"style="border: none; box-shadow: none; width: 100%;"></DatePicker>
                            </td>
                            <td style="border: 1px solid #000; padding: 10px;">
                                <Input v-model="form_data.auction_ref" placeholder="Enter Auction Ref" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                            </td>
                        </tr>
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Lots involved</td>
                            <td :style="`border: 1px solid #000; padding: 10px; font-size: ${tableFontSize}px;`">Total Value</td>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`"></td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #000; padding: 10px;">
                            <Input v-model="form_data.lots_involved" placeholder="Enter Lots involved" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                          </td>
                          <td style="border: 1px solid #000; padding: 10px;">
                            <Input v-model="form_data.total_value" placeholder="Enter Total Value" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                          </td>
                          <td style="border: 1px solid #000; padding: 10px;">
                          </td>
                        </tr>
                    </table>
<!--                    <div style="text-align: center; padding: 10px;" v-if="!ifCanEdit">-->
<!--                        <Button type="primary" size="small" @click="addOneLot">Add Lot</Button>-->
<!--                    </div>-->
                </div>

                <!-- Receiver Information Table -->
                <div style="border: 1px solid #000; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 10px; width: 20%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; vertical-align: top; font-size: ${tableFontSize}px;`">Receiver's Name</td>
                            <td style="border: 1px solid #000; padding: 10px; width: 30%;">
                                <Input v-model="form_data.receivers_name" placeholder="Enter Name" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                            </td>
                            <td :style="`border: 1px solid #000; padding: 10px; width: 20%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Company Name</td>
                            <td style="border: 1px solid #000; padding: 10px; width: 30%;">
                                <Input v-model="form_data.company_name" placeholder="Enter Company" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                            </td>
                        </tr>
                        <tr>
                            <td rowspan="3" :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; vertical-align: top; font-size: ${tableFontSize}px;`">Shipping Address</td>
                            <td rowspan="3" style="border: 1px solid #000; padding: 10px; vertical-align: top;">
                                <Input v-model="form_data.shipping_address" type="textarea" :autosize="{minRows: 4, maxRows: 6}" placeholder="Enter Address" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                            </td>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Destination Country</td>
                            <td style="border: 1px solid #000; padding: 10px;">
                                <Input v-model="form_data.destination_country" placeholder="Enter Country" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                            </td>
                        </tr>
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Phone Number</td>
                            <td style="border: 1px solid #000; padding: 10px;">
                                <Input v-model="form_data.phone_number" placeholder="Enter Phone" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                            </td>
                        </tr>
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Email</td>
                            <td style="border: 1px solid #000; padding: 10px;">
                                <Input v-model="form_data.email" placeholder="Enter Email" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                            </td>
                        </tr>
                    </table>
                </div>

                <!-- Packing and Shipping Table -->
                <div style="border: 1px solid #000; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td :style="`border: 1px solid #000; padding: 10px; width: 20%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; vertical-align: top; font-size: ${tableFontSize}px;`">Packing Type</td>
                        <td style="border: 1px solid #000; padding: 10px; width: 30%;">
                          <Input v-model="form_data.packing_method" placeholder="Enter Packing Type" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                        </td>
                        <td :style="`border: 1px solid #000; padding: 10px; width: 20%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Shipping Method</td>
                        <td style="border: 1px solid #000; padding: 10px; width: 30%;">
                          <Input v-model="form_data.shipping_method" placeholder="Enter Shipping Method" :readonly="!ifCanEdit"style="border: none; box-shadow: none;"></Input>
                        </td>
                      </tr>
                    </table>
                </div>

                <!-- Cost Details -->
                <div style="border: 1px solid #000; margin-bottom: 20px;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 10px; width: 60%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Cost of Packing and Shipping:</td>
                            <td :style="`border: 1px solid #000; padding: 10px; width: 20%; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; text-align: center; font-size: ${tableFontSize}px;`">GBP</td>
                            <td style="border: 1px solid #000; padding: 10px; width: 20%;">
                                <Input v-model="form_data.packing_shipping_GBP" placeholder="0.00" :readonly="!ifCanEdit" style="border: none; box-shadow: none; text-align: right;"></Input>
                            </td>
                        </tr>
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 5px; font-size: ${notesFontSize}px; color: #666;`" colspan="3">*Including compensation up to a maximum of £75 per consignment</td>
                        </tr>
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">
                                <span v-if="!ifCanEdit">
                                    <Checkbox v-model="includeAdditionalCover" style="margin-right: 8px;"></Checkbox>
                                </span>
                                Cost of Additional Cover:
                            </td>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; text-align: center; font-size: ${tableFontSize}px;`">GBP</td>
                            <td style="border: 1px solid #000; padding: 10px;">
                                <Input v-model="form_data.additional_GBP" placeholder="0.00" :readonly="!ifCanEdit" style="border: none; box-shadow: none; text-align: right;"></Input>
                            </td>
                        </tr>
                        <tr>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; font-size: ${tableFontSize}px;`">Total Payment Due:</td>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; text-align: center; font-size: ${tableFontSize}px;`">GBP</td>
                            <td style="border: 1px solid #000; padding: 10px;">
                                <Input v-model="form_data.total_payment_GBP" placeholder="0.00" :readonly="true" style="border: none; box-shadow: none; text-align: right;"></Input>
                            </td>
                        </tr>
                        <tr>
                            <td style="border: 1px solid #000; padding: 10px;"></td>
                            <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; text-align: center; font-size: ${tableFontSize}px;`">USD</td>
                            <td style="border: 1px solid #000; padding: 10px;">
                              <Input v-model="form_data.total_payment_USD" placeholder="0.00" :readonly="true" style="border: none; box-shadow: none; text-align: right;"></Input>
                            </td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #000; padding: 10px;"></td>
                          <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; text-align: center; font-size: ${tableFontSize}px;`">EUR</td>
                          <td style="border: 1px solid #000; padding: 10px;">
                            <Input v-model="form_data.total_payment_EUR" placeholder="0.00" :readonly="true" style="border: none; box-shadow: none; text-align: right;"></Input>
                          </td>
                        </tr>
                        <tr>
                          <td style="border: 1px solid #000; padding: 10px;"></td>
                          <td :style="`border: 1px solid #000; padding: 10px; background: ${ifCanEdit ? '#CCFFCC' : '#E0E0E0'}; font-weight: bold; text-align: center; font-size: ${tableFontSize}px;`">AUD</td>
                          <td style="border: 1px solid #000; padding: 10px;">
                            <Input v-model="form_data.total_payment_AUD" placeholder="0.00" :readonly="true" style="border: none; box-shadow: none; text-align: right;"></Input>
                          </td>
                        </tr>
                    </table>
                </div>

                <!-- Terms and Buttons -->
                <div :style="`margin: 20px 0; padding: 15px; border: 1px solid #000; font-size: ${baseFontSize}px;`">
                    <p :style="`margin-bottom: 20px; line-height: 1.5; font-size: ${baseFontSize}px;`">By accepting our quotation and instructing us to proceed with this Shipping Order, you, the Customer, authorise us, the Company, to charge any and all of the charges specified on this Shipping Order and/or costs including penalties arising in the event of non-payment of the Consignee. You have read the <a href="https://www.mbe.co.uk/parcel/terms-conditions" target="_blank" style="color: #1890ff;">Terms and Conditions</a> and agree to abide by them.</p>

                    <div style="display: flex; justify-content: space-between;" v-if="!ifCanEdit">
                        <Button type="primary" size="large" @click="acceptQuotation" :style="`min-width: 120px; font-size: ${buttonFontSize}px;`">Accept</Button>
                        <Button type="warning" size="large" @click="amendInformation" :style="`min-width: 200px; font-size: ${buttonFontSize}px;`">Amend Information &<br>Request New Quote</Button>
                    </div>
                </div>
            </Col>
        </Row>

        <!-- 接受报价弹框 -->
        <Modal
            v-model="showAcceptModal"
            title="Accept Quotation"
            :closable="true"
            :mask-closable="false"
            width="600"
            class-name="quotation-detail-modal"
        >
            <Form ref="acceptFormRef" :model="acceptForm" :rules="acceptFormRules" :label-width="160">
                <FormItem label="Payment Method" prop="paymentMethod">
                    <RadioGroup v-model="acceptForm.paymentMethod" @on-change="onPaymentMethodChange">
                      <Radio label="bank_transfer">Bank transfer</Radio>
                      <Radio label="card_payment" v-if=" !form_data.total_payment_GBP ||  parseFloat(form_data.total_payment_GBP) <= 500">Card Payment</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="Settlement Currency" prop="currency">
                    <Select v-model="acceptForm.currency" placeholder="Select currency">
                        <Option value="GBP">GBP - {{ form_data.total_payment_GBP }}</Option>
                        <Option value="USD">USD - {{ form_data.total_payment_USD }}</Option>
                        <Option value="EUR">EUR - {{ form_data.total_payment_EUR }}</Option>
                        <Option value="AUD">AUD - {{ form_data.total_payment_AUD }}</Option>
                    </Select>
                </FormItem>

                <!-- 银行信息展示 -->
                <div v-if="acceptForm.paymentMethod === 'bank_transfer'" style="margin-top: 20px; padding: 20px; background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); border-radius: 12px; border: 1px solid #e1e8ed; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                        <Icon type="ios-card" size="24" style="color: #2d8cf0; margin-right: 10px;"></Icon>
                        <h3 style="margin: 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Bank Transfer Details</h3>
                    </div>

                    <!-- GBP 银行信息 -->
                    <div v-if="acceptForm.currency === 'GBP'" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Account Name</span>
                                <span style="color: #2c3e50; font-weight: 600;">Mbe Fine Art Shipping Ltd</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Account Number</span>
                                <span style="color: #2c3e50; font-weight: 600;">13569225</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Sort Code</span>
                                <span style="color: #2c3e50; font-weight: 600;">23-08-01</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">IBAN</span>
                                <span style="color: #2c3e50; font-weight: 600;">GB69 TRWI 2308 0113 5692 25</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Swift/BIC</span>
                                <span style="color: #2c3e50; font-weight: 600;">TRWIGB2LXXX</span>
                            </div>
                            <div style="display: flex; flex-direction: column; grid-column: 1 / -1;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Bank Address</span>
                                <span style="color: #2c3e50; font-weight: 600; line-height: 1.4;">Wise Payments Limited, 1st Floor, Worship Square, 65 Clifton Street, London, EC2A 4JE, United Kingdom</span>
                            </div>
                        </div>
                    </div>

                    <!-- USD 银行信息 -->
                    <div v-if="acceptForm.currency === 'USD'" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Account Name</span>
                                <span style="color: #2c3e50; font-weight: 600;">Mbe Fine Art Shipping Ltd</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Account Number</span>
                                <span style="color: #2c3e50; font-weight: 600;">152208195652740</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Account Type</span>
                                <span style="color: #2c3e50; font-weight: 600;">Deposit</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Routing Number</span>
                                <span style="color: #2c3e50; font-weight: 600;">084009519</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Swift/BIC</span>
                                <span style="color: #2c3e50; font-weight: 600;">TRWIUS35XXX</span>
                            </div>
                            <div style="display: flex; flex-direction: column; grid-column: 1 / -1;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Bank Address</span>
                                <span style="color: #2c3e50; font-weight: 600; line-height: 1.4;">Wise US Inc, 30 W. 26th Street, Sixth Floor, New York, NY, 10010, United States</span>
                            </div>
                        </div>
                    </div>

                    <!-- EUR 银行信息 -->
                    <div v-if="acceptForm.currency === 'EUR'" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Account Name</span>
                                <span style="color: #2c3e50; font-weight: 600;">Mbe Fine Art Shipping Ltd</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">IBAN</span>
                                <span style="color: #2c3e50; font-weight: 600;">BE41 9055 5106 7010</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Swift/BIC</span>
                                <span style="color: #2c3e50; font-weight: 600;">TRWIBEB1XXX</span>
                            </div>
                            <div style="display: flex; flex-direction: column; grid-column: 1 / -1;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Bank Address</span>
                                <span style="color: #2c3e50; font-weight: 600; line-height: 1.4;">Wise, Rue du Trône 100, 3rd floor, Brussels, 1050, Belgium</span>
                            </div>
                        </div>
                    </div>

                    <!-- AUD 银行信息 -->
                    <div v-if="acceptForm.currency === 'AUD'" style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; font-size: 14px;">
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Account Name</span>
                                <span style="color: #2c3e50; font-weight: 600;">Mbe Fine Art Shipping Ltd</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Account Number</span>
                                <span style="color: #2c3e50; font-weight: 600;">233059869</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">BSB Code</span>
                                <span style="color: #2c3e50; font-weight: 600;">774001</span>
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Swift/BIC</span>
                                <span style="color: #2c3e50; font-weight: 600;">TRWIAUS1XXX</span>
                            </div>
                            <div style="display: flex; flex-direction: column; grid-column: 1 / -1;">
                                <span style="color: #8c8c8c; font-size: 12px; margin-bottom: 4px;">Bank Address</span>
                                <span style="color: #2c3e50; font-weight: 600; line-height: 1.4;">Wise Australia Pty Ltd, Suite 1, Level 11, 66 Goulburn Street, Sydney, NSW, 2000, Australia</span>
                            </div>
                        </div>
                    </div>
<!--                    <div style="margin-top: 15px; padding: 12px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; display: flex; align-items: center;">-->
<!--                        <Icon type="ios-information-circle" size="18" style="color: #f39c12; margin-right: 8px;"></Icon>-->
<!--                        <span style="color: #856404; font-size: 13px;">Please include your auction reference number in the payment reference</span>-->
<!--                    </div>-->
                </div>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="submitAcceptForm">Next</Button>
            </div>
        </Modal>

        <!-- 修改信息弹框 -->
        <Modal
            v-model="showAmendModal"
            title="Message to our shipping team"
            :closable="true"
            :mask-closable="false"
            width="600"
            class-name="quotation-detail-modal"
        >
            <div style="padding: 20px 0;">
                <Input
                    v-model="amendMessage"
                    type="textarea"
                    :autosize="{minRows: 6, maxRows: 10}"
                    placeholder="Please enter your message to our shipping team..."
                    style="width: 100%; border: 1px solid #ddd;"
                />
            </div>
            <div slot="footer">
                <Button @click="cancelAmendRequest" style="margin-right: 10px;">Cancel</Button>
                <Button type="primary" @click="submitAmendRequest">Submit</Button>
            </div>
        </Modal>

        <!-- 支付确认弹框 -->
        <Modal
            v-model="showPaymentConfirmModal"
            title="Payment Confirmation"
            :closable="true"
            :mask-closable="true"
            width="500"
            class-name="quotation-detail-modal"
        >
            <div style="padding: 20px; text-align: center;">
                <div style="margin-bottom: 30px;">
                    <Icon type="ios-checkmark-circle" size="60" style="color: #19be6b;"></Icon>
                </div>

                <h3 style="margin-bottom: 25px; color: #2c3e50; font-size: 20px;">Payment Details Confirmed</h3>

                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e9ecef;">
                        <span style="color: #6c757d; font-weight: 500;">Payment Method:</span>
                        <span style="color: #2c3e50; font-weight: 600; text-transform: capitalize;">{{ acceptForm.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Card Payment' }}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e9ecef;">
                        <span style="color: #6c757d; font-weight: 500;">Settlement Currency:</span>
                        <span style="color: #2c3e50; font-weight: 600;">{{ acceptForm.currency }}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #6c757d; font-weight: 500;">Payment Amount:</span>
                        <span style="color: #e74c3c; font-weight: 700; font-size: 18px;">
                            {{ acceptForm.currency }} {{ getPaymentAmount() }}
                        </span>
                    </div>
                </div>

                <div v-if="acceptForm.paymentMethod === 'card_payment'" style="background: #e3f2fd; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #1976d2; font-size: 14px;">
                        <Icon type="ios-information-circle" style="margin-right: 5px;"></Icon>
                        A new window has been opened for card payment processing.
                    </p>
                </div>

                <div v-if="acceptForm.paymentMethod === 'bank_transfer'" style="background: #fff3cd; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #856404; font-size: 14px;">
                        <Icon type="ios-information-circle" style="margin-right: 5px;"></Icon>
                        Please use the bank details provided above to complete your transfer.
                    </p>
                </div>
            </div>

            <div slot="footer" style="text-align: center;">
                <Button type="primary" @click="closePaymentConfirm" size="large" style="min-width: 120px;">OK</Button>
            </div>
        </Modal>

        <!-- 修改请求确认弹框 -->
        <Modal
            v-model="showAmendConfirmModal"
            title="Request Submitted"
            :closable="true"
            :mask-closable="true"
            width="500"
            class-name="quotation-detail-modal"
        >
            <div style="text-align: center; padding: 20px 0;">
                <div style="margin-bottom: 20px;">
                    <Icon type="ios-checkmark-circle" size="60" color="#52c41a"></Icon>
                </div>

                <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <h3 style="color: #2c3e50; margin-bottom: 15px; font-weight: 600;">Amendment Request Status</h3>

                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e9ecef;">
                            <span style="color: #6c757d; font-weight: 500;">Status:</span>
                            <span style="color: #52c41a; font-weight: 600;">Submitted Successfully</span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e9ecef;">
                            <span style="color: #6c757d; font-weight: 500;">Request Type:</span>
                            <span style="color: #2c3e50; font-weight: 600;">Quotation Amendment</span>
                        </div>

                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: #6c757d; font-weight: 500;">Next Step:</span>
                            <span style="color: #2c3e50; font-weight: 600;">Awaiting Review</span>
                        </div>
                    </div>

                    <div style="background: #e8f5e8; padding: 15px; border-radius: 6px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #2e7d32; font-size: 14px; line-height: 1.5;">
                            <Icon type="ios-information-circle" style="margin-right: 5px;"></Icon>
                            Your amendment request has been submitted successfully. Please wait for our team to review and respond to your request. You will be notified once there is an update.
                        </p>
                    </div>
                </div>
            </div>

            <div slot="footer">
                <Button type="primary" @click="closeAmendConfirm" style="width: 100px;">OK</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
                // ========== 字体大小配置（可随时调整） ==========
                baseFontSize: 18,        // 基础字体大小（原来16px）
                tableFontSize: 18,       // 表格文字字体大小（原来没有设置，默认继承）
                inputFontSize: 20,       // 输入框字体大小
                buttonFontSize: 18,      // 按钮字体大小
                notesFontSize: 18,       // 备注说明文字大小（原来12px）
                // =============================================

                ifCanEdit: false, // 是否可以编辑
                showAmendModal: false, // 是否显示修改信息弹框
                amendMessage: '', // 修改信息内容
                showAcceptModal: false, // 是否显示接受报价弹框
                showPaymentConfirmModal: false, // 是否显示支付确认弹框
                showAmendConfirmModal: false, // 是否显示修改请求确认弹框
                includeAdditionalCover: true, // 是否包含额外保险费用
                acceptForm: {
                    paymentMethod: 'bank_transfer',
                    currency: 'GBP',
                },
                acceptFormRules: {
                    paymentMethod: [
                        { required: true, message: 'Please select a payment method', trigger: 'change' }
                    ],
                    currency: [
                        { required: true, message: 'Please select a currency', trigger: 'change' }
                    ]
                },
                 form_data: {
                  _id: '',
                  auction_name: '',
                  auction_date: '',
                  auction_ref: '',
                  lots_involved: '',
                  total_value: '',
                  receivers_name: '',
                  company_name: '',
                  shipping_address: '',
                  destination_country: '',
                  phone_number: '',
                  email: '',
                  packing_method: '',
                  shipping_method: '',
                  packing_shipping_GBP: '',
                  additional_GBP: '',
                  total_payment_GBP: '',
                  total_payment_USD: '',
                  total_payment_EUR: '',
                  total_payment_AUD: '',
                  currency_type: 'EUR',
                  alternative_payment: ''
                },
                // 汇率配置
                exchangeRates: {
                    // USD: 1.27,  // 1 GBP = 1.27 USD
                    // EUR: 1.17,  // 1 GBP = 1.17 EUR
                    // AUD: 1.85   // 1 GBP = 1.85 AUD
                    AUD: 2.07,
                    EUR: 1.17,
                    USD: 1.36
                }
            }
        },
        computed: {
            // 根据URL参数判断是否为查看模式
            // viewMode() {
            //     return this.$route.query.mode === 'view';
            // }
        },
        watch: {
            // 监听packing_shipping_GBP变化
            'form_data.packing_shipping_GBP'(newVal) {
                this.calculateTotalPayments();
            },
            // 监听additional_GBP变化
            'form_data.additional_GBP'(newVal) {
                this.calculateTotalPayments();
            },
            // 监听includeAdditionalCover变化
            'includeAdditionalCover'(newVal) {
                this.calculateTotalPayments();
            }
        },
        mounted() {
            // 检查路由query参数auction_ref和mail
            const { auction_ref, email, _id, is_create } = this.$route.query;
            if (_id) {
              console.log(this.$route.params)
              for (let key in this.$route.params) {
                this.form_data[key] = this.$route.params[key];
              }
              this.ifCanEdit = true;
            }else{
                if(is_create){
                  this.ifCanEdit = true;
                }else{
                  if (auction_ref && email) {
                    // 如果auction_ref和mail都有值，调用查询详情接口进行数据回显
                    this.ifCanEdit = false;
                    this.loadQuotationDetailByParams(auction_ref, email);
                  }
                }
            }
        },
        methods: {
            onPaymentMethodChange(){
              // 当 paymentMethod 发生变化时，将 currency 设置为 GBP
              console.log('123')
              this.acceptForm.currency = 'GBP';
            },
            // 计算总金额和汇率转换
            calculateTotalPayments() {
                const packingCost = parseFloat(this.form_data.packing_shipping_GBP) || 0;
                const additionalCost = this.includeAdditionalCover ? (parseFloat(this.form_data.additional_GBP) || 0) : 0;
                const totalGBP = packingCost + additionalCost;

                // 设置GBP总金额
                this.form_data.total_payment_GBP = totalGBP.toFixed(2);

                // 计算其他货币金额
                this.form_data.total_payment_USD = (totalGBP * this.exchangeRates.USD).toFixed(2);
                this.form_data.total_payment_EUR = (totalGBP * this.exchangeRates.EUR).toFixed(2);
                this.form_data.total_payment_AUD = (totalGBP * this.exchangeRates.AUD).toFixed(2);
            },

            // 根据auction_ref和mail参数加载报价单详情
            loadQuotationDetailByParams(auction_ref, email) {
                // 调用API根据auction_ref和mail查询详情进行数据回显
                this.Ajax.get(API_URL.get_quotation_by_params, {
                    params: {
                        auction_ref,
                        email
                    }
                }).then((ret) => {
                    if (ret && ret.DATA) {
                        this.form_data = { ...this.form_data, ...ret.DATA.data };
                        this.form_data['_id'] = ret.DATA._id;
                        this.ifCanEdit = false; // 允许编辑
                    } else {
                        this.$Message.error("Please enter matching Auction Reference and Email");
                        // 如果没有找到数据，保持新建模式
                        this.ifCanEdit = false;
                    }
                }).catch(() => {
                    this.$Message.error("Data loading failed");
                    this.ifCanEdit = false; // 出错时默认新建模式
                });


            },
            // 提交保存报价单
            submit() {
              // 这里应该调用API保存报价单数据
              this.Ajax.post(API_URL.createOrEdit_quotation, this.form_data).then((ret) => {
                if (ret) {
                  this.$Message.success("Saved successfully");
                  this.$router.push({name: 'quotation_list'});
                }
              }).catch(() => {
                this.$Message.error("Save failed");
              });
            },
            // 接受报价
            acceptQuotation() {
                this.showAcceptModal = true;
            },
            // 提交接受报价表单
            submitAcceptForm() {
                this.$refs.acceptFormRef.validate((valid) => {
                    if (valid) {
                        // 这里应该调用API接受报价
                        this.Ajax.post(API_URL.createOrEdit_quotation, {
                            _id: this.form_data._id,
                            status:2,
                            ...this.acceptForm
                        }).then((ret) => {
                            if (ret) {
                                this.handlePaymentSuccess();
                            }
                        });
                    } else {
                        this.$Message.error('Please fill in all required fields');
                    }
                });
            },
            // 处理支付成功后的逻辑
            handlePaymentSuccess() {
                this.$Message.success("The quotation has been accepted");
                this.showAcceptModal = false;

                // 如果是卡支付，打开支付网址
                if (this.acceptForm.paymentMethod === 'card_payment') {
                    window.open('https://secure.blinkpayment.co.uk/MBEFINEARTSHIPPING', '_blank');
                }

                // 显示支付确认弹框
                this.showPaymentConfirmModal = true;
            },
            // 取消接受报价
            cancelAcceptForm() {
                this.showAcceptModal = false;
                this.resetAcceptForm();
            },
            // 重置接受报价表单
            resetAcceptForm() {
                this.acceptForm = {
                    paymentMethod: 'bank_transfer',
                    currency: 'GBP'
                };
                this.$refs.acceptFormRef && this.$refs.acceptFormRef.resetFields();
            },
            // 获取支付金额
            getPaymentAmount() {
                const currency = this.acceptForm.currency;
                switch(currency) {
                    case 'GBP':
                        return this.form_data.total_payment_GBP || '0.00';
                    case 'USD':
                        return this.form_data.total_payment_USD || '0.00';
                    case 'EUR':
                        return this.form_data.total_payment_EUR || '0.00';
                    case 'AUD':
                        return this.form_data.total_payment_AUD || '0.00';
                    default:
                        return '0.00';
                }
            },
            // 关闭支付确认弹框
            closePaymentConfirm() {
                this.showPaymentConfirmModal = false;
                this.resetAcceptForm();
            },
            // 关闭修改请求确认弹框
            closeAmendConfirm() {
                this.showAmendConfirmModal = false;
            },
            // 修改信息并请求新报价
            amendInformation() {
                this.showAmendModal = true;
            },
            // 提交修改信息请求
            submitAmendRequest() {
                if (!this.amendMessage.trim()) {
                    this.$Message.error('Please enter the modification information');
                    return;
                }
                // 这里应该调用API提交修改请求
                this.Ajax.post(API_URL.createOrEdit_quotation, {
                    _id: this.form_data._id,
                    status:3,
                    amendMessage: this.amendMessage,
                }).then((ret) => {
                    if (ret) {
                        this.handleAmendSuccess();
                    }
                }).catch(() => {
                    this.$Message.error('Submit failed, please try again');
                });
            },
            // 处理修改请求成功后的逻辑
            handleAmendSuccess() {
                this.$Message.success("The modification request has been submitted");
                this.showAmendModal = false;
                this.amendMessage = '';
                // 显示修改请求确认弹框
                this.showAmendConfirmModal = true;
            },
            // 取消修改请求
            cancelAmendRequest() {
                this.showAmendModal = false;
                this.amendMessage = '';
            }
         }
    }
</script>

<style scoped>
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
        cursor: pointer;
    }

    table {
        font-family: Arial, sans-serif;
    }

    table td {
        vertical-align: middle;
    }
</style>

<style>
    /* ==================== 核心：表单组件字体大小控制（仅限于 quotation-detail-page） ==================== */

    /* Input 输入框字体大小 - 最高优先级 */
    .quotation-detail-page .ivu-input {
        font-size: var(--input-font-size, 16px) !important;
        line-height: 1.5 !important;
    }

    /* Textarea 文本域字体大小 */
    .quotation-detail-page textarea.ivu-input {
        font-size: var(--input-font-size, 16px) !important;
        line-height: 1.5 !important;
    }

    /* DatePicker 日期选择器输入框字体大小 */
    .quotation-detail-page .ivu-date-picker .ivu-input {
        font-size: var(--input-font-size, 16px) !important;
        line-height: 1.5 !important;
    }

    .quotation-detail-page .ivu-date-picker input {
        font-size: var(--input-font-size, 16px) !important;
        line-height: 1.5 !important;
    }

    /* Select 下拉框字体大小 */
    .quotation-detail-page .ivu-select .ivu-select-selection {
        font-size: var(--input-font-size, 16px) !important;
    }

    .quotation-detail-page .ivu-select-selection {
        font-size: var(--input-font-size, 16px) !important;
    }

    .quotation-detail-page .ivu-select-selected-value {
        font-size: var(--input-font-size, 16px) !important;
        line-height: 1.5 !important;
    }

    /* InputNumber 数字输入框 */
    .quotation-detail-page .ivu-input-number input {
        font-size: var(--input-font-size, 16px) !important;
        line-height: 1.5 !important;
    }

    /* Placeholder 占位符字体大小 */
    .quotation-detail-page .ivu-input::-webkit-input-placeholder {
        font-size: var(--input-font-size, 16px) !important;
    }

    .quotation-detail-page .ivu-input::-moz-placeholder {
        font-size: var(--input-font-size, 16px) !important;
    }

    .quotation-detail-page .ivu-input:-ms-input-placeholder {
        font-size: var(--input-font-size, 16px) !important;
    }

    /* ==================== 按钮字体大小 ==================== */
    .quotation-detail-page .ivu-btn {
        font-size: var(--button-font-size, 16px) !important;
    }

    .quotation-detail-page .ivu-btn-large {
        font-size: var(--button-font-size, 16px) !important;
    }

    /* ==================== 复选框和单选框字体大小 ==================== */
    .quotation-detail-page .ivu-checkbox-wrapper {
        font-size: var(--input-font-size, 16px) !important;
    }

    .quotation-detail-page .ivu-radio-wrapper {
        font-size: var(--input-font-size, 16px) !important;
    }

    /* ==================== Modal 弹框内的表单控件（仅限于 quotation-detail-modal） ==================== */
    .quotation-detail-modal .ivu-input {
        font-size: 20px !important;
        line-height: 1.5 !important;
    }

    .quotation-detail-modal textarea.ivu-input {
        font-size: 20px !important;
        line-height: 1.5 !important;
    }

    .quotation-detail-modal .ivu-select-selection {
        font-size: 20px !important;
    }

    .quotation-detail-modal .ivu-select-selected-value {
        font-size: 20px !important;
        line-height: 1.5 !important;
    }

    .quotation-detail-modal .ivu-modal-body {
        font-size: 18px !important;
    }

    .quotation-detail-modal .ivu-form-item-label {
        font-size: 18px !important;
    }

    .quotation-detail-modal .ivu-btn {
        font-size: 18px !important;
    }

    .quotation-detail-modal .ivu-radio-wrapper {
        font-size: 20px !important;
    }

    .quotation-detail-modal .ivu-checkbox-wrapper {
        font-size: 20px !important;
    }
</style>
