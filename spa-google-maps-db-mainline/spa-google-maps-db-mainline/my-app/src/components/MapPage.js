import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';
import { Map, GoogleApiWrapper, Marker, InfoWindow } from 'google-maps-react';
import { getAllLocations, profileChangeSubmit, addLocation, getAllUsers, getMyFriends, postAddFriend } from '../services/UserService'

const adjustMapStyle = {
    margin: 0
}

const locationTypes = ['parks', 'restaurant', 'gym', 'gasstation', 'bank', 'atm'];

class MapPage extends Component {
    constructor() {
        super();
        this.state = {
            radiusPickerName: 50,
            showAddLocationPage: false,
            showEditProfile: false,
            updateLocation: {
                type: 'parks',
                info: '',
                rating: '3',
                locLat: '',
                locLng: '',
                name: '',
                address: '',
            },
            displayAllFriends: false,

        }
    }

    componentDidMount() {

        let userData1 = this.props.userData;
        userData1['visible'] = true;
        this.setState({ userData1 });
    }

    onChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    onAddNewLocations = (e) => {
        let newLoc = {
            type: 'parks',
            info: '',
            rating: '3',
            locLat: '',
            locLng: '',
            name: '',
            address: '',
        };

        this.setState({
            showAddLocationPage: true,
            showEditProfile: false,
            updateLocation: newLoc,
            addLocationMsg: '',
        });

    }

    onFindAllLocations = () => {
        let userInterestedLoc = locationTypes.filter(item => this.state[item] === true);
        let data = {
            location: this.props.userData.location.x + "," + this.props.userData.location.y,
            //location: "47.66,-122.108",
            type: userInterestedLoc,
            distance: "" + this.state.radiusPickerName,
        }

        getAllLocations(data, this.props.userData.userID).then(data => {
            console.log(data);
            let items = [];
            let bounds = new this.props.google.maps.LatLngBounds();
            let userLocation = this.props.userData && this.props.userData.location;
            bounds.extend({ lat: userLocation.x, lng: userLocation.y });
            data.map(item => {
                items.push({
                    lat: item.location.x,
                    lng: item.location.y,
                    type: item.type,
                    info: item.info
                });
                bounds.extend({
                    lat: item.location.x,
                    lng: item.location.y,
                })
            });
            this.setState({ bounds, currentMarkers: items })
            // let newLatLng = {
            //     markerPositionX: data[0].location.x || 0,
            //     markerPositionY: data[0].location.y || 0,
            // };
            //bounds.extend(newLatLng);
            //this.setState({ bounds });
        });
    };

    onEditProfile = () => {
        let dataToSubmit = {
            location: this.props.userData.location.x + "," + this.props.userData.location.y,
            distance: 2000,
        }
        getAllUsers(dataToSubmit, this.props.userData.userID).then(data => this.setState({ friends: data, showEditProfile: true }));
        //getMyFriends(this.props.userData.userID).then(data => this.setState({ friends: data, showEditProfile: true }));
    }

    handleEdit = (e) => {
        let userData11 = { ...this.state.userData1 };
        userData11[e.target.name] = e.target.value;
        this.setState({ userData1: userData11 });
    }

    addFriend = (e) => {
        let dataToSubmit = {
            friendID: "" + e.target.name,
        }
        postAddFriend(dataToSubmit, this.props.userData.userID).then(data => data.message && alert(data.message));
    }

    onDisplayAllFriends = (e) => {
        getMyFriends(this.props.userData.userID).then(data => this.setState({ displayAllFriends: true, myfriends: data, showEditProfile: true }));
    }


    onChangeSubmit = () => {
        let userData = { ...this.state.userData1 };
        delete userData['token'];
        delete userData['userID'];
        console.log(userData);
        userData.location = userData.location.x + "," + userData.location.y;
        userData['visible'] = userData['visible'] === true ? true : false;
        //let dataToSubmit = Object.keys(userData).filter(item => (item !== 'token' && item !== 'userID'));
        profileChangeSubmit(userData, this.state.userData1.userID).then(data => this.setState({
            profileEditOperationMsg: data && data.message
        }));
    }

    handleAddLocationChange = (e) => {
        let updated = this.state.updateLocation;
        updated[e.target.name] = e.target.value;
        this.setState({ updateLocation: updated });
    }

    onLocationAdd = () => {
        let dataToSubmit = this.state.updateLocation;
        let location = dataToSubmit['locLat'] + "," + dataToSubmit['locLng'];
        delete dataToSubmit['locLat'];
        delete dataToSubmit['locLng'];
        dataToSubmit['location'] = location;
        addLocation(dataToSubmit, this.state.userData1.userID).then(data => this.setState({ addLocationMsg: data.message }));
    }
    onBackToMapView = () => {
        this.setState({
            showEditProfile: false,
            showAddLocationPage: false,
            profileEditOperationMsg: '',
            displayAllFriends: false,
        });
    }

    render() {
        let userData;
        if (this.state.userData1) {
            userData = this.state.userData1;
        }
        else {
            userData = this.props.userData;
        }

        return (
            <div>
                {
                    !(this.state.showEditProfile || this.state.showAddLocationPage) &&
                    <div>
                        <h5>Welcome, {userData.firstname}</h5>
                        <div><button type="button" style={{ marginRight: 20 }} onClick={(e) => this.onEditProfile()} className="btn btn-primary">Edit Profile</button>
                        </div>
                        <div className="row adjustMapStyle">
                            <div className="form-group col-md-4">
                                <h5>Filter your locations: </h5>
                                <div>1. Please select a range: </div>
                                <input type="range" name="radiusPickerName" id="radiusPickerId" min="0" max="100" onInput={(e) => this.onChange(e)} />
                                <output name="radiusPickerOutputName" id="radiusPickerOutputId">{this.state.radiusPickerName}</output>
                                <div>2. Please select location types: </div>
                                <div> {
                                    locationTypes.map(item => <div><input type="checkbox" name={`${item}`} style={{ marginRight: 10 }} onChange={this.onChange} /><span>{item}</span></div>)
                                }

                                </div>
                                <button type="button" style={{ marginRight: 10 }} onClick={(e) => this.onFindAllLocations()} className="btn btn-primary">Find all locations</button>
                                <span>OR</span>
                                <button type="button" style={{ marginLeft: 10 }} onClick={(e) => this.onAddNewLocations(e)} className="btn btn-primary">Add new locations</button>

                            </div>
                            <div className="form-group col-md-8">
                                <Map
                                    google={this.props.google}
                                    zoom={6}
                                    style={{ height: '70vh' }}
                                    initialCenter={
                                        {
                                            lat: JSON.stringify(userData.location.x),
                                            lng: JSON.stringify(userData.location.y)
                                        }}
                                    bounds={this.state.bounds}
                                >
                                    <Marker position={{
                                        lat: "" + userData.location.x,
                                        lng: "" + userData.location.y
                                    }}
                                        title={'Current User Location'}
                                        onClick={() => console.log("You clicked me!")}
                                    />
                                    {
                                        this.state.currentMarkers && this.state.currentMarkers.map(marker =>
                                            <Marker position={
                                                {
                                                    lat: marker.lat,
                                                    lng: marker.lng
                                                }}
                                                title={marker.type}
                                                onClick={() => console.log("You clicked me!")}
                                            >
                                                <InfoWindow
                                                    visible={true}
                                                    style={{}}
                                                >
                                                    <div className={{}}>
                                                        <p>Click on the map or drag the marker to select location where the incident occurred</p>
                                                    </div>
                                                </InfoWindow>
                                            </Marker>
                                        )
                                    }
                                </Map>
                            </div>
                        </div>
                    </div>

                }
                <div>
                    {
                        this.state.profileEditOperationMsg && <h4 style={{ color: 'green' }}>{this.state.profileEditOperationMsg}</h4>
                    }
                    {
                        this.state.showEditProfile && <div>
                            <h4>Please update you profile below: </h4>
                            {
                                Object.keys(this.state.userData1).map(item => item !== 'token' && item !== 'userID' && item !== 'location' && item !== 'message' && item !== 'email' && item !== 'visible' &&
                                    <div className='row col-md-4'><span style={{ minWidth: '30%' }}>{item}: </span><input type='text' name={item} value={this.state.userData1[item]} onChange={(e) => this.handleEdit(e)} /></div>)

                            }
                            <button type="button" style={{ margin: 20 }} onClick={(e) => this.onChangeSubmit()} className="btn btn-primary">Submit Changes</button>
                            {
                                !this.state.displayAllFriends && <button type="button" style={{ margin: 20, marginTop: 40, display: 'block' }} onClick={(e) => this.onDisplayAllFriends()} className="btn btn-primary">Display All My Friends</button>
                            }
                            {
                                !this.state.displayAllFriends && this.state.friends[0] && this.state.friends[0].firstname && <h4>Below are all available users: </h4>
                            }
                            {
                                !this.state.displayAllFriends && this.state.friends[0] && this.state.friends[0].firstname && this.state.friends.map((item, index) => item && <div className='row col-md-4' style={{ marginBottom: 20 }}><span style={{ minWidth: '30%' }}>First name: </span><input type='text' name={item.firstname} readonly value={this.state.friends[index]['firstname']} /><span style={{ minWidth: '30%' }}>Last name: </span><input type='text' name={item.lastname} readonly value={this.state.friends[index]['lastname']} /><button name={item.userid} className='btn btn-primary' style={{ display: 'inline-block' }} onClick={(e) => this.addFriend(e)}>Add As Friend</button></div>)
                            }
                            {
                                this.state.displayAllFriends && this.state.myfriends[0] && this.state.myfriends[0].firstname && this.state.myfriends.map((item, index) => item && <div className='row col-md-4' style={{ marginBottom: 20 }}><span style={{ minWidth: '30%' }}>First name: </span><input type='text' name={item.firstname} readonly value={this.state.myfriends[index]['firstname']} /><span style={{ minWidth: '30%' }}>Last name: </span><input type='text' name={item.lastname} readonly value={this.state.myfriends[index]['lastname']} /></div>)
                            }
                            <button type="button" style={{ margin: 20 }} onClick={(e) => this.onBackToMapView()} className="btn btn-primary">Back to Maps View</button>

                        </div>
                    }
                </div>
                <div className="newLocationPage">
                    {
                        this.state.showAddLocationPage && <div>
                            {
                                this.state.addLocationMsg && <h4 style={{ color: 'green' }}>{this.state.addLocationMsg}</h4>
                            }
                            <h4>Add New Location</h4>
                            <label>
                                <span>Name: </span><input type='text' name='name' placeholder='Location Name' value={this.state.updateLocation['name']} onChange={(e) => this.handleAddLocationChange(e)} />
                            </label>
                            <label>
                                <span>Type: </span>
                                <select value={this.state.updateLocation['type']} name='type' onChange={(e) => this.handleAddLocationChange(e)}>
                                    <option value="parks">Park</option>
                                    <option value="restaurant">Restuarant</option>
                                    <option value="gym">Gym</option>
                                    <option value="gas">Gas Station</option>
                                    <option value="atm">ATM</option>
                                    <option value="bank">Bank</option>
                                </select>
                            </label>
                            <label>
                                <span>Info: </span><input type='text' name='info' placeholder='inforamtion' value={this.state.updateLocation['info']} onChange={(e) => this.handleAddLocationChange(e)} />
                            </label>
                            <label>
                                <span>Rating: </span>
                                <select value={this.state.updateLocation['rating']} name='rating' onChange={(e) => this.handleAddLocationChange(e)}>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                            </label>
                            <label>
                                <span>Location - Latitude:  </span><input type='text' name='locLat' placeholder='Location Latitude' value={this.state.updateLocation['locLat']} onChange={(e) => this.handleAddLocationChange(e)} />
                            </label>
                            <label>
                                <span>Location - Longitude:</span><input type='text' name='locLng' placeholder='Location Longitude' value={this.state.updateLocation['locLng']} onChange={(e) => this.handleAddLocationChange(e)} />
                            </label>
                            <label>
                                <span>Address</span><input type='text' name='address' placeholder='Location Address' value={this.state.updateLocation['address']} onChange={(e) => this.handleAddLocationChange(e)} />
                            </label>
                            <button type="button" style={{ margin: 20 }} onClick={(e) => this.onLocationAdd()} className="btn btn-primary">Add Location</button>
                            <button type="button" style={{ margin: 20 }} onClick={(e) => this.onBackToMapView()} className="btn btn-primary">Back to Maps View</button>

                        </div>
                    }
                </div>

            </div >


        )
    }
}



export default GoogleApiWrapper({
    apiKey: 'AIzaSyAcrsGPVVpCPEYny1u1KezaO_d5ooYc3-w'
})(MapPage);

// export default GoogleApiWrapper({
//     apiKey: 'YOUR_GOOGLE_MAPS_API_KEY_GOES_HERE'
// })(MapContainer);