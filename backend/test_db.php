<?php
require_once 'config.php';

try {
    $conn = getDBConnection();
    echo "Database connection successful!\n";

    // Test query to check if tables exist
    $stmt = $conn->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    echo "Tables in database:\n";
    foreach ($tables as $table) {
        echo "- $table\n";
    }

    // Test user table
    $stmt = $conn->query("SELECT COUNT(*) as user_count FROM users");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Total users: " . $result['user_count'] . "\n";



    // Test orders table
    $stmt = $conn->query("SELECT COUNT(*) as order_count FROM orders");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "Total orders: " . $result['order_count'] . "\n";

} catch (Exception $e) {
    echo "Database test failed: " . $e->getMessage() . "\n";
}
?>
