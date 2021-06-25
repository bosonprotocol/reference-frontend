require 'git'
require 'confidante'
require 'rake_fly'
require 'rake_terraform'
require 'ruby_terraform/output'
require 'aws-sdk'
require 'securerandom'
require 'mime/types'

require_relative 'lib/s3_website'

configuration = Confidante.configuration

configuration.non_standard_mime_types.each do |mime_type, extensions|
  MIME::Types.add(MIME::Type.new(mime_type.to_s) { |m|
    m.extensions = extensions
  })
end

RakeFly.define_installation_tasks(version: '6.7.2')
RakeTerraform.define_installation_tasks(
  path: File.join(Dir.pwd, 'vendor', 'terraform'),
  version: '0.15.4')

task :default => [
  :build_fix,
  :test
]

task :build => [
  :"app:lint",
  :"app:format",
  :"tests:lint",
  :"tests:format"
]

task :build_fix => [
  :"app:lint_fix",
  :"app:format_fix",
  :"tests:lint_fix",
  :"tests:format_fix"
]

task :test => [:'tests:unit']

namespace :secrets do
  desc 'Check if secrets are readable'
  task :check do
    if File.exist?('config/secrets')
      puts 'Checking if secrets are accessible.'
      unless File.read('config/secrets/.unlocked').strip == "true"
        raise RuntimeError, Paint['Cannot access secrets.', :red]
      end
      puts 'Secrets accessible. Continuing.'
    end
  end

  desc 'Unlock secrets'
  task :unlock do
    if File.exist?('config/secrets')
      puts 'Unlocking secrets.'
      sh('git crypt unlock')
    end
  end
end

namespace :bootstrap do
  RakeTerraform.define_command_tasks(
    configuration_name: 'bootstrap',
    argument_names: [
      :deployment_type,
      :deployment_label
    ]
  ) do |t, args|
    configuration = configuration
      .for_scope(args.to_h.merge(role: 'bootstrap'))

    vars = configuration.vars
    deployment_identifier = configuration.deployment_identifier

    t.source_directory = 'infra/bootstrap'
    t.work_directory = 'build'

    t.state_file = File.join(
      Dir.pwd, "state/bootstrap/#{deployment_identifier}.tfstate")
    t.vars = vars
  end
end

namespace :website do
  RakeTerraform.define_command_tasks(
    configuration_name: 'website',
    argument_names: [
      :deployment_type,
      :deployment_label
    ]
  ) do |t, args|
    configuration = configuration
      .for_scope(args.to_h.merge(role: 'website'))

    t.source_directory = 'infra/website'
    t.work_directory = 'build'

    t.backend_config = configuration.backend_config
    t.vars = configuration.vars
  end
end

namespace :dependencies do
  desc 'Fetch dependencies'
  task :install do
    sh('npm', 'install')
  end
end

namespace :app do
  desc 'Clean built content'
  task :clean do
    rm_rf 'src/dist'
    rm_rf 'build/content'
  end

  desc "Lint all app sources"
  task :lint => [:'dependencies:install'] do
    sh('npm', 'run', 'app:lint')
  end

  desc "Lint & fix all app source"
  task :lint_fix => [:'dependencies:install'] do
    sh('npm', 'run', 'app:lint-fix')
  end

  desc "Format all app sources"
  task :format => [:'dependencies:install'] do
    sh('npm', 'run', 'app:format')
  end

  desc "Format & fix all app sources"
  task :format_fix => [:'dependencies:install'] do
    sh('npm', 'run', 'app:format-fix')
  end

  desc "Run the app as a local process"
  task :run => [:'dependencies:install'] do
    configuration = configuration
      .for_scope(
        deployment_type: 'local',
        deployment_label: 'development',
        role: 'local-app'
      )

    environment = configuration
      .environment
      .map { |k, v| [k.to_s, v] }
      .to_h

    sh(environment, 'npm', 'run', 'start')
  end

  desc 'Build content for deployment identifier'
  task :build, [
      :deployment_type,
      :deployment_label
    ] => [:'dependencies:install'] do |_, args|
      default_deployment_identifier(args)

      configuration = configuration.for_scope(args.to_h)

      environment = configuration.environment
      content_work_directory = configuration.content_work_directory
      react_app_backend_base_url = configuration.react_app_backend_base_url

      sh({
           "NODE_ENV" => environment,
           "REACT_APP_BACKEND_BASE_URL" => react_app_backend_base_url
           "REACT_APP_FRONT_END_LOCALSTORAGE_VERSION" => 1.0
           "CONTENT_WORK_DIRECTORY" => content_work_directory
           "GENERATE_SOURCEMAP" => false
         }, "npm", "run",
         "build")
  end

  desc 'Publish content for deployment identifier'
  task :publish, [
    :deployment_type,
    :deployment_label
  ] do |_, args|
    configuration = configuration
      .for_scope(args.to_h.merge(role: 'website'))

    region = configuration.region
    max_ages = configuration.max_ages
    content_work_directory = configuration.content_work_directory
    bucket = configuration.website_bucket_name

    s3sync = S3Website.new(
      region: region,
      bucket: bucket,
      max_ages: max_ages)

    s3sync.publish_from(content_work_directory)
  end

  desc 'Invalidate content caches for deployment identifier'
  task :invalidate, [
    :deployment_type,
    :deployment_label
  ] => [:'terraform:ensure'] do |_, args|
    configuration = configuration
      .for_scope(args.to_h.merge(role: 'website'))

    region = configuration.region
    backend_config = configuration.backend_config

    distribution_id = JSON.parse(
      RubyTerraform::Output.for(
        name: 'cdn_id',
        source_directory: 'infra/website',
        work_directory: 'build',
        backend_config: backend_config))

    cloudfront = Aws::CloudFront::Client.new(region: region)

    cloudfront.create_invalidation(
      distribution_id: distribution_id,
      invalidation_batch: {
        caller_reference: SecureRandom.uuid,
        paths: {
          quantity: 1,
          items: ['/*'],
        }
      })
  end

  desc 'Deploy content'
  task :deploy, [
    :deployment_type,
    :deployment_label
  ] => [:'terraform:ensure'] do |_, args|
    Rake::Task['app:build'].invoke(*args)
    Rake::Task['app:publish'].invoke(*args)
    Rake::Task['app:invalidate'].invoke(*args)
  end
end

namespace :tests do
  desc "Lint all tests"
  task :lint => [:'dependencies:install'] do
    sh('npm', 'run', 'tests:lint')
  end

  desc "Lint & fix all tests"
  task :lint_fix => [:'dependencies:install'] do
    sh('npm', 'run', 'tests:lint-fix')
  end

  desc "Format all test files"
  task :format => [:'dependencies:install'] do
    sh('npm', 'run', 'tests:format')
  end

  desc "Format & fix all test files"
  task :format_fix => [:'dependencies:install'] do
    sh('npm', 'run', 'tests:format-fix')
  end

  desc "Run all unit tests"
  task :unit => [:'dependencies:install'] do
    script_name = ENV["INCLUDE_COVERAGE"] == 'true' ?
      'tests:unit:coverage' :
      'tests:unit'
    sh('npm', 'run', script_name)
  end

  namespace :coverage do
    desc "Run coverage badge creation"
    task :badge => [:'dependencies:install'] do
      sh('npm', 'run', 'tests:coverage:badge')
    end
  end
end

namespace :ci do
  RakeFly.define_authentication_tasks(
    namespace: :authentication,
    argument_names: [
      :ci_deployment_type,
      :ci_deployment_label
    ]) do |t, args|
    configuration = configuration
      .for_scope(args.to_h)

    t.target = configuration.concourse_team
    t.concourse_url = configuration.concourse_url
    t.team = configuration.concourse_team
    t.username = configuration.concourse_username
    t.password = configuration.concourse_password

    t.home_directory = 'build/fly'
  end

  namespace :pipeline do
    RakeFly.define_pipeline_tasks(
      namespace: :develop,
      argument_names: [
        :ci_deployment_type,
        :ci_deployment_label
      ]
    ) do |t, args|
      configuration = configuration
        .for_scope(args.to_h.merge(role: 'develop-pipeline'))
      ci_deployment_type = configuration.ci_deployment_identifier

      t.target = configuration.concourse_team
      t.team = configuration.concourse_team
      t.pipeline = "reference-frontend-develop"

      t.config = 'pipelines/develop/pipeline.yaml'

      t.vars = configuration.vars
      t.var_files = [
        'config/secrets/pipeline/constants.yaml',
        "config/secrets/pipeline/#{ci_deployment_type}.yaml"
      ]

      t.non_interactive = true
      t.home_directory = 'build/fly'
    end

    RakeFly.define_pipeline_tasks(
      namespace: :demo,
      argument_names: [
        :ci_deployment_type,
        :ci_deployment_label
      ]
    ) do |t, args|
      configuration = configuration
        .for_scope(args.to_h.merge(role: 'demo-pipeline'))
      ci_deployment_type = configuration.ci_deployment_identifier

      t.target = configuration.concourse_team
      t.team = configuration.concourse_team
      t.pipeline = "reference-frontend-demo"

      t.config = 'pipelines/demo/pipeline.yaml'

      t.vars = configuration.vars
      t.var_files = [
        'config/secrets/pipeline/constants.yaml',
        "config/secrets/pipeline/#{ci_deployment_type}.yaml"
      ]

      t.non_interactive = true
      t.home_directory = 'build/fly'
    end

    RakeFly.define_pipeline_tasks(
      namespace: :builder,
      argument_names: [
        :ci_deployment_type,
        :ci_deployment_label]
    ) do |t, args|
      configuration = configuration
        .for_scope(args.to_h.merge(role: 'builder-pipeline'))
      ci_deployment_type = configuration.ci_deployment_identifier

      t.target = configuration.concourse_team
      t.team = configuration.concourse_team
      t.pipeline = "reference-frontend-builder"

      t.config = 'pipelines/builder/pipeline.yaml'

      t.vars = configuration.vars
      t.var_files = [
        'config/secrets/pipeline/constants.yaml',
        "config/secrets/pipeline/#{ci_deployment_type}.yaml"
      ]

      t.non_interactive = true
      t.home_directory = 'build/fly'
    end

    namespace :pr do
      RakeFly.define_pipeline_tasks(
        argument_names: [
          :ci_deployment_type,
          :ci_deployment_label,
          :branch
        ]
      ) do |t, args|
        branch = args.branch || pr_metadata_branch

        configuration = configuration
          .for_scope(args.to_h.merge(role: 'pr-pipeline'))
          .for_overrides(source_repository_branch: branch)

        ci_deployment_type = configuration.ci_deployment_identifier

        t.target = configuration.concourse_team
        t.team = configuration.concourse_team
        t.pipeline = "reference-frontend-pr-#{to_pipeline_name(branch)}"

        t.config = 'pipelines/pr/pipeline.yaml'

        t.vars = configuration.vars
        t.var_files = [
          'config/secrets/pipeline/constants.yaml',
          "config/secrets/pipeline/#{ci_deployment_type}.yaml"
        ]

        t.non_interactive = true
        t.home_directory = 'build/fly'
      end

      task :handle, [
        :ci_deployment_type,
        :ci_deployment_label,
        :branch,
        :state
      ] do |_, args|
        branch = args.branch || pr_metadata_branch
        state = args.state || pr_metadata_state

        if state == "OPEN"
          Rake::Task[:"ci:pipeline:pr:push"].invoke(
            args.ci_deployment_type,
            args.ci_deployment_label,
            branch)
        else
          Rake::Task[:"ci:pipeline:pr:destroy"].invoke(
            args.ci_deployment_type,
            args.ci_deployment_label,
            branch)
        end
      end
    end
  end

  namespace :pipelines do
    desc "Push all pipelines"
    task :push, [:ci_deployment_type, :ci_deployment_label] do |_, args|
      Rake::Task[:"ci:pipeline:develop:push"].invoke(*args)
      Rake::Task[:"ci:pipeline:demo:push"].invoke(*args)
      Rake::Task[:"ci:pipeline:builder:push"].invoke(*args)
    end
  end
end

def pr_metadata_value(key)
  File.exist?(".git/resource/#{key}") ?
    File.read(".git/resource/#{key}") :
    nil
end

def pr_metadata_branch
  pr_metadata_value("head_name")
end

def pr_metadata_state
  pr_metadata_value("state")
end

def to_pipeline_name(string)
  string.gsub(/[^a-zA-Z0-9_-]/, "_")
end

def default_deployment_identifier(args)
  args.with_defaults(
    deployment_type: "bsn-local",
    deployment_label: "default")
end