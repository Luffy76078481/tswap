import * as React from "react";
import "./MyPage.scss";
// import "./MypageBlack.scss";  //夜间黑色主题
import NavBar from "components/navBar/NavBar"
import { List } from "antd-mobile";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import { NavLink, Link, withRouter } from "react-router-dom";
class MyPage extends BaseClass {
  public state = {
    checkAuth: true
  }
  constructor(props: any) {
    super(props, []);
  }

  // 跳转APP下载页
  downLoad() {
    window.open(this.props.remoteSysConfs.channel_push_url, "_blank");
} 
componentDidMount () {
    new window.actions.ApiSitemsgUnreadCountAction().fly();
}
  render() {
    return (
      <div className="MyPage">
        <NavBar message={true} title={'我的'}></NavBar>
        <div className="pageContent">
          <div className="content-container">
            <div className="second__25kyk">
              <div className="my-index__3XjEX">
                <div className="my-info-wrap__1dve9">
                  <img
                    src={require('./images/head.png')}
                    alt=""
                    className="loaded"
                    data-was-processed="true"
                  />
                </div>
                <div className="my-info-wrap1__3Ty9P">
                  <div className="more__1iKno">
                    <Link to="/My/privateInfo">个人资料</Link>
                  </div>
                  <div className="user__1iZuy">
                    <span className="l-name__1y0S5">
                      {this.props.user.username}
                    </span>
                  </div>
                  <div className="user__1iZuy1">
                    <span className="l-name__1y0S6">
                      {this.props.user.userLevelName}
                    </span>
                  </div>
                  <div className="bar__38Ioa">
                    <div className="progress-bar__1LKeG">
                      <div className="barleft__mve_I"></div>
                    </div>
                  </div>
                </div>
              </div>
              <NavLink to="/My/history" className="myAcount">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                  extra={<span>￥{this.props.user.userBalance}</span>}
                >
                  我的特权V
                </List.Item>
              </NavLink>
              <div className="palace__1MM09">
                <div className="grid__3Xa5w">
                  <span className="icon iconfont icon-cunkuan" />
                  <p>
                    <NavLink to="/Money">存款</NavLink>
                  </p>
                </div>
                <div className="grid__3Xa5w">
                  <span className="icon iconfont icon-qukuan" />
                  <p>
                    <NavLink to="/My/Withdraw">取款</NavLink>
                  </p>
                </div>
                <div className="grid__3Xa5w">
                  <span className="icon iconfont icon-youhui" />
                  <p>
                    <NavLink to="/My/Transfer">转账</NavLink>
                  </p>
                </div>
                <div className="grid__3Xa5w">
                  <span className="icon iconfont icon-huodong" />
                  <p>
                    <NavLink to="/My/activity">活动</NavLink>
                  </p>
                </div>
              </div>

              <NavLink to="/My/history">
                <List.Item className="listItem " arrow="horizontal">
                  <span className="icon iconfont icon-zhanghumingxi listIcon" />
                  <span className="listSpan">交易记录</span>
                </List.Item>
              </NavLink>

              <NavLink to="/Message">
                <List.Item className="listItem" arrow="horizontal">
                  <span className="icon iconfont icon-liwu listIcon" />
                  <span className="listSpan">优惠活动</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/siteLetter/pla">
                <List.Item className="listItem " arrow="horizontal">
                  <span className="icon iconfont icon-md-guangbo listIcon" />
                  <span className="listSpan">平台公告</span>
                 {this.props.noticesUnRead !== 0 && <span className="count">{this.props.noticesUnRead}</span>} 
                </List.Item>
              </NavLink>

              {
                window.config.spec.includes('usd')?'':
                <NavLink to="/My/siteLetter/mes">
                  <List.Item className="listItem " arrow="horizontal">
                    <span className="icon iconfont icon-wodexiaoxi listIcon" />
                    <span className="listSpan">站内信</span>
                  </List.Item>
                </NavLink>
              }

              <NavLink to="/My/cardManage">
                <List.Item className="listItem" arrow="horizontal">
                  <span className="icon iconfont icon-yinhangka listIcon" />
                  <span className="listSpan">银行卡</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/service">
                <List.Item className="listItem spclistItem" arrow="horizontal">
                  <span className="icon iconfont icon-lianxiwomen listIcon" />
                  <span className="listSpan">联系我们</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/agentShow">
                <List.Item className="listItem" arrow="horizontal">
                  <span className="icon iconfont icon-xinyonghu listIcon" />
                  <span className="listSpan">申请代理</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/editPassword">
                <List.Item className="listItem " arrow="horizontal">
                  <span className="icon iconfont icon-anquanzhongxin listIcon" />
                  <span className="listSpan">安全中心</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/sharePage">
                <List.Item className="listItem " arrow="horizontal">
                  <span className="icon iconfont icon-guanyuwomen listIcon" />
                  <span className="listSpan">好友推荐</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/feedback">
                <List.Item className="listItem " arrow="horizontal">
                  <span className="icon iconfont icon-youxiang listIcon" />
                  <span className="listSpan">意见建议</span>
                </List.Item>
              </NavLink>
              
              <NavLink to="/My/helpCenter">
                <List.Item className="listItem " arrow="horizontal">
                  <span className="icon iconfont icon-bangzhu listIcon" />
                  <span className="listSpan">帮助中心</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/about">
                <List.Item className="listItem spclistItem" arrow="horizontal">
                  <span className="icon iconfont icon-gerenbaobiao listIcon" />
                  <span className="listSpan">关于我们</span>
                </List.Item>
              </NavLink>

              <List.Item
                className="listItem "
                arrow="horizontal"
                onClick={this.downLoad.bind(this)}
              >
                <span className="icon iconfont icon-xiazai listIcon" />
                <span className="listSpan">APP下载</span>
              </List.Item>

              <div className="exit__VoeN" onClick={this.userQuit.bind(this)}>
                退出登录
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }


  userQuit() {
    new window.actions.LogoutAction().fly();
    this.props.history.push('/Home');
  }

}
const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.user,
  remoteSysConfs: state.remoteSysConfs,
  noticesUnRead: state.noticesUnRead
});

export default withRouter(connect(mapStateToProps)(MyPage));
