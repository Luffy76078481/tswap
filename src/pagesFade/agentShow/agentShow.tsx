import React from 'react';
import { connect } from "react-redux";
import "./agentShow.scss"
import NavBar from "components/navBar/NavBar"
import { NavLink, withRouter } from "react-router-dom";
import BaseClass from "@/baseClass";
import { Carousel} from 'antd-mobile';




class AgentShowPage extends BaseClass {
    constructor(props:any){
        super(props, []);
    }
    public state = {
    };


    render(){
        return(
            <div className="AgentShow anmateContent">
               <NavBar
                    btnGoback={true}
                    title={"申请代理"}
                >    
                </NavBar>

                <div className="content">   
                    <Carousel
                    autoplay={false}
                    dots={true}
                    infinite
                    style={{"height":"100%"}}
                    >
                    <div><img src={require('./Images/1.png')} alt="" style={{width:'100%'}}/></div>
                    <div><img src={require('./Images/2.png')} alt="" style={{width:'100%'}}/></div>
                    <div><img src={require('./Images/3.png')} alt="" style={{width:'100%'}}/></div>
                    <div><img src={require('./Images/4.png')} alt="" style={{width:'100%'}}/></div>
                    </Carousel>

                    <NavLink to="/My/agentReg" className='joinBtn'>
                        加入我们
                    </NavLink>
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
export default withRouter(connect(mapStateToProps)(AgentShowPage));