# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2024_05_12_123240) do
  create_table "blocked_hosts", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "hostname"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_blocked_hosts_on_user_id"
  end

  create_table "blocked_websites", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_blocked_websites_on_user_id"
  end

  create_table "browsing_times", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "host"
    t.integer "time"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_browsing_times_on_user_id"
  end

  create_table "browsing_times_with_users", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "host"
    t.integer "time"
    t.date "date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_browsing_times_with_users_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "name"
    t.string "username"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "blocked_hosts", "users"
  add_foreign_key "blocked_websites", "users"
  add_foreign_key "browsing_times", "users"
  add_foreign_key "browsing_times_with_users", "users"
end
