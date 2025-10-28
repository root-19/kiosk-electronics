<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Accomplishment extends Model
{
    protected $fillable = [
        'title',
        'description',
        'type',
        'photos',
        'is_active',
    ];

    protected $casts = [
        'photos' => 'array',
        'is_active' => 'boolean',
    ];

    public function getPhotosAttribute($value)
    {
        return $value ? json_decode($value, true) : [];
    }

    public function setPhotosAttribute($value)
    {
        $this->attributes['photos'] = $value ? json_encode($value) : null;
    }
}
