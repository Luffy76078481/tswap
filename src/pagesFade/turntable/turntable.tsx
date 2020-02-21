import React from "react";
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar"
import {getNowDate} from "tollPlugin/commonFun"
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Toast} from 'antd-mobile';
import "./turntable.scss"

let seamlessRoll:any; // 向上滑动

class Turntable extends BaseClass{
    constructor(props:any){
        super(props,[],true)
        this.state = {
            awradsList:[],
            activeTab:"setting",//默认选项卡
            clickFlag:true,//锁
            angle:0,// 转盘角度
            cicle:0,// 转盘转几圈
            top:0, // 走马灯滚动
            sTime:"",//活动开始时间
            eTime:"",//活动结束时间
        }
    }
    componentDidMount(){
        new window.actions.ApiActivityInfoAction(true).fly((res:any)=>{
            if(res.StatusCode===0){
                let LuckyInfo = res.LuckyInfo;
                let nowTime = new Date(getNowDate(0)).getTime();
                let startTime = new Date(LuckyInfo.StartTime.replace('T',' ')).getTime();
                let endTime = new Date(LuckyInfo.EndTime.replace('T',' ')).getTime();
                this.setState({
                    sTime:LuckyInfo.StartTime.replace('T',' '),
                    eTime:LuckyInfo.EndTime.replace('T',' ')
                })
                if(nowTime>=startTime && nowTime<=endTime){
                    // 转盘获奖名单
                    new window.actions.AwardslistAction({LuckyNo:"LuckyMoney"}).fly((resp:any) => {
                        if (resp.StatusCode === 0) {
                            this.setState({
                                awradsList:resp.List
                            })
                        }
                    });                
                }                
            }else{
                this.setState({
                    isCloseActivity:true
                })
            }
        })
    }
    componentDidUpdate(){
        let listEle = this.refs.awardsCot as HTMLElement;
        let ulHeight = listEle.scrollHeight;
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
    componentWillUnmount(){
        clearInterval(seamlessRoll)
    }
    tabChange(val:string){
        this.setState({
            activeTab:val,
        })
    }
    activityCotent(){
        let cot:any;
        if(this.state.activeTab==='setting'){
            cot = (
                <div dangerouslySetInnerHTML={{__html:this.props.Description}}></div>
            )
        }else if(this.state.activeTab==='role'){
            cot = (
                <div dangerouslySetInnerHTML={{__html:this.props.RuleDes}}></div>
            )
        }
        return cot
    }
    prizeList(){
        const awradsList = this.state.awradsList
        return(
            <ul className='awardsCot' ref='awardsCot' style={{"top":-this.state.top+'px'}}>
                {
                    awradsList.map((item:any,index:number)=>{
                        let UserName = item.User.UserName;
                        return(
                            <li key={index}>
                                <span>恭喜会员</span>
                                <span className='colors'>{UserName}</span>&nbsp;
                                <span>用户获得</span>
                                <span className='colors'>{item.LuckyItem.Prizes}</span>
                            </li>
                        )
                    })
                }
            </ul>
        )     
    }
    // 开始抽奖
    luckDraw(){
        if(!this.state.clickFlag)return
        let _this = this;
        this.setState({
            clickFlag:false
        })
        Toast.loading('查询抽奖信息中...',300);
        this.setState({
            angle:0
        },()=>{
            new window.actions.ApiCheckActivityCountsAction(true).fly((resp:any)=>{
                if(resp.StatusCode===0) {
                    if (resp.Count>0) {
                        new window.actions.ApiLuckDrawAction(true).fly((resp:any)=>{
                            Toast.hide()
                            if(resp.StatusCode === 0 && resp.Winning === true){                                                           
                                let cicle:any = Math.floor(Math.random()*3)+3// 转几圈
                                setTimeout(()=>{
                                    _this.setState({
                                        angle:resp.PrizeGrade,
                                        cicle:cicle
                                    },()=>{
                                        setTimeout(()=>{
                                            window.actions.popWindowAction({ 
                                                type:"DefiPop",
                                                title:"恭喜您中奖了",
                                                text:[`${resp.Message}`],
                                            })
                                            _this.setState({
                                                clickFlag:true
                                            })
                                        },3000)
                                    })
                                },100)                      
                            }else{
                                _this.setState({
                                    clickFlag:true
                                },()=>{
                                    window.actions.popWindowAction({
                                        type:"DefiPop",
                                        title:"温馨提示",
                                        text:[`${resp.Message}`],                        
                                    })                           
                                })                             
                            }
                        })
                    }else{
                        _this.setState({
                            clickFlag:true
                        },()=>{
                            Toast.hide();
                            window.actions.popWindowAction({
                                type:"DefiPop",
                                title:"温馨提示",
                                text:[`您的机会已经用完啦。`],                        
                            })                           
                        })
                    }
                }else{
                    Toast.hide()
                    window.actions.popWindowAction({
                        type:"DefiPop",
                        title:"温馨提示",
                        text:[`${resp.Message}`],                        
                    })                
                }
            })
        })
    }
    render(){
        return(
            <div className='turntable FadePage'>
                <NavBar btnGoback={true} title={`幸运转盘`}></NavBar>
                <div className='turnTableWrap'>                
                    <div className='contents'>
                        <div className='dzp'>
                            <div className="prize" 
                            style={ this.state.angle!==0?{"transform":`rotate(${-(this.state.angle*36)+(this.state.cicle*360)}deg)`,"transition":"transform 4s ease .1s"}:{} }>

                            </div>
                            <button onClick={this.luckDraw.bind(this)}></button>
                        </div>
                        <div className='prizeList'>
                            <div className='list-bg'>
                                {this.prizeList()}
                            </div>
                        </div>
                        <ul className='infos clearfix'>
                            <li className={this.state.activeTab==='setting'?'active setting':'setting'} onClick={this.tabChange.bind(this,'setting')}></li>
                            <li className={this.state.activeTab==='role'?'active role':'role'} onClick={this.tabChange.bind(this,'role')}></li>
                        </ul>
                        <div className='activtyCot'>
                            { this.activityCotent() }
                        </div>
                        <div className="footer">
                            <p className="copyright">COPYRIGHT © 本站 RESERVED</p>
                        </div>
                    </div>            
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state: ReducerState, ownProps: any) => ({
    Description:state.Activity.TurnTableDescription,
    RuleDes:state.Activity.TurnTableRuleDes
});
  
export default withRouter(connect(mapStateToProps)(Turntable));