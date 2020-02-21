import React from "react";
import BaseClass from "@/baseClass";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Flex,InputItem,List,Toast} from 'antd-mobile';
import {checkIndex} from "tollPlugin/commonFun";
const QRCode = require('qrcode.react');

class onlinePay extends BaseClass{
    constructor(props:any){
        super(props,[],true);
        this.state={
            isQrCode: false,
            qrCodeImg: "",
            onlinePayItem: this.props.onlinePayList,
            FixedAmountList: [],
            FixedAmountValue: "",
            depositMoney: "",
            selectAmount: '',
        }
    }
    // 父级状态改变
    static getDerivedStateFromProps(props:any,state:any){
        if(props.onlinePayList!==state.onlinePayItem){
            return({
                offlinePayItem:props.onlinePayList
            })
        }
        return null    
    }
    // 充值金额
    changeAmountInput(val:string) {
        let index;
        if(this.props.quickPrice){
            index = checkIndex<string>(this.props.quickPrice.split(','),val)
        }
        this.setState({
            depositMoney:val,
            selectAmount:val&&index?index:""
        })
    }
    // 点击快捷金额
    setAmount(item:any, i:any) {
        if (item<this.state.onlinePayItem.MinAmount || item > this.state.onlinePayItem.MaxAmount) return;
        this.setState({
            depositMoney: item,
            selectAmount: i
        })
    }
    // 确定存款
    savePay() {
        let self = this;
        let Thirdpay = this.state.onlinePayItem;
        if (!Thirdpay) {
            window.actions.popWindowAction({type: "Hint",text:"请选择支付方式和支付渠道！"})
            return false;
        }
        let depositMoney = this.state.depositMoney;
        let isPayLink = Thirdpay.IsJumpScanCode === 1;
        if (!depositMoney) {
            window.actions.popWindowAction({type: "Hint",text:"未输入存款金额"})
            return false;
        }
        if (depositMoney < Thirdpay.MinAmount || depositMoney > Thirdpay.MaxAmount) {
            window.actions.popWindowAction({type: "Hint",text:"存款金额错误"})
            return false;
        }
        let param = {  //提交传参
            Amount: depositMoney,
            Id: Thirdpay.Id,
            thirdPayId: Thirdpay.ThirdPayId,
            ReturnType: Thirdpay.IsJumpScanCode === 1 ? "QRLink" : "QRCode",
            Tag: window.config.webSiteTag,
            BankNo: Thirdpay.BankNo
        };
        if (this.props.isBank) {
            param.ReturnType = "Online";
        }
        Toast.loading(Thirdpay.IsJumpScanCode === 1 ? "支付连接获取中,请稍候！" : "二维码获取中,请稍候！", 300);
        new window.actions.ApiSubmitOnlinePayAction(param).fly((resp:any) => {
            Toast.hide();
            if (resp.StatusCode === 0) {
                if(!isPayLink) {
                    window.actions.popWindowAction({
                        type: "DefiPop", 
                        text: "获取支付成功，前往支付?",
                        leftBtn: {
                            text: "取消",
                            fc:()=>{
                                window.actions.popWindowAction({type:""})
                            }
                        },
                        rightBtn:{
                            text:"前往",
                            fc:()=>{
                                setTimeout(() => {
                                    window.actions.popWindowAction({ 
                                        type: "DefiPop", 
                                        text: "支付失败",
                                        leftBtn: {
                                            text: "支付失败",
                                            fc:()=>{return}
                                        },
                                        rightBtn: {
                                            text: "支付完成",
                                            fc:()=>{
                                                new window.actions.ApiPlayerInfoAction().fly();
                                                self.props.history.push('/My/history/record/chongzhi');
                                            }
                                        }
                                    })
                                }, 1000)
                            }
                        }
                    })
                }else{
                    self.setState({
                        isQrCode: true,
                        qrCodeImg: resp.Content
                    })
                }
            }else {
                if(resp.Message){
                    window.actions.popWindowAction({type: "Drawing",text:resp.Message})
                }else{
                    window.actions.popWindowAction({type:"Drawing",text:"二维码获取失败,请联系客服或再次尝试"})
                }
            }
        })
    }
    queryOrder() {
        new window.actions.ApiPlayerInfoAction().fly();//获取会员信息
        this.props.history.push('/My/history')
    }
    hide(){
        this.setState({
            isQrCode: false
        })
    }
    render() {
        let className = this.state.isQrCode ? "QrcodeDeposit slideInUp" : "QrcodeDeposit slideOutDown";
        let quickAmountArr = (
            !!this.state.onlinePayItem.FixedAmount && this.state.onlinePayItem.FixedAmount.split(',')
        ) || (
            (!!this.props.quickPrice && this.props.quickPrice.split(',')) || [51, 101, 201, 501, 1001, 2001, 5001, 10001]
        );
        return (
            <div className='onlinePay'>
                <div>
                    <label className='pickPay'>充值金额</label>
                    {/*注释*/}
                    {
                        !!!this.state.onlinePayItem.FixedAmount &&
                        <List.Item className="depositMoney">
                            <InputItem
                                ref="money"
                                clear
                                value={this.state.depositMoney}
                                maxLength={15}
                                type="digit"//原生的number类型支持小数
                                onChange={this.changeAmountInput.bind(this)}
                                placeholder={"请填写存款金额，范围" + (this.state.onlinePayItem.MinAmount || ' ') + '~' + (this.state.onlinePayItem.MaxAmount || ' ')}
                            >￥</InputItem>
                        </List.Item>
                    }
                    <Flex className="quick-amount" wrap="wrap" justify="center">
                        {
                            quickAmountArr.map((item:any, i:number) => {
                                let minAmount = this.state.onlinePayItem.MinAmount;
                                let maxAmount =this.state.onlinePayItem.MaxAmount;
                                let className= 'inline';
                                if(this.state.selectAmount === i) className='inline active';
                                if( item < minAmount  || item > maxAmount) className='inline disable';
                                return (
                                    <div key={i} className={className} onClick={this.setAmount.bind(this, item, i)}>{item}元</div>
                                )
                            })
                        }
                    </Flex>
                    <a onClick={this.savePay.bind(this)} className="btn">确定存款</a>
                    <p className={'reminderTxt'}>{!!this.props.reminder && this.props.reminder}</p>
                </div>
                {
                    this.state.isQrCode?
                    <div className={className+" thirdCode"}>
                        <div className="mask"/>
                        <div className="dom">
                            <div className="title">
                                <i className="icon iconfont icon-iconclose" onClick={this.hide.bind(this)}/>
                                {this.props.BankName}
                                <a onClick={this.queryOrder.bind(this)}>支付完成</a>
                            </div>
                            <div className="amount">
                                支付金额:<span>￥{this.state.depositMoney}</span>
                            </div>
                            <div className="con">
                                <div className="qrcode">
                                    <QRCode className="qrImg"
                                            includeMargin={true} //内部是否有margin
                                            size={200}  //图片大小
                                            value={this.state.qrCodeImg || ""} //地址
                                    />
                                </div>
                                <div className="text">
                                    <i className="icon icon-info-sign"/>
                                    <strong>长按保存二维码</strong>，或使用 <strong>截屏保存</strong>，打开{this.props.BankName}<strong>扫描相册二维码</strong>完成支付。如无法充值，请联系客服。
                                </div>
                            </div>
                        </div>
                    </div>:null
                }
            </div>
    );
  }
}

const mapStateToProps = (state: ReducerState, ownProps: any) => ({
    remoteSysConfs: state.remoteSysConfs,
});

export default withRouter(connect(mapStateToProps)(onlinePay));

