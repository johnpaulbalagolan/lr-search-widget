<?php namespace Navnorth\LrPublisher;

use Illuminate\Support\ServiceProvider;
use Event;
use ApiUser;
use Session;
use Auth;

class LrPublisherServiceProvider extends ServiceProvider {

	/**
	 * Indicates if loading of the provider is deferred.
	 *
	 * @var bool
	 */
	protected $defer = false;

	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register()
	{
		// // Setup persona to connect to our ApiUser model
		// Event::listen('oauth.login', function($id) {
    // 		return ApiUser::where('oauth_id', $id)->first();
		// });


		Event::listen('google.signin', function($info) {

				$user = ApiUser::where('oauth_id', $info['id'])->first();

				// if there's no user, create one
				if (!$user) {
						$user = new ApiUser();
						$user->oauth_id = $info['id'];
						$user->oauth_type = 'google';
						$user->firstname = $info['given_name'];
						$user->lastname = $info['family_name'];
						$user->email = $info['email'];
						$user->save();
				}

				Session::put('user', $user);
				Auth::login($user);

				return $user;
		});

		Event::listen('microsoft.signin', function($info) {

			$user = ApiUser::where('oauth_id', $info['id'])->first();

			// if there's no user, create one
			if (!$user) {
					$user = new ApiUser();
					$user->oauth_id = $info['id'];
					$user->oauth_type = 'microsoft';
					$user->firstname = $info['first_name'];
					$user->lastname = $info['last_name'];
					$user->save();
			}

			Session::put('user', $user);
			Auth::login($user);

			return $user;
		});

		Event::listen('amazon.signin', function($info) {

			$user = ApiUser::where('oauth_id', $info['id'])->first();

			// if there's no user, create one
			//
			// TODO: edit $user creation to match the information amazon returns
			if (!$user) {
					$user = new ApiUser();
					$user->oauth_id = $info['id'];
					$user->oauth_type = 'amazon';
					$user->firstname = $info['first_name'];
					$user->lastname = $info['last_name'];
					$user->save();
			}

			Session::put('user', $user);
			Auth::login($user);

			return $user;
		});
	}
	/**
	 * Get the services provided by the provider.
	 *
	 * @return array
	 */
	public function provides()
	{
		return array();
	}

}
