import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import "./PopWindow.scss";
interface RouterProps {
  history: any;
}
class PopWindow extends BaseClass<RouterProps> {
  public cantClose = false;
  render() {
    return (
      <div className="PopWindow" onClick={this.cancel.bind(this)} style={{ "display": this.props.popWindow.type ? "block" : "none" }}>
        <div onClick={(event) => { event.stopPropagation() }}>
          {this.switchPopType()}
        </div>
      </div >
    );
  }

  switchPopType() {
    switch (this.props.popWindow.type) {
      case 'LoginWindow': {
        //登陆提示弹窗
        // this.cantClose = true;
        return (
          <div className="windowBox">
            <i
              className="icon iconfont icon-iconclose"
              onClick={this.cancel.bind(this)}
            ></i>
            <p className="windowText titleImg">{this.props.popWindow.text}</p>
            <div className="bottomBox">
              <button
                className="leftBtoom"
                onClick={this.linkTo.bind(this, '/Home/LoginRegist/Login')}
              >
                确定
              </button>
              {/* <button className="rightBtoom" onClick={this.cancel.bind(this)}>取消</button> */}
            </div>
          </div>
        );
      }
      case 'serviceWindow': {
        //客服弹窗
        console.log(this.props.remoteSysConfs.online_service_link, "+++++");
        return (
          <div className="windowBox">
            <i
              className="icon iconfont icon-iconclose"
              onClick={this.cancel.bind(this)}
            ></i>
            <p className="windowText titleImg">{this.props.popWindow.text}</p>
            <div className="bottomBox">
              <button
                className="leftBtoom"
                onClick={() => {
                  window.actions.popWindowAction({ type: '' });
                  window.open(
                    this.props.remoteSysConfs.online_service_link,
                    '_blank'
                  );
                }}
              >
                确定
              </button>
            </div>
          </div>
        );
      }
      case 'Hint': {
        //简单提示框
        return (
          <div className="windowBox" onClick={this.cancel.bind(this)}>
            <i className="icon iconfont icon-iconclose"></i>
            <p className="windowText titleImg">
              {this.props.popWindow.text}
            </p>
            <div className="bottomBox">
              <button className="leftBtoom" onClick={this.cancel.bind(this)}>
                确定
              </button>
            </div>
          </div>
        );
      }
      case 'Drawing': {
        //提款稽核确认错误提示框
        return (
          <div className="windowBox" onClick={this.cancel.bind(this)}>
            <i className="icon iconfont icon-iconclose"></i>
            <p className="windowText titleImg" style={{height:'1.5rem',}}></p>
            <p className="windowEro" style={{  fontSize:'.3rem', textAlign: 'center', padding: '.2rem .2rem 0' }}>
              {this.props.popWindow.text}
            </p>
            <div className="bottomBox">
              <button className="leftBtoom" onClick={this.cancel.bind(this)}>
                确定
              </button>
            </div>
          </div>
        );
      }
      case 'DefiPop': {
        // 提示双按钮弹窗
        if (this.props.popWindow.title) {
          return (
            <div className="windowBox">
              <i
                className="icon iconfont icon-iconclose"
                onClick={this.cancel.bind(this)}
              ></i>
              <p className="windowTitle titleImg">
                {this.props.popWindow.title}
              </p>
              <p className="windowspeText">
                {typeof this.props.popWindow.text === 'object'
                  ? this.props.popWindow.text.map(
                      (item: string | {}, i: number) => {
                        return <li key={i}>{item}</li>;
                      }
                    )
                  : this.props.popWindow.text}
              </p>
              {this.props.popWindow.leftBtn ? (
                <div className="bottomBox">
                  <button
                    className="leftBtoom"
                    onClick={this.props.popWindow.leftBtn.fc.bind(this)}
                  >
                    {this.props.popWindow.leftBtn.text}
                  </button>
                  {this.props.popWindow.rightBtn && (
                    <button
                      className="rightBtoom"
                      onClick={this.props.popWindow.rightBtn.fc.bind(this)}
                    >
                      {this.props.popWindow.rightBtn.text}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          );
        } else {
          return (
            <div className="windowBox">
              <i
                className="icon iconfont icon-iconclose"
                onClick={this.cancel.bind(this)}
              ></i>
              <p className="windowTitle titleImg">
                {this.props.popWindow.text}
              </p>
              {this.props.popWindow.leftBtn ? (
                <div className="bottomBox bottomBox2">
                  <button
                    className="leftBtoom"
                    onClick={this.props.popWindow.leftBtn.fc.bind(this)}
                  >
                    {this.props.popWindow.leftBtn.text}
                  </button>
                  {this.props.popWindow.rightBtn && (
                    <button
                      className="rightBtoom"
                      onClick={this.props.popWindow.rightBtn.fc.bind(this)}
                    >
                      {this.props.popWindow.rightBtn.text}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          );
        }
      }
    }
  }
  linkTo(href: string) {
    this.cantClose = false;
    this.props.history.push(href);
    window.actions.popWindowAction({ type: "" })
  }
  cancel() {
    if(this.cantClose)return;
    window.actions.popWindowAction({ type: "" })
  }
  autoClose() {
    setTimeout(() => {
      this.cancel()
    }, 2200);
  }
}


const mapStateToProps = (state: any, ownProps: any) => ({
  popWindow: state.popWindow,
  remoteSysConfs: state.remoteSysConfs
});

export default withRouter(connect(mapStateToProps)(PopWindow));
