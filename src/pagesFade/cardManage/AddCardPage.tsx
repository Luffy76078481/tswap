import React from 'react';
import { List, InputItem,Picker,Toast,Modal} from 'antd-mobile';
import { connect } from "react-redux";
import {provinces} from "../../tollPlugin/provincesJson"
import './AddCardPage.scss';
import { NumPicker } from 'components/pui/Pui';

import NavBar from "components/navBar/NavBar"
import BaseClass from "@/baseClass";
import { withRouter } from "react-router-dom";

interface stateAny {
    state: any
}

let Province:any = [];
        for (var i = 0; i < provinces.length; i++) {
            var p = provinces[i];
            Province.push({
                label: p.name,
                value: i
            });
        }

     
class AddCard extends BaseClass {
  constructor(props: any) {
    super(props, [], true);
  }
  public submitStateLock = true;
  public state = {
    selProvince: Province,
    selCity: [] as any,
    ProvinceValue: [],
    ProvinceName: '',
    CityValue: [],
    CityName: '',
    bankData: [] as any,
    bankValue: [],
    bankId: '',
    WithdrawalPwd: ['0', '0', '0', '0'],
    bankInfos: [] as any
  };

  public cardNo = this.refs['cardNo'] as stateAny;
  realName = this.refs['realName'] as stateAny;
  branchNam = this.refs['branchNam'] as stateAny;
  username = this.refs['username'] as stateAny;
  branchName = this.refs['branchName'] as stateAny;
  phoneNo = this.refs['phoneNo'] as stateAny;
  codeNo = this.refs['codeNo'] as stateAny;
  

  componentDidMount() {
    this.cardNo = this.refs['cardNo'] as stateAny;
    this.realName = this.refs['realName'] as stateAny;
    this.branchNam = this.refs['branchNam'] as stateAny;
    this.username = this.refs['username'] as stateAny;
    this.branchName = this.refs['branchName'] as stateAny;
    this.phoneNo = this.refs['phoneNo'] as stateAny;
    this.codeNo = this.refs['codeNo'] as stateAny;

    new window.actions.ApiBanksAction().fly();
  }
  static getDerivedStateFromProps(props: any, state: any) {
    if (props.bankInfos.length !== state.bankInfos.length) {
      let arr: any = [];
      props.bankInfos.map((item: any, index: number) => {
        arr.push({
          label: item.BankName,
          trueValue: item.Id,
          value: index
        });
        return arr;
      });
      return {
        bankData: arr
      };
    }
    return null;
  }

  bankChange(val: any) {
    let index = val[0];
    this.setState({
      bankValue: [index],
      bankId: this.state.bankData[index].trueValue
    });
  }

  provinceChange(val: any) {
    let index = val[0];
    let city = [];
    for (var i = 0; i < provinces[index].cities.length; i++) {
      var p = provinces[index].cities[i];
      city.push({
        label: p.name,
        value: i
      });
    }
    this.setState({
      selCity: city,
      ProvinceName: this.state.selProvince[index].label,
      ProvinceValue: [index],
      CityValue: [],
      CityName: ''
    });
  }

  cityChange(val: any) {
    let index = val[0];
    this.setState({
      CityName: this.state.selCity[index].label,
      CityValue: [index]
    });
  }
  goBack() {
    this.props.history.goBack();
  }

  bindCardAction() {
    let _this = this;
    let params: any = {
      //后台要接收的参数
      BankId: this.state.bankId,
      Province: this.state.ProvinceName,
      City: this.state.CityName,
      BranchName: this.branchName.state.value,
      AccountNo: this.cardNo.state.value,
      AccountName: this.username.state.value
    };

    if (!this.props.user.HasWithdrawalPassword) {
      //首次设置取款密码
      params.WithdrawalPwd = this.state.WithdrawalPwd.toString().replace(
        /,/g,
        ''
      );
    }

    new window.actions.ApiBindCardAction(params).fly((resp: any) => {
      _this.submitStateLock = true;
      Toast.hide();
      if (resp.StatusCode === 0) {
        new window.actions.ApiBankAccountsAction().fly(); // 获取会员绑定的银行卡
        new window.actions.ApiPlayerInfoAction().fly(); // 刷新个人信息
        Modal.alert('银行卡添加成功!', '是否继续添加？', [
          {
            text: '返回',
            onPress: () => {
              new window.actions.ApiBankAccountsAction().fly();
              this.goBack();
            }
          },
          { text: '继续添加' }
        ]);
      } else {
        Modal.alert('添加失败！', resp.Message);
      }
    });
  }

  submit() {
    let _this = this;
    if (!this.submitStateLock) {
      return;
    }

    let realName = this.props.user.realName?this.props.user.realName:this.realName.state.value?this.realName.state.value:'';
    let bankId = this.state.bankId;
    let ProvinceName = this.state.ProvinceName;
    let CityName = this.state.CityName;
    let branchName = this.branchName.state.value;
    let cardNo = this.cardNo.state.value;
    let username = this.username.state.value;
    let cardNum = this.cardNo.state.value.replace(/\s+/g, '');
    if (realName != null && realName === '') {
      Modal.alert('错误!', '为确保正常提款,请认真填写您的真实姓名!');
      return;
    }
    if (!bankId) {
      Modal.alert('错误!', '开户银行信息不能为空!');
      return;
    }
    if (!username) {
      Modal.alert('错误!', '帐户名不能为空!');
      return;
    }
    if (!cardNo) {
      Modal.alert('错误!', '银行卡号不能为空!');
      return;
    }
    if (cardNum.length < 16 || cardNum.length > 19) {
      Modal.alert('错误!', '银行卡号限16~19位');
      return;
    }
    if (!ProvinceName) {
      Modal.alert('错误!', '开户省不能为空!');
      return;
    }
    if (!CityName) {
      Modal.alert('错误!', '开户市不能为空!');
      return;
    }
    if (!branchName) {
      Modal.alert('错误!', '开户支行不能为空!');
      return;
    }

    this.submitStateLock = false;
    if (!this.props.user.realName) {
      Toast.loading('银行卡添加中...', 300);
      new window.actions.ApiUpdateInfoAction(realName).fly((resp: any) => {
        if (resp.StatusCode === 0) {
          _this.bindCardAction();
        } else {
          Toast.hide();
          this.submitStateLock = true;
          Modal.alert('错误!', resp.Message);
        }
      });
    } else {
      Toast.loading('银行卡添加中...', 300);
      _this.bindCardAction();
    }
  }

  getPhoneCode(){
    new window.actions.ApiSendMobileVCodeAction().fly((resp: any)=>{
      if(resp.StatusCode === 0){
        console.log(999999,'获取成功')
      }
      
  })
  }

  openService(){
    window.actions.popWindowAction({type:"serviceWindow",text:"是否联系在线客服"});
  }

  render() {
    const { realName } = this.props.user;
    let {
      bankData,
      bankValue,
      selProvince,
      ProvinceValue,
      selCity,
      CityValue
    } = this.state;
    return (
      <div className="AddCard anmateContent">
        <NavBar
          btnGoback={true}
          btnService={true}
          title={'添加银行卡'}
        ></NavBar>
        <div className="scroll-content">
          <List>
            <div className="circle-wrap">
              <Picker
                extra="请选择开户银行"
                data={bankData}
                value={bankValue}
                ref="bank"
                cols={1}
                onOk={val => {
                  this.bankChange(val);
                }}
              >
                <List.Item arrow="down">选择银行</List.Item>
              </Picker>
              <InputItem
                placeholder="请输入您的银行卡号"
                ref="cardNo"
                type="number"
                maxLength={19}
              >
                银行卡号
              </InputItem>
              <InputItem
                placeholder="请填写银行卡的真实姓名"
                defaultValue={realName}
                editable={realName === '' ? true : false}
                type="text"
                className="warning-placehoder"
                ref="username"
              >
                帐户名
              </InputItem>

              {/* 手机 */}
              <InputItem
                placeholder="请输入您的手机号"
                ref="phoneNo"
                type="number"
                maxLength={11}
              >
                手机号
              </InputItem>

              {/* 验证码 */}
              {/* <InputItem
                  placeholder="验证码"
                  ref="codeNo"
                  type="text"
                  maxLength={8}
                >
                  验证码
                  <div className='yanzheng' onClick={()=>this.getPhoneCode()}>获取验证码</div>
                </InputItem> */}

              {/* {realName ? null : (
                <InputItem
                  placeholder="为确保正常提款，请输入您的真实姓名"
                  defaultValue={realName}
                  clear
                  maxLength={12}
                  type="text"
                  className="warning-placehoder"
                  ref="realName"
                >
                  真实姓名
                </InputItem>
              )} */}
              {!this.props.user.HasWithdrawalPassword && (
                <NumPicker
                  value={this.state.WithdrawalPwd}
                  onOk={(v: any) => this.setState({ WithdrawalPwd: v })}
                  tipText="取款密码"
                />
              )}
            </div>

            <div className="circle-wrap">
              <Picker
                extra="请选择开户省"
                data={selProvince}
                value={ProvinceValue}
                ref="province"
                cols={1}
                onOk={val => {
                  this.provinceChange(val);
                }}
              >
                <List.Item arrow="down">开户省</List.Item>
              </Picker>
              <Picker
                extra="请选择开户市"
                data={selCity}
                value={CityValue}
                ref="city"
                cols={1}
                onOk={val => {
                  this.cityChange(val);
                }}
              >
                <List.Item arrow="down">开户市</List.Item>
              </Picker>
              <InputItem
                placeholder="开户支行"
                clear
                type="text"
                ref="branchName"
                maxLength={40}
              >
                开户支行
              </InputItem>
            </div>
          </List>
          <button onClick={this.submit.bind(this)} className="btn">
            提交
          </button>
          <div className="prompt">
            <p>
              请认真校对银行卡号，卡号错误资金将无法到账。如需帮助，请
              <span onClick={this.openService.bind(this)}>联系客服</span>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => (
    {
        user:state.user,
        bankInfos:state.bankInfos
    }
);
export default withRouter(connect(mapStateToProps)( AddCard));