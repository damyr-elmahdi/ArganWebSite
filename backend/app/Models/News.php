<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;
    
    protected $table = 'news';

    protected $fillable = [
        'title',
        'content',
        'image_path',
        'author_id',
        'is_published',
        'published_at',
        'scheduled_publication', // Add this new field
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
        'scheduled_publication' => 'datetime', // Add this new field
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
    
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    
    public function publish()
    {
        $this->is_published = true;
        $this->published_at = now();
        $this->scheduled_publication = null; // Clear scheduled publication date
        $this->save();
    }
    
    public function archive()
    {
        $this->is_published = false;
        $this->save();
    }
}