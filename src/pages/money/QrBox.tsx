import React from "react";
import BaseClass from "@/baseClass";
import {Toast,InputItem,List} from 'antd-mobile';
import {copyCode} from "tollPlugin/commonFun";

type State = {
    AccountName:string,
    hide:boolean
}
export default class QrcodeDeposit extends BaseClass{
    public state:State = {
        AccountName:"",
        hide:false,
    };
    constructor(props:any){
        super(props,[],true);
    }
    // 隐藏
    hide(){
        let _this = this;
        this.setState({
            hide:true
        },()=>{
            setTimeout(()=>{
                _this.props.hide();
            },500)
        })
    }
    // 转账
    offlinePay(e:any){
        e.preventDefault();
        let _this = this;
        let depositMoney = this.props.depositMoney;
        let TransType;
        if(this.props.offPay.Bank.BankCode.indexOf('ALIPAY')>-1){//如果是支付宝
            TransType=6;
        }else if(this.props.offPay.Bank.BankCode.indexOf('WECHAT')>-1){//如果是微信
            TransType=7;
        }else{//如果是其他
            TransType=1;
        }
        Toast.loading('支付申请中,请稍后...');
        let filter = {//后台要接收的参数
            BankId:this.props.offPay.Id,
            TransType,
            Amount:depositMoney,
            AccountName:this.state.AccountName
        };
        new window.actions.ApiOfflineDepositAction(filter).fly((resp:any)=>{
            Toast.hide();
            if(resp.StatusCode===0) {
                window.actions.popWindowAction(
                    {
                        type: "DefiPop",
                        title: "线下支付申请成功",
                        text:[
                            `支付单号 ${resp.OrderNo}`,
                            `帐户名 ${this.props.offPay.AccountName}`,
                            `银行卡号 ${this.props.offPay.AccountNo}`,
                            `银行 ${this.props.offPay.Bank.BankName}`,
                        ],
                        leftBtn: {
                            text: "取消",
                            fc:()=>{
                                _this.hide();
                                window.actions.popWindowAction({type:""})
                            }
                        },
                        rightBtn:{
                            text: "前往查看",
                            fc:()=>{
                                _this.hide();
                                _this.props.push("/My/history/record/chongzhi")
                            }                    
                        }
                    }
                )
            }else{
                window.actions.popWindowAction({type: "Hint",text:resp.Message})
            }
        });
    }
    // 修改姓名
    AccountNameChange(val:string){
        if(val==="")return;
        this.setState({
            AccountName:val
        })
    }
    render() {
        let className = this.state.hide?"atmbox slideOutDown":"atmbox slideInUp";
        let BankName = this.props.offPay.Bank.BankName;
        return(
            <div className={className}>
                <div className="mask"></div>
                <div className="dom">
                    <div className="title">
                        <i className="icon iconfont icon-iconclose" onClick={this.hide.bind(this)}></i>银行转账
                    </div>
                    <div className="overflow">
                        <div className="amount">
                            请扫描下面的二维码转账:<span>￥{this.props.depositMoney}</span>
                        </div>
                        <div className="con">
                            <div className="qrcode">
                               <img alt="二维码" src={window.config.devImgUrl+this.props.offPay.ImageUrl} />
                            </div>
                            <div className="text">
                                <i className="icon icon-info-sign"></i>
                                <strong>长按保存二维码</strong>，或使用 <strong>截屏保存</strong>，打开{BankName}<strong>扫描相册二维码</strong>完成支付。如无法充值，请联系客服。
                            </div>
                            <div className="am-list UserBankInfo">
                                <div className="am-list-body">
                                    <div className="am-list-item am-input-item am-list-item-middle">
                                        <div className="am-list-line">
                                            <div className="am-input-label am-input-label-5">收款姓名:</div>
                                            <div className="am-input-control">
                                                <input type="text" id='account_name' style={{width:"75%"}} defaultValue={this.props.offPay.AccountName} contentEditable ={true} readOnly={false} />
                                                <button onClick={copyCode.bind(this,'account_name')} >复制</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="am-list-item am-input-item am-list-item-middle">
                                        <div className="am-list-line">
                                            <div className="am-input-label am-input-label-5">收款账号:</div>
                                            <div className="am-input-control">
                                                <input type="text" id='account_no' style={{width:"75%"}} defaultValue={this.props.offPay.AccountNo} contentEditable ={true} readOnly={false}/>
                                                <button onClick={copyCode.bind(this,'account_no')} >复制</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="am-list-item am-input-item am-list-item-middle">
                                        <div className="am-list-line">
                                            <div className="am-input-label am-input-label-5">收款银行:</div>
                                            <div className="am-input-control">
                                                <input type="text" id='account_BankName' style={{width:"75%"}} defaultValue={this.props.offPay.Bank.BankName} contentEditable ={true} readOnly={false}/>
                                                <button onClick={copyCode.bind(this,'account_BankName')} >复制</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>                            
                            <h3>转账信息</h3>
                            <List>
                                <InputItem
                                    defaultValue={this.state.AccountName}
                                    placeholder="请输入转账人姓名"
                                    onChange={this.AccountNameChange.bind(this)}
                                >用户姓名:</InputItem>
                            </List>
                            {
                                this.state.AccountName?
                                <a onClick={this.offlinePay.bind(this)} className="btn FinishAddMoneyBtn">转账完成点这里</a>
                                :<a className={"disabled btn"}>转账完成点这里</a>
                            }
                        </div>
                    </div>
                </div>
            </div>
        )   
  }
}
