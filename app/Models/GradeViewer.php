<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradeViewer extends Model
{
    use HasFactory;
     protected $table = 'grade_viewers';
    protected $fillable = [
        'id_number',
        'last_name',
        'first_name',
        'middle_name',
        'extra_name',
        'program',
        'level',
        'grade',
        'date_validated',
    ];

    protected $casts = [
        'date_validated' => 'date',
    ];
}
