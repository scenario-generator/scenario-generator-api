# frozen_string_literal: true

# == Schema Information
#
# Table name: options
#
#  id         :bigint(8)        not null, primary key
#  text       :string
#  weight     :float            default(1.0)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  column_id  :integer
#
# Indexes
#
#  index_options_on_column_id  (column_id)
#

# This is an option for it's parent.
# An option may have a column dependent on it. These are stored in the columns relation.
# It will be inserted into the generated scenario by the generator.
class Option < ApplicationRecord
  belongs_to :column

  has_many :column_parents, as: :parent, dependent: :destroy
  has_many :columns, through: :column_parents, as: :parent, dependent: :destroy
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

  def self.sample_without_exclusions(total_amount = 1, allow_duplicates = false)
    options = []
    while (remaining_options = total_amount - options.length).positive?
      new_options = all.weighted_sample(remaining_options)
      options = merge_without_exclusions(options, new_options, allow_duplicates)
    end
    options
  end

  def self.merge_without_exclusions(options, new_options, allow_duplicates)
    Option.without_exclusions(options + new_options).tap do |merged_options|
      merged_options.uniq! unless allow_duplicates
    end
  end

  def self.weighted_sample(amount = 1)
    option_weight_hash = all.map { |option| [option, option.weight] }.to_h
    WeightedRandomizer.new(option_weight_hash).sample(amount)
  end

  # We're building up a list of options so that we don't included
  # any two options that appear in the same exclusion set.
  # So we create a new list of options by iterating over each option
  # and adding it to the list if it doesn't conflict with anything already in
  # the list
  # Probably a better way to do this in SQL.
  def self.without_exclusions(options)
    [].tap do |filtered_options|
      options.each do |option|
        filtered_options << option if (filtered_options & option.exclusions).empty?
      end
    end
  end

  # If an option appears in exclusions then it cannot be included in the same column as this one.
  def exclusions
    excluded_options.where.not(id: id)
  end

  def search_for_generator
    column_search_result = column.search_for_generator
    return column_search_result if column_search_result.class == Generator

    false
  end
end
