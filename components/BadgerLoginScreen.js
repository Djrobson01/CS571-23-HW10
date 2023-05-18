import { Alert, Button, StyleSheet, Text, View, TextInput } from "react-native";
import { useState } from 'react';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const checkCredentials = () => {
        fetch('https://cs571.org/s23/hw10/api/login', {
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
            console.log(data);
            if(Object.keys(data).includes('token')) {
                props.setKey(data['token']);
                props.loggedIn(true);
            }
            else {
                setErrorMsg(data.msg);
            }
        })
    }

    const handleAnon = () => {
        props.setAnon(true);
        props.loggedIn(true);
    }

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
        <Text>Username</Text>
        <TextInput style={styles.input} onChangeText={(e) => setUsername(e)} />
        <Text>Password</Text>
        <TextInput secureTextEntry={true} style={styles.input} onChangeText={(e) => setPassword(e)} />
        {
            errorMsg !== ''
            ? <Text style={{color: 'red', margin: 5, paddingBottom: 5}}>{errorMsg}</Text>
            : <></>
        }
        <Button color="crimson" title="Login" onPress={checkCredentials} />
        <Text style={{margin: 10}}>New here?</Text>
        <View style={{flexDirection: 'row'}}>
            <Button color="grey" title="Signup" onPress={() => props.setIsRegistering(true)} />
            <View style={{width: 5}} />
            <Button color='gray' title='Continue As Guest' onPress={handleAnon} />
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
        padding: 5,
        margin: 10
    }
});

export default BadgerLoginScreen;