import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from 'react';
import { set } from "react-native-reanimated";

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confPass, setConfPass] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const checkCredentials = () => {
        setErrorMsg('');
        console.log('Checking credentials');

        if(confPass !== password) {
            setErrorMsg('Passwords do not match!');
        }
        else if(password === '') {
            setErrorMsg('Please enter a password!');
        }
        else {
            fetch('https://cs571.org/s23/hw10/api/register', {
                method: "POST",
                headers: {
                    'X-CS571-ID': 'bid_14a36d6cb07d9384668f',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            .then(res => res.json())
            .then(data => {
                if(Object.keys(data).includes('token')) {
                    props.setKey(data['token']);
                    props.loggedIn(true);
                }
                else {
                    setErrorMsg(data.msg)
                }
                
            })
        }
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text>Username</Text>
        <TextInput style={styles.input} onChangeText={(e) => setUsername(e)}/>
        <Text>Password</Text>
        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(e) => setPassword(e)}/>
        <Text>Confirm Password</Text>
        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(e) => setConfPass(e)}/>
        {
            errorMsg !== '' ? <Text style={{color: 'red', margin: 10}}>{errorMsg}</Text> : <View></View>
        }
        <View style={{flexDirection: "row"}}>
            <Button color="crimson" title="Signup" onPress={checkCredentials} />
            <View style={{width: 10}}></View>
            <Button color="grey" title="Nevermind!" onPress={() => props.setIsRegistering(false)} />
        </View>

    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        borderColor: 'black',
        width: 200,
        height: 40,
        borderStyle: 'solid',
        borderWidth: 1,
        margin: 10,
        padding: 5
    }
});

export default BadgerRegisterScreen;