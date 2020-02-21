import React from 'react';
import { connect } from "react-redux";
import NavBar from "components/navBar/NavBar"
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import { clearHtml } from "tollPlugin/commonFun"; //清楚html中的style
import "./ReadMessagePage.scss"

class ReadMessage extends BaseClass{
    constructor(props: any) {
        super(props, []);
    }
    public state = {
        id: parseInt(this.props.match.params.messageId),
    };

    renderMessage() {
        let id = this.state.id;
        let con: any = [];
        this.props.promotions.forEach((item: any, index: any) => {
            if (item.Id === id) {
                con.push(
                    <div key={index} dangerouslySetInnerHTML={{ __html: clearHtml(item.Content) }}>
                    </div>
                )
                return false;
            }
        })
        return con;
    }

    render() {
        return (
            <div className="ReadMessage anmateContent">
                <NavBar
                    btnGoback={true}
                    btnService={true}
                    title={"活动推广"}
                >
                </NavBar>
                <div className="messageCon scroll-content">
                    {this.renderMessage()}
                </div>
            </div>
        )
    }


}

const mapStateToProps = (state: any, ownProps: any) => (
    {
        promotions: state.promotions.promotions.rows
    }
);
export default withRouter(connect(mapStateToProps)(ReadMessage));

