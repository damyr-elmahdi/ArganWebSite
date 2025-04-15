<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'subject_id',
        'creator_id',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'creator_id');
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function completions()
    {
        return $this->hasMany(CompletedQuiz::class);
    }
    
    public function activate()
    {
        $this->is_active = true;
        $this->save();
    }
    
    public function deactivate()
    {
        $this->is_active = false;
        $this->save();
    }
    
    public function addQuestion(Question $question)
    {
        $this->questions()->save($question);
    }
}
