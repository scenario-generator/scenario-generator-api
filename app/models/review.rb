class Review < ActiveRecord::Base
  belongs_to :product, touch: true
  belongs_to :user
  counter_culture :user,    column_name: 'total_reviews'
  counter_culture :product, column_name: 'total_reviews'

  has_one :company, through: :product
  has_many :attachments, as: :attachable
  has_many :tag_taggables, as: :taggable, dependent: :destroy
  has_many :tags, through: :tag_taggables
  has_many :links, dependent: :destroy
  has_many :review_votes, dependent: :destroy

  accepts_nested_attributes_for :product
  accepts_nested_attributes_for :tags
  accepts_nested_attributes_for :links, allow_destroy: true
  accepts_nested_attributes_for :attachments, allow_destroy: true

  before_save :cache_helpfulness
  after_save do
    product.save if product
  end

  def self.sorted(sort_string)
    case sort_string
    when 'low_to_high'
      order('quality_score ASC NULLS LAST, id DESC')
    when 'high_to_low'
      order('quality_score DESC NULLS LAST, id DESC')
    when 'helpful'
      order('cached_helpfulness DESC NULLS LAST, id DESC')
    when 'unhelpful'
      order('cached_helpfulness ASC NULLS LAST, id DESC')
    when 'oldest'
      order(created_at: :asc)
    else
      order(created_at: :desc)
    end
  end

  def display_date
    created_at.strftime('%b %e, %Y')
  end

  def formatted_quality_review
    (quality_review.nil? || quality_review.empty?) ? '' : ApplicationController.helpers.simple_format(quality_review)
  end

  validates :quality_score, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
  validates :price_score, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 5 }, allow_nil: true
  validates :user_id, uniqueness: { scope: :product_id }, presence: true
  validate :has_at_least_one_field

  private

  def cache_helpfulness
    self.cached_helpfulness = calculate_helpfulness
  end

  def calculate_helpfulness
    review_votes.helpful.size - review_votes.unhelpful.size
  end

  def has_at_least_one_field
    invalid_title = title.nil? || title.empty?
    invalid_quality_review = quality_review.nil? || quality_review.empty?
    invalid_quality_score = quality_score.nil?
    invalid_price_review = price_review.nil? || price_review.empty?
    invalid_price_score = price_score.nil?
    invalid_attachments = attachments.nil? || attachments.empty?
    invalid_tags = tags.nil? || tags.empty?
    invalid_links = links.nil? || links.empty?

    review_missing_field = invalid_title && invalid_quality_review && invalid_quality_score &&
                           invalid_price_review && invalid_price_score && invalid_attachments &&
                           invalid_tags && invalid_links

    if review_missing_field
      errors.add(:review, 'at least one field is required')
    end
  end
end
