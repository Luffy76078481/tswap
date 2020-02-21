import React from 'react';
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {Toast} from 'antd-mobile';
import './SharePage.scss';
import BaseClass from "@/baseClass";
import NavBar from "components/navBar/NavBar";
import { clearHtml } from "tollPlugin/commonFun"; //清楚html中的style
const QRCode = require('qrcode.react');


interface RouterProps {
    history: any
}

class SharePage extends BaseClass<RouterProps> {
    constructor(props:any){
        super(props, []);
    }
    public state = {
        sharePeople:0,
        ContentData:[],
        title:'',
    };

componentDidMount(){
    new window.actions.ApiShareAction().fly((resp: any)=>{
        if (resp.StatusCode === 0) {
            this.setState({
                sharePeople:resp.Conut
            })
        }
    });

    new window.actions.ApiNoticeAction("phoneShare").fly((res: any) => {
        if (res.StatusCode===0) {
            this.setState({ContentData:res.NewsInfo,title:res.NewsInfo[0].Title})
        }
    },'phoneShare');

    

}

    copyCode(copyId:string){
        var copyObj:any = document.getElementById(copyId);
        copyObj.select();
        copyObj.setSelectionRange(0, copyObj.value.length);
        document.execCommand("Copy");
        Toast.success('复制成功',1);
    }

    renderHtml() {
        let con: any = [];
        this.state.ContentData.map((item: any, index: any) => {
                con.push(
                    <div key={index} className='scroll-content' dangerouslySetInnerHTML={{ __html: clearHtml(item.Content) }}>
                    </div>
                )    
                return con        
        })
        return con;
    }

    render(){
        let host = window.location.host;
        // let promo_url = host + '/register?channel='+this.props.user.recommendCode;
        let promo_url = host + "/Home/LoginRegist/reg?channel="+this.props.user.recommendCode;
        // let recommended_num = this.state.sharePeople;
        return(
            <div className="SharePage anmateContent">
               <NavBar
                    btnGoback={true}
                    // btnService={true}
                    recommend={true}
                    title={"好友推荐"}
                >    
                </NavBar>
                <div className="content">
                    <div className='copy_text'>
                        <span>呼朋唤友，一起来战斗分享链接</span>
                    </div>
                    <div className='copy_link_box'>
                        {/* <span className='text_tip'>复制推荐链接</span> */}
                        <div className='url_code'>
                            <input id="code_content" className='link_url' value={promo_url} readOnly />
                            {/* <i className='icon iconfont icon-fuzhi' onClick={this.copyCode.bind(this,'code_content')}/> */}
                            <span className='copyBtn' onClick={this.copyCode.bind(this,'code_content')}>复制</span>
                        </div>
                    </div>
                    {/* <div className='recmmended_num'>已推荐好友人数: {recommended_num || 0}</div> */}
                    <div className='qr_code_box'>
                        <div className='QRcodeBG'></div>
                        <QRCode includeMargin={true} size={110} value={promo_url} className="qrImg" />
                        <p>请使用带扫描功能的浏览器进行扫码</p>
                    </div>

                    <div className='Sharyapply'>
                        <h4>
                            {this.state.title}
                        </h4>
                        {this.renderHtml()}
                    </div>
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state: any, ownProps: any) => (
    { 
        user: state.user,
     }
);
export default withRouter(connect(mapStateToProps)(SharePage));