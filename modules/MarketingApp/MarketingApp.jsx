import { Component, PropTypes } from 'react';
import style from './MarketingApp.import.css';

export default class MarketingApp extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired
  }

  render() {
    return (
      <div id="marketing-app">
        {this.props.children}
      </div>
    );
  }
}