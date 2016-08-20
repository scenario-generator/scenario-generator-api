# This is an option for it's parent.
# An option may have a column dependent on it. These are stored in the columns relation.
# It will be inserted into the generated scenario by the generator.
#
# id
# text
# created_at
# updated_at
#
class Option < ActiveRecord::Base
  belongs_to :column

  has_many :columns, as: :parent, dependent: :destroy
  has_many :option_exclusions, dependent: :destroy
  has_many :exclusion_sets, through: :option_exclusions
  has_many :excluded_options, through: :exclusion_sets, class_name: 'Option', source: :options

  alias parent column

  def self.process_child_columns(options)
    options.flat_map do |option|
      columns = option[:columns] || option.columns
      columns.process_all
    end
  end

  # We do it this way instead of like this:
  # ```
  # all_options.each do |option|
  #   all_options -= option.exclusions
  # end
  # ```
  # because the all_options used by the each is not the same as the one we remove from.
  # If the code was set up like that then every time there was an exclusion both sides of the exclusion would be
  # removed, instead of just one.
  # TODO: Refactor
  def self.without_exclusions(options)
    all_options = options
    for option_index in 0..all_options.length
      option = all_options[option_index]
      break unless option
      all_options -= option.exclusions
    end
    all_options
  end

  # If an option appears in exclusions then it cannot be included in the same column as this one.
  def exclusions
    all_exclusions = excluded_options.to_a
    all_exclusions.delete self
    all_exclusions
  end
end
