<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delegate extends Model
{
    protected $fillable = [
        'sport_id',
        'name',
        'position',
        'image_path',
    ];

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }
}
