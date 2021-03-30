require 'confidante'

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
end
