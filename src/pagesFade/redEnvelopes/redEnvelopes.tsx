import React from "react";
import BaseClass from "@/baseClass";
import {withRouter} from "react-router-dom";
// import * as ReactDOM from 'react-dom';
import {connect} from "react-redux";
import {Toast} from 'antd-mobile';
import BScroll from 'better-scroll'
import {clearHtml } from "tollPlugin/commonFun";
import "./redEnvelopes.scss"

type APIParam = {
    StatusCode:number,
    Message:string,
    [names:string]:any
}
let timer:any;
let seamlessRoll:any; // 向上滑动
class RedEnvelopes extends BaseClass{
    constructor(props:any){
        super(props,[],true)
        this.state = {
            title:"",
            remind:"",
            startTime:"",
            endTime:"",
            showWinnerList:false,
            top:0,
            isCloeActivity:false
        }
    }
    componentWillUnmount(){
        clearInterval(timer)
        clearInterval(seamlessRoll)
    }
    componentDidMount(){
        new window.actions.AwardslistAction().fly()//中奖信息列表
        // 红包信息API
        new window.actions.ApiActivityInfoAction().fly((resp:APIParam)=>{
            if(resp.StatusCode===0){
                let startTime = resp.LuckyInfo.StartTime.replace('T',' ');
                let endTime = resp.LuckyInfo.EndTime.replace('T',' ');
                let now = new Date();
                if(now.getTime()>Date.parse(endTime)){
                    this.setState({
                        title:"本期活动结束",
                        remind:"请下次参与"
                    })
                }else if(now.getTime()<Date.parse(startTime)){
                    clearInterval(timer)
                    this.setState({
                        nowTime:new Date(),
                        startTime:startTime,
                        endTime:endTime,
                        title:"距离下期开始",
                    },()=>{
                        timer = setInterval(()=>{
                            let timeGMT = new Date(Date.parse(this.state.nowTime))//转换GMT                 
                            let NowTime = this.state.nowTime.setTime( (timeGMT.getTime()+1000) );// 每次加1秒，方能倒计时
                            let t = Date.parse(this.state.startTime) - NowTime;//时间戳差
                            let d = Math.floor(t / 1000 / 60 / 60 / 24);
                            let h = Math.floor(t / 1000 / 60 / 60 % 24);
                            let m = Math.floor(t / 1000 / 60 % 60);
                            let s = Math.floor(t / 1000 % 60);
                            this.setState({
                                remind:`${d}天${h}时${m}分${s}秒`
                            })
                        },1000);                
                    })
                }else if(now.getTime()<Date.parse(endTime)){
                    clearInterval(timer)
                    this.setState({
                        title:"活动正进行中",
                        nowTime:new Date(),
                        startTime:startTime,
                        endTime:endTime,
                    },()=>{
                        timer = setInterval(()=>{
                            let timeGMT = new Date(Date.parse(this.state.nowTime))//转换GMT                 
                            let NowTime = this.state.nowTime.setTime( (timeGMT.getTime()+1000) );// 每次加1秒，方能倒计时
                            let t = Date.parse(this.state.endTime) - NowTime;//时间戳差
                            let d = Math.floor(t / 1000 / 60 / 60 / 24);
                            let h = Math.floor(t / 1000 / 60 / 60 % 24);
                            let m = Math.floor(t / 1000 / 60 % 60);
                            let s = Math.floor(t / 1000 % 60);
                            this.setState({
                                remind:`${d}天${h}时${m}分${s}秒`
                            })
                       },1000)                      
                    })
                }
            }else{
                this.setState({
                    title:resp.Message, 
                    isCloeActivity:true
                })
            }
        })
        let wrapper:any = document.querySelector('.wrapper')
        new BScroll(wrapper,{click:true,}) 
    }
    componentDidUpdate(){
        let listEle = this.refs.awardsCot as HTMLElement;
        if(listEle!==undefined){
            let ulHeight = listEle.scrollHeight || 0;
            if(ulHeight>0){
                clearInterval(seamlessRoll)
                seamlessRoll = setInterval(()=>{
                    if(ulHeight>=this.state.top){
                        this.setState({
                            top:this.state.top+1
                        })
                    }else{
                        this.setState({
                            top:0
                        })
                    }
                },40)            
            }            
        }
    }
    prizeList(){
        return(
            <ul className='awardsCot' ref='awardsCot' style={{"top":-this.state.top}}>
                {
                    this.props.awradsList.map((item:any,index:number)=>{
                        let UserName = item.User.UserName;
                        return(
                            <li key={index}>
                                <span>恭喜会员</span>&nbsp;
                                <span className='yellow fixW'>{UserName}</span>&nbsp;
                                <span>用户获得</span>
                                <span className='yellow money'>{item.LuckyItem.Prizes}</span>
                                <span >元</span>
                            </li>
                        )
                    })
                }
            </ul>
        )     
    }
    // 查询抽奖次数
    checkUser(){
        Toast.loading('查询抽奖信息中...',300);
        new window.actions.ApiCheckActivityCountsAction().fly((resp:APIParam)=>{  
            Toast.hide();       
            if(resp.StatusCode === 0 && resp.Count>0){
                new window.actions.ApiLuckDrawAction().fly((resp:APIParam)=>{
                    if(resp.StatusCode === 0){
                        if(resp.Winning === true || resp.Winning === 'true' ){
                            window.actions.popWindowAction({ type:"DefiPop",title:"恭喜发财",text:"您获得红包奖励"+resp.Prize+"元" })
                        }
                    }else{
                        window.actions.popWindowAction({ type:"DefiPop",title:"温馨提示",text:resp.Message })
                    }
                })
            }else{
                setTimeout(()=>{
                    window.actions.popWindowAction({ type:"DefiPop",title:"温馨提示",text:[`没有剩余次数`] })
                },300)
            }
        })
    }
    winnerList(){
        let tableDom:any[] = []
        if(this.props.WinnerList.length>0){
            this.props.WinnerList.map((item:any,i:number)=>{
                return tableDom.push(
                    <tr key={i}>
                        <td>{item.LuckyItem['Prizes']}</td>
                        <td>{item.CreateTime.replace("T"," ")}</td>
                        <td>{item.StatusText}</td>
                    </tr>
                )
            })
        }else{
            tableDom.push(
                <tr key={'poor'}><td colSpan={3}>未找到相关信息</td></tr>
            );
        }
        return tableDom
    }
    checkWinner(){
        new window.actions.ApiAwardsWinnerListAction().fly()//中奖信息列表
        this.setState({
            showWinnerList:true
        })
    }
    render(){
        return(
            <div className='RedEnvelopes FadePage'>
                <div className='top'>
                    <div className='goback' onClick={()=>this.props.history.goBack()}>
                        <span className="icon iconfont icon-fanhui" />
                    </div>
                    <div>
                        <p>抢红包</p>
                    </div>
                    <div>
                        <button className='check_redEnv' onClick={this.checkWinner.bind(this)}>中奖查询</button>
                    </div>
                </div>
                {
                    this.state.showWinnerList?
                    <div className='List_Of_winners'>
                        <div className='shelter'></div>
                        <div className='close'>
                            <i className="icon iconfont icon-iconclose" onClick={()=>{this.setState({showWinnerList:false})}}></i>
                        </div>
                        <div className='tableWinner'>
                            <p>获奖历史记录</p>
                            <div className='tableScr'>
                                <table>
                                    <thead className="winnerHead"><tr><td>中奖详情</td><td>领取时间</td><td>是否派彩</td></tr></thead>
                                    <tbody>
                                        {this.winnerList()}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>:null                    
                }
                <div className='redEnvCots wrapper'>
                    <div className="content">
                        <main>                 
                            <div className="notice"> 
                                <span className='title'>{this.state.title}</span><br/>
                                <span className='cots'>{this.state.remind}</span>
                            </div>
                            <div className='redButtons'>
                                <button className='rob_redEnv' onClick={this.checkUser.bind(this)}>点击抢红包</button>
                            </div>
                            {
                                this.state.isCloeActivity?null:
                                <div className='redEnv_wrap'>
                                    <title className='listTit'></title>
                                    <div className='prizeList'>
                                        {this.prizeList()}
                                    </div>
                                    <title className='details'></title>
                                    <div className='detailsCot' dangerouslySetInnerHTML={{__html:clearHtml(this.props.Description)}}></div>
                                    <title className='role'></title>
                                    <div className='roleCot' dangerouslySetInnerHTML={{__html:this.props.RuleDes}}></div>                    
                                </div>
                            }
                        </main>                    
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state: ReducerState, ownProps: any) => ({
    awradsList:state.Activity.List,
    WinnerList:state.Activity.WinnerList,
    Description:state.Activity.Description,
    RuleDes:state.Activity.RuleDes
});
  
export default withRouter(connect(mapStateToProps)(RedEnvelopes));