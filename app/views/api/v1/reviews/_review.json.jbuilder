json.extract! review, :id, :title, :quality_review, :quality_score,
                      :price_review, :price_score, :attachments, :links,
                      :created_at, :updated_at, :tags, :product,
                      :review_votes, :helpful_votes, :total_votes, :display_date

json.attachments review.attachments, partial: 'api/v1/attachments/attachment', as: :attachment

json.formatted_price_review (review.price_review.nil? or review.price_review.empty?) ? "" : simple_format(review.price_review)
json.formatted_quality_review (review.quality_review.nil? or review.quality_review.empty?) ? "" : simple_format(review.quality_review)

json.user do
  json.(review.user, :id, :name, :job_title, :department, :avatar_url, :location, :total_reviews)
end unless review.user.nil?