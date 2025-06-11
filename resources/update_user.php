<?php
header('Content-Type: application/json');

$conn = new mysqli('localhost', 'root', '', 'bar');
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'DB connection error']);
    exit;
}

$name = $_POST['name'] ?? null;
$gender = $_POST['gender'] ?? null;
$DOB = $_POST['DOB'] ?? null;
$phone = $_POST['phone'] ?? null;
$address = $_POST['address'] ?? null;
$email = $_POST['email'] ?? null; 

$stmt = $conn->prepare("UPDATE users SET name=?, gender=?, DOB=?, phone=?, address=? WHERE email=?");
$stmt->bind_param("ssssss", $name, $gender, $DOB, $phone, $address, $email);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'User updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update', 'error' => $stmt->error]);
}

$stmt->close();
$conn->close();
