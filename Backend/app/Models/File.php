<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $fillable = [
        'folder_id',
        'user_id',
        'file_name',
        'file_path',
        'file_size',
        'file_type'
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    protected $appends = [
        'upload_date',
        'last_modified',
        'file_size_formatted'
    ];

    public function getUploadDateAttribute()
    {
        return $this->created_at->diffForHumans();
    }

    public function getLastModifiedAttribute()
    {
        return $this->updated_at->diffForHumans();
    }

    public function getFileSizeFormattedAttribute()
    {
        $bytes = $this->file_size;

        if ($bytes >= 1073741824) {
            return round($bytes / 1073741824, 1) . ' GB';
        }

        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 1) . ' MB';
        }

        if ($bytes >= 1024) {
            return round($bytes / 1024, 1) . ' KB';
        }

        return $bytes . ' B';
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}