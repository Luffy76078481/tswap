import React from 'react';
import NavBar from "components/navBar/NavBar"
import { connect } from "react-redux";
import './recommend.scss';
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import { DatePickerView} from 'antd-mobile';
import { getNowDate, formatTime } from "../../tollPlugin/commonFun";
import { Pagination } from 'antd-mobile';


// 推荐明细页面-----------------------------------------------


interface RouterProps {
    history: any
}

class Recommend extends BaseClass<RouterProps> {
    public state = {
        showTimeChoose: false,
        beginValue: new Date(new Date().getTime() - 0 * 24 * 60 * 60 * 1000),
        endValue: new Date(),
        fromDate: getNowDate(-30).slice(0, 10),
        toDate: getNowDate(0).slice(0, 10),
        minDate: new Date(new Date().getTime() - 730 * 24 * 60 * 60 * 1000),
        maxDate: new Date(new Date().getTime()),
        TotalPeople:0,
        TotalAmount:0,
        List:[],
        PageIndex:1, //页码
        AllPeople:0,  //条件查询的总会员数
        
    };
    constructor(props: any) {
        super(props, []);

    }

    componentDidMount(){
        this.getList()
    }

    submit(){
        this.getList()
    }

    PageChange(e:any){
        this.setState({
            PageIndex:e
        },()=>{ this.getList()})
    }

    getList(){
        new window.actions.ApiShareAction(this.state.fromDate,this.state.toDate,this.state.PageIndex-1).fly((resp: any)=>{
            if (resp.StatusCode === 0) {
                this.setState({
                    TotalPeople:resp.TotalPeople,
                    TotalAmount:resp.TotalAmount,
                    List:resp.List,
                    AllPeople:resp.Count,
                })
            }
        },'recommend');
    }



    showTimeChoose() {
        this.setState({
            showTimeChoose: true
        })
    }

    hideTimeChoose() {
        this.setState({
            showTimeChoose: false
        })
    }

    chooseTime() {
        let beginTime: any = this.state.beginValue;
        let endTime: any = this.state.endValue;
        this.setState({
            fromDate: formatTime(beginTime).slice(0, 10),
            toDate: formatTime(endTime).slice(0, 10),
            showTimeChoose: false,
            tabLoading: true,
            PageIndex:1,
            List:[]
        },()=>{ this.getList()})
    }
    
    onBeginChange(value: any) {
        this.setState({
            beginValue: value
        })
    }

    onEndChange(value: any) {
        this.setState({
            endValue: value
        })
    }

    renderRecommend(){
        let ret=[]
        if (this.state.List && this.state.List.length>0) {
            ret.push(
                this.state.List.map((item:any, index)=>{
                    return(
                        <tr key={index}>
                            <td>{item.UserName}</td>
                            <td>{item.TotalDeposit}</td>
                            <td>{item.ReferralFee}</td>
                            <td>{item.OperateTime.slice(0, 10)}</td>
                        </tr>
                    )
                })
            )
        }else{
            ret.push(
                <tr key='null'>
                    <td colSpan={4}>暂无推荐会员</td>
                </tr>
            )
        }
        return ret;
    }


    render(){
        return(
            <div className="Recommend anmateContent">
                <NavBar
                    btnGoback={true}
                    title={"推荐金额明细"}
                >    
                </NavBar>
                <div className="scroll-content">
                    <div className='recommendInfo'>
                        <div  className='recomendInfoBox'>
                            <div><i className='icon iconfont icon-guanyuwomen'></i></div>
                            <div>
                                <span className='recomendTitle'>我邀请的人数</span>
                                <span className='recomendData'>{this.state.TotalPeople?this.state.TotalPeople:0}</span>
                            </div>
                        </div>
                        <div  className='recomendInfoBox'>
                            <div><i className='icon iconfont icon-guanyuwomen'></i></div>
                            <div>
                                <span className='recomendTitle'>已获得的奖金</span>
                                <span className='recomendData'>￥{this.state.TotalAmount?this.state.TotalAmount:0}</span>
                            </div>
                        </div>
                    </div>
                    <div className="timeBtn" onClick={this.showTimeChoose.bind(this)}>
                        <span className='title'>时间筛选：</span>
                        <span className='date'>{this.state.fromDate} ~ {this.state.toDate}</span>
                    </div>
                    <div className='queryBtn' onClick={this.submit.bind(this)}>查询</div>
                    <div className='table'>
                        <table>
                            <thead>
                                <tr>
                                    <th>会员名</th>
                                    <th>存款</th>
                                    <th>推荐金额</th>
                                    <th>时间</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderRecommend()}
                            </tbody>
                        </table>

                    {this.state.List && this.state.List.length>0?
                        <Pagination 
                            total={this.state.AllPeople?(Math.ceil(this.state.AllPeople/10)):0}
                            className="custom-pagination-with-icon"
                            current={this.state.PageIndex}
                            onChange={this.PageChange.bind(this)}
                        />
                        :''
                    }
                    </div>
                    {
                    this.state.showTimeChoose ?
                        <div className="timeChoose">
                            <div className="mask"
                                onClick={this.hideTimeChoose.bind(this)}
                            ></div>
                            <div className="timeCon">
                                <div className="timeConBtn">
                                    <a className="left" onClick={this.hideTimeChoose.bind(this)}>取消</a>
                                    <a className="right" onClick={this.chooseTime.bind(this)}>确定</a>
                                </div>
                                <div className="sub-title">开始时间</div>
                                <DatePickerView
                                    mode="date"
                                    value={this.state.beginValue}
                                    onChange={this.onBeginChange.bind(this)}
                                    // minDate={this.state.minDate}
                                    // maxDate={this.state.maxDate}
                                />
                                <div className="sub-title">结束时间</div>
                                <DatePickerView
                                    mode="date"
                                    value={this.state.endValue}
                                    onChange={this.onEndChange.bind(this)}
                                    // minDate={this.state.minDate}
                                    // maxDate={this.state.maxDate}
                                />
                            </div>
                        </div> : null
                }
                </div>




            </div>
        )
    }

}

const mapStateToProps = (state: any, ownProps: any) => (
    {

    }
);
export default withRouter(connect(mapStateToProps)(Recommend));