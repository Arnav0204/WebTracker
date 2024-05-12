class BlockedHostsController < ApplicationController
  before_action :authorize_request
  # GET /blocked_hosts
  def index
    @blocked_hosts = @current_user.blocked_hosts
    render json: @blocked_hosts
  end

  # POST /blocked_hosts
  def create
    @blocked_host = @current_user.blocked_hosts.new(blocked_host_params)

    if @blocked_host.save
      render json: @blocked_host, status: :created
    else
      render json: @blocked_host.errors, status: :unprocessable_entity
    end
  end

  # DELETE /blocked_hosts/:id
  def destroy
    @blocked_host = @current_user.blocked_hosts.find(params[:id])
    @blocked_host.destroy

    render json: { message: 'Blocked host deleted' }
  end

  private

  def blocked_host_params
    params.require(:blocked_host).permit(:hostname)
  end
end