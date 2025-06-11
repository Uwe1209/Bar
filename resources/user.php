<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "bar";

$connn = mysqli_connect($servername, $username, $password);

if (!$connn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql = "CREATE DATABASE IF NOT EXISTS $database";
mysqli_query($connn, $sql);
mysqli_close($connn);

$conn = mysqli_connect($servername, $username, $password, $database);

if (!$conn) {
  die("Connection failed: " . mysqli_connect_error());
}

$sql1 = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    img VARCHAR(100) NULL,
    gender VARCHAR(6) NULL,
    DOB DATE NULL,
    phone VARCHAR(15) NULL,
    address VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

mysqli_query($conn, $sql1);
