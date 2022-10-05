import React from "react";
import "./Audit.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userActions } from "../_actions";
// import Pagination from './Pagination/Pagination'

let PageSize = 10;
import { Navbar, Nav } from "react-bootstrap";
class Auditpage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      value: "",
      date: "12",
      filterdata: [],
      currentPage: 1,
      isSearched: false,
    };

    this.handleOptions = this.handleOptions.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.sort = this.sort.bind(this);
  }

  static getDerivedStateFromProps(props, state) {
    // let fildata=[];
    const fildata = state.isSearched ? state.filterdata : props.users.items;
    // const firstPageIndex = (state.currentPage - 1) * PageSize;
    // const lastPageIndex = firstPageIndex + PageSize;
    // fildata = fildata.slice(firstPageIndex, lastPageIndex);

    return {
      filterdata: fildata,
      data: props.users.items,
    };
  }

  componentDidMount() {
    this.props.getUsers();
  }

  handleOptions(e) {
    e.preventDefault();
    this.setState({ date: e.target.value });
  }

  handleDeleteUser(id) {
    return (e) => this.props.deleteUser(id);
  }

  handleInputChange(e) {
    e.preventDefault();
    let value = e.target.value.toLowerCase();
    let result = [];
    result = this.state.data.filter((res) => {
      const name =
        res.firstName.toLowerCase() + " " + res.lastName.toLowerCase();
      return (
        res.role.toLowerCase().includes(value) ||
        name.toLowerCase().includes(value) ||
        res._id.toLowerCase().includes(value)
      );
    });
    this.setState({ filterdata: result, isSearched: true });
  }

  sort(e) {
    let result = [];
    const data = this.state.data;
    let symbol = {};

    switch (e.target.id) {
      case "id":
        result = data.sort((a, b) => {
          return a.id.localeCompare(b.id);
        });
        break;
      case "role":
        result = data.sort((a, b) => {
          return a.role.localeCompare(b.role);
        });
        break;
      case "name":
        result = data.sort((a, b) => {
          const aname = a.firstName + " " + a.lastName;
          const bname = b.firstName + " " + b.lastName;
          return aname.localeCompare(bname);
        });
        break;
      default:
        console.log("Other click");
        break;
    }
    this.setState({ filterdata: result, length: result.length });
  }

  render() {
    const { user, users } = this.props;
    const filtereddata = this.state.filterdata;
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand></Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link>
              <Link to="/">Home</Link>
            </Nav.Link>
            <Nav.Link href="#features">Auditor</Nav.Link>
            <Nav.Link>
              {" "}
              <Link to="/login">Logout</Link>
            </Nav.Link>
          </Nav>
        </Navbar>
        <div className="col-md-6 col-md-offset-3">
          <h1>Hi {user.firstName}!</h1>
          <p>You're logged in with React!!</p>
          <h3>All login audit :</h3>
          <label for="date">Choose a data/time format: </label>
          <select onChange={(e) => this.handleOptions(e)} name="date" id="date">
            <option value="12" selected>
              12hr
            </option>
            <option value="24">24hr</option>
          </select>
          <br></br>
          <label for="Search">Search:</label>
          <input
            name="Search"
            placeholder="ID/Role/Name"
            onChange={(e) => this.handleInputChange(e)}
          ></input>
          <table>
            {users.loading && <em>Loading users...</em>}
            {users.error && (
              <span className="text-danger">ERROR: {users.error}</span>
            )}
            {users.items && (
              <div className="user-screen">
                <thead>
                  <tr>
                    <th>
                      Id{" "}
                      <button id="id" onClick={(e) => this.sort(e)}>
                        ↑
                      </button>
                    </th>
                    <th>
                      Role{" "}
                      <button id="role" onClick={(e) => this.sort(e)}>
                        ↑
                      </button>
                    </th>
                    <th>Time</th>
                    <th>
                      Name{" "}
                      <button id="name" onClick={(e) => this.sort(e)}>
                        ↑
                      </button>
                    </th>
                    <th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {filtereddata.map((user, index) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.role}</td>
                      <td>
                        {this.state.date === "12"
                          ? new Date(user.createdDate).toLocaleString("en-US", {
                              timeZone: "GMT",
                              hour12: true,
                            })
                          : new Date(user.createdDate).toLocaleString("en-US", {
                              timeZone: "GMT",
                              hour12: false,
                            })}
                      </td>
                      <td>{user.firstName + " " + user.lastName}</td>
                      <td>
                        {user.deleting ? (
                          <em> - Deleting...</em>
                        ) : user.deleteError ? (
                          <span className="text-danger">
                            {" "}
                            - ERROR: {user.deleteError}
                          </span>
                        ) : (
                          <span>
                            {" "}
                            -{" "}
                            <a onClick={this.handleDeleteUser(user.id)}>
                              Delete
                            </a>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </div>
            )}
          </table>
          {/* <Pagination
            className="pagination-bar"
            currentPage={this.state.currentPage}
            totalCount={filtereddata.length}
            pageSize={PageSize}
            onPageChange={(page) => setCurrentPage(page)}
          /> */}
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
  deleteUser: userActions.delete,
};

const connectedAuditPage = connect(mapState, actionCreators)(Auditpage);
export { connectedAuditPage as Auditpage };
