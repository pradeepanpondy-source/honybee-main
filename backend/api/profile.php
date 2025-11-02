<?php
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

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Get profile
        $stmt = $conn->prepare("SELECT * FROM profiles WHERE user_id = ?");
        $stmt->execute([$userId]);
        $profile = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$profile) {
            sendJsonResponse(['error' => 'Profile not found'], 404);
        }

        sendJsonResponse(['profile' => $profile]);

    } elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
        // Update profile
        $data = getJsonInput();

        $fields = ['name', 'age', 'location', 'address', 'pincode', 'email', 'phone'];
        $updates = [];
        $params = [];

        foreach ($fields as $field) {
            if (isset($data[$field])) {
                $updates[] = "$field = ?";
                $params[] = $data[$field];
            }
        }

        if (empty($updates)) {
            sendJsonResponse(['error' => 'No fields to update'], 400);
        }

        $params[] = $userId;
        $sql = "UPDATE profiles SET " . implode(', ', $updates) . " WHERE user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);

        // Also update user name and email if provided
        if (isset($data['name']) || isset($data['email'])) {
            $userUpdates = [];
            $userParams = [];

            if (isset($data['name'])) {
                $userUpdates[] = "name = ?";
                $userParams[] = $data['name'];
            }
            if (isset($data['email'])) {
                $userUpdates[] = "email = ?";
                $userParams[] = $data['email'];
            }

            $userParams[] = $userId;
            $userSql = "UPDATE users SET " . implode(', ', $userUpdates) . " WHERE id = ?";
            $stmt = $conn->prepare($userSql);
            $stmt->execute($userParams);
        }

        sendJsonResponse(['message' => 'Profile updated successfully']);

    } else {
        sendJsonResponse(['error' => 'Method not allowed'], 405);
    }

} catch (Exception $e) {
    sendJsonResponse(['error' => 'Operation failed: ' . $e->getMessage()], 500);
}
?>
