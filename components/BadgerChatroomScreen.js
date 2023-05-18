import { StyleSheet, Text, View, ScrollView, Button, Modal, TextInput, Pressable, Alert } from "react-native";
import { useEffect, useState } from 'react';
import BadgerChatMessage from "./BadgerChatMessage";

function BadgerChatroomScreen(props) {
    const [messages, setMessages] = useState([]);
    const [visible, setModalVisible] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');

    useEffect(() => {
        fetch(`https://cs571.org/s23/hw10/api/chatroom/${props.name}/messages`, {
            method: "GET",
            headers: {
                'X-CS571-ID': 'bid_14a36d6cb07d9384668f'
            }
        })
        .then(res => res.json())
        .then(data => setMessages(data["messages"]))
    }, [refresh]);

    function clearPost() {
        setTitle('');
        setBody('');
        setModalVisible(!visible);
    }

    const handleSubmit = () => {
        let token = props.getToken['_j'];
        fetch(`https://cs571.org/s23/hw10/api/chatroom/${props.name}/messages`, {
            method: "POST",
            headers: {
                'X-CS571-ID': 'bid_14a36d6cb07d9384668f',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                title: title,
                content: body
            })
        })
        .then(res => res.json())
        .then(data => {
            if(Object.keys(data).length == 1) {
                Alert.alert('Error', `${data.msg}`);
            }
            else {
                Alert.alert('Successfully posted!', `${data.msg}`)
            }
            clearPost();
            setRefresh(!refresh);
        })
    }

    const handleCancel = () => {
        clearPost()
    }

    return <View style={{ flex: 1 }}>
        <ScrollView>
            {
                messages.map(message => {
                    return <BadgerChatMessage key={message.id} created={message.created} poster={message.poster} title={message.title} content={message.content}/>
                })
            }
        </ScrollView>
        <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{fontSize:18, fontWeight: 400, padding: 5, alignSelf: 'center'}}>Create A Post</Text>
            <Text>Title</Text>
            <TextInput style={[styles.input, {height: 40}]} onChangeText={(e) => setTitle(e)} />
            <Text>Body</Text>
            <TextInput style={[styles.input, {height: 200}]} onChangeText={(e) => setBody(e)} />
            <Pressable
              style={[styles.gButton]}
              onPress={handleSubmit}>
              <Text style={styles.textStyle}>Create Post</Text>
            </Pressable>
            <View style={{height: 5}}></View>
            <Pressable
              style={[styles.bButton]}
              onPress={handleCancel}>
              <Text style={styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
        {!props.anon 
            ? <Button title='Add Post' color='maroon' onPress={() => setModalVisible(true)}/>
            : <></>
        }
        
        <Button title='Refresh' color='gray' onPress={() => setRefresh(!refresh)}/>
    </View>
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
        borderStyle: 'solid',
        width: 350,
        borderWidth: 1,
        margin: 10,
        padding: 5,
        textAlignVertical: 'top'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, .35)'
    },
    modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    },
    gButton: {
        backgroundColor: 'maroon',
        width: 350,
        height: 30,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
    bButton: {
        backgroundColor: 'gray',
        width: 350,
        height: 30,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
        borderRadius: 15
    },
    textStyle: {
        color: 'white'
    }
});

export default BadgerChatroomScreen;