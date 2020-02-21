import React from "react";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import { withRouter } from "react-router-dom";
import { getStorage, setStorage, getSession, setSession } from "tollPlugin/commonFun";
import { DatePicker, Picker, Checkbox } from "antd-mobile";
import { config } from '../../config/projectConfig'
import "./LoginRegist.scss";




interface State {
    Fields: any,
    inpActive: string,
    comObj: any,
    reqKeyList: string[],
    getLock: boolean,
    AuthCode: string,
    [key: string]: any
}

var pickerData = [[
    { label: '0', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
]];
pickerData = [...pickerData, ...pickerData, ...pickerData, ...pickerData]



class LoginRegist extends BaseClass {

    public state: State = {
        userNameValue: getStorage("autoLoginVal") ? JSON.parse(getStorage("autoLoginVal")).admin : "",
        password: getStorage("autoLoginVal") ? JSON.parse(getStorage("autoLoginVal")).pass : "",
        showPassWord: false,
        remberPass: getStorage("autoLogin"),
        submitStateLock: true,
        showLogin: this.props.match.params.LorR === "Login",
        Fields: [],//接口返回需要输入的信息
        inpActive: "",//当前用户点击的框，给提示用
        comObj: {//提交注册的参数
            IsReceiveEmail: true,//需要收到emall默认选中
            IsReceiveSMS: true,//需要收到短信默认选中
        },
        reqKeyList: [],//必填并且需要效验的参数,
        getLock: false,//防止重复获取验证码
        AuthCode: "",//验证码图片地址
    };


    //登录相关   开始
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
        if (!this.state.submitStateLock) return;
        this.state.submitStateLock = false;
        if (this.state.remberPass) {
            setStorage("autoLoginVal", JSON.stringify({ "admin": this.state.userNameValue, "pass": this.state.password }))
        } else {
            localStorage.removeItem("autoLoginVal");
        };
        new window.actions.ApiLoginAction(this.state.userNameValue, this.state.password).fly((res: any) => {
            if (res && res.StatusCode === 0) {
                new window.actions.LoginAfterInit();
                this.props.history.push('/Home');
            } else {
                window.actions.popWindowAction({
                    type: "DefiPop", title: "登录失败", text: res.Message,
                    leftBtn: {
                        text: "确定",
                        fc: () => { window.actions.popWindowAction({ type: "" }) }
                    },
                });
            }
            this.state.submitStateLock = true;
        });
    }

    cleanInput() {
        this.setState({
            userNameValue: '',
            password: ''
        });
    }

    inputVal_Login(type: number, e: any) {
        if (type === 1) {//用户名
            this.setState({
                userNameValue: e.target.value
            });
        } else {
            this.setState({
                password: e.target.value
            });
        }
    }

    isShowPass() {//显示或隐藏密码
        this.setState({
            showPassWord: !this.state.showPassWord
        })
    }

    changeRember() {//修改记住密码状态
        setStorage("autoLogin", !this.state.remberPass)
        this.setState({
            remberPass: !this.state.remberPass
        })

    }

    render() {
        return (
            <div className="LoginRegist anmateContent">
                <video autoPlay loop>
                    <source src={require("./images/football2.mp4")} type="video/mp4" />
                </video>
                <div className="loginBox">
                    {
                        config.spec.includes('usd') ? <div className="titleEde">
                            <div className='imgBoxUsd'></div>
                        </div>
                            : <div className="titleEde">
                                <div className="imgBox"></div>
                                <div className="imgBox" style={{ "marginLeft": ".2rem", "marginRight": ".2rem" }}></div>
                                <div className="imgBox"></div>
                            </div>
                    }
                    <div className="buttonBox">
                        <div className={`${this.state.showLogin && "buttomBoxActive"}`} onClick={() => { this.setState({ showLogin: true }) }}>登录</div>
                        <div className={`${!this.state.showLogin && "buttomBoxActive"}`} onClick={() => { this.setState({ showLogin: false }) }}>注册</div>
                    </div>

                    {
                        this.state.showLogin ?
                            <div className="loginCont">
                                <div className="inputBox">
                                    <span className="icon iconfont icon-yonghu" />
                                    <input type="text" value={this.state.userNameValue} onChange={this.inputVal_Login.bind(this, 1)} placeholder="用户名" />
                                    {this.state.userNameValue && <span className="icon iconfont icon-guanbi" onClick={this.cleanInput.bind(this)}></span>}
                                </div>
                                <div className="inputBox">
                                    <span className="icon iconfont icon-mima" />
                                    <input type={this.state.showPassWord ? "text" : "password"} value={this.state.password} onChange={this.inputVal_Login.bind(this, 0)} placeholder="密码" />
                                    <span className={`icon iconfont ${this.state.showPassWord ? "icon-yincangkejian" : "icon-yincangbukejian"}`} onClick={this.isShowPass.bind(this)}></span>
                                </div>
                                <div className="swichBox">
                                    <span>
                                        <span onClick={this.changeRember.bind(this)} className={`icon iconfont check ${this.state.remberPass ? "icon-icon" : "icon-public-checklist"}`}></span>
                                        <span className="checkFont">记住密码</span>
                                    </span>
                                    <span>
                                        <span className="checkFont" onClick={v => window.actions.popWindowAction({ type: "serviceWindow", text: "联系客服修改密码" })} style={{ "color": "#0ebade" }}>忘记密码</span>
                                    </span>
                                </div>
                                <div className="loginBtn" onClick={this.login.bind(this)}>
                                    <span>立即登录</span>
                                </div>
                                <div className="loginBtn goBack" onClick={this.goBack.bind(this)}>
                                    <span>返回首页</span>
                                </div>
                            </div>
                            :
                            <div>
                                <div className="loginCont">
                                    <div className="loginLeft">
                                        <div className="leftCont">
                                            {this.renderInput()}
                                            <div className="loginBtn" onClick={this.regist.bind(this)}>
                                                <span>注册</span>
                                            </div>
                                            <div className="loginBtn goBack" onClick={this.goBack.bind(this)}>
                                                <span>先逛逛</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    }
                    <img src={require("./images/ouzb.png")} className="regBotImg" alt="彩蛋" />
                </div>
            </div>
        );
    }




    //注册相关   开始
    componentDidMount() {
        new window.actions.ApiGetRegistrySettingAction().fly((resp: any) => {
            this.setState({
                Fields: resp.Fields
            })
        });
        this.getAuthCode();
        let isAutoLogin = window.location.search;//如果是代理落地页注册过来的直接填入代理号
        if (isAutoLogin.indexOf('channel') > 0) {
            setSession('channel', isAutoLogin.split('=')[1]);
        }
    }


    renderInput() {//渲染各种输入框
        interface InpData {
            Field: string,
            Required: boolean,
        }
        let isRequired = (required: boolean, key: string) => {//是否必填处理
            if (required) {//必填
                this.state.reqKeyList = [...new Set([...this.state.reqKeyList, key])];
            }
        }
        // Password,Password2,TrueName,Phone,Email,,QQ,Wechat,Birthday,WithdrawalPassword,WithdrawalPassword2,ExtendCode,IsReceiveEmail,IsReceiveSMS,AuthCode
        let inputList = [];
        for (let i = 0; i < this.state.Fields.length; i++) {
            let inpData: InpData = this.state.Fields[i];
            switch (inpData.Field) {
                case "UserName"://用户名
                    isRequired(inpData.Required, "UserName")
                    inputList.push(
                        <div key="UserName" className="inputBox">
                            <span className="icon iconfont icon-yonghu icon1" />
                            <input id="demo1" type="text" placeholder="用户名"
                                onFocus={() => { this.setState({ inpActive: "UserName" }) }}
                                onBlur={() => { this.setState({ inpActive: "" }) }}
                                onChange={this.inputVal.bind(this, "UserName")}
                                maxLength={12}
                            />

                            <div className="conslo" style={{ "display": `${this.state.inpActive === "UserName" ? "block" : "none"}` }}>
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">用户名必须是6-12位的字母或数字</span>
                            </div>
                        </div>
                    )
                    break;
                case "TrueName"://真实姓名
                    isRequired(inpData.Required, "TrueName")
                    inputList.push(
                        <div key="TrueName" className="inputBox">
                            <span className="icon iconfont icon-gerenbaobiao icon1" />
                            <input type="text" placeholder="真实姓名"
                                maxLength={20}
                                onFocus={() => { this.setState({ inpActive: "TrueName" }) }}
                                onBlur={() => { this.setState({ inpActive: "" }) }}
                                onChange={this.inputVal.bind(this, "TrueName")}
                            />
                            <div className="conslo" style={{ "display": `${this.state.inpActive === "TrueName" ? "block" : "none"}` }}>
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">必须是非数字真实姓名</span>
                            </div>
                        </div>
                    )
                    break;

                case "Password"://密码
                    isRequired(inpData.Required, "Password")
                    inputList.push(
                        <div key="Password" className="inputBox">
                            <span className="icon iconfont icon-mima icon1" />
                            <input
                                type="password"
                                placeholder="密码"
                                onFocus={() => {
                                    this.setState({ inpActive: 'Password' });
                                }}
                                onBlur={() => {
                                    this.setState({ inpActive: '' });
                                }}
                                onChange={this.inputVal.bind(this, 'Password')}
                                maxLength={12}
                            />
                            <div
                                className="conslo"
                                style={{
                                    display: `${
                                        this.state.inpActive === 'Password'
                                            ? 'block'
                                            : 'none'
                                        }`
                                }}
                            >
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">
                                    请输入6-12为数字和字母
                          </span>
                            </div>
                        </div>
                    );
                    break;
                case "Password2"://再次密码
                    isRequired(inpData.Required, "Password2")
                    inputList.push(
                        <div key="Password2" className="inputBox">
                            <span className="icon iconfont icon-mima icon1" />
                            <input type="password" placeholder="密码"
                                onFocus={() => { this.setState({ inpActive: "Password2" }) }}
                                onBlur={() => { this.setState({ inpActive: "" }) }}
                                onChange={this.inputVal.bind(this, "Password2")}
                            />
                            <div className="conslo" style={{ "display": `${this.state.inpActive === "Password2" ? "block" : "none"}` }}>
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">请再次输入密码</span>
                            </div>
                        </div>
                    )
                    break;
                case "WithdrawalPassword"://取款密码
                    isRequired(inpData.Required, "WithdrawalPassword")
                    inputList.push(
                        <Picker
                            key="WithdrawalPassword"
                            cascade={false}
                            data={pickerData}
                            title="取款密码"
                            extra="取款密码"
                            onOk={this.selectNumVal.bind(this, "WithdrawalPassword")}
                        >
                            <div key="WithdrawalPassword" className="inputBox">
                                <span className="icon iconfont icon-yinxingqia icon1" />
                                <input className="WithdrawalPassword" type="text" placeholder="取款密码" defaultValue={this.state.comObj.WithdrawalPassword} readOnly />
                            </div>
                        </Picker>
                    )
                    break;
                case "WithdrawalPassword2"://确认取款密码
                    isRequired(inpData.Required, "WithdrawalPassword2")
                    inputList.push(
                        <Picker
                            key="WithdrawalPassword2"
                            cascade={false}
                            data={pickerData}
                            title="取款密码"
                            extra="取款密码"
                            onOk={this.selectNumVal.bind(this, "WithdrawalPassword2")}
                        >
                            <div key="WithdrawalPassword2" className="inputBox">
                                <span className="icon iconfont icon-yinxingqia icon1" />
                                <input className="WithdrawalPassword2" type="text" placeholder="取款密码" defaultValue={this.state.comObj.WithdrawalPassword} readOnly />
                            </div>
                        </Picker>
                    )
                    break;
                case "Phone"://手机
                    isRequired(inpData.Required, "Phone")
                    inputList.push(
                        <div key="Phone" className="inputBox">
                            <span className="icon iconfont icon-shouji1 icon1" />
                            <input type="tel" placeholder="手机号"
                                maxLength={11}
                                onFocus={() => { this.setState({ inpActive: "Phone" }) }}
                                onBlur={() => { this.setState({ inpActive: "" }) }}
                                onChange={this.inputVal.bind(this, "Phone")}
                            />
                            {/* <div className="conslo" style={{ "display": `${this.state.inpActive === "Phone" ? "block" : "none"}` }}>
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">手机号</span>
                            </div> */}
                        </div>
                    )
                    break;
                case "AuthCode"://验证码
                    isRequired(inpData.Required, "AuthCode")
                    inputList.push(
                        <div key="AuthCode" className="inputBox">
                            <span className="icon iconfont icon-gengduo icon1" />
                            <input className='authCode' type="text" maxLength={4} placeholder="验证码"
                                onFocus={() => { this.setState({ inpActive: "AuthCode" }) }}
                                onBlur={() => { this.setState({ inpActive: "" }) }}
                                onChange={this.inputVal.bind(this, "AuthCode")}
                            />
                            <img className="AuthCode" onClick={this.getAuthCode.bind(this, true)} src={this.state.AuthCode} alt="验证码" />
                        </div>
                    )
                    break;
                case "Email"://邮箱
                    isRequired(inpData.Required, "Email")
                    inputList.push(
                        <div key="Email" className="inputBox">
                            <span className="icon iconfont icon-youxiang icon1" />
                            <input type="text" placeholder="电子邮箱"
                                onFocus={() => { this.setState({ inpActive: "Email" }) }}
                                onBlur={() => { this.setState({ inpActive: "" }) }}
                                onChange={this.inputVal.bind(this, "Email")}
                            />
                            {/* <div className="conslo" style={{ "display": `${this.state.inpActive === "Email" ? "block" : "none"}` }}>
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">电子邮箱</span>
                            </div> */}
                        </div>
                    )
                    break;
                case "QQ"://
                    isRequired(inpData.Required, "QQ")
                    inputList.push(
                        <div key="QQ" className="inputBox">
                            <span className="icon iconfont icon-qq1 icon1" />
                            <input type="text" placeholder="QQ号码"
                                maxLength={15}
                                onFocus={() => { this.setState({ inpActive: "QQ" }) }}
                                onBlur={() => { this.setState({ inpActive: "" }) }}
                                onChange={this.inputVal.bind(this, "QQ")}
                            />
                            {/* <div className="conslo" style={{ "display": `${this.state.inpActive === "QQ" ? "block" : "none"}` }}>
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">电子邮箱</span>
                            </div> */}
                        </div>
                    )
                    break;
                case "Wechat"://微信
                    isRequired(inpData.Required, "Wechat")
                    inputList.push(
                        <div key="Wechat" className="inputBox">
                            <span className="icon iconfont icon-weixin icon1" />
                            <input type="text" placeholder="Wechat"
                                maxLength={19}
                                onFocus={() => { this.setState({ inpActive: "Wechat" }) }}
                                onBlur={() => { this.setState({ inpActive: "" }) }}
                                onChange={this.inputVal.bind(this, "Wechat")}
                            />
                            {/* <div className="conslo" style={{ "display": `${this.state.inpActive === "QQ" ? "block" : "none"}` }}>
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">电子邮箱</span>
                            </div> */}
                        </div>
                    )
                    break;
                case "Birthday"://生日
                    isRequired(inpData.Required, "Birthday")
                    inputList.push(
                        <DatePicker
                            key="Birthday"
                            mode="date"
                            title="日期选择"
                            extra="请填写您的生日"
                            value={this.state.comObj.birthday ? new Date(this.state.comObj.birthday) : new Date()}
                            minDate={new Date(1900, 1, 1)}
                            maxDate={new Date()}
                            onOk={this.selectDateVal.bind(this, "Birthday")}
                        >
                            <div key="Birthday" className="inputBox">
                                <span className="icon iconfont icon-shengri icon1" />
                                <input type="text" placeholder="生日" defaultValue={this.state.comObj.Birthday} readOnly />
                                {/* <div className="conslo" style={{ "display": `${this.state.inpActive === "QQ" ? "block" : "none"}` }}>
                                <span className="icon iconfont icon-warning_icon icon2" />
                                <span className="iconFont">电子邮箱</span>
                            </div> */}
                            </div>
                        </DatePicker>
                    )
                    break;
                case "IsReceiveEmail"://愿意收邮件单选框
                    isRequired(inpData.Required, "IsReceiveEmail")
                    inputList.push(
                        <div key="IsReceiveEmail" className="inputBox">
                            <Checkbox.CheckboxItem defaultChecked
                                onChange={this.chexboxChange.bind(this, 'IsReceiveEmail')}>
                                是的，我想收到{window.config.appName}的邮件消息
                            </Checkbox.CheckboxItem>
                        </div>
                    )
                    break;
                case "IsReceiveSMS"://愿意收短信
                    isRequired(inpData.Required, "IsReceiveSMS")
                    inputList.push(
                        <div key="IsReceiveSMS" className="inputBox">
                            <Checkbox.CheckboxItem defaultChecked
                                onChange={this.chexboxChange.bind(this, 'IsReceiveSMS')}>
                                是的，我想收到{window.config.appName}的短信消息
                            </Checkbox.CheckboxItem>
                        </div>
                    )
                    break;

            }

        }


        return inputList


    }

    inputVal(key: string, e: any) {
        this.setState({
            comObj: {
                ...this.state.comObj,
                [key]: e.target.value
            }
        })
    }

    selectDateVal(key: string, val: any) {
        this.setState({
            comObj: {
                ...this.state.comObj,
                [key]: val.getFullYear() + '-' + (val.getMonth() + 1) + '-' + val.getDate()
            }
        })
    }

    selectNumVal(key: string, val: any) {
        if (key === "WithdrawalPassword" || key === "WithdrawalPassword2") {//取款选择密码特殊处理
            val = val.join('')
        }
        this.setState({
            comObj: {
                ...this.state.comObj,
                [key]: val
            }
        })
    }

    chexboxChange(key: string) {
        this.setState({
            comObj: {
                ...this.state.comObj,
                [key]: this.state.comObj[key]
            }
        })
    }



    getAuthCode() {//获取验证码
        if (this.state.getLock) return;
        this.state.getLock = true;
        new window.actions.ApiAuthCodeAction().fly((resp: any) => {
            if (resp.StatusCode === 0) {
                this.setState({
                    AuthCode: resp.AuthImg,
                    comObj: {
                        ...this.state.comObj,
                        AuthToken: resp.AuthToken
                    }
                })
            }
            this.state.getLock = false;
        })

    }


    regist() {
        for (let i = 0; i < this.state.reqKeyList.length; i++) {//必填选项验证不为空
            if (!!!this.state.comObj[this.state.reqKeyList[i]]) {
                window.actions.popWindowAction({ type: "Hint", text: "请您填写完整信息" });
                return;
            }
        }
        let obj = this.state.comObj
        for (const key in obj) {//提交参数验证
            if (obj.hasOwnProperty(key)) {
                switch (key) {
                    case "UserName": {
                        const reg = /[\u4e00-\u9fa5]/g; //判断是中文
                        if (reg.test(obj[key])) {
                            window.actions.popWindowAction({ type: "Hint", text: "用户名不能是中文,只能是数字或字母" });
                            return false;
                        } else if (obj[key].length < 6) {
                            window.actions.popWindowAction({ type: "Hint", text: "用户名必须是6-15位的字母或数字" });
                            return false;
                        }
                        break;
                    }
                    case "TrueName": {
                        const reg = /^\+?[0-9][0-9]*$/; //判断不是数字
                        if (reg.test(obj[key])) {
                            window.actions.popWindowAction({ type: "Hint", text: "真实姓名必须是非数字" });
                            return false;
                        }
                        break;
                    }
                    case "Password": {
                        if ('Password2' in obj) {//需要二次输入效验账号密码
                            if (obj[key] !== obj.Password2) {
                                window.actions.popWindowAction({ type: "Hint", text: "两次输入的登录密码不一致" });
                                return false;
                            }
                        }
                        break;
                    }
                    case "WithdrawalPassword": {
                        if ('WithdrawalPassword2' in obj) {//需要二次输入效验取款密码
                            if (obj[key] !== obj.WithdrawalPassword2) {
                                window.actions.popWindowAction({ type: "Hint", text: "两次输入的取款密码不一致" });
                                return false;
                            }
                        }
                        break;
                    }
                    case "Phone": {
                        const reg = /^1[1-9][0-9]\d{4,8}$/; //判断电话
                        if (!reg.test(obj[key])) {
                            window.actions.popWindowAction({ type: "Hint", text: "手机号码格式有误" });
                            return false;
                        }
                        break;
                    }

                    case "QQ": {
                        let regNum = /^[0-9]+$/;   //正则判断QQ只能是数字
                        if (!regNum.test(obj[key])) {
                            window.actions.popWindowAction({ type: "Hint", text: "QQ只能是数字" });
                            return false;
                        }
                        break;
                    }

                    case "Wechat": {
                        let regTeshu = /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/; //正则过滤特殊字符
                        if (regTeshu.test(obj[key])) {
                            window.actions.popWindowAction({ type: "Hint", text: "微信不能含有特殊字符" });
                            return false;
                        }
                        break;
                    }


                }

            }
        }

        this.state.comObj.WebSite = getSession("channel");
        new window.actions.ApiSignUpAction(this.state.comObj).fly((respond: any) => {
            if (respond.StatusCode === 0) {
                new window.actions.LoginAfterInit();
                this.props.history.push("/Money");
            } else {
                if (respond.StatusCode === 512) {//验证码过期
                    this.getAuthCode();
                } else {
                    window.actions.popWindowAction({
                        type: "DefiPop", title: "注册失败", text: respond.Message,
                        leftBtn: {
                            text: "确定",
                            fc: () => { window.actions.popWindowAction({ type: "" }) }
                        },
                    });
                }
            }
        });



    }

}

const mapStateToProps = (state: ReducerState, ownProps: any) => ({

});

export default withRouter(connect(mapStateToProps)(LoginRegist));
