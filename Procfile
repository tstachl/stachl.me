web:    bundle exec jekyll --server $PORT
worker: bundle exec rake resque:work QUEUE=*
cron:   bundle exec clockwork clock.rb
