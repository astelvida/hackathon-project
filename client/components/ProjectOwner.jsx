import React, { Component } from 'react';
import { connect } from 'react-redux';
import { savePreferences, getPreferences } from '../store/actions/firebase/firebaseActions';
import SignUpLocation from './signup/SignUpLocation';
import SignUpRound from './signup/SignUpRound';
import SignUpRange from './signup/SignUpRange';
import SignUpIndustry from './signup/SignUpIndustry';
import SignUpProduct from './signup/SignUpProduct';
import Button from './button/Button';

const initState = {
  step: 1,
  role: { Investor: false, 'Project Owner': false },
  location: '',
  industry: { Healthcare: false, FinTech: false, Consumer: false, 'Digital Media': false, Ecommerce: false, SaaS: false },
  round: { Idea: false, Seed: false, 'Series A': false, 'Series B': false, After: false },
  range: { '<100k': false, '100k-300k': false, '300k-500k': false, '500k-1M': false, '>1M': false },
  product: {
    Description: '',
    Title: ''
  }
};


class ProjectOwner extends Component {
  constructor(props) {
    super(props);
    const { location, industry, round, range, product, role } = this.props.auth.preferences;
    const nextState = { ...initState };

    for(var prop in nextState) {
      for(var key in nextState[prop]) {
        if(this.props.auth.preferences[prop][key]) {
          nextState[prop][key] = this.props.auth.preferences[prop][key]
        } else {
          nextState[prop][key] = false;
        }
      }
    }

    this.state = nextState;

    this.handleChangeLocation = this.handleChangeLocation.bind(this);
    this.handleClickRound = this.handleClickRound.bind(this);
    this.handleClickRange = this.handleClickRange.bind(this);
    this.handleClickIndustry = this.handleClickIndustry.bind(this);
    this.handleChangeProductTitle = this.handleChangeProductTitle.bind(this);
    this.handleChangeProductDescription = this.handleChangeProductDescription.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

    shouldComponentUpdate(nextProps) {
      if(nextProps.auth.preferences !== this.props.auth.preferences) {
        return false;
      }
      return true;
    }
  handleChangeLocation(e) {
    this.setState({
      location: e.target.value,
    });
  }

  handleClickRound(e) {
    console.log('handleClickRound clicked', e.target.name);
    const { round } = this.state;
    const newState = {
      ...round,
      [e.target.name]: !this.state.round[e.target.name],
    };
    this.setState({
      round: newState,
    });
  }


  handleClickRange(e) {
    console.log('handleClickRange clicked', e.target.name);
    const { range } = this.state;
    const newState = {
      ...range,
      [e.target.name]: !this.state.range[e.target.name],
    };

    this.setState({
      range: newState,
    });
  }

  handleClickIndustry(e) {
    console.log('handleClickIndustry clicked', e.target.name);
    const { industry } = this.state;
    console.log('THIS', this)
    const newState = {
      ...industry,
      [e.target.name]: !this.state.industry[e.target.name],
    };

    this.setState({
      industry: newState,
    });
  }

  handleChangeProductTitle(e) {
    console.log('handleChange clicked', this.state.product);
    this.setState({
      product: { ...this.state.product, Title: e.target.value },
    });
  }

  handleChangeProductDescription(e) {
    console.log('handleChange clicked', this.state.product);
    this.setState({
      product: { ...this.state.product, Description: e.target.value },
    });
  }

  handleSaveClick() {
    console.log('handleSaveClick clicked');
    const oldState = { ...this.state }
    this.props.savePreferences(this.state)
  }

  render() {
    // const stateCopy = { ...this.state, this.props.auth.preferences }
    // console.log('',stateCopy)
    const { location, industry, round, range, product } = this.props.auth.preferences;
    // console.log('this.props: ', this.props);

    if (!product) {
      return <div />;
    }

    return (
      <div>
        <h2>Edit your profile</h2>
        <h3>Location</h3>
        <SignUpLocation changeHandler={this.handleChangeLocation} label={location} placeholderText={'Enter your city'} value={this.state.location} />
        <h3>Round</h3>
        <SignUpRound clickHandler={this.handleClickRound} options={this.state.round} />
        <h3>Range</h3>
        <SignUpRange clickHandler={this.handleClickRange} options={this.state.range} />
        <h3>Industry</h3>
        <SignUpIndustry clickHandler={this.handleClickIndustry} options={this.state.industry} />
        <h3>Product</h3>
        <SignUpProduct
          changeTitleHandler={this.handleChangeProductTitle}
          changeDescriptionHandler={this.handleChangeProductDescription}
          titlePlaceholderText={'Enter your product name'}
          descriptionPlaceholderText={'Enter your product description'}
          titleValue={product.Title}
          descriptionValue={product.Description}
        />
        <Button label={'Save'} clickHandler={this.handleSaveClick} />
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  auth,
});

export default connect(mapStateToProps, { getPreferences, savePreferences })(ProjectOwner);
