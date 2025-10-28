<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    protected $table = 'calendar_events';

    protected $fillable = [
        'title',
        'description',
        'event_date',
        'event_type',
        'is_active',
    ];

    protected $casts = [
        'event_date' => 'date',
        'is_active' => 'boolean',
    ];

    public static function getEventTypes(): array
    {
        return [
            'holiday' => 'Holiday',
            'academic' => 'Academic',
            'sports' => 'Sports',
            'general' => 'General',
        ];
    }
}
