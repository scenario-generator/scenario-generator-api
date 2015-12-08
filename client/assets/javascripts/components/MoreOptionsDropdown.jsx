import React from 'react';
import _ from 'lodash';

const MoreOptionsDropdown = React.createClass({
  displayName: 'MoreOptions',

  getInitialState: function getInitialState() {
    return {
      visible: false
    };
  },

  getDefaultProps: function getDefaultProps() {
    return {
      name: 'more-options',
      rows: []
    };
  },

  toggleDropdown: function() {
    this.setState({
      visible: !this.state.visible
    });
  },

	handleClick: function() {
		this.toggleDropdown();
	},

  renderMoreOptions: function(rows) {
    let dropdownRows = _.map(this.props.rows, function(row) {
    return (
      <div className="dropdown-row" 
					 onClick={row.action}>
        {row.description}
      </div>
      );
    });
    return (
      <div className="more-options-container">
        <button className='more-options-button' 
								handleClick={this.handleClick}/>
        <div className={this.state.visible ? 
						'more-options-dropdown' :
						'more-options-dropdown hidden'}>
          {dropdownRows}
        </div>
      </div>
    );
  },


  render: function render() {
   return (
       <div>
         { this.renderMoreOptions() }
       </div>
    );
  }
})

MoreOptionsDropdown.propTypes = {
  name: React.PropTypes.string.isRequired,
  rows: React.PropTypes.array.isRequired
};

export default MoreOptionsDropdown;
