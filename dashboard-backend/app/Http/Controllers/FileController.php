<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\File;
use App\Models\Folder;
use Illuminate\Support\Facades\Storage;

class FileController extends Controller
{
    
    public function getFolders()
    {
        return Folder::where('user_id', auth()->id())->get();
    }

    
    public function createFolder(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $folder = Folder::create([
            'name'    => $request->name,
            'user_id' => auth()->id()
        ]);

        return response()->json($folder);
    }

    
    public function renameFolder(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $folder = Folder::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $folder->update(['name' => $request->name]);

        return response()->json($folder);
    }

    
    public function deleteFolder($id)
    {
        $folder = Folder::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        // Delete all physical files stored in this folder
        foreach ($folder->files as $file) {
            Storage::disk('public')->delete($file->file_path);
        }

        // deletes related File records via DB cascade
        $folder->delete();

        return response()->json(['message' => 'Folder deleted']);
    }

    
    public function getFiles($folderId)
    {
        return File::where('folder_id', $folderId)
            ->where('user_id', auth()->id())
            ->get();
    }

    
    public function uploadFile(Request $request)
    {
        $request->validate([
            'file'      => 'required|file',
            'folder_id' => 'required|exists:folders,id'
        ]);

        $file = $request->file('file');

        
        $path = $file->store('uploads', 'public');

        $newFile = File::create([
            'folder_id' => $request->folder_id,
            'user_id'   => auth()->id(),
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'file_type' => strtoupper($file->getClientOriginalExtension())
        ]);

        return response()->json($newFile);
    }


    public function renameFile(Request $request, $id)
    {
        $request->validate([
            'file_name' => 'required|string|max:255'
        ]);

        $file = File::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $file->update(['file_name' => $request->file_name]);

        return response()->json($file);
    }


    public function deleteFile($id)
    {
        $file = File::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        Storage::disk('public')->delete($file->file_path);
        $file->delete();

        return response()->json(['message' => 'File deleted']);
    }

    
    public function downloadFile($id)
    {
        $file = File::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return Storage::disk('public')->download($file->file_path, $file->file_name);
    }

    
    public function searchFiles(Request $request)
    {
        $query = $request->query('query');

        return File::where('user_id', auth()->id())
            ->where('file_name', 'LIKE', "%$query%")
            ->get();
    }

    
    public function storageInfo()
    {
        $total = 10 * 1024 * 1024 * 1024; // 10 GB in bytes

        $used = File::where('user_id', auth()->id())
            ->sum('file_size');

        return response()->json([
            'total'           => $total,
            'used'            => $used,
            'used_formatted'  => $this->formatBytes($used),
            'total_formatted' => $this->formatBytes($total),
            'percent_used'    => $total > 0 ? round(($used / $total) * 100, 1) : 0
        ]);
    }


    private function formatBytes($bytes)
    {
        if ($bytes >= 1073741824) return round($bytes / 1073741824, 1) . ' GB';
        if ($bytes >= 1048576)   return round($bytes / 1048576, 1) . ' MB';
        if ($bytes >= 1024)      return round($bytes / 1024, 1) . ' KB';
        return $bytes . ' B';
    }
}