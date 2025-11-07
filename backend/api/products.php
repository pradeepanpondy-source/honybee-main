<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

// Get Supabase client
$supabase = getSupabaseClient();

try {
    // Get all products
    $response = $supabase->from('products')->select('*')->eq('is_active', true)->execute();
    $products = $response->getBody();

    sendJsonResponse(['products' => $products]);
} catch (Exception $e) {
    sendJsonResponse(['error' => 'Failed to fetch products: ' . $e->getMessage()], 500);
}
?>
