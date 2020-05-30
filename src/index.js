import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Companies from './components/Companies.js';

const API = 'https://acme-users-api-rev.herokuapp.com/api'

class App extends Component {
  state = {
    user: {},
    companies: [],
    following: []
  };
  // eslint-disable-next-line lines-between-class-members
  async componentDidMount() {
    const randomUser = await fetch(`${API}/users/random`);
    const user = await randomUser.json();
    const storage = window.localStorage;
    const userId = storage.userId ? storage.getItem('userId') : storage.setItem('userId', user.id);
    if (userId) {
      try {
        fetch(`${API}/users/detail/${userId}`)
          .then(user => user.json())
          .then(data => {
            this.setState({ user: data });
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
        this.setState({ companies: data })
      });

    const followingList = await fetch(`${API}/users/${userId}/followingCompanies`);
    const followingData = await followingList.json()
      .then(data => {
        this.setState({ following: data }, () => console.log(this.state.following))
      })
  }

  async update(value, id) {
    const { following } = this.state;
    const amFollowing = following.filter(follow => follow.companyId === id).length ? true : false;

    if (amFollowing) {

      const followingId = this.state.following.filter(follow => follow.companyId === id)[0].id;

      if (value > 0) {
        const editMe = await fetch(`${API}/users/${this.state.user.id}/followingCompanies/${followingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rating: value, companyId: id }),
        });
      } else {
        const deleteMe = await fetch(`${API}/users/${this.state.user.id}/followingCompanies/${followingId}`,
          {
            method: 'DELETE',
          });
      }

    } else {
      const newFollow = await fetch(`${API}/users/${this.state.user.id}/followingCompanies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rating: value, companyId: id }),
      });
    }
    const followingList = await fetch(`${API}/users/${this.state.user.id}/followingCompanies`);
    const followingData = await followingList.json()
      .then(data => {
        this.setState({ following: data }, () => console.log(this.state.following))
      })
  }

  render() {
    const { user, companies, following } = this.state;
    const { update } = this;
    return (
      <>
        <h1>
          {user.firstName} {user.lastName}
        </h1>
        <Companies
          companies={companies}
          following={following}
          update={update.bind(this)}
        />
      </>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'), () => {
});
