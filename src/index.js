import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Companies from './components/Companies.js';

const API = 'https://acme-users-api-rev.herokuapp.com/api'

class App extends Component {
  state = {
    user: {},
    companies: [],
    following: []
  }
  // eslint-disable-next-line lines-between-class-members
  async componentDidMount() {
    const randomUser = await fetch(`${API}/users/random`);
    const user = await randomUser.json();
    console.log('random user: ', user)
    const storage = window.localStorage;
    const userId = storage.userId ? storage.getItem('userId') : storage.setItem('userId', user.id);
    if (userId) {
      try {
        fetch(`${API}/users/detail/${userId}`)
          .then(user => user.json())
          .then(data => {

            this.setState({ user: data }, () => console.log(this.state));
          })
      }
      catch (ex) {
        storage.removeItem('userId');
        // return fetchUser();
      }
    }
    const companiesList = await fetch(`${API}/companies`);
    const companiesData = await companiesList.json()
      .then(data => {
        this.setState({ companies: data }, () => {
          console.log('companies: ', this.state)
        })
      });

      const followingList = await fetch(`${API}/users/${userId}/followingCompanies`);
      const followingData = await followingList.json()
      .then(data => {
        this.setState({ following: data }, () => {
          console.log('following: ', this.state)
        })
      })
  }

  update(value,id) {
      const amFollowing = this.state.following.filter(follow => follow.companyId === id).length ? true : false;
      console.log(amFollowing)
  }

  render() {
    const { user, companies, following } = this.state;
    return (
      <>
        <h1>{user.firstName} {user.lastName}</h1>
        <Companies companies={companies} following={following} update={this.update.bind(this)}/>
      </>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'), () => {
});
