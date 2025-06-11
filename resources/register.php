<?php
include('user.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$re_password = $data['re_password'] ?? '';

if ($password !== $re_password) {
    echo json_encode(['success' => false, 'message' => 'Passwords do not match']);
    exit;
}

$check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check_stmt->bind_param("s", $email);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email is already used']);
    $check_stmt->close();
    $conn->close();
    exit;
}
$check_stmt->close();

$hashed = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $email, $hashed);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error occurred: ' . $conn->error]);
}

$stmt->close();
$conn->close();
