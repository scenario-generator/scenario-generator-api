import React from 'react/addons';
const ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
import _ from 'lodash';
import ProductBox from './ProductBox';
import SectionRow from './SectionRow';
import Section from './Section';

function sumSizeFunc(item) {
  return item.props.size;
}

class RecentlyAddedSection extends React.Component {
  constructor() {
    super();

    this._offset = 0;
    this._rows = 2;
  }

  getOffset() {
    return this._offset;
  }

  getMax() {
    // TODO: add smart method to calculate
    return 8;
  }

  getCurrentBoxSize(products, product) {
    let gridSize = this.props.cols;
    let boxSize = gridSize - 1;
    let countBoxSizes = _.countBy(_.map(products, 'props.size'));

    if (products.length > 0) {
      boxSize = _.min([_.last(products).props.size, gridSize - (_.last(products).props.size || 0)]);
      if (countBoxSizes[boxSize] >= gridSize || countBoxSizes[boxSize] * boxSize >= gridSize) {
        boxSize = _.max([0, boxSize - 1]);
      }
    } else if (!product.image) {
      boxSize = _.max([0, boxSize - 1]);
    }

    return boxSize === 0 ? 0.5 : boxSize;
  }

  buildRows(products) {
    let sectionRows = [];
    let row;

    while (products.length > 0) {
      row = _.last(sectionRows);

      if (!row || _.sum(row, sumSizeFunc) >= this.props.cols) {
        row = [];
        sectionRows.push(row);
      }

      row.push(products.shift());
    }

    return sectionRows.map(function mapRows(sectionRow) {
      return (<SectionRow items={sectionRow}/>);
    });
  }

  fetchItems() {
    let product;
    let products = [];
    let hasItems;
    let needsItem;
    let sumItems;
    let currentItem = 0;

    if (!this.props.items) return [];

    do {
      product = this.props.items[currentItem++];

      products.push(<ProductBox size={this.getCurrentBoxSize(products, product)} {...product} />);

      hasItems = this.props.items.length > currentItem;
      sumItems = _.sum(products, sumSizeFunc);
      needsItem = sumItems < this._rows * this.props.cols;
    } while (hasItems && needsItem);

    this._offset += currentItem;
    return this.buildRows(products);
  }

  render() {
    debugger;
    return (<Section {...this.props}>
      <ReactCSSTransitionGroup transitionName="section-row">
        {this.fetchItems()}
      </ReactCSSTransitionGroup >
    </Section>);
  }
}

RecentlyAddedSection.displayName = 'RecentlyAddedSection';

RecentlyAddedSection.defaultProps = {
  cols: 4,
  rows: 2,
  title: 'Recently Added Products'
};

RecentlyAddedSection.propTypes = {
  cols: React.PropTypes.number.isRequired,
  items: React.PropTypes.array.isRequired,
  title: React.PropTypes.string.isRequired,
  itemsClass: React.PropTypes.string
};

export default RecentlyAddedSection;
