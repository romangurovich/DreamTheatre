class CreateThemes < ActiveRecord::Migration
  def change
    create_table :themes do |t|
      t.string :trope

      t.timestamps
    end
  end
end
