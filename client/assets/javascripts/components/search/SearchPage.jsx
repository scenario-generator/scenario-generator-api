import React from 'react';
import _ from 'lodash';
import { Link, Navigation } from 'react-router';
import FluxSearchPageActions from '../../actions/FluxSearchPageActions'
import SearchPageStore from '../../stores/SearchPageStore'
import Results from './Results'
import TagResults from './TagResults'

const SearchPage = React.createClass({
  mixins: [ Navigation ],
  displayName: 'SearchPage',

  getInitialState: function() {
    return { data: { products: [], companies: [], tags: [] } }
  },

  performSearch: function(data) {
    SearchPageStore.listen(this.onChange.bind(this));
    FluxSearchPageActions.getSearchResults(data);
  },

  componentDidMount: function() {
    this.performSearch({ searchString: this.props.params.searchString, page: this.props.params.page });
  },

  onChange: function(data) {
    this.setState(data);
  },

  changePageAndSearch: function(params) {
    let searchString = params.searchString || this.props.params.searchString
    let section = params.section || this.props.params.section
    let page = params.page || 1

    this.performSearch({ searchString: searchString, page: page});
    this.transitionTo(`/app/search/${section}/${searchString}/${page}`);
  },

  onSearchInput: function(event) {
    this.changePageAndSearch({ searchString: event.target.value });
  },

  changeTab: function(section) {
    this.changePageAndSearch({ section: section });
  },

  changePage: function(page) {
    this.changePageAndSearch({ page: page });
  },

  displaySection: function(sectionName) {
    return this.state.data[sectionName].total > 0 &&
      (this.props.params.section == sectionName || this.props.params.section == 'all')
  },

  renderRightBar: function() {
    return (
      <div className='col-xs-3'>
        <div className='links'>
          <div className='link' onClick={ () => this.changeTab('all') }>All</div>
          <div className='link' onClick={ () => this.changeTab('products') }>Products</div>
          <div className='link' onClick={ () => this.changeTab('companies') }>Companies</div>
          <div className='link' onClick={ () => this.changeTab('tags') }>Tags</div>
        </div>
        <div className='new-product'>
          { "Can't find a product?" }
          <Link to='/app/reviews/new'>
            Add and Review It
          </Link>
        </div>
      </div>
    )
  },

  renderResults: function() {
    if(!this.displaySection('products') &&
      !this.displaySection('companies') &&
      !this.displaySection('tags')) {
      return <div className='no-results'>No Results</div>
    }

    return (
      <div className='col-xs-6'>
        <Results
          type='products'
          activeSection={this.props.params.section}
          data={this.state.data.products}
          searchTerm={this.props.params.searchString}
          changePage={this.changePage}
          currentPage={this.props.params.page} />
        <Results
          type='companies'
          activeSection={this.props.params.section}
          data={this.state.data.companies}
          searchTerm={this.props.params.searchString}
          changePage={this.changePage}
          currentPage={this.props.params.page} />
        <TagResults
          activeSection={this.props.params.section}
          data={this.state.data.tags}
          searchTerm={this.props.params.searchString} />
      </div>
    )
  },

  renderFilters: function() {
    return ( <div className='col-xs-3'></div>)
  },

  render: function() {
    return (
      <div className='search-page'>
        <div className='row'>
          <div className='col-xs-12'>
            <input
              className='search-box'
              ref='inputBox'
              defaultValue={ this.props.params.searchString }
              onChange={ this.onSearchInput } />
          </div>
        </div>
        <div className='row'>
          { this.renderRightBar() }
          { this.renderResults() }
          { this.renderFilters() }
        </div>
      </div>
    );
  }
})

export default SearchPage;
