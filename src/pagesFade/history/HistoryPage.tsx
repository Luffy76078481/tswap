import React from "react";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar"
import "./HistoryPage.scss"
import { List } from "antd-mobile";
import { NavLink, withRouter } from "react-router-dom";


interface RouterProps {
    history: any
}
class HistoryPage extends BaseClass<RouterProps> {

    render() {
        return (
            <div className="HistoryPage FadePage">
                <NavBar
                    btnGoback={true}
                    btnService={true}
                    title={"交易记录"}
                >    
                </NavBar>
                <div className="pageContent">
                    <div className="record">
                        <NavLink to="/My/history/record/touzhu">
                            <List.Item
                            className="listItem spclistItem "
                            arrow="horizontal"
                            //  onClick={this.goToTransferPage.bind(this,item)}
                            >
                            <span className="icon iconfont icon-touzhujilu1 listIcon" />
                            <span className="listSpan">投注记录</span>
                            </List.Item>
                        </NavLink>
                    </div>
                    <div className="record">
                        <NavLink to="/My/history/record/chongzhi">
                            <List.Item
                            className="listItem "
                            arrow="horizontal"
                            //  onClick={this.goToTransferPage.bind(this,item)}
                            >
                            <span className="icon iconfont icon-icon_chongzhi listIcon" />
                            <span className="listSpan">存款记录</span>
                            </List.Item>
                        </NavLink>
                    </div>
                    <div className="record">
                        <NavLink to="/My/history/record/youhui">
                            <List.Item
                            className="listItem spclistItem "
                            arrow="horizontal"
                            //  onClick={this.goToTransferPage.bind(this,item)}
                            >
                            <span className="icon iconfont icon-youhuijilu listIcon" />
                            <span className="listSpan">优惠记录</span>
                            </List.Item>
                        </NavLink>
                    </div>
                    <div className="record">
                        <NavLink to="/My/history/record/tikuan">
                            <List.Item
                            className="listItem "
                            arrow="horizontal"
                            //  onClick={this.goToTransferPage.bind(this,item)}
                            >
                            <span className="icon iconfont icon-qukuan listIcon" />
                            <span className="listSpan">提款记录</span>
                            </List.Item>
                        </NavLink>
                    </div>
                    <div className="record">
                        <NavLink to="/My/history/record/zhuanzhang">
                            <List.Item
                            className="listItem "
                            arrow="horizontal"
                            //  onClick={this.goToTransferPage.bind(this,item)}
                            >
                            <span className="icon iconfont icon-zhuanzhangjilu listIcon" />
                            <span className="listSpan">转账记录</span>
                            </List.Item>
                        </NavLink>
                    </div>
                    <div className="prompt">
                        <p className="warning">
                            如遇订单延迟，会导致报表数据延迟统计，请耐心等待。
                        </p>
                    </div>
                </div>

            </div>
        );
    }





}

const mapStateToProps = (state: any, ownProps: any) => ({
    user: state.user,
});

export default withRouter(connect(mapStateToProps)(HistoryPage));
