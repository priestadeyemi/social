<?php
// Set headers to accept JSON from the frontend
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");

// Database configuration
$host = "localhost";
$dbname = "your_database_name";
$user = "your_db_username";
$pass = "your_db_password";

try {
    // 1. Connect to SQL Database using PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    // Set error mode to exception for better debugging
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2. Get the incoming JSON payload from JS fetch()
    $data = json_decode(file_get_contents("php://input"));

    // Check if data exists
    if (!empty($data->username) && !empty($data->password) && !empty($data->platform)) {
        
        $platform = $data->platform;
        $username = $data->username;
        $plain_password = $data->password;

        // 3. SECURE HASHING: Hash the password before it goes to the database
        $hashed_password = password_hash($plain_password, PASSWORD_DEFAULT);

        // 4. Prepare SQL Statement (Prevents SQL Injection)
        // Note: Make sure you have a table named 'users' with these columns
        $query = "INSERT INTO users (platform, username, password_hash) VALUES (:platform, :username, :password_hash)";
        
        $stmt = $pdo->prepare($query);
        
        // Bind the parameters
        $stmt->bindParam(":platform", $platform);
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":password_hash", $hashed_password);

        // 5. Execute and respond
        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Record created successfully."]);
        } else {
            echo json_encode(["status" => "error", "message" => "Unable to create record."]);
        }

    } else {
        echo json_encode(["status" => "error", "message" => "Incomplete data sent."]);
    }

} catch(PDOException $e) {
    // Return database connection errors back to the frontend
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $e->getMessage()]);
}
?>