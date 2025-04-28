<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = ['quiz_id', 'question_text'];
    
    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
    
    public function options()
    {
        return $this->hasMany(Option::class);
    }
    
    public function correctOption()
    {
        return $this->options()->where('is_correct', true)->first();
    }
}
