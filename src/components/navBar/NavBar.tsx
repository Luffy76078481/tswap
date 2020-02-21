import React from "react";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import { withRouter } from "react-router-dom";
import "./NavBar.scss"
import { config } from "../../config/projectConfig";
import { Badge } from 'antd-mobile';

class NavBar extends BaseClass {
  public state = {
    showQuery: false,
    queryVal: '',
    showQueBtn: false,
    platformsIdLoading: [],
  };

  render() {
    let { imagesConfig } = this.props;
    return (
      <div className="NavBar">
        <div className="NavBarLeft">
          {this.props.btnGoback && (
            <div className="goBank" onClick={this.goBack.bind(this)}>
              <span className="icon iconfont icon-fanhui-" />
            </div>
          )}
          { config.spec.includes("bbt") ? null : this.props.appIcon && (
            <div className="appIcon">
              <img
                src={config.devImgUrl + imagesConfig.Avatar}
                className="appImg"
                alt=""
              />
            </div>
          )}
        </div>
        <div className="NavBarCenter">
          { (config.spec.includes('bbt') && this.props.logo) ? (
            <div className="appLogo">
              <img
                src={config.devImgUrl + imagesConfig.Avatar}
                className="appImg"
                alt=""
              />
            </div>
          ) : (
            <p>{this.props.title}</p>
          )}
        </div>
        <div className="NavBarRight">
          {this.props.btnService && (
            <div onClick={this.goService.bind(this)}>
              <span className="icon iconfont icon-kefu1" />
            </div>
          )}
          {this.props.btnQuery && (
            <div onClick={this.goQuery.bind(this, true)}>
              <span className="icon iconfont icon-search" />
            </div>
          )}
          {this.props.message && (
            <div onClick={this.goMessage.bind(this)}>
              <span className="icon iconfont icon-kefuzhongxin iconfont-spec">
                {this.props.user.Token && this.props.sitemsg.unread > 0 && (
                  window.config.spec.includes('usd')?<Badge dot />:
                  <div className="title-message">
                    {this.props.sitemsg.unread > 99
                      ? '99+'
                      : this.props.sitemsg.unread}
                  </div>
                )}
              </span>
            </div>
          )}
          {this.props.deposit && (
            <div
              onClick={this.goUrl.bind(this, '/Money/depositDetails')}
              style={{ fontSize: '0.25rem' }}
            >
              存款教程
            </div>
          )}

          {this.props.tutorial && (
            <div
              onClick={this.goUrl.bind(this, '/My/Withdraw/withdrawDetails')}
              style={{ fontSize: '0.25rem' }}
            >
              取款教程
            </div>
          )}

          {this.props.recommend && (
            <div
              onClick={this.goUrl.bind(this, '/My/sharePage/recommend')}
              style={{ fontSize: '0.25rem' }}
            >
              推荐明细
            </div>
          )}

          {// 自定义按钮
          this.props.customFunc && this.props.customTxt && (
            <div onClick={this.props.customFunc.bind(this)}>
              <button>{this.props.customTxt}</button>
            </div>
          )}
        </div>
        <div
          className="floatQuery"
          style={{ display: this.state.showQuery ? 'block' : 'none' }}
        >
          <div className="queryIpBox">
            <span className="icon iconfont icon-search" />
            <input
              type="text"
              placeholder="请输入关键字"
              value={this.state.queryVal}
              onChange={this.queryChange.bind(this, false)}
            />
          </div>
          {this.state.showQueBtn ? (
            <div
              className="queryCancle"
              onClick={this.subQuery.bind(this, false)}
            >
              确认
            </div>
          ) : (
            <div
              className="queryCancle"
              onClick={this.goQuery.bind(this, false)}
            >
              取消
            </div>
          )}
        </div>
      </div>
    );
  }

  goBack() {
    this.props.history.goBack();
  }
  goService() {
    window.actions.popWindowAction({
      type: 'serviceWindow',
      text: '是否联系在线客服'
    });
  }

  goMessage(e:any) {
    if (!this.props.user || !this.props.user.Token) {
        e.preventDefault()
        window.actions.popWindowAction({
        type: 'LoginWindow',
        text:"您当前未登录,是否登录！",
      });
    }else {
        this.props.history.push('/My/siteLetter/mes'); 
    }
}

  goQuery(showQuery: boolean) {
    if (!showQuery) {
      this.queryChange(true);
    }
    this.setState({ showQuery });
  }
  queryChange(clear: boolean, e?: any) {
    if (clear) {
      this.setState({
        queryVal: '',
        showQueBtn: false
      });
      this.props.getQuetyParam('clear');
    } else {
      let inputVal = e.target.value;
      if (inputVal === '') {
        this.setState({
          queryVal: inputVal,
          showQueBtn: false
        });
      } else {
        this.setState({
          queryVal: inputVal,
          showQueBtn: true
        });
      }
    }
  }
  subQuery() {
    this.props.getQuetyParam(this.state.queryVal);
  }

  goUrl(url: string) {
    this.props.history.push(url);
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  // testAction: state.testAction
  user: state.user,
  notices: state.notices,
  sitemsg: state.sitemsg,
  imagesConfig: state.imagesConfig,
});

export default withRouter(connect(mapStateToProps)(NavBar));
