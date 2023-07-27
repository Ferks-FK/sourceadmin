<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Permission\Models\Permission as BasePermission;

class Permission extends BasePermission
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'guard_name',
        'readable_name'
    ];

    /**
     * Get the groups associated with the permission.
     */
    public function groups()
    {
        return $this->belongsToMany(Group::class, 'group_has_permissions');
    }
}
