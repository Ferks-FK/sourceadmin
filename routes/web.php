<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Dashboard\HomeController;
use App\Http\Controllers\Auth\SteamAuthController;
use App\Http\Controllers\Ban\BanController;
use App\Http\Controllers\Mute\MuteController;
use App\Http\Controllers\Report\ReportController;
use App\Http\Controllers\Server\ServerController;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [HomeController::class, 'index'])->name('home.index');

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
|
| Endpoint: /auth
|
*/
Route::group(['prefix' => 'auth'], function() {
    Route::get('/login', [AuthController::class, 'index'])->middleware('guest')->name('auth');
    Route::post('/login', [AuthController::class, 'login'])->name('auth.login');

    Route::group(['middleware' => 'auth:sanctum'], function() {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/register', [AuthController::class, 'register']);
    });
});

/*
|--------------------------------------------------------------------------
| Server Routes
|--------------------------------------------------------------------------
|
| Endpoint: /servers
|
*/
Route::group(['prefix' => 'servers'], function() {
    Route::get('/', [ServerController::class, 'index'])->name('servers.index');
    Route::get('/{server:id}', [ServerController::class, 'connectToServer'])->name('server.connect');
});

/*
|--------------------------------------------------------------------------
| Bans Routes
|--------------------------------------------------------------------------
|
| Endpoint: /bans
|
*/
Route::group(['prefix' => 'bans'], function() {
    Route::get('/', [BanController::class, 'index'])->name('bans.index');
});

/*
|--------------------------------------------------------------------------
| Mutes Routes
|--------------------------------------------------------------------------
|
| Endpoint: /mutes
|
*/
Route::group(['prefix' => 'mutes'], function() {
    Route::get('/', [MuteController::class, 'index'])->name('mutes.index');
});

/*
|--------------------------------------------------------------------------
| Report Routes
|--------------------------------------------------------------------------
|
| Endpoint: /report
|
*/
Route::group(['prefix' => 'report'], function() {
    Route::get('/', [ReportController::class, 'index'])->name('report.index');
    Route::post('/create', [ReportController::class, 'create'])->name('report.create');
});

/*
|--------------------------------------------------------------------------
| Steam Routes
|--------------------------------------------------------------------------
|
| Endpoint: /steam
|
*/
Route::group(['prefix' => 'steam'], function() {
    Route::get('/auth', [SteamAuthController::class, 'getSteamAuthUrlJson'])->name('steam.login');
    Route::get('/callback', [SteamAuthController::class, 'steamCallback'])->name('steam.callback');
});


Route::get('/email', function() {
    $user = User::query()->first();

    return new App\Mail\PlayerReported($user);
});
