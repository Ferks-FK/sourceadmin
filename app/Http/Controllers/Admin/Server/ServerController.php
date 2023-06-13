<?php

namespace App\Http\Controllers\Admin\Server;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Server\ServerUpdateRequest;
use App\Traits\Server;
use App\Models\Mod;
use App\Models\Region;
use App\Models\Server as ServerModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServerController extends Controller
{
    use Server;

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return Inertia::render('admin/ServerSettings/ServerIndex', [
            'serversIds' => $this->getServersIds(getAll: true)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param Request $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
        $serverAttrs = $this->getServerAttributes($id, ['created_at', 'updated_at', 'mod_id', 'region_id', 'enabled']);
        $serverData = $this->connectToServer($request, $id)->getData();
        $serverData[0]->Created_At = $serverAttrs[0]->created_at;
        $serverData[0]->Updated_At = $serverAttrs[0]->updated_at;
        $serverData[0]->ModId = $serverAttrs[0]->mod_id;
        $serverData[0]->RegionId = $serverAttrs[0]->region_id;
        $serverData[0]->Enabled = $serverAttrs[0]->enabled;

        $mods = Mod::where('enabled', true)->get(['id', 'name']);
        $regions = Region::where('enabled', true)->get(['id', 'region']);

        return Inertia::render('admin/ServerSettings/ServerShow', [
            'server' => $serverData,
            'mods' => $mods,
            'regions' => $regions
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(ServerUpdateRequest $request, $id)
    {
        $data = $request->except('new_rcon_confirmation');
        $server = ServerModel::findOrFail($id);

        if ($request->input('new_rcon')) {
            unset($data['new_rcon']);
            $data['rcon'] = $request->input('new_rcon');
        }

        $server->fill($data);
        $server->save();

        $this->removeServerFromCache($id);

        return redirect()->route('admin.servers.index')->with('success', __('The server has been successfully updated.'));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
