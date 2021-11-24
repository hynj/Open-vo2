const state = {
    currentUser: 0,
    setPower: 0,
    setIntervalTime: 0,
    setDuration: 0,
    users: [{
        id: 0,
        name: "test user",
        weight: 80,
        height: 1.77,
        FVC: 0,
    }
    ]
}

const mutations = {
    ADD_USER(state, userData){
        userData.id = (state.users[state.users.length - 1].id + 1)
        state.users.push(user)
    }
}

const actions = {

}

const getters = {

}

export default {
    state,
    mutations,
    actions,
    getters
  };