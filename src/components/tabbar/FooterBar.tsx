import React from "react";
import { NavLink, withRouter } from 'react-router-dom';
import BaseClass from '@/baseClass';
import { connect } from "react-redux";
import { Badge } from 'antd-mobile';
import "./FooterBar.scss";
// import "./FooterBarBlack.scss"; //夜间黑色主题

class FooterBar extends BaseClass {

  
  loginFlag  (e:any)  {
    if (!this.props.user || !this.props.user.Token) {
      e.preventDefault()
      window.actions.popWindowAction({
        type: 'LoginWindow',
        text: '您当前未登录,是否登录！'
      });
    }
  };
  loginFlags  (e:any)  {
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
      <nav className="FooterBar">
        <NavLink to="/Home">
          <span className="icon iconfont icon-shouye" />
          <p>首页</p>
        </NavLink>
        <NavLink to="/Money" onClick={this.loginFlags.bind(this)}>
          <span className="icon iconfont icon-qianbao" />
          <p>存款</p>
        </NavLink>
        <NavLink to="/Message">
          <span className="icon iconfont icon-liwulipinjiangpin-xianxing" />
          <p>优惠</p>
        </NavLink>
        <a href="#" onClick={openService}>
          <span className="icon iconfont icon-kefu1" />
          <p>客服</p>
        </a>
        <NavLink to="/My" onClick={this.loginFlags.bind(this)}>
          <span className="icon iconfont icon-wode" />
          <p>我的</p>
          { this.props.user.Token && (this.props.noticesUnRead !== 0 || this.props.sitemsg.unread > 0) ? <Badge dot /> : ''}
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



const openService = ()=>{
  window.actions.popWindowAction({type:"serviceWindow",text:"是否联系在线客服"});
}


const mapStateToProps = (state: any, ownProps: any) => ({
  // testAction: state.testAction,
  user: state.user,
  sitemsg: state.sitemsg, //未读消息
  noticesUnRead: state.noticesUnRead
});

export default withRouter(connect(mapStateToProps)(FooterBar));
