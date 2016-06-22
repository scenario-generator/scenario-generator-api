class CreateSubjects < ActiveRecord::Migration
  def change
    create_table :subjects do |t|
      t.string :name
      t.string :ad_link
      t.string :old_name

      t.timestamps null: false
    end
  end
end
