import React from 'react';
import NavBar from "components/navBar/NavBar"
import { Picker, List} from 'antd-mobile';
import { connect } from "react-redux";
import './helpCenter.scss';
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import { clearHtml } from "tollPlugin/commonFun"; //清楚html中的style




interface RouterProps {
    history: any
}

class helpCenter extends BaseClass<RouterProps> {
    public state = {
        titleData:[],
        selectIndex: ["体育赛事介绍"],
    };
    constructor(props: any) {
        super(props, []);
    }

    componentDidMount(){
        new window.actions.ApiNoticeAction("phonehelp").fly((res: any) => {
            if (res.StatusCode===0) {
                this.setState({titleData:res.NewsInfo})
            }
        },'phonehelp');
    }

    renderHtml() {
        let con: any = [];
        this.state.titleData.map((item: any, index: any) => {
                if (this.state.selectIndex[0] === item.Title) {
                    con.push(
                        <div key={index} className='helpContent' dangerouslySetInnerHTML={{ __html: clearHtml(item.Content) }}>
                        </div>
                    )  
                } 
                return con        
        })
        return con;
    }

    selectProblem(val:any){
        this.setState({
            selectIndex: val
          });
    }

    render(){
        const tabs = [(
            this.state.titleData.map((i:any,index) => (
                    {label:i.Title,value:i.Title}
                ))
        )];

        return(
            <div className="helpCenter anmateContent">
                <NavBar
                    btnGoback={true}
                    title={"帮助中心"}
                >    
                </NavBar>
                <div className="helpTitle">
                    <List>
                        <Picker
                            title=""
                            data={tabs[0]}
                            cols={1}
                            extra="请选择问题类型"
                            value={this.state.selectIndex}
                            onOk={val => this.selectProblem(val)}
                        >
                        {/* <List.Item arrow="horizontal" onClick={this.onClick}>Multiple & async</List.Item> */}
                        <List.Item arrow="down"></List.Item>
                        </Picker>
                    </List>
                </div>
                {
                    this.renderHtml()
                }

                


            </div>
        )
    }

}

const mapStateToProps = (state: any, ownProps: any) => (
    {

    }
);
export default withRouter(connect(mapStateToProps)(helpCenter));