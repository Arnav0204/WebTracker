class BrowsingTimesController < ApplicationController
  before_action :authorize_request
  # POST /browsing_times
  def create
    host = params[:host]
    time = params[:time]
    date = Date.today

    # Check if a record with the same URL and date already exists
    existing_record = @current_user.browsing_times.find_by(host: host, date: date)

    if existing_record
      # Update the browsing time for the existing record
      existing_record.update!(time: existing_record.time + time)
      render json: existing_record, status: :ok
    else
      # Create a new BrowsingTime record
      browsing_time = @current_user.browsing_times.create!(host: host, time: time, date: date)
      render json: time, status: :created
    end
  end

  # GET /browsing_times/:date
   def show
    date = Date.today

    # Find all BrowsingTime records for the given date and user
    browsing_times = @current_user.browsing_times.where(date: date)

    # Calculate the total browsing time for each URL
    host_totals = browsing_times.group(:host).sum(:time)

    # Return the URL totals as JSON
    render json: host_totals
   end
end