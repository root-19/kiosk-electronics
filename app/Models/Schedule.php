<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    protected $fillable = [
        'section_id',
        'professor_id',
        'subject_id',
        'day_of_week',
        'time_slot',
        'room',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function section(): BelongsTo
    {
        return $this->belongsTo(Section::class);
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(Professor::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public static function getTimeSlots(): array
    {
        return [
            '7:30-8:30',
            '8:30-9:30',
            '9:30-10:30',
            '10:30-11:30',
            '11:30-12:30',
            '12:30-1:30',
            '1:30-2:30',
            '2:30-3:30',
            '3:30-4:30',
            '4:30-5:30',
            '5:30-6:30',
            '6:30-7:30',
        ];
    }

    public static function getDaysOfWeek(): array
    {
        return [
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
            'sunday',
        ];
    }
}
