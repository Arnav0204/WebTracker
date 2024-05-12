Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  resources :users, param: :_username
  post '/auth/login', to: 'authentication#login'

  resources :blocked_websites, only: [:index, :create, :show, :update, :destroy]
  get    '/blocked_hosts', to: 'blocked_hosts#index'
  post   '/blocked_hosts', to: 'blocked_hosts#create'
  delete '/blocked_hosts/:id', to: 'blocked_hosts#destroy'

  resources :browsing_times, only: [:show, :create]
  get '/browsing_times', to: 'browsing_times#show'
  post '/browsing_times', to: 'browsing_times#create'

  get '/*a', to: 'application#not_found'
end
