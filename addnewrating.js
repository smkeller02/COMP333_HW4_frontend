import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function AddNewRating({ route }) {
    // State variables to manage user input and messages
    const [artist, setArtist] = useState('');
    const [song, setSong] = useState('');
    const [rating, setRating] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const { onRatingAdded, user } = route.params;

    // Handle the form submission
    const handleSubmit = async () => {
      try {
        // Send POST request to the server to add a new rating
        const response = await fetch('http://129.133.188.213/COMP333_HW4_backend/index.php/addnewrating', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user,
            artist,
            song,
            rating,
          }),
        });

      const responseData = await response.json();

      if (response.status === 200) {
        // If the response status is OK, clear artist, song, rating, set success message,
        // and notify the parent component that a new rating was added
        setArtist('');
        setSong('');
        setRating('');
        setMessage('Rating added');
        // Automatically clear the message after 2 seconds
        setTimeout(() => setMessage(''), 2000);
        onRatingAdded();
        navigation.navigate('Ratings'); // navigate to ratings main page
      } else if (response.status === 400) {
        // If the response is 400, access the error message from the backend
        setMessage(responseData.error);
      } else {
        // Else display a generic error
        setMessage('Something went wrong');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
        <Text style={styles.userText}>Welcome, {user}</Text>
      <TextInput
        style={styles.input}
        value={artist}
        placeholder="Artist"
        onChangeText={(text) => setArtist(text)}
      />
      <TextInput
        style={styles.input}
        value={song}
        placeholder="Song"
        onChangeText={(text) => setSong(text)}
      />
      <TextInput
        style={styles.input}
        value={rating}
        placeholder="Rating"
        onChangeText={(text) => setRating(text)}
      />
      <TouchableOpacity onPress={handleSubmit}>
        <Text style={styles.text}>Add rating</Text>
      </TouchableOpacity>

      {/* Display success or error message, if present */}
      <View>
        <Text style={styles.message}>{message}</Text>
      </View>

      <Button title="Cancel" onPress={() => navigation.navigate('Ratings')} color="#FFFFFF"/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0C27A4',
  },
  input: {
    width: 200,
    height: 40,
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#FFFFFF'
  },
  message: {
    marginTop: 10,
    color: '#FF6B6B',
    fontSize: 18
  },
  userText: {
    color: '#FFFFFF',
    fontWeight: '900', // Make the text bold
    textAlign: 'center',
    fontSize: 24,
    paddingTop: 15,
    paddingBottom: 10
 },
 text: {
    color: '#FFFFFF',
    fontSize: 20,
 }
});

export default AddNewRating;