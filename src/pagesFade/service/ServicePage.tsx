import React from 'react';
import {Flex, List,Toast} from 'antd-mobile';
import { connect } from "react-redux";
import './ServicePage.scss';
// import {config} from "globalConfig";
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar";

const Item = List.Item;


class ServicePage extends BaseClass {
    constructor(props:any){
        super(props, []);
    }

    copyCode(copyId:string){
        var copyObj:any = document.getElementById(copyId);
        copyObj.select();
        copyObj.setSelectionRange(0, copyObj.value.length);
        document.execCommand("Copy");
        Toast.success('复制成功',1);
    }

    render(){
        return(
            <div className="ServicePage anmateContent">
                <NavBar
                    btnGoback={true}
                    btnService={true}
                    title={"联系我们"}
                >    
                </NavBar>
                <div className="scroll-content">
                    <Flex>
                        <List className="list">
                            <p className='title'>您可以通过以下方式和我们取得联系</p>
                            <div className="my-am-list-item">
                            {
                                this.props.remoteSysConfs.online_service_phone?
                                    <Item>
                                        <i className="icon iconfont icon-shouji1" />电话：                                        
                                        <input id="code_phone" className='link_url' value={this.props.remoteSysConfs.online_service_phone} readOnly />
                                        <span className="copy" onClick={this.copyCode.bind(this,'code_phone')}>复制</span>
                                    </Item>:null
                            }
                            {
                                this.props.remoteSysConfs.online_service_qq?
                                    <Item>
                                        <i className="icon iconfont icon-qq1" />Q Q：
                                        <input id="code_QQ" className='link_url' value={this.props.remoteSysConfs.online_service_qq} readOnly />
                                        <span className="copy" onClick={this.copyCode.bind(this,'code_QQ')}>复制</span>
                                    </Item>:null
                            }
                            {
                                this.props.remoteSysConfs.online_service_wechat?
                                    <Item>
                                        <i className="icon iconfont icon-weixin" />官方微信：
                                        <input id="code_service_wechat" className='link_url' value={this.props.remoteSysConfs.online_service_wechat} readOnly />
                                        <span className="copy" onClick={this.copyCode.bind(this,'code_service_wechat')}>复制</span>
                                    </Item>:null
                            }
                            {
                                this.props.remoteSysConfs.agent_wecaht &&
                                <Item>
                                    <i className="icon iconfont icon-weixin" />代理微信：
                                    <input id="code_agent_wecaht" className='link_url' value={this.props.remoteSysConfs.agent_wecaht} readOnly />
                                    <span className="copy"onClick={this.copyCode.bind(this,'code_agent_wecaht')}>复制</span>
                                </Item>
                            }
                            {
                                this.props.remoteSysConfs.online_service_skype?
                                    <Item >
                                        <i className="icon iconfont" />Skype：
                                        <input id="code_service_skype" className='link_url' value={this.props.remoteSysConfs.online_service_skype} readOnly />
                                        <span className="copy"onClick={this.copyCode.bind(this,'code_service_skype')}>复制</span>
                                    </Item>:null
                            }
                            {
                                this.props.remoteSysConfs.online_service_email?
                                    <Item >
                                        <i className="icon iconfont icon-youxiang" />邮箱：
                                        <input id="code_service_email" className='link_url' value={this.props.remoteSysConfs.online_service_email} readOnly />
                                        <span className="copy"onClick={this.copyCode.bind(this,'code_service_email')}>复制</span>
                                    </Item>:null
                            }
                            {
                                this.props.remoteSysConfs.online_service_worktime?
                                    <Item >
                                        <i className="icon iconfont icon-gongzuoshijian" />工作时间：
                                        <input id="code_service_worktime" className='link_url' value={this.props.remoteSysConfs.online_service_worktime} readOnly />
                                        <span className="copy"onClick={this.copyCode.bind(this,'code_service_worktime')}>复制</span>
                                    </Item>:null
                            }
                            </div>
                        </List>
                    </Flex>
                </div>
            </div>
        )
    }

}


const mapStateToProps = (state: any, ownProps: any) => (
    { 
        remoteSysConfs:state.remoteSysConfs
     }
);
export default withRouter(connect(mapStateToProps)(ServicePage));