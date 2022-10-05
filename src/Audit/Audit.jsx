import React from 'react';
import './Audit.css';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { userActions } from '../_actions';

import { Navbar, Nav } from 'react-bootstrap';
class Auditpage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            data:[],
            value: '',
            date: "12",
            filterdata: [],
        }
        // this.setState({filterdata: data});
        this.handleOptions=this.handleOptions.bind(this);
        this.handleInputChange=this.handleInputChange.bind(this);
    }

    componentDidMount() {
       let reqdata = this.props.getUsers();
       this.setState({data: this.props.users.items})
       this.setState({filterdata: this.props.users.items})
    }

    handleOptions(e){
        e.preventDefault();
        this.setState({date: e.target.value})
    }

    handleDeleteUser(id) {
        return (e) => this.props.deleteUser(id);
    }

    handleInputChange(e){
        e.preventDefault();
        // const user = this.props.users;
        const users = this.props.users.items;
        this.setState({data: users})
        // console.log("console",users);
        const fulldata = this.state.data;
        console.log("console",fulldata);
        // console.log("console",this.state.data);
        let value=e.target.value.toLowerCase();
        let result=[];
        // console.log("data: ", users)
        result=this.state.data.filter((res)=>{
            return res.role.search(value)!==-1;
        });
        this.setState({filterdata: result})
    }

    render() {
        const { user, users } = this.props;
        return (
            <div>
                <Navbar bg="dark" variant="dark">
                    <Navbar.Brand ></Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link ><Link to="/">Home</Link></Nav.Link>
                        <Nav.Link href="#features">Auditor</Nav.Link>
                        <Nav.Link> <Link to="/login">Logout</Link></Nav.Link>
                    </Nav>
                </Navbar>
                <div className="col-md-6 col-md-offset-3">

                    <h1>Hi {user.firstName}!</h1>
                    <p>You're logged in with React!!</p>
                    <h3>All login audit :</h3>
                    <label for="date">Choose a data/time format: </label>
                    <select onChange={(e)=>this.handleOptions(e)} name="date" id="date">
                        <option value="12" selected>12hr</option>
                        <option value="24">24hr</option>
                    </select><br></br>
                    <label for="Search">Search:</label>
                    <input name = "Search" onChange={(e)=>this.handleInputChange(e)}></input>
                    <table>
                    {users.loading && <em>Loading users...</em>}
                    {users.error && <span className="text-danger">ERROR: {users.error}</span>}
                    {users.items &&
                        <div className="user-screen">
                            <thead>
                            <tr>
                                <th onclick="sortingTable()">Id</th>
                                <th>Role</th>
                                <th>Time</th>
                                <th>Name</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                            <tbody>
                                {users.items.map((user, index) =>
                                    <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.role}</td>
                                            <td>{this.state.date==="12" ? new Date(user.createdDate).toLocaleString('en-US', { timeZone: 'GMT', hour12: true }) : new Date(user.createdDate).toLocaleString('en-US', { timeZone: 'GMT', hour12: false }) }</td>
                                            <td>{user.firstName + ' ' + user.lastName}</td>
                                            <td>
                                            {
                                                user.deleting ? <em> - Deleting...</em>
                                                    : user.deleteError ? <span className="text-danger"> - ERROR: {user.deleteError}</span>
                                                        : <span> - <a onClick={this.handleDeleteUser(user.id)}>Delete</a></span>
                                            }
                                            </td>
                                    </tr>
                                )}
                            </tbody>
                        </div>
                    }
                    </table>
                </div>
            </div>
        );
    }
}

function mapState(state) {
    const { users, authentication } = state;
    const { user } = authentication;
    return { user, users };
}

const actionCreators = {
    getUsers: userActions.getAll,
    deleteUser: userActions.delete
}

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };