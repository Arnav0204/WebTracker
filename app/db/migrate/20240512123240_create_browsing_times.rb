class CreateBrowsingTimes < ActiveRecord::Migration[7.1]
  def change
    create_table :browsing_times do |t|
      t.references :user, null: false, foreign_key: true
      t.string :host
      t.integer :time
      t.date :date

      t.timestamps
    end
  end
end
