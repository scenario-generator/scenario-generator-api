import React from 'react';
import _ from 'lodash';
import { Link, Navigation } from 'react-router';
import CollectionBox from './CollectionBox';
import Modal from 'react-modal';
import CollectionStore from '../../stores/CollectionStore';
import FluxAlertActions from '../../actions/FluxAlertActions';
import FluxCollectionActions from '../../actions/FluxCollectionActions';
import FluxNotificationsActions from '../../actions/FluxNotificationsActions'
import ProductName from '../reviews/ProductName'
import Results from '../search/Results'
import { CollectionShareMixin } from './CollectionShareModal'

var appElement = document.getElementById('content');

Modal.setAppElement(appElement);
Modal.injectCSS();

const CollectionMixin = {
  mixins: [ CollectionShareMixin ],

  renderCollectionModal: function() {
    return (
      <div>
        <CollectionModal
          ref='collectionModal'
          visible={this.collectionModalVisible()}
          show={this.showCollectionModal}
          close={this.closeCollectionModal}
          onSaveCollection={this.onSaveCollection} />
        {this.renderCollectionShareModal()}
      </div>
    )
  },

  collectionModalVisible: function() {
    return this.state && this.state.showCollectionModal
  },

  closeCollectionModal: function() {
    this.setState({showCollectionModal: false})
    if(!(this.props.route && this.props.route.name == "CollectionPage")) {
      FluxCollectionActions.clearCollection();
    }
  },

  showCollectionModal: function() {
    this.setState({showCollectionModal: true})
  },

  showCollectionModalWithProduct: function(product) {
    FluxCollectionActions.fetchedCollection({
      title: '', description: '', products: [product]
    });
    this.showCollectionModal()
  },

  showCollectionModalForEditing: function(collection) {
    FluxCollectionActions.fetchedCollection(collection);
    this.showCollectionModal()
  },

  onSaveCollection: function(collection, resolve) {
    let _this = this;
    if(collection.id) {
      FluxCollectionActions.updateCollection(collection.id, collection, resolve)
    } else {
      FluxCollectionActions.createCollection(collection, function(collection) {
        resolve();

        // Show an alert after saving that asks the user whether they want to share the collection or not.
        FluxAlertActions.showAlert({
          title: 'Your Collection was successfully created!',
          message: 'You can privately share this Collection with other users in Fletcher, or make it available to everyone by making it public.',
          success: 'Share',
          cancel: 'Not now',
          successCallback: function() {
            _this.showCollectionShareModal(collection)
          }
        })
      })
    }
  }
};

const CollectionModal = React.createClass ({
  displayName: 'CollectionModal',

  getInitialState: function() {
    return {
      data: {
        collection: {
          title: '',
          description: '',
          products: []
        }
      }
    }
  },

  componentDidMount: function() {
    CollectionStore.listen(this.onChange);
  },

  onChange: function(data) {
    this.setState(data);
  },

  clearCollection: function() {
    this.setState(this.getInitialState());
  },

  close: function() {
    this.props.close()
  },

  onFocus: function(e) {
    $(React.findDOMNode(this.refs.fields_container)).addClass('focus')
  },

  onBlur: function(e) {
    $(React.findDOMNode(this.refs.fields_container)).removeClass('focus')
  },

  getProductIDs: function() {
    return _.map(this.state.data.collection.products, function(product) {
      return product.id
    })
  },

  removeProduct: function(product_id) {
    let products = this.state.data.collection.products.filter(function(product) {
      return product.id !== product_id;
    });

    let data = this.state.data
    data.collection.products = products

    this.setState({product_name: null, data: data})
  },

  addProduct: function(product, selected) {
    if(selected) {
      let newProducts = this.state.data.collection.products
      newProducts.push(product)
      this.setState({product_name: null, collection: {products: newProducts}})
    } else {
      this.setState({product_name: product.name})
    }
  },

  submitForm: function(e) {
    e.preventDefault()
    let _this = this

    let collection = {
      id: this.state.data.collection.id,
      title: this.state.data.collection.title,
      description: this.state.data.collection.description,
      privacy: e.currentTarget.dataset.privacy,
      products: this.getProductIDs()
    }

    this.props.onSaveCollection(collection, function() {
      _this.close(_this)

      FluxNotificationsActions.showNotification({
        type: 'collection',
        subject: {
          id: collection.id,
          type: 'Collection',
          name: collection.title
        }
      })
    })
  },

  onChangeField: function(name, e) {
    let hash = this.state.data.collection;
    hash[name] = e.currentTarget.value
    this.setState({
      data: {
        collection: hash
      }
    })
  },

  renderTextFields: function() {
    return (
      <div className='form-group attached-fields' ref='fields_container'>
        <input  type='text'
                className='form-control'
                placeholder='Title'
                name='collection[title]'
                ref='collection_title'
                value={this.state.data.collection.title}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
                onChange={(e) => this.onChangeField('title', e)} />
        <textarea type='text'
                  className='form-control'
                  placeholder='Say something'
                  name='collection[description]'
                  rows='10'
                  ref='collection_description'
                  value={this.state.data.collection.description}
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                  onChange={(e) => this.onChangeField('description', e)} />
      </div>
    )
  },

  renderProductTypeahead: function() {
    return (
      <ProductName  ref='product_name'
                    value={this.state.product_name}
                    helpMessage={'Add Product'}
                    hideLabel={true}
                    onSetProduct={this.addProduct} />
    )
  },

  renderProducts: function() {
    return (
      <Results
        type='collection-product'
        onRemove={this.removeProduct}
        data={{data: this.state.data.collection.products}} />
    )
  },

  buttonsDisabled: function() {
    return !(this.state.data.collection.title.length > 0 &&
             this.state.data.collection.description.length > 0 &&
             this.state.data.collection.products.length > 0)
  },

  updating: function() {
    return !!this.state.data.collection.id
  },

  renderSubmissionButtons: function() {
    let disabled = this.buttonsDisabled()
    if(this.updating()) {
      return (
        <div className='buttons'>
          <button className='btn btn-red btn-round'
                  onClick={this.submitForm}
                  data-privacy={this.state.data.collection.privacy}
                  disabled={disabled}>Update</button>
        </div>
      )
    } else {
      return (
        <div className='buttons'>
          <button className='btn btn-red btn-round'
                  onClick={this.submitForm}
                  data-privacy='hidden'
                  disabled={disabled}>Create Collection</button>
        </div>
      )
    }
  },

  renderCollectionForm: function() {
    return (
      <div className='row'>
        <form className='col-xs-10 col-xs-offset-1 form collection'
              ref='collection_form'>
          {this.renderTextFields()}
          {this.renderProductTypeahead()}
          {this.renderProducts()}
          {this.renderSubmissionButtons()}
        </form>
      </div>
    )
  },

  render: function() {
    return (
      <Modal
        isOpen={this.props.visible}>
        <div className='header'>
          <span className='title'>
            {this.updating() ? 'Update' : 'Create'} Collection
          </span>
          <span onClick={this.close} className='close'>x</span>
        </div>
        {this.renderCollectionForm()}
      </Modal>
    )
  }
});

module.exports = {
  CollectionMixin: CollectionMixin,
  CollectionModal: CollectionModal
};
