<?php
require_once '../config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendJsonResponse(['error' => 'Method not allowed'], 405);
}

$data = getJsonInput();

// Validate required fields
$errors = validateRequired($data, ['name', 'email', 'password']);
if (!empty($errors)) {
    sendJsonResponse(['error' => 'Validation failed', 'details' => $errors], 400);
}

$name = trim($data['name']);
$email = trim($data['email']);
$password = $data['password'];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendJsonResponse(['error' => 'Invalid email format'], 400);
}

if (strlen($password) < 6) {
    sendJsonResponse(['error' => 'Password must be at least 6 characters long'], 400);
}

try {
    $conn = getDBConnection();

    // Check if user already exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        sendJsonResponse(['error' => 'User with this email already exists'], 409);
    }

    // Create user
    $hashedPassword = hashPassword($password);
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, created_at, last_login) VALUES (?, ?, ?, NOW(), NOW())");
    $stmt->execute([$name, $email, $hashedPassword]);

    $userId = $conn->lastInsertId();

    // Create profile entry
    $stmt = $conn->prepare("INSERT INTO profiles (user_id, name, email) VALUES (?, ?, ?)");
    $stmt->execute([$userId, $name, $email]);

    // Generate token
    $token = generateToken($userId);

    sendJsonResponse([
        'message' => 'User created successfully',
        'user' => [
            'id' => $userId,
            'name' => $name,
            'email' => $email
        ],
        'token' => $token
    ], 201);

} catch (Exception $e) {
    sendJsonResponse(['error' => 'Registration failed: ' . $e->getMessage()], 500);
}
?>
