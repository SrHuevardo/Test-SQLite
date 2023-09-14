import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from 'expo-sqlite';

// Abrir o crear una base de datos SQLite llamada 'notes.db'
const db = SQLite.openDatabase('notes.db');

export default function NoteScreen() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  // Configuración inicial: creación de la tabla si no existe
  useEffect(() => {
    db.transaction(tx => {
      // Crear la tabla 'notes' si no existe, con una columna 'id' (clave primaria) y 'text'
      tx.executeSql(
        'create table if not exists notes (id integer primary key not null, text text);'
      );
    });
    // Cargar las notas existentes desde la base de datos al montar el componente
    fetchNotes();
  }, []);

  // Función para cargar las notas desde la base de datos
  const fetchNotes = () => {
    db.transaction(tx => {
      // Consulta SQL para seleccionar todas las notas de la tabla 'notes'
      tx.executeSql('select * from notes;', [], (_, { rows }) => {
        // Extraer los resultados y actualizar el estado 'notes'
        const data = rows._array;
        setNotes(data);
      });
    });
  };

  // Función para agregar una nueva nota a la base de datos
  const addNote = () => {
    db.transaction(tx => {
      // Insertar una nueva nota con el texto proporcionado en el estado 'note'
      tx.executeSql('insert into notes (text) values (?);', [note], () => {
        // Limpiar el estado 'note' y volver a cargar las notas actualizadas
        setNote('');
        fetchNotes();
      });
    });
  };

  // Función para eliminar una nota de la base de datos por su ID
  const deleteNote = id => {
    db.transaction(tx => {
      // Eliminar la nota con el ID proporcionado de la tabla 'notes'
      tx.executeSql('delete from notes where id = ?;', [id], () => {
        // Volver a cargar las notas actualizadas después de la eliminación
        fetchNotes();
      });
    });
  };

  return (
    <View>
      <Text>Notas</Text>
      <TextInput
        placeholder="Escribe una nota..."
        value={note}
        onChangeText={text => setNote(text)}
      />
      <Button title="Agregar Nota" onPress={addNote} />
      <FlatList
        data={notes}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.text}</Text>
            <Button title="Eliminar" onPress={() => deleteNote(item.id)} />
          </View>
        )}
      />
    </View>
  );
}


/* Inicialización de la base de datos: Se crea una base de datos SQLite llamada 'notes.db' usando SQLite.openDatabase.
Esta base de datos se utilizará para almacenar las notas.

Configuración inicial: Dentro de useEffect, se ejecuta una transacción SQL para crear la tabla 'notes' si no existe. 
La tabla tiene una columna 'id' como clave primaria y una columna 'text' para almacenar el texto de la nota.

fetchNotes: Esta función se utiliza para consultar todas las notas de la base de datos y actualizar el estado 'notes' con los resultados.

addNote: Permite agregar una nueva nota a la base de datos. 
Se ejecuta una transacción SQL para insertar la nota en la tabla 'notes'. Luego, se limpia el estado 'note' y se vuelve a cargar la lista de notas.

deleteNote: Elimina una nota existente por su ID. Similar a addNote,
se ejecuta una transacción SQL para eliminar la nota y luego se actualiza la lista de notas. 
 */