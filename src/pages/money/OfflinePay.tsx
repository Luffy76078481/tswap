import React from "react";
import BaseClass from "@/baseClass";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Flex,InputItem,List} from 'antd-mobile';
import {checkIndex} from "tollPlugin/commonFun";
// import QrBox from './QrBox'
// import AtmBox from './AtmBox'

interface State{
    offlinePayItem:any,
    depositMoney:string,
    boxData:any,
    showQrBox:boolean,
    showBox:boolean
}
class OfflinePay extends BaseClass{
    public state:State = {
        offlinePayItem:this.props.offlinePayItem, // 银行信息
        depositMoney:"",    // 充值金额
        boxData:{},         // 数据通信-AtmBox或QrBox
        showQrBox:false,    // 银行转账或三方支付判断
        showBox:false       // 是否显示转账信息，点击下一步后为true
    };
    constructor(props:any){
        super(props,["user"],true);
    }
    // 父级状态改变
    static getDerivedStateFromProps(props: any, state: State){  
        if(props.offlinePayItem!==state.offlinePayItem){
            return({
                offlinePayItem:props.offlinePayItem
            })
        }
        return null    
    }
    // 输入金额
    changeAmountInput(val:string) {
        if(this.props.quickPrice){
            checkIndex<string>(this.props.quickPrice.split(','),val)
        }
        this.setState({
            depositMoney:val,
        })
    }
    // 点击快捷金额
    setAmount(item:string,i:number) {
        let minAmount = this.state.offlinePayItem.MinAmount;
        let maxAmount = this.state.offlinePayItem.MaxAmount;
        if (item < minAmount || item > maxAmount) return;
        this.setState({
            depositMoney:this.props.backConfigs.isDecimal==='1'?(+item+Math.random()+0.01).toFixed(2):item,
        })
    }
    // 显示银行信息表单
    nextBox(){
        let offPay = this.state.offlinePayItem;      
        if(Object.keys(offPay).length===0){
            window.actions.popWindowAction({type:"Hint",text:"无银行信息"})
            return
        }
        let depositMoney = Number(this.state.depositMoney)
        if (!depositMoney || depositMoney === 0 || depositMoney < offPay.MinAmount || depositMoney > offPay.MaxAmount) {
            window.actions.popWindowAction(
                {
                    type: "DefiPop",
                    title:"存款金额错误",
                    text:[
                        `${offPay.Bank.BankName}`,
                        `允许存款金额范围：`,
                        `${offPay.MinAmount} ～ + ${offPay.MaxAmount}`
                    ],
                    leftBtn:{
                        text:"确定",
                        fc:()=>{
                            window.actions.popWindowAction({ type: "" })
                        }                       
                    }

                }
            )
            return;
        }
        this.props.setPayData(offPay,depositMoney,this.state.offlinePayItem.Type)
    }
    render() {
        let quickAmountArr = (!!this.props.quickPrice && this.props.quickPrice.split(',')) || [51, 101, 201, 501, 1001, 2001, 5001, 100001];
        return (
        <div className="offinepay">
            <label className='pickPay'>存款金额</label>
            <List.Item className="depositMoney">
                <InputItem
                    ref="money"
                    clear
                    value={this.state.depositMoney}
                    maxLength={15}
                    type="digit"// number类型支持小数
                    onChange={this.changeAmountInput.bind(this)}
                    placeholder={"请填写存款金额，范围为" + (this.state.offlinePayItem.MinAmount || ' ') + '~' + (this.state.offlinePayItem.MaxAmount || ' ')}
                >￥</InputItem>
            </List.Item>
            {
                this.props.backConfigs.isDecimal==='1'? <p className="warning">*（快捷/固定）选取的金额会随机生成2位小数。</p>:
                <p className="warning">为了您存款快速到账，请输入非整百带小数的金额</p>
            }
           
            <Flex className="quick-amount" wrap="wrap" justify="center">
                {
                    // 快捷金额
                    quickAmountArr.map((item:any,i:number) => {
                        let minAmount = this.state.offlinePayItem.MinAmount;
                        let maxAmount =this.state.offlinePayItem.MaxAmount;
                        let className= 'inline';
                        if(Number(parseInt(this.state.depositMoney)) === Number(item)) className='inline active';
                        if( item<minAmount || item>maxAmount) className='inline disable';
                        return(
                            <div key={i} className={className} onClick={this.setAmount.bind(this,item,i)}>{item}元</div>
                        )
                    })
                }
            </Flex>        
            <a onClick={this.nextBox.bind(this)} className="btn">下一步</a>                     
            <p className={'reminderTxt'}>{!!this.props.reminder && this.props.reminder}</p>   
            {/* {
                this.state.showBox && (
                    this.state.showQrBox ?
                    <QrBox hide={()=>this.setState({showBox: false})} {...this.state.boxData} />:
                    <AtmBox hide={()=>this.setState({showBox: false})} {...this.state.boxData} />
                )
            }                */}
        </div>
        );
    }
}

const mapStateToProps = (state: ReducerState, ownProps: any) => ({
    user:state.user,
    backConfigs:state.backConfigs
});

export default withRouter(connect(mapStateToProps)(OfflinePay));

