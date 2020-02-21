import React from "react";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar"
import { List } from "antd-mobile";
import { NavLink, withRouter } from "react-router-dom";
import "./activity.scss"

class ActivityPage extends BaseClass{

    render() {
        return (
            <div className="FadePage activityPage">
                <NavBar btnGoback={true} title={"活动中心"}></NavBar>
                <div className="pageContent">
                    <div>
                        <NavLink to="/My/activity/redEnvelopes">
                            <List.Item
                            className="listItem "
                            arrow="horizontal"
                            >
                            <span className="icon iconfont icon-hongbao listIcon" />
                            <span className="listSpan">抢红包</span>
                            </List.Item>
                        </NavLink>
                    </div>
                    <div>
                        <NavLink to="/My/activity/turntable">
                            <List.Item
                            className="listItem "
                            arrow="horizontal"
                            >
                            <span className="icon iconfont icon-zhuanpan listIcon" />
                            <span className="listSpan">大转盘</span>
                            </List.Item>
                        </NavLink>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: any, ownProps: any) => ({
    user: state.user,
});

export default withRouter(connect(mapStateToProps)(ActivityPage));
