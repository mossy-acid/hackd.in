// import React, { PropTypes } from 'react'
// import ProjectList from './ProjectList'

class Create extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <div>
        <div id="form-input">
          <form class="form" id="form1">
            <p class="name">
              <input name="name" type="text" class="formInput" placeholder="Name" id="name" />
            </p>
            <p class="email">
              <input name="email" type="text" class="formInput" id="email" placeholder="Email" />
            </p>
            <p class="text">
              <textarea name="text" class="formInput" id="comment" placeholder="Write your comment"></textarea>
            </p>
          </form>
          <div class="submit">
              <input type="submit" value="SEND" id="button-blue"/>
          </div>
        </div>
      </div>
    );
  }
}