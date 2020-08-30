import React, { Component } from "react";
import Redirect from "react-router-dom/es/Redirect";
import axios from 'axios';

class SearchInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      term: '',
    };

    this.submit = this.submit.bind(this);
    this.changeTerm = this.changeTerm.bind(this);
  }

  changeTerm(event) {
    this.setState({term: event.target.value});
  }

  submit(event) {
    let url = 'http://pleroma.site/api/v2/search?query=' + encodeURI(this.state.term) + '&json=1';
    axios.get(url)
      .then(response => {
        let data = {
          results: response.data,
        };
        this.setState(data);
      })
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        <form className="search-form" onSubmit={this.submit}>
          <input type="text" placeholder="Enter your search..." onChange={this.changeTerm} />
        </form>
        {this.state.results.length > 0 &&
          <Redirect to={{
            pathname: '/search',
            state: { results: this.state.results }
          }}/>
        }
      </div>
    );
  }
}

export default SearchInput;