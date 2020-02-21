import React from "react";
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {List,Switch,InputItem,Toast} from 'antd-mobile';

class TransGame extends BaseClass{
    constructor(props:any){
        super(props,[],true)
        let pathName:any = this.props.location.pathname.split("").reverse().join("");
        let routerName:string = pathName.substr(0,pathName.indexOf('/'));
        this.state={
            titleName:routerName.split("").reverse().join(""),//游戏ID
            Balance:0,
            money:"",
            transferType:true,
            submitState:true
        }
    }
    componentDidMount(){
        new window.actions.ApiGamePlatformBalanceAction(this.state.titleName).fly((resp:any)=>{
            if(resp.StatusCode===0){
                this.setState({
                    Balance:resp.Balance
                })
            }
        })
    }
    reload(platformId:string){
        new window.actions.ApiPlayerInfoAction().fly();
        new window.actions.ApiGamePlatformBalanceAction(platformId).fly((resp:any)=>{
            if(resp.StatusCode===0){
                this.setState({
                    Balance:resp.Balance
                })
                Toast.hide();
                //window.actions.popWindowAction({type:"Hint",text:"转账成功"})
            }
        });
    }
    transferIn(platformId:string,total:number){
        if(!this.state.submitState) return;
        let _this = this;
        new window.actions.ApiTransferAction (platformId,"in", total,true).fly((resp:any)=>{
            if (resp.StatusCode === 0) {
                this.reload(platformId);
            }else{
                Toast.hide();
                window.actions.popWindowAction({type:"Hint",text:resp.Message})
            }
            _this.setState({
                submitState:true
            })
        }, "transfer_in_" + platformId);
    }
    transferOut(platformId:string,total:number){
        if(!this.state.submitState) return;
        let _this = this;
        this.setState({
            submitState:false
        })
        new window.actions.ApiTransferAction (platformId,"out", total,true).fly((resp:any)=>{
            if (resp.StatusCode === 0) {
                this.reload(platformId);
            }else{
                Toast.hide();
                window.actions.popWindowAction({type:"Hint",text:resp.Message})
            }
            _this.setState({
                submitState:true
            })
        }, "transfer_out_" + platformId);
    }
    transfer(){
        let type = this.state.transferType;
        let total = this.state.money;
        let totalMoney = type?this.props.user.amount:this.state.Balance;
        let text = type?"转入":"转出";
        if (!total) {
            window.actions.popWindowAction({type:"Hint",text:'请填写转账金额!'})
            return;
        }else if(total<1){
            window.actions.popWindowAction({type:"Hint",text:"转账金额必须大于1元!"})
            return;
        }else if(total>totalMoney){
            window.actions.popWindowAction({type:"Hint",text:'您的'+text+'金额超出了余额!'})
            return;
        }
        Toast.loading(text+'中,请稍后...',300);
        if(type){
            this.transferIn(this.state.titleName,total)
        }else{
            this.transferOut(this.state.titleName,total)
        }
    }
    render(){
        return(
            <div className='transGame'>
                <NavBar btnGoback={true} title={`${this.state.titleName}游戏转账`}></NavBar>
                <div className="scroll-content MoneyManage">               
                    <List>
                        <List.Item extra={this.props.user.amount+"RMB"} align="middle">主账户余额</List.Item>
                        <List.Item extra={this.props.user.userBalance+"RMB"} align="middle">总财富</List.Item>
                        <List.Item extra={this.state.Balance} align="middle">平台余额</List.Item>
                        <List.Item
                            extra={<Switch
                                checked={this.state.transferType}
                                onChange={() => {
                                    this.setState({
                                        transferType: !this.state.transferType,
                                    });
                                }}
                            />
                            }
                        >
                            转入转出
                        </List.Item>
                        <InputItem
                            type="number"
                            onChange={(val:any)=>this.setState({money:val-0})}
                            value = {this.state.money}
                            maxLength={15}
                            placeholder="请填写转账金额"
                            extra={<span className='allM' onClick={()=>{this.setState({money:(this.state.transferType ? this.props.user.amount : this.state.Balance)})}}>全部</span>}
                            clear
                        >转账金额</InputItem>
                    </List>    
                    <button onClick={this.transfer.bind(this)} className="btn">{this.state.transferType?"转入":"转出"}{this.state.titleName}</button>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state: ReducerState, ownProps: any) => ({
    user:state.user,
    backConfigs:state.backConfigs,
    remoteSysConfs:state.remoteSysConfs,
    platforms: state.game.platforms,
});
  
export default withRouter(connect(mapStateToProps)(TransGame));