import React from "react";
import BaseClass from "@/baseClass";
import {connect} from "react-redux";
import {withRouter} from "react-router-dom";
import {Toast,DatePicker} from 'antd-mobile';
import "./PopWindow.scss";

let timer:any=null;//倒计时
let timerNum:number=60;

class MessagePop extends BaseClass{
    constructor(props:any){
        super(props,['user','remoteSysConfs'],false)
        this.state={
            phoneCode:"",   // 验证码输入值
            buttonDisabled: false,  // 控制获取验证码按钮Disabled
            sendButtonMes:"获取验证码",   //验证码按钮文字内容
            codeLock:true, // 按钮LOCK,防止获取验证码按钮连续点击
            phoneCodeState:true,// 验证码确定按钮LOCK

            time:'',//'生日时间'
        }
    }
    componentWillUnmount(){
        clearInterval(timer)
    }
    getPhoneCode(popType:string){
        if(!this.state.codeLock)return
        if(timer)clearInterval(timer)
        this.setState({codeLock:false})
        let _this = this;
        Toast.info('验证码发送中,请稍后...',300);
        let Api = popType==="phone"?"ApiSendMobileVCodeAction":"ApiSendEmailVCodeAction";
        new window.actions[Api]().fly((resp:any)=>{
            Toast.hide();
            if(resp.StatusCode === 0){
                Toast.info('验证码已发送,请注意查收！')
                this.setState({
                    sendButtonMes:'重新获取('+timerNum+'s)',
                    buttonDisabled:true,
                });
                timer=setInterval(()=>{
                    if(timerNum>0){
                        _this.setState({
                            sendButtonMes:'重新获取('+ timerNum-- +'s)'
                        });
                    }else{
                        _this.setState({
                            sendButtonMes:'获取验证码',
                            buttonDisabled:false,
                            codeLock:true
                        });
                        timerNum=60;
                        clearInterval(timer);
                    }
                },1000)
            }else{
                _this.setState({
                    codeLock:true,
                },()=>{
                    Toast.info(resp.Message,1.5)
                })
            }
        })
    }
    onSubmitPhone(){
        let _this = this;
        if(!_this.state.phoneCodeState)return;
        let phoneCode = _this.state.phoneCode;
        if(!phoneCode){
            Toast.info('请输入验证码!',1)
            return;
        }
        Toast.loading('验证中,请稍后...',10)
        this.setState({
            phoneCodeState:false
        })
        new window.actions.ApiValidatePhoneAction(this.props.user.phone,phoneCode).fly((resp:any)=>{
            Toast.hide();
            if(resp.StatusCode === 0){
                new window.actions.ApiPlayerInfoAction();
                new window.actions.LoadBackConfigsAction().fly()
                _this.setState({
                    phoneCodeState:true
                })
                _this.props.hidePop()
                window.actions.popWindowAction({
                    type:"DefiPop",
                    title:"成功",
                    text:[`恭喜验证成功，现在您可以进行提款`],
                    leftBtn:{text: "确定",fc:()=>window.actions.popWindowAction({type:""})}
                })
            }else{
                _this.setState({
                    phoneCodeState:true
                })
                Toast.info(resp.Message,1.5)
            }
        });        
    }
    // 客服Link
    handleClickService(){
        window.open(this.props.remoteSysConfs.online_service_link, '_blank');     
    }
    validateInput(val:any){
        this.setState({
            time: val.format("yyyy-MM-dd")
        },()=>[
            this.props.changeBirthday(this.state.time)
        ])
    }
    render(){
        let {popType} = this.props;
        // 取款时如果未验证绑定手机需要手机验证，手机验证弹窗
        if(popType==="phone" || popType==="email"){
            return(
                <div className="PopWindow" onClick={()=>this.props.hidePop()}>
                    <div className="msgWindow windowBox" onClick={(event) => { event.stopPropagation() }}>
                        <i className="icon iconfont icon-iconclose" onClick={()=>this.props.hidePop()}></i>
                        <p className="windowTitle titleImg">{popType==="phone"?'手机':'邮箱'}短信验证</p>
                        <div className="bottomBox">
                            <p className='tips'>点击将向您的{popType==="phone"?'手机号码':'邮箱账号'}发送验证码</p>
                            {
                                popType==="phone"?
                                <input className='numIput' type="number" value={this.props.user.phone} disabled />: 
                                <input className='numIput' type="text" value={this.props.user.email} disabled />
                            }              
                            <div className='inputWrap clearfix'>
                                <input className="code" type="number" placeholder="验证码" onClick={ (event:any)=>{this.setState({phoneCode:event.target.value})} } />
                                <a className={this.state.buttonDisabled ? "getCode disabled" : "getCode"} onClick={this.getPhoneCode.bind(this,popType)}>
                                    {this.state.sendButtonMes}
                                </a>
                            </div>
                            <button className="leftBtoom" onClick={this.handleClickService.bind(this)}>联系客服</button>
                            <button className="rightBtoom" onClick={this.onSubmitPhone.bind(this)}>确定</button>
                        </div>
                    </div>
                </div>
            )
        }
        let {title,cancleFunc,okText,okFunc,changeInputVal,inputType,isBirthday} = this.props;
        // 个人资料修改弹窗
        return (
          <div className="PopWindow" onClick={cancleFunc}>
            <div
              className="infoWindow windowBox"
              onClick={event => {
                event.stopPropagation();
              }}
            >
              <i
                className="icon iconfont icon-iconclose"
                onClick={cancleFunc}
              ></i>
              <p className="windowTitle titleImg">{'请输入您的' + title}</p>
              <div className="bottomBox">
                <p className="tips">注意:个人信息只允许修改一次</p>
                <div className="inputWrap clearfix">
                  {(isBirthday && (
                    <DatePicker
                      mode="date"
                      title="日期选择"
                      extra="请填写您的生日"
                      minDate={new Date(1900, 1, 1)}
                      maxDate={new Date()}
                      //value={new Date(birthday)}
                      onOk={(e: any) => this.validateInput(e)}
                    >
                      <input
                        placeholder={'请填写您的生日'}
                        value={this.state.time}
                        readOnly
                      />
                    </DatePicker>
                  )) ||
                    (title === '手机' && (
                      <input
                        className="infoInput"
                        onChange={changeInputVal}
                        type="tel"
                        maxLength={11}
                        placeholder={'请输入您需要修改的' + title}
                      />
                    )) || (
                      <input
                        className="infoInput"
                        onChange={changeInputVal}
                        type={inputType}
                        placeholder={'请输入您需要修改的' + title}
                      />
                    )}
                </div>
                <button className="leftBtoom" onClick={okFunc}>
                  {okText}
                </button>
              </div>
            </div>
          </div>
        );
    }
}
const mapStateToProps = (state: any, ownProps: any) => ({
    user:state.user,
    remoteSysConfs:state.remoteSysConfs,
});
  
export default withRouter(connect(mapStateToProps)(MessagePop));

  

