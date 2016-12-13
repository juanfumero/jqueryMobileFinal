var createStatement = "CREATE TABLE IF NOT EXISTS presupuestos (id INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, email TEXT, precio REAL)";

var selectAllStatement = "SELECT * FROM presupuestos";
var insertStatement = "INSERT INTO presupuestos (nombre, email,precio) VALUES (?,?,?)";
var deleteStatement = "DELETE FROM presupuestos WHERE id=?";
var dropStatement = "DROP TABLE IF EXISTS presupuestos";

var db = openDatabase("calculadora", "1.0", "calculadora", 200000); // nombre, version, alias, tamaño estimado

function initDatabase() {
    try {
        if (!window.openDatabase)
        {
            alert('SQLite no soportado.');
        }
        else {
            crearTablas();
        }
    } catch (e) {
        if (e == 2) {
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error " + e + ".");
        }
    }
}

function crearTablas() {
    db.transaction(function (tx) {
        tx.executeSql(createStatement, [], null, onError);
    });
}

function insertRecord(nombre, email, monto) {
    db.transaction(function (tx) {
        tx.executeSql(insertStatement, [nombre, email, monto], null, onError);
    });
}

function deleteRecord(id) {
    var iddelete = id.toString();

    db.transaction(function (tx) {
        tx.executeSql(deleteStatement, [id], null, onError);
    });
}

function dropTable() {
    db.transaction(function (tx) {
        tx.executeSql(dropStatement, [], null, onError);
    });
}

function onError(tx, error) {
    alert(error.message);
}

function showRecords(){
    db.transaction(function (tx){
        tx.executeSql(selectAllStatement, [], function(tx, result) {
            var dataset = result.rows;

            $('#listado').html('');
            for (var i = 0, item = null; i < dataset.length;  i++) {
                item = dataset.item(i);

                $('#listado').append(
                    '<li><a href="#">' +
                    item['nombre'] +
                    '&lt;' +
                    item['email'] +
                    '&gt; (' +
                    item['precio'].toFixed(2) +
                    ')</a></li>'

                );
            }
             $("#listado").listview("refresh");
        });
    });
}

$(document).ready(function () {
	//dropTable();
    initDatabase();
    insertRecord('Juan','juan.fumero@wikot.com', 2500);
});