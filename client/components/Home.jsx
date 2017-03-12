import React, { Component } from 'react';
import { connect } from 'react-redux';
import { savePreferences, getPreferences } from '../store/actions/firebase/firebaseActions';
import Investor from './Investor';
import ProjectOwner from './ProjectOwner';
import { isEmpty } from 'lodash';

class Home extends Component {
  componentWillMount() {
    this.props.getPreferences();
  }
  render() {
    if(isEmpty(this.props.auth.preferences)) {
      return <div>LOADING</div>;
    }
    return (
      <div>
        {this.props.auth.preferences.role.Investor ?
          <Investor {...this.props} /> :
          <ProjectOwner />}
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return {
    auth,
  };
};

export default connect(mapStateToProps, { getPreferences })(Home);
