import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import timeago from 'timeago';
import dateutil from 'date-util';
import Rating from '../Rating';
import PriceRating from '../PriceRating';
import TextHelper from '../../utils/helpers/TextHelper';

const ReviewBox = React.createClass ({
  displayName: 'ReviewBox',

  contextTypes: {
    router: React.PropTypes.object
  },

  getDefaultProps: function getDefaultProps() {
    return {
      size: 1,
      editable: false,
      product: {
      showReadMore: false,
        company: {}
      }
    }
  },

  formatActivityType: function() {
    if (_.isFunction(this.props.onFormatActivityType)) {
      return this.props.onFormatActivityType(this.props);
    } else {
      return (
        <span>
          Review added {this.props.created_at ? new Date(this.props.created_at).format('mmm dd') : ''}
        </span>
      );
    }
  },

  render: function() {
    let product = this.props.product;
    let company = product.company;

    let boxSize = this.props.size;
    let boxClass = `box-${boxSize} no-pic-box`;
    let classes = _.compact(['product', 'review-box', boxClass]).join(' ');

    let quality_review = TextHelper.truncate(this.props.quality_review, 150);
    let editable = this.props.editable;
    let showReadMore = this.props.showReadMore;

    let attachments = this.props.attachments.length;
    let links = this.props.links.length;
    let tags = this.props.tags.length;

    return (<div className={classes}>
      <div className='content'>
        <div className='data'>

          <div className='details'>
            <div className="header">
              <div className='activity-type'>
                {this.formatActivityType()}
              </div>
              <h3 className='title'><a href={`/app/products/${product.id}/${product.slug}`}>{product.name}</a></h3>
              <h4 className='company'><a href={`/app/companies/${company.id}/${company.slug}`} >{company.name}</a></h4>
            </div>

            <div className='review'>
              <div className='rating'>
                <Rating value={this.props.quality_score} name='rating'/>
                { this.props.small ? '' : <PriceRating value={this.props.price_score} name='rating'/> }
              </div>

              { this.props.small ? '' :
                <div>
                  <h3 className='title'>{this.props.title}</h3>
                  <p className='description'>
                    { editable && _.isEmpty(quality_review) ?
                      <span className='message'>Click Edit to add a review</span> :
                      quality_review
                     }
                  </p>

                  { attachments > 0 ? <p className='item attachments'> {attachments} attachment(s) </p> : ''}
                  { links > 0 ? <p className='item links'> {links} link(s) </p> : ''}
                  { tags > 0 ? <p className='item tags'> {tags} tag(s) </p> : ''}
                </div>
              }
            </div>
          </div>

          { this.props.small ? '' :
            <div>
              <div className='read-more-container'>
                {
                  showReadMore ?
                  <a href={`/app/products/${this.props.product.id}/${this.props.product.slug}`} className='link'>
                    <span className='icon-edit-review'>Read more</span>
                  </a> : ''
                }
              </div>

              <div className='footer'>
                {
                  editable ?
                  <a href={`/app/products/${this.props.product.id}/${this.props.product.slug}/reviews/${this.props.id}`} className='btn btn-round'>
                    <span className='icon-edit-review'>Edit</span>
                  </a> :
                  <span className='created_at'>{timeago(this.props.created_at)}</span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>);
  }
})

export default ReviewBox;
