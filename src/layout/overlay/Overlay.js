import React from 'react';
import './Overlay.css';

export default class Overlay extends React.Component {
  static defaultProps = {
    show: false
  };

  constructor(props){
    super(props);
    this.state = {
      show: props.show
    };
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.show !== this.state.show){
      this.setState({
        show: nextProps.show
      });
    }
  }

  render(){
    return (
      <div className={`overlay overlay-scale ${this.state.show ? 'open' : ''}`}>
        <button type="button" className="overlay-close" onClick={() => this.setState({show: false})}>Close</button>
        {this.props.children}
      </div>
    );
  }
}