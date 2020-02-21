import React from "react";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import { withRouter } from "react-router-dom";
import NavBar from "components/navBar/NavBar"
import "./PrivateInfoPage.scss"
import { AsteriskProcessing } from "tollPlugin/commonFun";
import MessagePop from "components/popWindow/MsgWindow"
const emailReg = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

class PrivateInfoPage extends BaseClass{
    public state = {
        showBirthday:false,
        showWeChat:false,
        showQQ:false,
        showPhone:false,
        showMail:false,
        birthday:'' as any,
        weChat:'' as any,
        QQ:'' as any,
        phone:'' as any,
        Mail:'' as any,
        showPop:false,//控制修改信息弹窗
        showPhonePop:false,
        popType:"phone",
        popDatas:{
            title:"",
            okText:"确定",
            inputType:"text",
            inputVal:"",
            isBirthday:false,
            changeInputVal:()=>{},
            confirmInfo:()=>{}
        }
    };
    componentDidUpdate(props:any,state:any){
    
    }
    // 日期转换
    validateInput(val:any) {

        this.setState({
            birthday: val.format("yyyy-MM-dd"),     
        });
 
    }
    // 修改信息提交
    confirmInfo(val:string){
        this.setState({showPop:false})
        let {realName} = this.props.user;
        if(!realName){
            window.actions.popWindowAction({
                type: "DefiPop",
                text:"未填寫真實姓名" ,
                leftBtn:{
                    text:"确定",
                    fc: () => {
                        window.actions.popWindowAction({type: "" })  
                    }
                }
            })
            return;        
        }
        let filter = { //初始化
            TrueName:realName||"",
            qq:"",
            email:"",
            WebChat:"",
            birthday:"",
            phone:""
        }
        if(val==="email"){
            filter = {
                ...filter,
                email:this.state.Mail
            }
            if(!filter.email){
                window.actions.popWindowAction({
                    type: "DefiPop",
                    text:"请输入邮箱" ,
                    leftBtn:{
                        text:"确定",
                        fc: () => {
                            window.actions.popWindowAction({ type: "" })  
                        }
                    }
                })
                return;
            }    
            if (!emailReg.test(filter.email)) {
                window.actions.popWindowAction({
                    type: "DefiPop",
                    text:"邮箱格式错误!" ,
                    leftBtn:{
                        text:"确定",
                        fc: () => {
                            window.actions.popWindowAction({ type: "" })  
                        }
                    }
                })
                return;
            }                     
        }else if(val==='qq'){
            filter = {
                ...filter,
                qq:this.state.QQ
            }
            if(!filter.qq){
                window.actions.popWindowAction({
                    type: "DefiPop",
                    text:"请填写QQ号" ,
                    leftBtn:{
                        text:"确定",
                        fc: () => {
                            window.actions.popWindowAction({ type: "" })  
                        }
                    }
                })
                return;
            }
        }else if(val==='weChat'){
            filter = {
                ...filter,
                WebChat:this.state.weChat
            }  
            if(!filter.WebChat){
                window.actions.popWindowAction({
                    type: "DefiPop",
                    text:"请填写微信号" ,
                    leftBtn:{
                        text:"确定",
                        fc: () => {
                            window.actions.popWindowAction({ type: "" })  
                        }
                    }
                })
                return;
            }  
            if (/[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/.test(filter.WebChat)) {
                window.actions.popWindowAction({
                    type: "DefiPop",
                    text:"微信号格式错误!" ,
                    leftBtn:{
                        text:"确定",
                        fc: () => {
                            window.actions.popWindowAction({ type: "" })  
                        }
                    }
                })
                return;
            }   
        }else if(val==='phone'){
            filter = {
                ...filter,
                phone:this.state.phone
            }  
            if(!filter.phone){
                window.actions.popWindowAction({
                    type: "DefiPop",
                    text:"请填写手机号" ,
                    leftBtn:{
                        text:"确定",
                        fc: () => {
                            window.actions.popWindowAction({ type: "" })  
                        }
                    }
                })
                return;
            }
            if (!(/^1[1-9][0-9]\d{4,8}$/.test(filter.phone))) {
                window.actions.popWindowAction({
                    type: "DefiPop",
                    text:"手机号码格式错误!" ,
                    leftBtn:{
                        text:"确定",
                        fc: () => {
                            window.actions.popWindowAction({ type: "" })  
                        }
                    }
                })
                return;
            }
        }else if(val==='birthday'){
            filter = {
                ...filter,
                birthday:this.state.birthday
            }  
            if(!filter.birthday){
                window.actions.popWindowAction({
                    type: "DefiPop",
                    text:"请填写生日" ,
                    leftBtn:{
                        text:"确定",
                        fc: () => {
                            window.actions.popWindowAction({type: "" })  
                        }
                    }
                })
                return;
            }
        }
        if(!val)return
        if(realName) {
            new window.actions.ApiUpdateInfoAction(filter).fly((res:any) => {
                if(res.StatusCode === 0){
                    this.setState({showPop:false})
                    new window.actions.ApiPlayerInfoAction().fly();
                    window.actions.popWindowAction({
                        type: "DefiPop",
                        text:"修改成功" ,
                        leftBtn:{
                            text:"确定",
                            fc:()=>window.actions.popWindowAction({ type: "" })                           
                        }
                    })                
                }else {
                    this.setState({showPop:false})
                    window.actions.popWindowAction({
                        type: "DefiPop",
                        title:"错误",
                        text:res.Message ,
                        leftBtn:{
                            text:"确定",
                            fc:()=>window.actions.popWindowAction({ type: "" })          
                        }
                    })
                }
            })                       
        }
    }
    // 修改信息
    WhichInfo(val:string){
        this.setState({
            showPop:true,
            popDatas:{
                ...this.state.popDatas,
                inputVal:"",
                isBirthday:false,
                confirmInfo:this.confirmInfo.bind(this,val)
            }
        },()=>{
            if(val==='email'){
                this.setState({
                    popDatas:{
                        ...this.state.popDatas,
                        title:"邮箱",
                        changeInputVal:(e:any)=>{this.setState({Mail:e.target.value})},
                        inputType:"email",                      
                    }                          
                })
            }else if(val==="qq"){
                this.setState({
                    popDatas:{
                        ...this.state.popDatas,
                        title:"QQ",
                        changeInputVal:(e:any)=>{this.setState({QQ:e.target.value})},
                        inputType:"number",                       
                    }                          
                })                
            }else if(val==="weChat"){
                this.setState({
                    popDatas:{
                        ...this.state.popDatas,
                        title:"微信",
                        changeInputVal:(e:any)=>{this.setState({weChat:e.target.value})},
                        inputType:"text"                         
                    }                          
                })               
            }else if(val==='phone'){
                this.setState({
                    popDatas:{
                        ...this.state.popDatas,
                        title:"手机",
                        changeInputVal:(e:any)=>{this.setState({phone:e.target.value})},
                        inputType:"number"                         
                    }                          
                })                
            }else if(val==='birthday'){
                this.setState({
                    popDatas:{
                        ...this.state.popDatas,
                        title:"生日",
                        changeInputVal:(e:any)=>this.validateInput(e),
                        inputType:"text",
                        isBirthday:true,                       
                    }                          
                })       
            }
        })
    }
    changeBirthday(data:any){
        this.setState({
            birthday:data
        })
    }
    render(){
        return (
            <div className="PrivateInfoPage anmateContent">
                <NavBar btnGoback={true} btnService={true} title={"个人资料"}></NavBar>
                <div className="content">
                    <div className="item_box">
                        <div className="line">
                            <span className="title"> <span className="icon iconfont icon-yonghu" />账号</span>
                            <span className="lineContent">{this.props.user.username?this.props.user.username:"未填写"}</span>
                        </div>
                        <div className="line_no_btm">
                            <span className="title"><span className="icon iconfont icon-wode" />姓名</span>
                            <span className="lineContent">{this.props.user.realName?AsteriskProcessing(this.props.user.realName,'realName'):"未填写"}</span>
                        </div>
                    </div>
                    <div className="item_box">
                        <div className="line_only">
                            <span className="title"><span className="icon iconfont icon-shengri" />生日</span>
                            <span className="lineContent">{this.props.user.birthday?this.props.user.birthday.substr(0,this.props.user.birthday.indexOf("T")):"未填写"}</span>
                            {
                                !this.props.user.birthday?
                                <span className="edit" onClick={this.WhichInfo.bind(this,'birthday')}><i className='icon iconfont icon-pan_icon'/></span>:null
                            }
                        </div>
                    </div>
                    <div className="item_box">
                        <div className="line">
                            <span className="title"> <span className="icon iconfont icon-weixin" />微信</span>
                            <span className="lineContent">{this.props.user.weChat?AsteriskProcessing(this.props.user.weChat,'weChat'):"未填写"}</span>
                            {
                                this.props.user.weChat?null:<span className="edit" onClick={this.WhichInfo.bind(this,'weChat')}>
                                <i className='icon iconfont icon-pan_icon'/></span> 
                            }

                        </div>
                        <div className="line_no_btm">
                            <span className="title"><span className="icon iconfont icon-qq1" />QQ</span>
                            <span className="lineContent">{this.props.user.qq?AsteriskProcessing(this.props.user.qq,'qq'):"未填写"}</span>
                            {
                                this.props.user.qq ? null:<span className="edit" onClick={this.WhichInfo.bind(this,'qq')}>
                                <i className='icon iconfont icon-pan_icon'/></span>
                            }
                        </div>
                    </div>
                    <div className="item_box">
                        <div className="line">
                            <span className="title"> <span className="icon iconfont icon-shouji1" />手机</span>
                            <span className="lineContent">{this.props.user.phone?AsteriskProcessing(this.props.user.phone,'phone'):"未填"}</span>
                            {
                                this.props.user.phone?(
                                    this.props.user.verfyPhone?
                                        <i className="verified">已验证</i>:
                                        <i className='unverified' onClick={ e=>this.setState({showPhonePop:true,popType:'phone'})}>
                                            未验证
                                        </i>
                                )
                                :
                                <span className="edit" onClick={this.WhichInfo.bind(this,'phone')}>
                                <i className='icon iconfont icon-pan_icon'/></span>     
                            }
                            
                        </div>
                        <div className="line_no_btm">
                            <span className="title"><span className="icon iconfont icon-youxiang" />邮箱</span>
                            <span className="lineContent">{this.props.user.email?AsteriskProcessing(this.props.user.email,'email'):"未填写"}</span>
                            {
                                this.props.user.email?(
                                    this.props.user.verfyEmail?
                                    <i className="verified">已验证</i>:
                                    <i className="unverified" onClick={ e=>this.setState({showPhonePop:true,popType:'email'})}>未验证</i>
                                ):
                                 <span className="edit" onClick={this.WhichInfo.bind(this,'email')}>
                                    <i className='icon iconfont icon-pan_icon'/>
                                </span>                               
                            }
                        </div>
                    </div>
                    <p className="warning">如资料有误，请联系在线客服修改</p>             
                    {/* 万能弹窗 */}
                    {
                        this.state.showPop && 
                        <MessagePop
                            title={this.state.popDatas.title}                             
                            okText = {this.state.popDatas.okText}
                            inputType = {this.state.popDatas.inputType}
                            changeInputVal={this.state.popDatas.changeInputVal}                     
                            okFunc = {this.state.popDatas.confirmInfo}
                            birthday = {this.state.birthday}
                            changeBirthday={this.changeBirthday.bind(this)}
                            isBirthday = {this.state.popDatas.isBirthday}
                            cancleFunc = {()=>this.setState({showPop:false})}
                        ></MessagePop>
                    }     
                    {
                        // 手机验证
                        this.state.showPhonePop?
                        <MessagePop popType={this.state.popType} hidePop={()=>this.setState({showPhonePop:false})}></MessagePop>:null
                    }
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any, ownProps: any) => ({
    user: state.user,
});

export default withRouter(connect(mapStateToProps)(PrivateInfoPage));
