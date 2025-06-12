<?php
class Product {
    private $conn;
    private $table_name = "products";

    public $id;
    public $name;
    public $description;
    public $price;
    public $image_url;
    public $category;
    public $stock_quantity;
    public $created_at;
    public $search;
    public $sort;
    public $page;
    public $per_page;
    public $total_count;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $where_conditions = array();
        $params = array();

        if (!empty($this->category)) {
            $where_conditions[] = "category = :category";
            $params[':category'] = $this->category;
        }

        if (!empty($this->search)) {
            $where_conditions[] = "(name LIKE :search OR description LIKE :search)";
            $params[':search'] = "%" . $this->search . "%";
        }

        if (!empty($where_conditions)) {
            $query .= " WHERE " . implode(" AND ", $where_conditions);
        }

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $this->total_count = $row['total'];

        // Main query for products
        $query = "SELECT * FROM " . $this->table_name;

        if (!empty($where_conditions)) {
            $query .= " WHERE " . implode(" AND ", $where_conditions);
        }

        // Add sorting
        switch ($this->sort) {
            case 'price_low':
                $query .= " ORDER BY price ASC";
                break;
            case 'price_high':
                $query .= " ORDER BY price DESC";
                break;
            case 'name':
                $query .= " ORDER BY name ASC";
                break;
            default: // newest
                $query .= " ORDER BY created_at DESC";
                break;
        }

        // Add pagination
        $query .= " LIMIT :limit OFFSET :offset";
        $params[':limit'] = $this->per_page;
        $params[':offset'] = ($this->page - 1) * $this->per_page;

        $stmt = $this->conn->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();

        return $stmt;
    }

    public function create() {
        $query = "INSERT INTO " . $this->table_name . "
                SET
                    name = :name,
                    description = :description,
                    price = :price,
                    image_url = :image_url,
                    category = :category,
                    stock_quantity = :stock_quantity";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->stock_quantity = htmlspecialchars(strip_tags($this->stock_quantity));

        // Bind values
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":stock_quantity", $this->stock_quantity);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function update() {
        $query = "UPDATE " . $this->table_name . "
                SET
                    name = :name,
                    description = :description,
                    price = :price,
                    image_url = :image_url,
                    category = :category,
                    stock_quantity = :stock_quantity
                WHERE
                    id = :id";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->description = htmlspecialchars(strip_tags($this->description));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->image_url = htmlspecialchars(strip_tags($this->image_url));
        $this->category = htmlspecialchars(strip_tags($this->category));
        $this->stock_quantity = htmlspecialchars(strip_tags($this->stock_quantity));

        // Bind values
        $stmt->bindParam(":id", $this->id);
        $stmt->bindParam(":name", $this->name);
        $stmt->bindParam(":description", $this->description);
        $stmt->bindParam(":price", $this->price);
        $stmt->bindParam(":image_url", $this->image_url);
        $stmt->bindParam(":category", $this->category);
        $stmt->bindParam(":stock_quantity", $this->stock_quantity);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }

    public function delete() {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(":id", $this->id);

        if ($stmt->execute()) {
            return true;
        }
        return false;
    }
}
?> 