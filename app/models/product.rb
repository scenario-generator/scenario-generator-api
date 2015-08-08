gem 'faker'

class Product < ActiveRecord::Base
  belongs_to :company
  has_many :reviews, as: :reviewable
  has_many :images, -> { with_images }, through: :reviews, source: :attachments
  has_one :default_image, class_name: 'Attachment'

  scope :recently_added, -> do
    order('created_at desc')
  end

  scope :most_popular, -> do
    order('views desc')
  end

  # TODO: use attachments
  def image
    Faker::Number.between(0, 5).odd? ? "http://lorempixel.com/960/540/technics?random=#{id}" : nil
  end

  def rating
    self.reviews.map(&:quality_score).compact.average || 0
  end

  def price
    self.reviews.map(&:price_score).compact.average || 0
  end

  def author
    Faker::Name.name
  end

  def tags
    Faker::Lorem.words(10)
  end

  def increment_views!
    self.views = self.views + 1
    self.save
  end

  validates :name, presence: true, uniqueness: { scope: :company_id }
  validates :description, presence: true
  validates :company, presence: true
end
