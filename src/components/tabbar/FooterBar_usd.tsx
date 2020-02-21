import React from "react";
import { NavLink, withRouter } from 'react-router-dom';
import BaseClass from '@/baseClass';
import { connect } from "react-redux";
import { Badge } from 'antd-mobile';
import "./FooterBar_usd.scss";

class FooterBar_usd extends BaseClass {


  loginFlag(e: any) {
    if (!this.props.user || !this.props.user.Token) {
      e.preventDefault()
      window.actions.popWindowAction({
        type: 'LoginWindow',
        text: '您当前未登录,是否登录！'
      });
    }
  };
  loginFlags(e: any) {
    if (!this.props.user || !this.props.user.Token) {
      e.preventDefault()
      window.actions.popWindowAction({
        type: 'LoginWindow',
        text: '您当前未登录,是否登录！'
      });
    }
  };

  render() {
    return (
      <nav className="FooterBar_usd">
        <NavLink to="/Home">
          <span className="icon iconfont icon-xiaoyuan- iconfont-spec" />
          <p>游戏</p>
        </NavLink>
        <NavLink to="/found" className='faxian'>
          <span className="icon iconfont icon-icon_faxian iconfont-spec" />
          <p>发现</p>
        </NavLink>
        <NavLink to="/live">
          <span className="icon iconfont icon-bofanganniu iconfont-spec " />
          <p>比分直播</p>
        </NavLink>
        <a href="#" onClick={openService}>
          <span className="icon iconfont icon-kefu1 iconfont-spec" />
          <p>客服</p>
        </a>
        <NavLink to="/My" onClick={this.loginFlags.bind(this)}>
          <span className="icon iconfont icon-wode iconfont-spec" />
          <p>我的</p>
          {this.props.user.Token && (this.props.noticesUnRead !== 0 || this.props.sitemsg.unread > 0) ? <Badge dot /> : ''}
        </NavLink>
        {/* 新的 我的页面 备用 */}
        {/* <NavLink to="/NewMy">
        <span className="icon iconfont icon-wode" />
        <p>新我</p>
      </NavLink> */}
      </nav>
    );
  }
};



const openService = () => {
  window.actions.popWindowAction({ type: "serviceWindow", text: "是否联系在线客服" });
}


const mapStateToProps = (state: any, ownProps: any) => ({
  // testAction: state.testAction,
  user: state.user,
  sitemsg: state.sitemsg, //未读消息
  noticesUnRead: state.noticesUnRead
});

export default withRouter(connect(mapStateToProps)(FooterBar_usd));
