<?php

namespace App\Http\Controllers;

use App\Models\Club;
use App\Models\ClubMember;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ClubMemberController extends Controller
{
    /**
     * Store a newly created club member.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $clubId
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $clubId)
    {
        // Validate club exists
        $club = Club::findOrFail($clubId);

        // Validate request data
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:member,leader,assistant',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if user is already a member of the club
        $existingMember = ClubMember::where('club_id', $clubId)
            ->where('user_id', $request->user_id)
            ->first();

        if ($existingMember) {
            return response()->json([
                'message' => 'User is already a member of this club'
            ], 422);
        }

        // Create new club member
        $clubMember = new ClubMember([
            'club_id' => $clubId,
            'user_id' => $request->user_id,
            'role' => $request->role,
        ]);

        $clubMember->save();
        
        // Load the related user for the response
        $clubMember->load('user');

        return response()->json($clubMember, 201);
    }
    
    /**
     * Update the specified club member.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $clubId
     * @param  int  $memberId
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $clubId, $memberId)
    {
        // Validate club exists
        Club::findOrFail($clubId);
        
        // Validate request data
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id',
            'role' => 'required|string|in:member,leader,assistant',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Find the club member
        $clubMember = ClubMember::where('club_id', $clubId)
            ->where('id', $memberId)
            ->firstOrFail();
            
        // Update member details
        $clubMember->update([
            'user_id' => $request->user_id,
            'role' => $request->role,
        ]);
        
        // Load the related user for the response
        $clubMember->load('user');

        return response()->json($clubMember);
    }

    /**
     * Remove the specified club member.
     *
     * @param  int  $clubId
     * @param  int  $memberId
     * @return \Illuminate\Http\Response
     */
    public function destroy($clubId, $memberId)
    {
        // Validate club exists
        Club::findOrFail($clubId);
        
        // Find and delete the club member
        $clubMember = ClubMember::where('club_id', $clubId)
            ->where('id', $memberId)
            ->firstOrFail();
            
        $clubMember->delete();

        return response()->json(null, 204);
    }
}