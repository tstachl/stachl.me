module Jobs
  @queue = :job
  
  def self.perform(job)
    system "bundle exec rake #{job}"
    puts "Did #{job}"
  end
end