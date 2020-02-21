import React from 'react';
import NavBar from "components/navBar/NavBar"
import {Tabs} from 'antd-mobile';
import { connect } from "react-redux";
import './depositDetails.scss';
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import { clearHtml } from "tollPlugin/commonFun"; //清楚html中的style



interface RouterProps {
    history: any
}

class DepositDetails extends BaseClass<RouterProps> {
    public state = {
        titleData:[],
    };
    constructor(props: any) {
        super(props, []);
    }

    componentDidMount(){
        new window.actions.ApiNoticeAction("phoneAccount").fly((res: any) => {
            if (res.StatusCode===0) {
                this.setState({titleData:res.NewsInfo})
            }
        },'phoneAccount');
    }

    renderHtml() {
        let con: any = [];
        
        this.state.titleData.map((item: any, index: any) => {
                con.push(
                    <div key={index} className='scroll-content' dangerouslySetInnerHTML={{ __html: clearHtml(item.Content) }}>
                    </div>
                )    
                return con        
        })
        return con;
    }

    render(){
        const tabs = [(
            this.state.titleData.map((i:any) => (
                    {title:i.Title,Key:i.Key}
                ))
        )];
        return(
            <div className="DepositDetails anmateContent">
                <NavBar
                    btnGoback={true}
                    title={"存款帮助"}
                >    
                </NavBar>
                <Tabs tabs={tabs[0]}
                 renderTabBar={props => <Tabs.DefaultTabBar {...props} page={4} />}
                >
                    {this.renderHtml()}
                </Tabs>
            </div>
        )
    }

}

const mapStateToProps = (state: any, ownProps: any) => (
    {

    }
);
export default withRouter(connect(mapStateToProps)(DepositDetails));