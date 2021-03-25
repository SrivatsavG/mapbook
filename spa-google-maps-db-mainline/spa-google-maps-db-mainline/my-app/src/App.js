import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Header } from './components/Header'
import { Users } from './components/Users'
import { DisplayBoard } from './components/DisplayBoard'
import CreateUser from './components/CreateUser'
import MapPage from './components/MapPage'
import { getAllUsers, createUser, signInUser } from './services/UserService'

class App extends Component {

  state = {
    user: {},
    users: [],
    numberOfUsers: 0,
    showCreateUser: false,
    showFirstPage: true,
    showLoginError: false,
    showPageNumber: 0,

  }

  createUser = (e) => {
    this.setState({ showCreateUser: true });
    // createUser(this.state.user)
    //   .then(response => {
    //     console.log(response);
    //     this.setState({ numberOfUsers: this.state.numberOfUsers + 1 })
    //   });
  }

  getAllUsers = () => {
    getAllUsers()
      .then(users => {
        console.log(users)
        this.setState({ users: users, numberOfUsers: users.length })
      });
  }

  onChangeForm = (e) => {
    let user = this.state.user;
    user[e.target.name] = e.target.value;
    this.setState({ user })
  }

  onSignIn = (e) => {
    console.log(e);
    this.setState({
      showCreateUser: false,
      showLoginError: null
    });

    signInUser(this.state.user)
      .then(response => {
        console.log(response);
        if (response.token) {
          this.setState({
            showFirstPage: false,
            userDetails: { ...response }
          })
        }
        else {
          console.log("showlogin user failed");
          this.setState({
            showLoginError: response.message
          })
        }

        //this.setState({ numberOfUsers: this.state.numberOfUsers + 1 })
      });
  }

  createUser = (e) => {
    console.log(this.state.user);
    this.setState({
      showCreateUser: true,
    });
  }

  onSignUp = (e) => {
    this.setState({ showLoginError: null })
    createUser(this.state.user)
      .then(response => {
        console.log(response);
        if (response.userID) {
          this.setState({
            showFirstPage: true,
            showCreateUser: false,
            userDetails: { ...response },
            currentMsg: 'Sign Up Successful, please Login to continue...',
          })
        }
        else {
          console.log("showlogin user failed");
          this.setState({
            showLoginError: response.message
          })
        }

        //this.setState({ numberOfUsers: this.state.numberOfUsers + 1 })
      });
  }



  render() {

    return (
      <div className="App">
        <Header></Header>
        {
          this.state.showFirstPage &&
          <div className="container mrgnbtm">
            <div className="row">
              <div className="col-md-4">
                {/* <DisplayBoard
                numberOfUsers={this.state.numberOfUsers}
                getAllUsers={this.getAllUsers}
              >
              </DisplayBoard> */}
                <div style={{ background: "#1456a9", color: '#FFF', padding: 20, }}>
                  <h5 style={{ textAlign: 'center' }}>Team: 9</h5>
                  <hr style={{ background: "#FFF" }} />
                  <h6>Team Members: </h6>
                  <h6>Siddharth </h6>
                  <h6>Srivastav </h6>
                  <h6>Patrick </h6>
                  <h6>Under guidance: Professor Dr. Hossam Fattah </h6>
                  <h6>TA: Ms. Jyoti Shankar</h6>
                  <h6>Front-end: React JS with Google Maps APIs integreated</h6>
                  <h6>Back-end: Node JS with express server running as web server </h6>
                  <h6>Database: AWS Postgress SQL database with different schema</h6>
                </div>
              </div>




              <div className="col-md-8">
                <CreateUser
                  user={this.state.user}
                  onChangeForm={this.onChangeForm}
                  createUser={this.createUser}
                  onSignIn={this.onSignIn}
                  showCreateUser={this.state.showCreateUser}
                  showLoginError={this.state.showLoginError}
                  onSignUp={this.onSignUp}
                  currentMsg={this.state.currentMsg}
                >
                </CreateUser>
              </div>

            </div>
          </div>
        }

        {
          !this.state.showFirstPage && <MapPage userData={this.state.userDetails}></MapPage>
        }

        <div className="row mrgnbtm">
          <Users users={this.state.users}></Users>
        </div>
      </div>
    );
  }
}

export default App;
