require 'pathname'
require 'forwardable'
require 'mime/types'
require 'digest/md5'
require 'pp'

class S3Website
  class Item
    attr_reader :key, :hash, :mime_type, :max_age

    def initialize(key, hash, mime_type, max_age)
      @key = key
      @hash = hash
      @mime_type = mime_type
      @max_age = max_age
    end

    def ==(o)
      o.key == self.key &&
          o.hash == self.hash &&
          o.mime_type == self.mime_type &&
          o.max_age == self.max_age
    end
  end

  class ItemSet
    include Enumerable
    extend Forwardable

    attr_reader :items

    def_delegators :@items, :each, :<<

    def initialize(items)
      @items = items
    end

    def missing(other)
      self_keys = Set.new(self.items.collect(&:key))
      other_keys = Set.new(other.items.collect(&:key))

      difference = self_keys.difference(other_keys)

      ItemSet.new(self.items.select {|i| difference.include?(i.key)})
    end

    def different(other)
      self_keys = Set.new(self.items.collect(&:key))
      other_keys = Set.new(other.items.collect(&:key))

      intersection = self_keys.intersection(other_keys)
      modified = intersection.reject do |key|
        self_item = self.items.find {|i| i.key == key}
        other_item = other.items.find {|i| i.key == key}

        self_item == other_item
      end

      ItemSet.new(self.items.select {|i| modified.include?(i.key)})
    end
  end

  class DirectorySource
    def initialize(path)
      @source = Pathname.new(path)
    end

    def traverse(&block)
      @source.find
          .select {|e| e.file?}
          .collect {|e| block.call(e.to_s)}
    end
  end

  class BucketDestination
    def initialize(bucket, region)
      @destination = Aws::S3::Resource.new(region: region).bucket(bucket)
    end

    def traverse(&block)
      @destination.objects
          .collect {|o| block.call(o)}
    end
  end

  def initialize(configuration)
    @configuration = configuration
    @s3 = Aws::S3::Resource.new(region: configuration[:region])
  end

  def publish_from(directory)
    source_item_set = directory_item_set_for(directory)
    destination_item_set = bucket_item_set_for(
        @configuration[:bucket],
        @configuration[:region])

    added = source_item_set.missing(destination_item_set)
    modified = source_item_set.different(destination_item_set)
    removed = destination_item_set.missing(source_item_set)

    bucket = @s3.bucket(@configuration[:bucket])
    added.each do |entry|
      bucket.put_object(
          key: entry.key,
          body: File.read(File.join(directory, entry.key)),
          content_type: entry.mime_type,
          cache_control: "max-age=#{entry.max_age}")
    end
    modified.each do |entry|
      bucket.put_object(
          key: entry.key,
          body: File.read(File.join(directory, entry.key)),
          content_type: entry.mime_type,
          cache_control: "max-age=#{entry.max_age}")
      # invalidate
    end
    removed.each do |entry|
      bucket.delete_objects(
          delete: {
              objects: [{key: entry.key}]
          })
      # invalidate
    end
  end

  private

  def directory_item_set_for(directory)
    items = DirectorySource.new(directory)
                .traverse do |f|
      Item.new(
          Pathname.new(f).relative_path_from(Pathname.new(directory)).to_s,
          md5_hash_for(f),
          mime_type_for(f),
          max_age_for(f))
    end

    ItemSet.new(items)
  end

  def bucket_item_set_for(bucket, region)
    items = BucketDestination.new(bucket, region)
                .traverse do |o|
      Item.new(
          o.key,
          o.etag.gsub('"', ''),
          o.get.content_type,
          o.get.cache_control && o.get.cache_control.gsub('max-age=', '').to_i)
    end

    ItemSet.new(items)
  end

  def md5_hash_for(f)
    Digest::MD5.file(f).to_s
  end

  def mime_type_for(f)
    MIME::Types.type_for(f).first.simplified
  end

  def max_age_for(f)
    @configuration[:max_ages][mime_type_for(f)]
  end
end
