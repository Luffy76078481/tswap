import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from "react-redux";
import "./CardManagePage.scss"
import NavBar from "components/navBar/NavBar"
import { withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";


class CardManagePage extends BaseClass{
    constructor(props: any) {
        super(props, [], true);
    }
    public state = {
        BankCards:[],

    };

    componentDidMount(){
        new window.actions.ApiBankAccountsAction().fly((resp: any)=>{
            if (resp.StatusCode === 0) {
                this.setState({
                    BankCards:resp.List
                })
            }
        });
    }

    renderCards(){
        let cards=[];
            this.state.BankCards.forEach((item: any,index: any)=>{
                cards.push(
                    <div key={index} className="card" >
                        <div>
                            <p className="BankTitle">
                                <span>
                                    {item.Bank.BankName}
                                </span>
                                {
                                    index===0?<span className="BankDefault">默认</span>:""
                                }
                            </p>
                            <p  className="BankNum">
                                <span>
                                    {item.AccountNo.replace(/^\s/g, "").substr(0,4)} &nbsp; **** &nbsp;**** &nbsp;{item.AccountNo.replace(/\s/g, "").substr(-4)}
                                </span>
                            </p>
                        </div>
                    </div>
                )
            })     
            
            if(this.state.BankCards.length===0){
                cards.push(<div key="noCard" className="noCard">您还没有绑定过银行卡!</div>)
            }
        return cards;    
        
    }
    
    render(){
        return(
            <div className="CardManage anmateContent">
               <NavBar
                    btnGoback={true}
                    btnService={true}
                    title={"银行卡列表"}
                >
                </NavBar>
                <div className="scroll-content">
                    <div className="cardsList">
                        {this.renderCards()}
                    </div>
                    {
                        this.state.BankCards.length>5?
                        "":(
                            <div>
                                <NavLink to="/My/addCard" className='btn'> 绑定银行卡</NavLink>
                            </div>
                        )
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
export default withRouter(connect(mapStateToProps)(CardManagePage ));