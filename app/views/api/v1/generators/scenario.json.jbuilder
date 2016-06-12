json.generator do
  json.(@generator, :id, :name)
  json.subject do
    json.(@generator.subject, :id, :name, :ad_link)
  end
end

json.scenario do
  json.columns @scenario, partial: 'api/v1/scenarios/column', as: :column
end