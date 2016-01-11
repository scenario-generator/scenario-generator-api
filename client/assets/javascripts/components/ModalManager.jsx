import React from 'react';
import _ from 'lodash';
import { Link } from 'react-router';
import Modal from 'react-modal';
import AlertModal from './AlertModal';
import  CreateCollectionMixin from './collections/CreateCollectionMixin';
import { ShareCollectionMixin } from './collections/ShareCollectionModal';
import { AddToCollectionMixin } from './collections/AddToCollectionModal';
import { ViewCollectionMixin } from './collections/ViewCollectionModal';
import { EditCollectionMixin } from './collections/EditCollectionModal';
import { ManageCollaboratorCollectionMixin } from './collections/ManageCollaboratorCollectionModal';
import { ShareProductMixin } from './products/ShareProductModal';
import { ProductFilesMixin } from './products/ProductFilesModal';
import { ProductLinksMixin } from './products/ProductLinksModal';
import { UserListMixin } from './modals/UserListModal';

var appElement = document.getElementById('content');

Modal.setAppElement(appElement);

const ModalManager = React.createClass ({
  displayName: 'ModalManager',
  mixins: [
    CreateCollectionMixin,
    ShareCollectionMixin,
    AddToCollectionMixin,
    ViewCollectionMixin,
    EditCollectionMixin,
    ShareProductMixin,
    ProductFilesMixin,
    ProductLinksMixin,
    ManageCollaboratorCollectionMixin,
    UserListMixin,
  ],

  childContextTypes: {
    router: React.PropTypes.object
  },

  getChildContext: function() {
    return {router: this.props.router};
  },

  render: function() {
    return (
      <div>
        <AlertModal router={this.props.router} />
        { this.renderCreateCollectionModal() }
        { this.renderShareCollectionModal() }
        { this.renderAddToCollectionModal() }
        { this.renderViewCollectionModal() }
        { this.renderEditCollectionModal() }
        { this.renderShareProductModal() }
        { this.renderProductFilesModal() }
        { this.renderProductLinksModal() }
        { this.renderManageCollaboratorCollectionModal() }
        { this.renderUserListModal() }
      </div>
    )
  }
});


export default ModalManager;
