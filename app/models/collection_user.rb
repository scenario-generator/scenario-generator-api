class CollectionUser < ActiveRecord::Base

  belongs_to :shared_collection, class_name: 'Collection', foreign_key: 'collection_id'
  belongs_to :sharee, class_name: 'User'

  after_create :create_notification
  after_create :send_email

  validates_uniqueness_of :collection_id, :scope => :sharee_id

  def create_notification
    Notification.create(sender: shared_collection.user,
                        user: sharee,
                        notification_type: 'share',
                        notification_subject: shared_collection)
  end

  def send_email
    ShareMailer.collection(shared_collection.user, sharee, shared_collection).deliver_now
  end

end
