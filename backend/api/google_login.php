<?php
require_once '../vendor/autoload.php';
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

$data = getJsonInput();

if (empty($data['code'])) {
    sendJsonResponse(['error' => 'Authorization code not provided'], 400);
}

$client = new Google_Client();
$client->setClientId(getenv('GOOGLE_CLIENT_ID'));
$client->setClientSecret(getenv('GOOGLE_CLIENT_SECRET'));
$client->setRedirectUri('postmessage');

try {
    $token = $client->fetchAccessTokenWithAuthCode($data['code']);
    if (isset($token['error'])) {
        sendJsonResponse(['error' => 'Failed to retrieve access token: ' . $token['error_description']], 400);
    }

    $payload = $client->verifyIdToken($token['id_token']);
    if (!$payload) {
        sendJsonResponse(['error' => 'Invalid ID token'], 400);
    }

    $googleId = $payload['sub'];
    $email = $payload['email'];
    $name = $payload['name'];
    $googleProfile = $payload;

    $conn = getDBConnection();

    $stmt = $conn->prepare("SELECT id, name, email, login_method, google_profile FROM users WHERE google_profile->>'$.sub' = ? OR email = ?");
    $stmt->execute([$googleId, $email]);
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existingUser) {
        if ($existingUser['login_method'] === 'google') {
            $stmt = $conn->prepare("UPDATE users SET google_profile = ?, last_login = NOW() WHERE id = ?");
            $stmt->execute([json_encode($googleProfile), $existingUser['id']]);
            $userId = $existingUser['id'];
        } else {
            sendJsonResponse(['error' => 'An account with this email already exists. Please login with email and password, then link your Google account.'], 409);
        }
    } else {
        $stmt = $conn->prepare("INSERT INTO users (name, email, login_method, google_profile, email_verified, created_at, last_login) VALUES (?, ?, 'google', ?, TRUE, NOW(), NOW())");
        $stmt->execute([$name, $email, json_encode($googleProfile)]);
        $userId = $conn->lastInsertId();

        $stmt = $conn->prepare("INSERT INTO profiles (user_id, name, email) VALUES (?, ?, ?)");
        $stmt->execute([$userId, $name, $email]);
    }

    $jwt = generateToken($userId);

    $stmt = $conn->prepare("SELECT id, name, email FROM users WHERE id = ?");
    $stmt->execute([$userId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    sendJsonResponse([
        'message' => 'Google login successful',
        'user' => $user,
        'token' => $jwt
    ]);

} catch (Exception $e) {
    sendJsonResponse(['error' => 'Google login failed: ' . $e->getMessage()], 500);
}
?>
