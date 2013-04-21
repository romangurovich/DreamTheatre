class CreateDreams < ActiveRecord::Migration
  def change
    create_table :dreams do |t|
      t.text :blurb

      t.timestamps
    end
  end
end
