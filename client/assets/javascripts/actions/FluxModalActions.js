import alt from '../FluxAlt';
import _ from 'lodash';
import CollectionAPI from '../utils/api/CollectionAPI';
import FluxNotificationsActions from './FluxNotificationsActions'

class FluxModalActions {
  setVisibleModal(modal, currentPosition) {
    $(window).scrollTop(0);
    $('body').addClass('no-scroll');
    this.dispatch({modal: modal, height: currentPosition});
  }

  closeModal() {
    this.dispatch(null);
    $('body').removeClass('no-scroll');
  }
}

export default alt.createActions(FluxModalActions);
