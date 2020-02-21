import * as React from "react";
import "./NewMyPage.scss";
import { List,Toast } from "antd-mobile";
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
  refresh = ()=> {
    Toast.loading('刷新中...');
    new window.actions.ApiGamePlatformAllBalanceAction().fly((resp:any)=>{
        if (resp.StatusCode === 0) {
            new window.actions.ApiPlayerInfoAction().fly((resp:any)=>{
                    if (resp.StatusCode === 0) {
                        Toast.success('刷新成功', 1);
                    } else{
                        Toast.fail('刷新失败', 1);
                    }
            })
        }
    });
}

// 跳转APP下载页
downLoad() {
  window.open(this.props.remoteSysConfs.channel_push_url, "_blank");
}
  render() {
    return (
      <div className="MyNewPage">
        <div className="Head">
          <div className="head_title">我</div>
          <div className="head_znx" 
            onClick={()=>this.props.history.push("/My/siteLetter/mes")}
          >
            <span className="icon iconfont icon-kefuzhongxin" />
          </div>
          <div className="myInfo">
              <div className="my-index__3XjEX">
                  <div className="my-info-wrap__1dve9">
                      <img src={require("./images/head.png")} alt="" className="head_pic" data-was-processed="true" />
                  </div>
                  <div className="my-info-wrap1__3Ty9P">
                      <div className="head_user_name">
                        <span className="l-name__1y0S5">{this.props.user.username}</span>
                      </div>
                      <div className="head_user_vip">
                        <span className="l-name__1y0S6">{this.props.user.userLevelName}</span>
                      </div>
                      <div className="money_num">
                        <span>￥<i>{this.props.user.userBalance || '0'}</i></span>
                      </div>
                      <div className="btns">
                        <Link to="/My/Transfer" className='check_all'>钱包中心</Link>
                        <i className='icon icon-refresh iconfont icon-jiazai  refresh' onClick={()=>this.refresh()}></i>
                      </div>
                  </div>
                  <div className="palace__1MM09">
                    <div className="grid__3Xa5w">
                      <span className="icon iconfont icon-cunkuan" />
                        <p><NavLink to="/Money">存款</NavLink></p>
                    </div>  
                    <div className="grid__3Xa5w">
                      <span className="icon iconfont icon-qukuan" />
                      <p><NavLink to="/My/Withdraw">取款</NavLink></p>
                    </div>                  
                    <div className="grid__3Xa5w">
                      <span className="icon iconfont icon-youhui" />
                      <p><NavLink to="/My/Transfer">转账</NavLink></p>
                    </div>
                  </div>
              </div>
          </div>
        </div>
        <div className="pageContent">
          <div className="content-container">
            <div className="second__25kyk">
            <div className="gg">
              <NavLink to="/My/privateInfo">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-yonghu listIcon" />
                  <span className="listSpan">个人资料</span>
                </List.Item>
              </NavLink>
              <NavLink to="/My/siteLetter/pla" >
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-md-guangbo listIcon" />
                  <span className="listSpan">平台公告</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/cardManage">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-yinhangka listIcon" />
                  <span className="listSpan">绑定银行卡</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/history">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-zhanghumingxi listIcon" />
                  <span className="listSpan">交易记录</span>
                </List.Item>
              </NavLink>

              <NavLink to="/Message">
                <List.Item
                  className="listItem"
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-liwu listIcon" />
                  <span className="listSpan">优惠活动</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/agentReg">
                <List.Item
                  className="listItem spclistItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-gerenbaobiao listIcon" />
                  <span className="listSpan">申请代理</span>
                </List.Item>
              </NavLink>
            </div>
            <div className="gg">
              <NavLink to="/My/editPassword">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-anquanzhongxin listIcon" />
                  <span className="listSpan">安全中心</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/sharePage">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-guanyuwomen listIcon" />
                  <span className="listSpan">好友推荐</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/siteLetter/mes">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-wodexiaoxi listIcon" />
                  <span className="listSpan">站内信</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/feedback">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-youxiang listIcon" />
                  <span className="listSpan">意见建议</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/service">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-lianxiwomen listIcon" />
                  <span className="listSpan">联系我们</span>
                </List.Item>
              </NavLink>

              <NavLink to="/My/about">
                <List.Item
                  className="listItem "
                  arrow="horizontal"
                //  onClick={this.goToTransferPage.bind(this,item)}
                >
                  <span className="icon iconfont icon-gerenbaobiao listIcon" />
                  <span className="listSpan">关于我们</span>
                </List.Item>
              </NavLink>

              <List.Item className="listItem " arrow="horizontal"  onClick={this.downLoad.bind(this)}>
                <span className="icon iconfont icon-xiazai listIcon"/>
                <span className="listSpan">APP下载</span>
              </List.Item>

            </div>
            <div className="exit__VoeN" onClick={this.userQuit.bind(this)}>退出登录</div>
          </div>
        </div>
      </div>
    </div >
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
});

export default withRouter(connect(mapStateToProps)(MyPage));
