import React from "react";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import { Carousel } from "antd-mobile";
import { getSession, setSession } from "tollPlugin/commonFun";
import { appOpen } from "tollPlugin/commonFun";
import "./NoticeWindow.scss";


class NoticeWindow extends BaseClass {

  constructor(props: any) {
    super(props, []);
    this.state = {
      showNotice: !getSession("showNotice")
    }
  }
  render() {
    return (
      (!this.props.user.Token)?null:
      <div
        className="NoticeWindow"
        style={{ display: this.state.showNotice ? 'block' : 'none' }}
      >
        <div className="noticeBox">
          <div className="noticeTop">
            <p className="noticeTitle">系统公告</p>
            <div className="noticeContent">
              <Carousel
                autoplay={true}
                infinite
                autoplayInterval={300000}
                swipeSpeed={30}
              >
                {this.renderContent()}
              </Carousel>
            </div>
          </div>
          <div className="noticeClose" onClick={this.closeNotice.bind(this)}>
            <i className="icon iconfont icon-iconclose"></i>
          </div>
        </div>
      </div>
    );
  }

  closeNotice() {
    setSession("showNotice", "true");
    this.setState({
      showNotice: false
    })
  }


  renderContent() {
    let content: JSX.Element[] = [];
    let { homePromotion } = this.props;
    homePromotion.length > 0 && homePromotion.forEach((item: any, i: number) => (
      content.push(
        <a
          className="promotionCon"
          key={item.Id}
          onClick={this.openPromotion.bind(this, item.ExternalLink)}
          dangerouslySetInnerHTML={{ __html: item.Content }}
        ></a>
      )
    ))
    return content;
  }


  // 打开公告详情
  openPromotion(link: string) {
    if (!link) return;
    if (window.config.isApp) {
      appOpen(link)
    } else {
      window.open(link, '_blank');
    }
  }

}



const mapStateToProps = (state: any, ownProps: any) => ({
  homePromotion: state.homePromotion,
  user: state.user,
});

export default connect(mapStateToProps)(NoticeWindow);
