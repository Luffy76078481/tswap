import React from "react";
import { connect } from "react-redux";
import BaseClass from "@/baseClass";
import { List, ListView, Accordion } from 'antd-mobile';
import { withRouter } from "react-router-dom";
import NavBar from "components/navBar/NavBar"
import { getStorage, setStorage, clearHtml } from "tollPlugin/commonFun";
import "./PlatFromAnnouncePage.scss"

interface RouterProps {
    history: any
}
class PlatFromAnnouncePage extends BaseClass<RouterProps> {

    public state = {
        firstLoading: true,
        isLoading: false,
        hasMore: true,
        dataSource: ""
    };
    constructor(props: any) {
        super(props);
        const dataSource = new ListView.DataSource({
            rowHasChanged: (row1: any, row2: any) => row1 !== row2,
        });
        this.state.dataSource = dataSource.cloneWithRows({})

    }
    componentDidMount() {
        new window.actions.ApiNoticeAction("notice").fly((resp:any) => {
            if (resp.StatusCode === 0 ) {
               console.log(resp);
            }
        }, "pop_news_notice");
        // let notices = this.props.notices;
        // let listData = JSON.parse(JSON.stringify(this.props.notices));
        // this.getList(listData, notices.length);
    }

    render() {
        return (
            <div className="PlatFromAnnouncePage anmateContent">
                <NavBar
                    btnGoback={true}
                    btnService={true}
                    title={"平台公告"}
                ></NavBar>
                <div className="scroll-content">
                    {this.renderList()}
                </div>
            </div>
        );
    }

    renderList() {
        let isReadNews = getStorage('isReadNews') ? getStorage('isReadNews') : "";
        let row = (rowData: any) => {
            let tittle = <div className='AnnounceHeader'>
                {isReadNews.indexOf(rowData.Id + ',') > -1 ? '' : (
                    <span className='newIcon'>1</span>)}
                <span className='title'>{rowData.Title}</span>
                <span className='AnnounceTime'>{rowData.CreateTime.slice(0, 10)}</span>
            </div>;

            return (
                <List.Item className='messageAnnounce' onClick={this.accordionReadNew.bind(this, rowData.Id)}>
                    <Accordion className="my-accordion">
                        <Accordion.Panel header={tittle} className="pad">
                            <p dangerouslySetInnerHTML={{ __html: clearHtml(rowData.Content) }}></p>
                        </Accordion.Panel>
                    </Accordion>
                </List.Item>
            )
        };
        const renderFooter = () => {
            let con;
            if (this.state.hasMore) {
                con = (<div className="dataLoading"><i className="icon-spinner icon-spin"></i> 玩命加载中...</div>)
            } else {
                con = (<div style={{ textAlign: 'center', lineHeight: '2rem' }}>我没有更多数据了! (ㄒoㄒ)~</div>)
            }
            return con;
        };
        return (
            <ListView
                dataSource={this.state.dataSource}
                className="myListView"
                renderFooter={renderFooter}
                renderRow={row}
                pageSize={30}//每次事件循环（每帧）渲染的行数
                scrollRenderAheadDistance={200}//当一个行接近屏幕范围多少像素之内的时候，就开始渲染这一行
                onEndReached={this.onEndReached.bind(this)}//当所有的数据都已经渲染过，并且列表被滚动到距离最底部不足onEndReachedThreshold个像素的距离时调用
                onEndReachedThreshold={100}//调用onEndReached之前的临界值，单位是像素
            />
        )
    }


    accordionReadNew(id: string) {
        let isReadNews = getStorage('isReadNews') ? getStorage('isReadNews') : "";
        let isRedList = isReadNews.split(",");
        if (!isRedList.includes(id + "")) {
            setStorage('isReadNews', isReadNews + id + ',');
        }
    }


    onEndReached = () => {
        if (!this.state.hasMore || this.state.isLoading) return false;
        this.setState({ isLoading: true });
        // this.fetchNotice();
    };





}

const mapStateToProps = (state: any, ownProps: any) => ({
    user: state.user,
});

export default withRouter(connect(mapStateToProps)(PlatFromAnnouncePage));
