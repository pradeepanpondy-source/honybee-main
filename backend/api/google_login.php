<?php
// This file is deprecated. Google OAuth is now handled by Supabase.
// Authentication is managed client-side through Supabase Auth.

header('Content-Type: application/json');
http_response_code(410); // Gone
echo json_encode([
    'error' => 'This endpoint is deprecated. Google OAuth is now handled by Supabase.',
    'message' => 'Please use the client-side Supabase authentication.'
]);
?>
