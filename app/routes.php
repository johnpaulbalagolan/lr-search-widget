<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

Route::controller('auth', 'AuthController');
Route::controller('api/search', 'SearchApiController');
Route::controller('api', 'ApiController');

Route::resource('searchfilter', 'SearchFilterController');

Route::get('/', 'HomeController@showHome');