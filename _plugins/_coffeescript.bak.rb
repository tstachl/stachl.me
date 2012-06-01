require 'coffee-script'

module Jekyll
  module CoffeeScript
    class CoffeeScriptFile < Jekyll::StaticFile
      
      # Obtain destination path.
      #   +dest+ is the String path to the destination dir
      #
      # Returns destination file path.
      def destination(dest)
        File.join(dest, @dir, @name.sub(/coffee$/, 'js'))
      end
      
      # Convert the CoffeeScript file into a js file.
      #   +dest+ is the String path to the destination dir
      #
      # Returns false if the file was not modified since last time (no-op).
      def write(dest)
        dest_path = destination(dest)
        
        return false if File.exist? dest_path and !modified?
        @@mtimes[path] = mtime
        
        FileUtils.mkdir_p(File.dirname(dest_path))
        begin
          content = ::CoffeeScript.compile File.read(path)
          File.open(dest_path, 'w') do |f|
            f.write(content)
          end
        rescue => e
          STDERR.puts "CoffeScript Exception: #{e.message}"
        end
        
        true
      end
    end

    class CoffeeScriptGenerator < Jekyll::Generator
      safe true
      
      # Jekyll will have already added the *.less files as Jekyll::StaticFile
      # objects to the static_files array.  Here we replace those with a
      # CoffeeScriptFile object.
      def generate(site)
        # site.static_files.clone.each do |sf|
        #   if sf.kind_of?(Jekyll::StaticFile) && sf.path =~ /\.coffee$/
        #     site.static_files.delete(sf)
        #     if sf.path.include?('bootstrap.coffee')
        #       name = File.basename(sf.path)
        #       destination = File.dirname(sf.path).sub(site.source, '')
        #       site.static_files << CoffeeScriptFile.new(site, site.source, destination, name)
        #     end
        #   end
        # end
      end
    end
  end
end