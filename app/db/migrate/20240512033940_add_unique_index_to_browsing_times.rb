class AddUniqueIndexToBrowsingTimes < ActiveRecord::Migration[7.1]
    def change
    change_table :browsing_times do |t|
      t.index [:url, :date], unique: true
    end
  end
end
