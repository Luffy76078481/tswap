import React from "react";
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Toast,Icon,Switch} from 'antd-mobile';
import {checkIndex} from "tollPlugin/commonFun"
import "./TransferNew.scss";

type ApiGamePlatform = {
    Data:{
        [names:string]:number
    },
    StatusCode:number|string
}
class Transfer extends BaseClass {
  constructor(props: any) {
    super(props, [], true);
    this.state = {
      allLoading:true,
      transferAllOutState: true, // 一键转出-锁
      openLock: false, // 自动转账按钮锁
      platformsIdLoading: [],
      platforms:[],// 所有游戏平台
    };
  }
  static getDerivedStateFromProps(props: any, state:any) {
    // 平台信息
    if(props.platforms.length>0 && props.platforms.length!==state.platforms.length){
      return{
        platforms:props.platforms,
      }
    }
    // 平台信息和平台剩余余额是两个接口。
    if(props.platforms.length>0 && props.platforms.length===state.platforms.length && props.platforms[0].Balance!==undefined){
      return{
        platforms:props.platforms,
        allLoading:false
      }
    }
    return null;
  }
  componentDidMount() {
    new window.actions.ApiPlayerInfoAction().fly(); // 用户信息
  }
  // 刷新全部
  reloadAll() {
    this.setState({
      allLoading:true,
    },()=>{
      new window.actions.ApiGamePlatformAllBalanceAction().fly(() => {
        this.setState({
          allLoading: false
        });
        new window.actions.ApiPlayerInfoAction().fly(); // 会员信息
      });     
    });
  }
  // 平台单独刷新
  reload(platformsId:string) {
    let _this = this;
    new window.actions.ApiGamePlatformBalanceAction(platformsId).fly(() => {
      // 获取单个平台余额
      let index = checkIndex<string>(
        this.state.platformsIdLoading,
        platformsId
      ); // 通过值获取下标
      let newArr = this.state.platformsIdLoading;
      newArr.splice(index, 1);
      _this.setState({
        platformsIdLoading: newArr,
        transferAllOutState:true
      },()=>{
        if(this.state.platformsIdLoading.length===0){
          new window.actions.ApiPlayerInfoAction().fly();
        }
      });
    }, platformsId);
  }
  // 一键转出
  transferAllOut() {
    let _this = this;
    let transferArr:any = []; //空数组
    if (!this.state.transferAllOutState) return;
    for (let i = 0; i < this.state.platforms.length; i++) {
      let platform = this.state.platforms[i];
      if (platform.ID === 'YOPLAY') continue;
      if ( (platform.Balance && +platform.Balance >= 1) && !platform.Maintain ) {
        // 如果余额大于1存入空数组
        transferArr.push(platform);
      }
    }
    if (transferArr.length === 0) {
      // 余额大于1的平台为空数组时
      window.actions.popWindowAction({
        type: 'DefiPop',
        title: '抱歉',
        text: [`您的所有平台没有足够的余额可以转出`],
        leftBtn: {
          text: '前往充值',
          fc: () => {
            window.actions.popWindowAction({ type: '' });
            _this.props.history.push('/Money');
            _this.setState({
              transferAllOutState: true // 开锁
            });
          }
        }
      });
      return;
    } else {
      this.setState({
        transferAllOutState: false // 关锁
      });
    }
    // 参数
    let obj:{[key:string]:number} = {};// 转出平台
    let loadingPlat = []; // 转出平台的ID，为了LOADING
    for(let b = 0;b<transferArr.length;b++){
      let Balance = transferArr[b].Balance as number;
      obj[transferArr[b].ID] = Balance;
      loadingPlat.push(transferArr[b].ID)
    }
    Toast.loading('转出中,请稍后...', 30);
    this.setState({
      platformsIdLoading:loadingPlat
    },()=>{
      new window.actions.ApiTransferOutAction(obj).fly((resp:{StatusCode:number,Success:boolean,Message:string})=>{
        Toast.hide()
        if (resp.StatusCode === 0 || resp.Success === true) {
          for(let i=0; i<transferArr.length;i++){
            let platform:any = transferArr[i];
            _this.reload(platform.ID);
          }
        }else{
          this.setState({
            platformsIdLoading:[],
            transferAllOutState:true
          })
        }
      })
    })
  }
  // 游戏列表
  renderList() {
    let list: any[] = [];
    let tem: any[] = [];
    for (let i = 0; i < this.state.platforms.length; i++) {
      let item = this.state.platforms[i];
      let balanceDom: any; // 余额
      if (this.state.allLoading) {
        balanceDom = (
          <span className="loading">
            <Icon type="loading" />
          </span>
        );
      } else {
        if (this.state.platformsIdLoading.join(',').includes(item.ID)) {
          balanceDom = (
            <span className="loading">
              <Icon type="loading" />
            </span>
          );
        } else {
          if (item.Maintain) {
            balanceDom = (
              <span className="money" style={{color:'#f00'}}>维护中</span>
            );
          } else {  
            balanceDom = (
              <span className="money">{item.Balance!==undefined?item.Balance.toFixed(2):0}</span>
            );
          }
        }
      }
      //一个DIV放4个LI
      tem.push(
        <div
          key={i}
          onClick={
            this.props.user.AutoTransfer
              ? () => {
                  return;
                }
              : () => {
                  if (item.Maintain) {
                    return
                  } else {   
                    this.props.history.push(
                      '/My/transfer/transferGame/' + item.ID
                    );
                  }
                }
          }
        >
          <span className="tlt">{item.Name}</span>
          {balanceDom}
        </div>
      );
      if (tem.length === 4) {
        list.push(<li key={item.ID}>{tem}</li>);
        tem = [];
      }
      if (i === this.state.platforms.length-1 && tem.length > 0) {
        list.push(<li key={item.ID}>{tem}</li>);
      }
    }
    return <ul>{list}</ul>;
  }
  changeAutoTransfer() {
    if (this.state.openLock) return;
    Toast.loading('转账模式切换中...', 0.8);
    this.state.openLock = true;
    let open = this.props.user.AutoTransfer === 1 ? 0 : 1;
    let _this = this;
    new window.actions.ApiUpdateTransferSettingAction(open).fly(
      (resp: ApiGamePlatform) => {
        if (resp.StatusCode === 0) {
          new window.actions.ApiPlayerInfoAction().fly((resp: any) => {
            Toast.success('转账模式切换成功', 0.8);
          });
        } else {
          Toast.fail('转账模式切换失败', 0.8);
        }
        _this.setState({
          openLock: false
        });
      }
    );
  }
  getMoney(){//提款自动转入
      if(this.props.user.AutoTransfer){
          this.transferAllOut();
      }
      this.props.history.push('money/withdraw');
  }
  render() {
    return (
      <div className="transfer_page">
        <NavBar
          btnGoback={true}
          title={'资金管理'}
          customFunc={this.reloadAll.bind(this)}
          customTxt={'刷新'}
        ></NavBar>
        <div className="scroll-content">
          <div className="wrap">
            <ul>
              <li>
                <span className="tlt">主账户余额</span>
                <span className="money">{this.props.user.amount}</span>
              </li>
              <li>
                <span className="tlt">游戏总余额</span>
                <span className="money">{this.props.gameMoney}</span>
              </li>
              <li>
                <button onClick={this.transferAllOut.bind(this)}>一键回收</button>
              </li>
            </ul>
          </div>
          <div className="games">
            {this.renderList()}
          </div>
          <div className="autoTransfer">
            {this.props.user.AutoTransfer?(
              <span>
                <b>自动转账</b>(余额自动转入游戏)
              </span>
            ):(
              <span>请点击游戏名称进入手动转账页面</span>
            )}
            <Switch
              checked={this.props.user.AutoTransfer}
              onChange={this.changeAutoTransfer.bind(this)}
            />
          </div>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: ReducerState, ownProps: any) => ({
    user:state.user,
    platforms:state.game.platforms,
    gameMoney:state.game.gameMoney,
});
  
export default withRouter(connect(mapStateToProps)(Transfer));