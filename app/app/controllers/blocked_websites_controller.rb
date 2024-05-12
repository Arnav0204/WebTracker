# app/controllers/blocked_websites_controller.rb
class BlockedWebsitesController < ApplicationController
  before_action :authorize_request

  # GET /blocked_websites
  def index
    @blocked_websites = @current_user.blocked_websites
    render json: @blocked_websites
  end

  # POST /blocked_websites
  def create
    @blocked_website = @current_user.blocked_websites.new(blocked_website_params)
    if @blocked_website.save
      render json: @blocked_website, status: :created
    else
      render json: @blocked_website.errors, status: :unprocessable_entity
    end
  end

  # DELETE /blocked_websites/:id
  def destroy
    @blocked_website = current_user.blocked_websites.find(params[:id])
    @blocked_website.destroy
    head :no_content
  end

  private

  def blocked_website_params
    params.require(:blocked_website).permit(:url)
  end
end
