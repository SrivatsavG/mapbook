import React from 'react'


const CreateUser = ({ onChangeForm, createUser, onSignIn, showCreateUser, showLoginError, onSignUp, currentMsg }) => {
    console.log("In createUser", showLoginError);

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-7 mrgnbtm">
                    <h2>Sign In</h2>
                    {
                        currentMsg && <h6>{currentMsg}</h6>
                    }
                    <form>
                        {showCreateUser &&

                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="exampleInputEmail1">First Name</label>
                                    <input type="text" onChange={(e) => onChangeForm(e)} className="form-control" name="firstname" id="firstname" aria-describedby="emailHelp" placeholder="First Name" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="exampleInputPassword1">Last Name</label>
                                    <input type="text" onChange={(e) => onChangeForm(e)} className="form-control" name="lastname" id="lastname" placeholder="Last Name" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="exampleInputLocation1">Location</label>
                                    <input type="text" onChange={(e) => onChangeForm(e)} className="form-control" name="location" id="location" placeholder="Location" />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="exampleInputUsername1">Username</label>
                                    <input type="text" onChange={(e) => onChangeForm(e)} className="form-control" name="username" id="username" placeholder="Username" />
                                </div>
                            </div>
                        }
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputEmail1">Email</label>
                                <input type="text" onChange={(e) => onChangeForm(e)} className="form-control" name="email" id="email" aria-describedby="emailHelp" placeholder="Email" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-12">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" onChange={(e) => onChangeForm(e)} className="form-control" name="password" id="password" aria-describedby="emailHelp" placeholder="password" />
                            </div>
                        </div>
                        {
                            showLoginError ? <h4>{showLoginError}</h4> : ''
                        }
                        {
                            showCreateUser && <button type="button" style={{ marginRight: 20 }} onClick={(e) => onSignUp()} className="btn btn-primary">Sign Up</button>

                        }

                        {
                            !showCreateUser && <div>
                                <button type="button" style={{ marginRight: 20 }} onClick={(e) => onSignIn()} className="btn btn-primary">Sign In</button>
                                <span>OR </span>
                                <button type="button" style={{ marginLeft: 20 }} onClick={(e) => createUser()} className="btn btn-primary">Create New User </button>
                            </div>

                        }

                    </form>
                </div>
            </div>
        </div >
    )
}

export default CreateUser