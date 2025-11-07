{
  "scripts": {
    "build": "vite build"
  }
}<?php
require_once '../config.php';

// Get authorization header
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (!$authHeader || !preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
    sendJsonResponse(['error' => 'Authorization token required'], 401);
}

$token = $matches[1];
$payload = verifyToken($token);

if (!$payload) {
    sendJsonResponse(['error' => 'Invalid or expired token'], 401);
}

$userId = $payload['user_id'];

try {
    $conn = getDBConnection();

    // Update last logout time (optional)
    $stmt = $conn->prepare("UPDATE users SET last_logout = NOW() WHERE id = ?");
    $stmt->execute([$userId]);

    sendJsonResponse(['message' => 'Logout successful']);

} catch (Exception $e) {
    sendJsonResponse(['error' => 'Logout failed: ' . $e->getMessage()], 500);
}
?>
