import React from 'react';
import {List,InputItem,Modal,Toast,Picker} from "antd-mobile";
import { connect } from "react-redux";
import { setSession } from "tollPlugin/commonFun";
import "./AgentRegPage.scss"
import NavBar from "components/navBar/NavBar"
import { NavLink, withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";




const isChinese = function isChinese(str:any){ 
    var patrn=/[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/gi; 
    if(!patrn.exec(str)){ 
        return false; 
    }else{ 
        return true; 
    } 
}

interface stateAny {
    state: any
}
var pickerData = [
  [
    { label: '0', value: '0' },
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' }
  ]
];
pickerData = [...pickerData, ...pickerData, ...pickerData, ...pickerData];

class AgentRegPage extends BaseClass {
  constructor(props: any) {
    super(props, []);
  }
  public state = {
    submitStateLock: true,
    birthday: '',
    checkPay: false,
    VerifyCode: '',
    noUsername: false,
    noRealname: false,
    noPassword: false,
    notMatchPayPassword: false,
    noBirthday: false,
    noEmail: false,
    noVerifycode: false,
    noPayPassword: false,
    noPayPassword2: false,
    noPhone: false,
    noWechat: false,
    noQQ: false,
    withdrawPassword: false,
    AgentbanksAccount: false,
    agentBanks: [],
    defaultagentBanks: [0],
    agentbanksId: '',
    values: [],
  };

  public PayMethodList: any = [];

  componentWillMount() {
    Toast.info('数据加载中,请稍后');
    new window.actions.ApiAgentGetRegistSetting().fly((resp: any) => {
      Toast.hide();
    });
    // 推广链接
    let isAutoLogin = window.location.search;
    if (isAutoLogin.indexOf('channel') > 0) {
      setSession('channel', isAutoLogin.split('=')[1]);
    }
    new window.actions.ApiagentBanks().fly((resp: any) => {
      let index = 0;
      for (let i = 0; i < resp.Data.length; i++) {
        let banks = resp.Data[i];
        this.PayMethodList.push({
          label: banks.BankName,
          selfObj: banks,
          value: index,
          Id: banks.Id
        });
        index++;
      }
      this.setState({
        agentbanksId: this.PayMethodList[0].Id
      });
    });
  }

  // 注册提交
  onRegister(event: any) {
    let usernameState = this.refs.username as stateAny;
    let passwordState = this.refs.password as stateAny;
    let notMatchPayPasswordState = this.refs.notMatchPayPassword as stateAny;
    let noRealnameState = this.refs.noRealname as stateAny;
    let noEmailState = this.refs.noEmail as stateAny;
    let noQQState = this.refs.noQQ as stateAny;
    let noPhoneState = this.refs.noPhone as stateAny;
    let noAgentbanksAccountState = this.refs.AgentbanksAccount as stateAny;


    event.preventDefault();
    let checknom = 0;
    let username = usernameState.state.value;
    let password = passwordState.state.value;
    let notMatchPayPassword = notMatchPayPasswordState.state.value;
    let AgentBanks = this.state.agentbanksId;
    let AgentAccount = noAgentbanksAccountState.state.value;
    let withdrawPassword = this.state.values;
    let noRealname = '',
      noPhone = '',
      noEmail = '',
      noQQ = '',
      noBirthday = '',
      noWechat = '';
    let AgentbanksAccount = '';
    let params = {};
    if (!username) {
      this.setState({
        noUsername: true
      });
      checknom++;
    }
    if (!password) {
      this.setState({
        noPassword: true
      });
      checknom++;
    }
    if (!notMatchPayPassword) {
      this.setState({
        notMatchPayPassword: true
      });
      checknom++;
    }
    if (password !== notMatchPayPassword) {
      this.setState({
        notMatchPayPassword: true
      });
      checknom++;
    }

    // 真实姓名
    if (this.props.registerSetting.TrueName.IsVisible) {
      noRealname = noRealnameState.state.value;
      if (!noRealname && this.props.registerSetting.TrueName.IsRequire) {
        this.setState({
          noRealname: true
        });
        checknom++;
      }
    }
    if (this.props.registerSetting.Phone.IsVisible) {
      noPhone = this.refs.noPhone && noPhoneState.state.value;
      if (!noPhone && this.props.registerSetting.Phone.IsRequire) {
        this.setState({
          noPhone: true
        });
        checknom++;
      }
    }
    AgentbanksAccount =
      this.refs.AgentbanksAccount && noAgentbanksAccountState.state.value;
    if (!AgentbanksAccount) {
      this.setState({
        AgentbanksAccount: true
      });
      checknom++;
    }
    withdrawPassword = this.refs.withdrawPassword && this.state.values;
    if (!withdrawPassword) {
      this.setState({
        withdrawPassword: true
      });
      checknom++;
    }
    if (this.props.registerSetting.Email.IsVisible) {
      noEmail = this.refs.noEmail && noEmailState.state.value;
      if (!noEmail && this.props.registerSetting.Email.IsRequire) {
        this.setState({
          noEmail: true
        });
        checknom++;
      }
    }
    if (this.props.registerSetting.QQ.IsVisible) {
      noQQ = this.refs.noQQ && noQQState.state.value;
      if (!noQQ && this.props.registerSetting.QQ.IsRequire) {
        this.setState({
          noQQ: true
        });
        checknom++;
      }
    }
    if (this.props.registerSetting.Birthday.IsVisible) {
      noBirthday = this.refs.noBirthday && this.state.birthday;
      if (!noBirthday && this.props.registerSetting.Birthday.IsRequire) {
        this.setState({
          noBirthday: true
        });
        checknom++;
      }
    }
    if (checknom !== 0) {
      return;
    }
    if (!this.state.submitStateLock) return;
    this.setState({ submitStateLock: false });
    Toast.loading('注册中,请稍后...');
    params = {
      UserName: username,
      TrueName: noRealname,
      Password: password,
      Email: noEmail,
      Phone: noPhone,
      QQ: noQQ,
      Wechat: noWechat,
      WithdrawalPassword: withdrawPassword,
      Birthday: noBirthday,
      AgentBankId: AgentBanks,
      WebSite: '',
      AgentBankNo: AgentAccount
    };
    new window.actions.ApiAgentRegisterAction(params).fly((respond: any) => {
      Toast.hide();
      this.state.submitStateLock = true;
      if (respond.StatusCode === 0) {
        new window.actions.LoginAfterInit();
        Modal.alert('注册成功！', respond.Message);
        this.props.history.push('/');
      } else {
        Modal.alert('注册失败！', respond.Message);
      }
    });
  }

  // 错误提示
  errorInfos = (which: any) => {
    let usernameState = this.refs.username as stateAny;
    let passwordState = this.refs.password as stateAny;
    let noPayPasswordState = this.refs.noPayPassword as stateAny;
    let noPhoneState = this.refs.noPhone as stateAny;

    //用户名
    const inputVal = usernameState.state.value;
    if (which === 'noUsername' && this.state.noUsername) {
      if (inputVal === '') {
        Toast.info('用户名不能为空');
      } else {
        if (isChinese(inputVal)) {
          Toast.info('用户名不能是中文,只能是数字或字母！');
          // usernameState.state.value = '';
        } else if (!isChinese(inputVal) && inputVal.length < 6) {
          Toast.info('用户名不能少于6位！');
        } else {
        }
      }
    }
    //真实姓名
    if (this.state.noRealname && which === 'noRealname') {
      Toast.info('请填写您的真实姓名！');
    }
    //密码
    if (this.state.noPassword && which === 'noPassword') {
      if (passwordState.state.value === '') {
        Toast.info('请填写登陆密码！');
      } else {
        Toast.info('登陆密码长度必须为6-12位！');
      }
    }
    //确认密码
    if (this.state.notMatchPayPassword && which === 'notMatchPayPassword') {
      Toast.info('确认密码与密码不相符！');
    }
    //取款密码
    if (this.state.noPayPassword && which === 'noPayPassword') {
      if (noPayPasswordState.state.value === '') {
        Toast.info('请填写取款密码！');
      } else if (noPayPasswordState.state.value === passwordState.state.value) {
        Toast.info('取款密码和登录密码不能相同！');
      } else {
        Toast.info('取款密码长度必须为6-12位！');
      }
    }
    //确认取款密码
    if (this.state.noPayPassword2 && which === 'noPayPassword2') {
      Toast.info('确认取款密码与取款密码不相符！');
    }
    //郵箱
    if (
      this.state.noEmail &&
      which === 'noEmail' &&
      this.props.registerSetting.Email.IsRequire
    ) {
      Toast.info('请填写您的邮箱！');
    }
    //生日
    if (this.state.noBirthday && which === 'noBirthday') {
      Toast.info('您的生日不能为空！');
    }
    //手机
    if (this.state.noPhone && which === 'noPhone') {
      if (noPhoneState.state.value === '') {
        Toast.info('请填写您的手机号码！');
      } else {
        Toast.info('手机号码长度错误！');
      }
    }
    //微信
    if (this.state.noWechat && which === 'noWechat') {
      Toast.info('您的微信号码不能为空！');
    }
    //QQ
    if (this.state.noQQ && which === 'noQQ') {
      Toast.info('您的QQ号码不能为空！');
    }

    if (this.state.AgentbanksAccount && which === 'AgentbanksAccount') {
      Toast.info('您的银行账号不能为空！');
    }
    if (this.state.withdrawPassword && which === 'withdrawPassword') {
      Toast.info('您的取款密码不能为空！');
    }
  };

  // 判断输入是否合格
  validateInput(which: any, val: any) {
    let passwordState = this.refs.password as stateAny;
    let noPayPasswordState = this.refs.noPayPassword as stateAny;
    //用户名
    if (which === 'noUsername') {
      if (val === '' || 6 > val.length || isChinese(val)) {
        this.setState({
          noUsername: true
        });
      } else {
        this.setState({
          noUsername: false
        });
      }
    }
    if (which === 'AgentbanksAccount') {
      if (val === '') {
        this.setState({
          AgentbanksAccount: true
        });
      } else {
        this.setState({
          AgentbanksAccount: false
        });
      }
    }
    if (which === 'withdrawPassword') {
      if (val === '') {
        this.setState({
          withdrawPassword: true
        });
      } else {
        this.setState({
          withdrawPassword: false
        });
      }
    }
    //真实姓名
    if (
      which === 'noRealname' &&
      this.props.registerSetting.TrueName.IsRequire
    ) {
      if (val === '') {
        this.setState({
          noRealname: true
        });
      } else {
        this.setState({
          noRealname: false
        });
      }
    }
    //登陆密码
    if (which === 'noPassword') {
      if (val === '' || 6 > val.length) {
        this.setState({
          noPassword: true
        });
      } else {
        this.setState({
          noPassword: false
        });
      }
    }
    //确认密码
    if (which === 'notMatchPayPassword') {
      let oldVal = passwordState.state.value;
      if (val === '' || oldVal !== val) {
        this.setState({
          notMatchPayPassword: true
        });
      } else {
        this.setState({
          notMatchPayPassword: false
        });
      }
    }

    //取款密码
    if (which === 'noPayPassword') {
      let oldVal = passwordState.state.value;
      if (val === '' || 6 > val.length || oldVal === val) {
        this.setState({
          noPayPassword: true
        });
      } else {
        this.setState({
          noPayPassword: false
        });
      }
    }
    //确认取款密码
    if (which === 'noPayPassword2') {
      let oldVal = noPayPasswordState.state.value;
      if (val === '' || oldVal !== val) {
        this.setState({
          noPayPassword2: true
        });
      } else {
        this.setState({
          noPayPassword2: false
        });
      }
    }
    //郵箱
    if (which === 'noEmail' && this.props.registerSetting.Email.IsRequire) {
      if (val === '') {
        this.setState({
          noEmail: true
        });
      } else {
        this.setState({
          noEmail: false
        });
      }
    }
    //手机
    if (which === 'noPhone' && this.props.registerSetting.Phone.IsRequire) {
      if (val === '' || val.length > 11 || val.length < 11) {
        this.setState({
          noPhone: true
        });
      } else {
        this.setState({
          noPhone: false
        });
      }
    }
    //QQ
    if (which === 'noQQ' && this.props.registerSetting.QQ.IsRequire) {
      if (val === '') {
        this.setState({
          noQQ: true
        });
      } else {
        this.setState({
          noQQ: false
        });
      }
    }
    //生日
    if (
      which === 'noBirthday' &&
      this.props.registerSetting.Birthday.IsVisible
    ) {
      if (val === '') {
        this.setState({
          noBirthday: true,
          birthday: val.format('yyyy-MM-dd')
        });
      } else {
        this.setState({
          noBirthday: false,
          birthday: val.format('yyyy-MM-dd')
        });
      }
    }
  }
  changeAgentBanks(val: any) {
    let index = val[0];
    this.setState({
      defaultagentBanks: [index],
      agentbanksId: this.PayMethodList[index].Id
    });
  }
  selectNumVal(key: string, val: any) {
    if (key === 'withdrawPassword') {
      //取款选择密码特殊处理
      val = val.join('');
      this.setState({
        values: val
      });
    }
  }
  render() {
    return (
      <div className="agentRegisterPage anmateContent">
        <NavBar btnGoback={true} btnService={true} title={'代理注册'}></NavBar>
        <div className="scroll-content">
          <form onSubmit={this.onRegister.bind(this)}>
            <List>
              {/*用户名*/}
              <InputItem
                placeholder="用户名（必填，长度6到12位）"
                clear
                maxLength={12}
                ref="username"
                error={this.state.noUsername}
                onKeyUp={this.errorInfos.bind(this, 'noUsername')}
                onErrorClick={this.errorInfos.bind(this, 'noUsername')}
                onChange={this.validateInput.bind(this, 'noUsername')}
              >
                <i className="icon iconfont icon-yonghu" />
              </InputItem>
              {/*密码*/}
              <InputItem
                placeholder="密码（必填，长度6到12位）"
                clear
                maxLength={12}
                type="password"
                ref="password"
                error={this.state.noPassword}
                onKeyUp={this.errorInfos.bind(this, 'noPassword')}
                onErrorClick={this.errorInfos.bind(this, 'noPassword')}
                onChange={this.validateInput.bind(this, 'noPassword')}
              >
                <i className="icon iconfont icon-mima54" />
              </InputItem>
              {/*确认密码*/}
              <InputItem
                placeholder="确认密码（请再次输入你的密码）"
                clear
                maxLength={12}
                type="password"
                ref="notMatchPayPassword"
                error={this.state.notMatchPayPassword}
                onKeyUp={this.errorInfos.bind(this, 'notMatchPayPassword')}
                onErrorClick={this.errorInfos.bind(this, 'notMatchPayPassword')}
                onChange={this.validateInput.bind(this, 'notMatchPayPassword')}
              >
                <i className="icon iconfont icon-yanzhengmamima" />
              </InputItem>
              {/*真实姓名*/}
              {this.props.registerSetting.TrueName.IsVisible  ? (
                <InputItem
                  placeholder="真实姓名（必填，涉及出款）"
                  clear
                  ref="noRealname"
                  error={this.state.noRealname}
                  onKeyUp={this.errorInfos.bind(this, 'noRealname')}
                  onErrorClick={this.errorInfos.bind(this, 'noRealname')}
                  onChange={this.validateInput.bind(this, 'noRealname')}
                  onBlur={this.validateInput.bind(this, 'noRealname')}
                >
                  <i className="icon iconfont icon-yonghu" />
                </InputItem>
              ) : null}
              {/*邮箱*/}
              {this.props.registerSetting.Email.IsVisible ? (
                <InputItem
                  placeholder="请输入您的常用邮箱"
                  clear
                  ref="noEmail"
                  // type="email"
                  error={this.state.noEmail}
                  onKeyUp={this.errorInfos.bind(this, 'noEmail')}
                  onErrorClick={this.errorInfos.bind(this, 'noEmail')}
                  onChange={this.validateInput.bind(this, 'noEmail')}
                >
                  <i className="icon iconfont icon-youxiang" />
                </InputItem>
              ) : null}
              {this.props.registerSetting.QQ.IsVisible ? (
                <InputItem
                  placeholder="QQ"
                  clear
                  ref="noQQ"
                  type="number"
                  error={this.state.noQQ}
                  onKeyUp={this.errorInfos.bind(this, 'noQQ')}
                  onErrorClick={this.errorInfos.bind(this, 'noQQ')}
                  onChange={this.validateInput.bind(this, 'noQQ')}
                >
                  <i className="icon iconfont icon-qq1" />
                </InputItem>
              ) : null}
              {this.props.registerSetting.Phone.IsVisible ? (
                <InputItem
                  placeholder="手机号码"
                  clear
                  type="number"
                  ref="noPhone"
                  error={this.state.noPhone}
                  maxLength={11}
                  onKeyUp={this.errorInfos.bind(this, 'noPhone')}
                  onErrorClick={this.errorInfos.bind(this, 'noPhone')}
                  onChange={this.validateInput.bind(this, 'noPhone')}
                >
                  <i className="icon iconfont icon-shouji1" />
                </InputItem>
              ) : null}
              <Picker
                data={this.PayMethodList}
                cols={1}
                value={this.state.defaultagentBanks}
                ref="AgentBanks"
                onOk={val => {
                  this.changeAgentBanks(val);
                }}
              >
                <List.Item arrow="down" className="am-list-content-Bank">
                  <i className="icon iconfont icon-qukuanmima" />
                  出款银行:
                </List.Item>
              </Picker>

              <InputItem
                placeholder="银行账号"
                clear
                ref="AgentbanksAccount"
                type="number"
                maxLength={19}
                error={this.state.AgentbanksAccount}
                onKeyUp={this.errorInfos.bind(this, 'AgentbanksAccount')}
                onErrorClick={this.errorInfos.bind(this, 'AgentbanksAccount')}
                onChange={this.validateInput.bind(this, 'AgentbanksAccount')}
              >
                <i className="icon iconfont icon-qukuanmima" />
              </InputItem>
              {/*密码*/}
              <Picker
                key="withdrawPassword"
                cascade={false}
                data={pickerData}
                title="取款密码"
                extra="取款密码"
                onOk={this.selectNumVal.bind(this, 'withdrawPassword')}
              >
                <div key="withdrawPassword" className="inputBox">
                  <i className="icon iconfont icon-mima54" />
                  <input
                    className="WithdrawalPassword"
                    type="text"
                    ref="withdrawPassword"
                    // onChange={this.validateInput.bind(this, 'withdrawPassword')}
                    value={this.state.values}
                    placeholder="取款密码"
                    readOnly
                  />
                </div>
              </Picker>
            </List>
            <button className="btn registerBtn">提交申请</button>
          </form>
          <NavLink to="/My/agentReg/partnership">
            <div className='jointImg'></div>
          </NavLink>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => (
    { 
        registerSetting:state.AgentRegisterSetting,
        remoteSysConfs:state.remoteSysConfs
     }
);
export default withRouter(connect(mapStateToProps)(AgentRegPage));