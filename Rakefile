require 'git'
require 'confidante'
require 'rake_fly'

configuration = Confidante.configuration

RakeFly.define_installation_tasks(version: '6.7.2')

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

namespace :dependencies do
  desc 'Fetch dependencies'
  task :install do
    sh('npm', 'install')
  end
end

namespace :app do
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
      t.pipeline = "reference-backend-develop"

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
      t.pipeline = "reference-backend-builder"

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
        t.pipeline = "reference-backend-pr-#{to_pipeline_name(branch)}"

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

def current_branch
  Git.open(File.dirname(__FILE__)).current_branch
end

def to_pipeline_name(string)
  string.gsub(/[^a-zA-Z0-9_-]/, "_")
end
