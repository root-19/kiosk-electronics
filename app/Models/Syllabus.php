<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Syllabus extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'file_name',
        'file_path',
        'file_type',
        'file_size',
        'subject',
        'grade_level',
        'category',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
