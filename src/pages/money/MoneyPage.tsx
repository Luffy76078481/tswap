/*

      存款页-业务逻辑难度：★★★★★
*/

import React from "react";
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Flex,Picker,List} from 'antd-mobile';
import OfflinePay from './OfflinePay'; //银行转账
import OnlinePay from './OnlinePay'
import BScroll from 'better-scroll'
import "./money.scss";
import QrBox from './QrBox'
import AtmBox from './AtmBox'

interface State{
    remark:string,
    payCode:string,
    payMethodList:any[],
    payMethodValue:number[],
    reminder:string,
    showOnlinePay:boolean,
    payList:any[],
    quickPrice:string,
    OnlinePay:{
      bankName:string,
      onlinePayList:any[],
      quickPrice:string,
      reminder:string,
    }
    OfflinePay:{
      bankName:string,
      offlinePayItem:any,
      quickPrice:string,
      reminder:string,
      id:string|number
    },
    boxData:any,
    showQrBox:boolean,
    showBox:boolean
}
function listVal(list:any[]):any{
    return list.map((item,i)=>{
        return({
          label: (
              <div key={i} className='payChannel'>
                  <span>{(item.BankName || item.Bank.BankName) + (item.AliasName ? ' - ' + item.AliasName : "")} </span>
              </div>
          ),
          selfObj:item,
          value:i      
        })
    })
}
class MoneyPage extends BaseClass{
    public state:State = {
      remark:"",            // 每一种支付方式下的提示语
      payMethodValue:[0],
      reminder: '', 
      showOnlinePay: false, // true 第三方 false 银行转账
      payList:[],           // 所有支付方式
      payCode: "",          // 当前选择的支付方式对应代码，用于ActiveClass
      payMethodList:[],     // 当前选择支付方式下的银行转账与三方支付合集
      quickPrice:"",
      OnlinePay: {
        bankName: "",
        onlinePayList: [],
        quickPrice:"",
        reminder:""
      },
      OfflinePay: {
          bankName: "",
          offlinePayItem: {},
          quickPrice:"",
          reminder:"",
          id:""
      },

      boxData:{},         // 数据通信-AtmBox或QrBox
      showQrBox:false,    // 银行转账或三方支付判断
      showBox:false       // 是否显示转账信息，点击下一步后为true
    };
    constructor(props:any){
      super(props,['pay','quickPrice'],true);
    }
    componentDidMount(){
      new window.actions.ApiGetAllPayAction().fly() 
      let wrapper:any = document.querySelector('.wrapper')
      new BScroll(wrapper,{
        click:true,
      }) 
    }
    static getDerivedStateFromProps(nextProps:any, prevState:State){
      if(nextProps.pay.length!==prevState.payList.length){
        let Banks = [...nextProps.pay[0].PayBanks.AdminBanks,...nextProps.pay[0].PayBanks.ThirdPayBanks];
        let nowPay = listVal(Banks);
        let quickPrice = nextProps.quickPrice;
        let bankName = Banks[0].BankName || Banks[0].Bank.BankName;
        return{
          payList:nextProps.pay,
          payCode:nextProps.pay[0].PayTypeCode,
          remark:nextProps.pay[0].Remark,
          payMethodList:nowPay,
          quickPrice:quickPrice,
          showOnlinePay: (Banks[0].PayType===2?false:Banks[0].PayType!==2),
          OnlinePay: {
            bankName,
            reminder: Banks[0].Reminder,
            onlinePayList: Banks[0],
            quickPrice:quickPrice
          },
          OfflinePay: {
              bankName,
              reminder: Banks[0].Reminder,
              id: Banks[0].Id,
              offlinePayItem: Banks[0],
              quickPrice:quickPrice
          },
        }
      }
      return null
    }
  setPayData(offPay:any,depositMoney:any,offlinePayItem:any){
    this.setState({
      showBox: true,
      showQrBox: (offlinePayItem === 3),// 3为三方支付，2为银行转账
      boxData: {
          offPay,
          depositMoney,
          user:this.props.user,
          ...this.props.history
      }
  });
  }
  // 选择支付方式
  tabChange(TypeCode:string,remark:string,banks:any,){
      let payMethodList:any[] = listVal([...banks.AdminBanks, ...banks.ThirdPayBanks])
      this.setState({
          payCode: TypeCode,
          remark: remark,
          payMethodList:payMethodList
      });
      this.setBankMsg(payMethodList[0])
    }
    changePay(val:any){
        if(val[0]<0)return
        this.setBankMsg(this.state.payMethodList[val[0]],val[0])
    }
    setBankMsg(bank:any,i:number=0){
        let nowbank = bank.selfObj;
        let bankName = nowbank.BankName || nowbank.Bank.BankName;
        this.setState({
            payMethodValue: [i],
            showOnlinePay: (nowbank.PayType === 2 ? false : nowbank.PayType !== 2),
            OnlinePay: {
                bankName,
                reminder: nowbank.Reminder,
                onlinePayList: nowbank,
                quickPrice:this.state.quickPrice
            },
            OfflinePay: {
                bankName,
                reminder: nowbank.Reminder,
                id: nowbank.Id,
                offlinePayItem: nowbank,
                quickPrice:this.state.quickPrice
            },
        });
    }
    render() {
        return (
            <div className="MoneyPage">
              {/* 头部 */}
              <NavBar btnGoback={true} deposit={true} title={"存款"}></NavBar>
              {/* 内容 */}
              <div className="scrollCont wrapper" ref='wrapper'>
                <div className='content'>
                  <label className="pickPay">支付方式</label>
                  {
                    // 每一种支付方式下的留言
                    this.state.remark && <p className='remark'>{this.state.remark}</p>
                  }
                  <Flex>
                    {
                      // 支付方式
                      this.state.payList?this.state.payList.map((item:any,i:number)=>{
                        let className = "tabsItem";
                        if (this.state.payCode === item.PayTypeCode) className = "tabsItem active";
                        return(
                          <div key={i}  
                            className={className + (item.Discounted ? ' iscounted' : '')+ (item.Recommend ? ' recommend' : '')}
                            onClick={this.tabChange.bind(this,item.PayTypeCode,item.Remark,item.PayBanks)}>
                            <Flex.Item>
                              {
                                item.Id === 0 ?<div className={'otherPay'}/>:
                                <img src={ window.config.devImgUrl + item.ImageUrl} alt="二维码"/>
                              }
                              <div className={'text'}>{item.PayTypeName}</div>
                              <div className='checkIcon'/>
                              <div className='recommendImg'/>
                            </Flex.Item>
                          </div>
                        )}
                      ):null           
                    }
                  </Flex>
                  
                  <div className='payMethodValue'>
                    {
                      this.state.payMethodList.length === 1?null:
                      <div className="pickBanks">
                        <label className="pickPay">支付通道</label>
                        <Picker 
                          extra={"请选择银行"}
                          data={
                              this.state.payMethodList.length === 0?
                              [{label: (<span>抱歉,暂无数据!</span>),value:-1}]:
                              this.state.payMethodList
                          }
                          value={this.state.payMethodValue}
                          ref="payMethod"
                          cols={1}
                          onOk={(val) => this.changePay(val)}>
                          <List.Item arrow="down"/>
                        </Picker>                     
                      </div>
                    }       
                  </div>   
                  {
                    this.state.showOnlinePay ?
                    <OnlinePay {...this.state.OnlinePay}/>:
                    <OfflinePay {...this.state.OfflinePay} setPayData={this.setPayData.bind(this)}/>
                  }                                
                </div>                 
              </div>  
              {
                  this.state.showBox && (
                      this.state.showQrBox?
                      <QrBox hide={()=>this.setState({showBox: false})} {...this.state.boxData} />:
                      <AtmBox hide={()=>this.setState({showBox: false})} {...this.state.boxData} />
                  )
              } 
            </div>
        );
    }
}

const mapStateToProps = (state: ReducerState, ownProps: any) => ({
  pay: state.getAllPay.PayList,
  quickPrice:state.getAllPay.QuickPrice,
  user:state.user,
});

export default withRouter(connect(mapStateToProps)(MoneyPage));

