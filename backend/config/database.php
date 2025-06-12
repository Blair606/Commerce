<?php
class Database {
    private $host = "localhost";
    private $db_name = "ecommerce_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                )
            );
        } catch(PDOException $e) {
            error_log("Connection Error: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(array(
                "message" => "Database connection failed",
                "error" => $e->getMessage()
            ));
            exit();
        }

        return $this->conn;
    }
}
?> 