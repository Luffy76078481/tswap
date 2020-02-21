import React from 'react';
import {TextareaItem, Toast,Picker,List} from 'antd-mobile';
import { connect } from "react-redux";
import "./FeedbackPage.scss";
import NavBar from "components/navBar/NavBar"
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";


interface RouterProps {
    history: any
}

class SiteLetter extends BaseClass<RouterProps> {
  public state = {
    disabled: true,
    selectIndex: [],
    Title:''
  };

  constructor(props: any) {
    super(props, []);
  }

  onChange(val: any) {
    let newVal: any = val.replace(' ', '');
    if (newVal.length > 0) {
      this.setState({
        disabled: false
      });
    } else {
      this.setState({
        disabled: true
      });
    }
  }

  submit() {
    interface fuck {
      state: any;
    }
    var test = this.refs['textarea'] as fuck;
    let val: any = test.state.value;
    let Title: any = this.state.Title;
    Toast.loading('反馈提交中...', 300);
    new window.actions.ApiFeedBackAction(val,Title).fly((resp: any) => {
      Toast.hide();
      if (resp.StatusCode === 0) {
        window.actions.popWindowAction({
          type: 'DefiPop',
          title: '问题提交成功!',
          text: `${resp.Message}`,
          leftBtn: {
            text: '确定',
            fc: () => {
              window.actions.popWindowAction({ type: '' });
            }
          }
        });
      } else {
        window.actions.popWindowAction({
          type: 'DefiPop',
          title: '问题提交失败!',
          text: `${resp.Message}`,
          leftBtn: {
            text: '确定',
            fc: () => {
              window.actions.popWindowAction({ type: '' });
            }
          }
        });
      }
    });
  }
  selectProblem(val: any) {
    switch (val[0]) {
      case 0:
        this.setState({ Title: '存款问题' });
        break;
      case 1:
        this.setState({ Title: '提款问题' });
        break;
      case 2:
        this.setState({ Title: '游戏问题' });
        break;
      case 3:
        this.setState({ Title: '优惠问题' });
        break;
      case 4:
        this.setState({ Title: '网站/APP问题' });
        break;
      case 5:
        this.setState({ Title: '资料问题' });
        break;
      case 6:
        this.setState({ Title: '流水问题' });
        break;
      default:
          this.setState({ Title: '其他问题' });
        break;
    }
    this.setState({
      selectIndex: val
    });
  }
  render() {
    return (
      <div className="feedbackPage anmateContent">
        <NavBar btnGoback={true} btnService={true} title={'意见建议'}></NavBar>

        <div className="scroll-content Feedback">
          {/* <div className="selectTex">问题类型</div> */}
          <Picker
            title=""
            data={[
              { label: '存款问题', value: 0 },
              { label: '提款问题', value: 1 },
              { label: '游戏问题', value: 2 },
              { label: '优惠问题', value: 3 },
              { label: '网站/APP问题', value: 4 },
              { label: '资料问题', value: 5 },
              { label: '流水问题', value: 6 },
              { label: '其他问题', value: 7 }
            ]}
            extra="请选择问题类型"
            value={this.state.selectIndex}
            cols={1}
            onOk={val => {
              this.selectProblem(val);
            }}
          >
            <List.Item arrow="down"></List.Item>
          </Picker>
          <TextareaItem
            placeholder="问题描述(不得超过150字)"
            rows={7}
            ref="textarea"
            count={150}
            onChange={this.onChange.bind(this)}
          />
          <button
            disabled={this.state.disabled}
            onClick={this.submit.bind(this)}
            className="btn"
          >
            提交
          </button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => (
    { 
        
     }
);
export default withRouter(connect(mapStateToProps)(SiteLetter));