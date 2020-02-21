import React from "react";
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {InputItem,List,Picker,Toast} from 'antd-mobile';
import {Link} from "react-router-dom";
import "./Withdraw.scss";
import { numberWithCommas } from 'tollPlugin/commonFun';
import MessagePop from "components/popWindow/MsgWindow"



type State = {
    money:string|undefined,
    Accounts:any[],
    AccountsValue:any[],
    AccountsId: string,
    PayType:string,
    audit_amount:number|string,      
    canWithdrawState:boolean,   
    passVal:string,
    showPop:boolean,
    type:string
}
type BankDom = {
    label:string,
    id:string|number,
    PayType:string,
    value:number,
}
type BankInfo = {
    Bank:{
        BankName:string
    },
    AccountNo:string,
    PayType:string,
    Id:string|number,
}
function bankList<T extends BankInfo>(arg:T[]):BankDom[]{
    return arg.map((item:BankInfo,i:number)=>{
        return({
            label:`${item.Bank.BankName} [ **** **** **** ${item.AccountNo.substr(-4)}]`,
            id:item.Id,
            PayType:item.PayType,
            value:i
        })
    })
}
class Withdraw extends BaseClass {
  constructor(props: any) {
    super(props, ['user'], true);
    let list: object[] | number[] = bankList(this.props.user.bankAccounts);
    this.state = {
      money: '',
      Accounts: list, // 银行卡下拉
      AccountsValue: [0],
      AccountsId:
        this.props.user.bankAccounts.length > 0
          ? this.props.user.bankAccounts[0].Id
          : '',
      PayType: '',
      audit_amount: 0,
      canWithdrawState: true, //取款状态锁
      passVal: '', //提款密码
      showPop: false,
      popType: 'phone', // Pop弹窗类型
      transferAllOutState: true, // 一键转出-锁
      platformsIdLoading: []
    };
  }
  static getDerivedStateFromProps(props: any, state: State) {
    if (state.Accounts.length < 1 && props.user.bankAccounts.length > 0) {
      return {
        Accounts: bankList(props.user.bankAccounts),
        AccountsValue: [0],
        AccountsId: props.user.bankAccounts[0].Id
      };
    }
    return null;
  }
  componentDidMount() {
    // 一键转账
    this.transferAllOut()
    //获取银行卡
    new window.actions.ApiBankAccountsAction().fly(
      (resp: { List: object[]; StatusCode: number }) => {
        if (resp.StatusCode === 0) {
          if (resp.List.length < 1 && this.state.Accounts.length < 1) {
            window.actions.popWindowAction({
              type: 'DefiPop',
              title: '无法取款',
              text: [
                `因没有绑定取款信息`,
                `需完善个人取款信息即可执行取款操作`
              ],
              leftBtn: {
                text: '完善信息',
                fc: () => {
                  window.actions.popWindowAction({ type: '' });
                  this.props.history.push('/My/cardManage');
                }
              }
            });
          }
        }
      }
    );
    new window.actions.ApiGetAuditAction().fly(
      (res: { TotalFee: number | string }) => {
        this.setState({
          audit_amount: res.TotalFee ? res.TotalFee : 0 // 稽核数
        },()=>{
          console.log(res)
        });
      }
    );

    new window.actions.ApiPlayerInfoAction().fly(); //获取会员信息

  }
  accountsChange(val: any[number]) {
    let index = val[0];
    this.setState({
      AccountsValue: [index],
      AccountsId: this.state.Accounts[index].id,
      PayType: this.state.Accounts[index].PayType
    });
  }
  onSubmit(e: any) {
    e.preventDefault();
    let self = this;
    let accountId = this.state.AccountsId;
    let money = this.state.money;
    let password = this.state.passVal;
    if (this.props.user.amount < money) {
      Toast.info('取款金额已经超出您的余额', 1);
      return;
    }
    if (!money) {
      Toast.info('取款金额必须大于0', 1);
      return;
    }
    if (money < 100) {
      Toast.info('单笔最低提款100', 1);
      return;
    }
    if (!accountId) {
      Toast.info('取款账号未指定', 1);
      return;
    }
    if (!password) {
      Toast.info('取款密码未指定', 1);
      return;
    }
    if (!this.props.user.verfyPhone) {
      Toast.info('手机未验证', 1);
      return;
    }
    //验证过手机
    if (!this.props.user.verfyPhone && this.props.backConfigs.IsBindingPhone) {
      this.setState({
        showPop: true
      });
      return;
    }
    this.setState({
      canWithdrawState: false,
      AccountsValue: this.state.AccountsValue,
      money: 0,
      passVal: this.state.passVal
    });
    Toast.loading('提款申请中...', 300);
    let filter = {
      BankAccountId: accountId,
      Amount: money,
      WithdrawalPwd: password,
      CodeType: this.state.PayType,
      UserAuditConfirm: false
    };
    new window.actions.ApiWithdrawAction(filter).fly((resp: any) => {
      Toast.hide();
      if (resp.StatusCode === 0) {
        if (resp.Success) {
          window.actions.popWindowAction({
            type: 'Hint',
            text: '提款申请处理中,请稍后。'
          });
          new window.actions.ApiPlayerInfoAction().fly();
          new window.actions.ApiGamePlatformAllBalanceAction().fly();

          self.setState({
            canWithdrawState: true
          });
          return;
        }
        if (resp.NeedToAudit) {
          //如果取款需要稽核时
          let AllowWithdrawals = resp.AllowWithdrawals; //稽核不通过，是否允许提款
          let amount = parseInt(money);
          let TotalFee = numberWithCommas(resp.TotalFee, 2); //手续费
          let leftFee = amount - TotalFee; //减去手续费后的值
          if (amount < Number(TotalFee)) {
            window.actions.popWindowAction({
              type: 'DefiPop',
              title: '取款失败',
              text: [`提款所需完成的流水不足，您还需完成的打码量是${TotalFee}`],
              leftBtn: {
                text: '确定',
                fc: () => {
                  window.actions.popWindowAction({ type: '' });
                }
              }
            });
            self.setState({
              canWithdrawState: true
            });
            return;
          } else if (amount + Number(TotalFee) > self.props.user.amount) {
            window.actions.popWindowAction({
              type: 'DefiPop',
              title: '取款失败',
              text: [
                `您账户的余额不足,稽核金额¥ ${TotalFee}`,
                `提款金额¥ ${amount}`,
                `已经大于您的账户余额¥ ${self.props.user.amount}`
              ],
              leftBtn: {
                text: '确定',
                fc: () => {
                  window.actions.popWindowAction({ type: '' });
                }
              }
            });
            self.setState({
              canWithdrawState: true
            });
            return;
          } else if (AllowWithdrawals) {
            window.actions.popWindowAction({
              type: 'DefiPop',
              title: '取款稽核确认',
              text: [
                `提款需扣除行政费用¥～${TotalFee}`,
                `实际提款金额¥～${leftFee}`
              ],
              leftBtn: {
                text: '取消',
                fc: () => {
                  self.setState({
                    canWithdrawState: true
                  });
                  window.actions.popWindowAction({ type: '' });
                }
              },
              rightBtn: {
                text: '确认',
                fc: () => {
                  Toast.loading('提款申请中...', 300);
                  let filtertwo = {
                    //后台要接收的参数
                    BankAccountId: accountId,
                    Amount: money,
                    WithdrawalPwd: password,
                    CodeType: self.state.PayType,
                    UserAuditConfirm: true
                  };
                  new window.actions.ApiWithdrawAction(filtertwo).fly(
                    (resp: any) => {
                      if (resp.StatusCode === 0) {
                        window.actions.popWindowAction({
                          type: 'Hint',
                          text: '恭喜您,取款申请成功'
                        });
                        new window.actions.ApiPlayerInfoAction().fly();
                        new window.actions.ApiGamePlatformAllBalanceAction().fly();
                      } else {
                        window.actions.popWindowAction({
                          type: 'Drawing',
                          text: resp.Message
                        });
                      }
                      Toast.hide();
                      self.setState({
                        canWithdrawState: true
                      });
                    }
                  );
                }
              }
            });
            return;
          } else {
            window.actions.popWindowAction({
              type: 'DefiPop',
              title: '取款失败',
              text: [`您的稽核未完成，提款需扣除行政费用是¥+${TotalFee}`],
              leftBtn: {
                text: '确定',
                fc: () => {
                  window.actions.popWindowAction({ type: '' });
                }
              }
            });
            self.setState({
              canWithdrawState: true
            });
            return;
          }
        }
      } else {
        window.actions.popWindowAction({
          type: 'DefiPop',
          title: '取款申请失败',
          text: [`${resp.Message}`],
          leftBtn: {
            text: '确定',
            fc: () => {
              window.actions.popWindowAction({ type: '' });
            }
          }
        });
        self.setState({
          canWithdrawState: true
        });
      }
    });
  }
  // 一键回收
  transferAllOut() {
    let _this = this;
    let transferArr = [];//空数组
    for (let i = 0; i < this.props.platforms.length; i++) {
        let platform = this.props.platforms[i];
        if (platform.ID === "YOPLAY") continue;
        if ( (platform.Balance && platform.Balance >= 1) && !platform.Maintain  ) { // 如果余额大于1存入空数组
            transferArr.push(platform);
        }
    }
    if(transferArr.length === 0) {  
        return
    }
    for (let i = 0; i < transferArr.length; i++) {
      let platform = transferArr[i];
      let index = i + 1;
      new window.actions.ApiTransferAction(platform.ID, "out", parseInt(platform.Balance)).fly((resp:any) => {
          if (resp.StatusCode === 0) {
              _this.reload(platform.ID);// 刷新
          }
          if (index === transferArr.length) {
              _this.setState({
                  transferAllOutState: true,// 开锁
              })
          }
      }, "transfer_" + platform.ID);
    }
  }
  reload(platformsId:string) {
      new window.actions.ApiPlayerInfoAction().fly();
      new window.actions.ApiGamePlatformBalanceAction(platformsId).fly(()=>{},platformsId);
  }
  render() {
    let extraBtn = (
      <div className="addAmount">
        <a onClick={() => this.setState({ money: this.props.user.amount - 0 })}>
          全部
        </a>
      </div>
    );
    return (
      <div className="WithdrawPage FadePage">
        <NavBar btnGoback={true} tutorial={true} title={'取款'}></NavBar>
        <div className="scroll-content">
          <div className="circle-wrap">
            <List>
              <List.Item>
                <span className="title">主账户余额</span>
                <span>
                  {this.props.user.amount}
                  <em> RMB</em>
                </span>
              </List.Item>
              <List.Item>
                <span className="title">总财富</span>
                <span>
                  {this.props.user.userBalance}
                  <em> RMB</em>
                </span>
              </List.Item>
              <List.Item>
                <span className="title">单笔最低提款100元</span>
                <span>您还需完成的打码量为: {this.state.audit_amount}</span>
              </List.Item>
            </List>
          </div>
          <div className="circle-wrap">
            <List>
              <List.Item className="noPaddingLeft" extra={extraBtn}>
                <InputItem
                  type="digit" //原生的number类型支持小数
                  ref="money"
                  placeholder="请填写转账金额"
                  clear
                  maxLength={15}
                  value={this.state.money}
                  onChange={v => this.setState({ money: v })}
                >
                  金额
                </InputItem>
              </List.Item>
              <div className="accounts">
                <Picker
                  extra="请选择收款账号"
                  data={this.state.Accounts}
                  value={this.state.AccountsValue}
                  cols={1}
                  onOk={val => {
                    this.accountsChange(val);
                  }}
                >
                  <List.Item arrow="down">收款账号</List.Item>
                </Picker>
              </div>
              <InputItem
                type="password"
                placeholder="请输入提款密码"
                onChange={v => this.setState({ passVal: v })}
              >
                提款密码
              </InputItem>
            </List>
          </div>
          <p className="tips">
            *初始提款密码默认为登录密码或者0000，为了保障资金安全，建议您立即去
            <Link to="/My/editPassword">修改密码</Link>页面修改密码!
          </p>
          <button onClick={this.onSubmit.bind(this)} className="btn">
            提 交
          </button>
        </div>
        {this.state.showPop ? (
          <MessagePop
            {...this.state}
            hidePop={() => this.setState({ showPop: false })}
          ></MessagePop>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state: ReducerState, ownProps: any) => ({
    user:state.user,
    state:state,
    platforms: state.game.platforms,
});
  
export default withRouter(connect(mapStateToProps)(Withdraw));