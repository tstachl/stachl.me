require 'clockwork'
require 'resque'
require './jobs'

include Clockwork
uri = URI.parse ENV['REDISTOGO_URL']
Resque.redis = Redis.new(:host => uri.host, :port => uri.port, :password => uri.password)

handler do |job|
  Resque.enqueue(Jobs, job)
  puts "Enqueued #{job}"
end

every(1.hour, 'rebuild')