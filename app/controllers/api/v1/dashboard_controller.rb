class Api::V1::DashboardController < AppController
  respond_to :json

  def index
    ids = JSON.parse(params[:ids]) if params[:ids]
    @dashboard = Fletcher::Dashboard.new(current_user, ids, params)

    respond_to do |format|
      format.json { render }
    end
  end
end