

// export async function createUser(data) {
//     const response = await fetch(`/api/user`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ user: data })
//     })
//     return await response.json();
// }

export async function signInUser(data) {
    console.log(JSON.stringify({ data }));
    let user = {
        "email": data.email,
        "password": data.password
    };
    console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3000/auth/signIn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });
    // let response = { ...response, { token: 'acd' }};
    return await response.json();
}

export async function createUser(data) {
    console.log(JSON.stringify({ data }));
    let user = {
        "firstname": data.firstname,
        "lastname": data.lastname,
        "email": data.email,
        "password": data.password,
        "location": data.location,
        "username": data.username
    };

    console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3000/auth/signUp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    })
    return await response.json();
}

export async function getAllLocations(data, userID) {
    console.log(getAllLocations, JSON.stringify({ data }));

    //console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3000/location/${userID}/allLocations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return await response.json();
}

export async function profileChangeSubmit(data, userID) {
    console.log('profileChangeSubmit', JSON.stringify({ data }));

    //console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3000/user/${userID}/edit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return await response.json();
}

export async function addLocation(data, userID) {
    console.log('profileChangeSubmit', JSON.stringify({ data }));

    //console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3000/location/${userID}/addLocation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return await response.json();
}

export async function getAllUsers(data, userID) {
    //console.log('profileChangeSubmit', JSON.stringify({ data }));

    //console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3000/user/${userID}/getAllUsers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return await response.json();
}

export async function getMyFriends(userID) {
    //console.log('profileChangeSubmit', JSON.stringify({ data }));

    //console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3000/user/${userID}/getMyFriends`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })
    return await response.json();
}

export async function postAddFriend(data, userID) {
    //console.log('profileChangeSubmit', JSON.stringify({ data }));

    //console.log(JSON.stringify(user));
    const response = await fetch(`http://localhost:3000/user/${userID}/addFriend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    return await response.json();
}
