import React from "react";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import { withRouter } from "react-router-dom";
import {getStorage,setStorage} from "tollPlugin/commonFun";
import "./LoginPage.scss";
import {config} from '../../config/projectConfig'

 
class LoginPage extends BaseClass {

    public state = {
        userNameValue: getStorage("autoLoginVal") ? JSON.parse(getStorage("autoLoginVal")).admin:"",
        password:getStorage("autoLoginVal") ?  JSON.parse(getStorage("autoLoginVal")).pass : "",
        showPassWord:false,
        remberPass:getStorage("autoLogin"),
        submitStateLock:true
    };

    useNameChange(e: any) {
        this.setState({
            userNameValue: e.target.value
        });
    }

    pwdChange(e: any) {
        this.setState({
            password: e.target.value
        });
    }

    goBack() {
        this.props.history.push("/Home");
    }

    login() {
        if(!this.state.submitStateLock) return;
        this.state.submitStateLock=false;
        if(this.state.remberPass){
            setStorage("autoLoginVal",JSON.stringify({"admin":this.state.userNameValue,"pass":this.state.password}))
        }else{
            localStorage.removeItem("autoLoginVal");
        };
        new window.actions.ApiLoginAction(this.state.userNameValue, this.state.password).fly((res: any) => {
            if (res && res.StatusCode === 0) {
                new window.actions.LoginAfterInit();
                this.props.history.push('/Home');
            }else{
                window.actions.popWindowAction({
                    type: "DefiPop", title:"登录失败",text: res.Message,
                    leftBtn: {
                        text: "确定",
                        fc: () => { window.actions.popWindowAction({ type: "" }) }
                    },
                });
            }
            this.state.submitStateLock = true;
        });
    }

    render() {
        return (
            <div className="LoginPage anmateContent">
                <div className="loginBox">
                    {
                        config.spec.includes('usd')?<div className="titleEde">
                            <div className='imgBoxUsd'></div>
                        </div>
                        :<div className="titleEde">
                                <div className="imgBox"></div>
                                <div className="imgBox"></div>
                                <div className="imgBox"></div>
                        </div>
                    }
                    {/* <div className="titleEde">
                        <div className="imgBox"></div>
                        <div className="imgBox"></div>
                        <div className="imgBox"></div>
                    </div> */}
                    <div className="loginCont">
                        <div className="loginLeft">
                            <div className="leftCont">
                                <p>登录</p>
                                <div className="inputBox">
                                    <span className="icon iconfont icon-yonghu" />
                                    <input type="text" value={this.state.userNameValue}  onChange={this.inputVal.bind(this,1)} placeholder="用户名"/>
                                    {this.state.userNameValue && <span className="icon iconfont icon-guanbi" onClick={this.cleanInput.bind(this)}></span>}
                                </div>
                                <div className="inputBox">
                                    <span className="icon iconfont icon-mima" />
                                    <input type={this.state.showPassWord?"text":"password"} value={this.state.password} onChange={this.inputVal.bind(this,0)} placeholder="密码"/>
                                    <span className={`icon iconfont ${this.state.showPassWord?"icon-yincangkejian":"icon-yincangbukejian"}`} onClick={this.isShowPass.bind(this)}></span>
                                </div>
                                <div className="swichBox">
                                    <span>
                                        <span onClick={this.changeRember.bind(this)} className={`icon iconfont check ${this.state.remberPass?"icon-icon":"icon-public-checklist"}`}></span>
                                        <span className="checkFont">记住密码</span>
                                    </span>
                                    <span>
                                        <span className="checkFont" onClick={v=>window.actions.popWindowAction({type:"serviceWindow",text:"联系客服修改密码"})}>忘记密码</span>
                                    </span>
                                </div>
                                <div className="loginBtn" onClick={this.login.bind(this)}>
                                    <span>登录</span>
                                </div>
                                <p className="goBack" onClick={this.goBack.bind(this)}>返回首页</p>
                            </div>
                        </div>
                        <div className="loginRight"  onClick={()=>{this.props.history.push("/Home/Register")}}>
                            <div className="rightBox">
                                <span className="icon iconfont icon-xinyonghu1"></span>
                                <span className="rightBoxFont">注册新用户</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    cleanInput(){
        this.setState({
            userNameValue: '',
            password: ''
        });
    }

    inputVal(type:number,e:any){
        if(type === 1){//用户名
            this.setState({
                userNameValue: e.target.value
            });
        }else{
            this.setState({
                password: e.target.value
            });
        }
    }

    isShowPass(){//显示或隐藏密码
        this.setState({
            showPassWord:!this.state.showPassWord
        })
    }

    changeRember(){//修改记住密码状态
        setStorage("autoLogin",!this.state.remberPass)
        this.setState({
            remberPass:!this.state.remberPass
        })
    
    }


}

const mapStateToProps = (state: ReducerState, ownProps: any) => ({

});

export default withRouter(connect(mapStateToProps)(LoginPage));
