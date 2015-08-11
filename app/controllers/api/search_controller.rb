module Api
  class SearchController < AppController
    respond_to :json

    def index
      @results = Fletcher::Search.new(params[:search]).results

      respond_to do |format|
        format.json { render }
      end
    end

  end
end