module Bootstrap
  module Filters
    [:label, :badge].each do |arg|
      proc = Proc.new do |input, cls|
        "<span class=\"#{arg.to_s}\">#{input}</span>" if cls.nil?
        "<span class=\"#{arg.to_s} #{arg.to_s}-#{cls}\">#{input}</span>"
      end
      
      send :define_method, arg do |input| proc.call input end
      [:success, :warning, :important, :info, :reverse].each do |subarg|
        method_name = ("#{arg.to_s}_#{subarg.to_s}").to_sym
        send :define_method, method_name do |input|
          proc.call input, subarg.to_s
        end
      end
    end
  end
end

Liquid::Template.register_filter(Bootstrap::Filters)