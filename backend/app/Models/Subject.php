<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
    ];

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class);
    }

    public function resources()
    {
        return $this->hasMany(Resource::class);
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
    
    public function addResource(Resource $resource)
    {
        $this->resources()->save($resource);
    }
    
    public function addQuiz(Quiz $quiz)
    {
        $this->quizzes()->save($quiz);
    }
}
