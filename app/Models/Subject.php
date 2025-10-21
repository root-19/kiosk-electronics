<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    protected $fillable = [
        'code',
        'name',
        'description',
        'units',
        'department',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'units' => 'integer',
    ];

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->name} ({$this->code})";
    }
}
