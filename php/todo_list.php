<?php

$mysqli = new mysqli("127.0.0.1", "root", "admin", "TodoList");
if($mysqli->connect_error) {
    exit('Could not connect');
}

if ($_GET != null) {
    echo getAllTodo($_GET, $mysqli);
}

if ($_POST != null) {
    echo saveAllTodo($_POST, $mysqli);
}

//TODO - change error messages(success => "error messages")
function saveAllTodo($data, $mysql) {
    if ($data == null) {
        return json_encode(array('success' => 0));
    }
    if (!isset($data['author'])) {
        return json_encode(array('success' => -1));
    }
    if (!isset($data['todos'])) {
        return json_encode(array('success' => 2));
    }

    if ($data['author'] == null) {
        return json_encode(array('success' => 3));
    }
    if ($data['todos'] == null) {
        return json_encode(array('success' => 4));
    }
    if ($data['todos'] == []) {
        return json_encode(array('success' => 5));
    }
    $sql = "DELETE FROM todos WHERE author='" . $data['author'] . "'";

    if (!$mysql->query($sql) === TRUE) {
        echo "Error deleting record: " . $mysql->error;
    }
    foreach($data['todos'] as $todo) {
    

    //TODO - change prepare statements
    $sql  = "INSERT INTO todos (author, index_todo_in_list, title, checkbox) Value ('" . $data['author'] . "', " . $todo['id'] . ", '" . $todo['title'] . "', " . $todo['checkbox'] . ");";

    if (!$mysql->query($sql) === TRUE) {
        return json_encode(array('success' => 0, 'todo' => $data['author'] . "', '" . $todo['id'] . "', '" . $todo['title'] . "', '" . $todo['checkbox']));
    }
    }
    return json_encode(array('success' => 1));

}
//TODO - change error messages(success => "error messages")
function getAllTodo($data, $mysql) {

    if ($data == null) {
        return json_encode(array('success' => 0));
    }
    if (!isset($data['author'])) {
        return json_encode(array('success' => -1));
    }
    if ($data['author'] == null) {
        return json_encode(array('success' => 2));
    }
    
    //TODO - change prepare statements
    $sql = "SELECT index_todo_in_list, title, checkbox from todos WHERE author = '" . $data['author'] . "'";
    $todos = [];
    $result = $mysql->query($sql);
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $todos = [
                "id" => $row['index_todo_in_list'],
                "title" => $row['title'],
                "checkb0x" => $row['checkbox']
            ];
            $out[] = $todos;
        }
    } else {
        return json_encode(array('success' => 1, 'todos' => $todos));
    }

    return json_encode(array('success' => 1, 'todos' => $out)); 
}


?>