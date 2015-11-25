json.extract! @user,  :id, :name, :department, :job_title,
                      :avatar_url, :location, :total_reviews,
                      :total_attachments, :tags, :total_products

json.collections @user.collections.visible(current_user), partial: 'api/collections/collection', as: :collection