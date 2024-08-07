class CreateBlockedHosts < ActiveRecord::Migration[7.1]
  def change
    create_table :blocked_hosts do |t|
      t.references :user, null: false, foreign_key: true
      t.string :hostname

      t.timestamps
    end
  end
end
