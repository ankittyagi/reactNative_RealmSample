import React, {Component} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput
} from 'react-native';
import Realm from 'realm';

var realm;
export default class realmSample extends Component {
constructor(props) {
    super(props);
    realm = new Realm({
      schema: [
        {
          name: 'Person',
          properties: {
            name: 'string',
            age: 'int'
          }
        }
      ],
      schemaVersion: 5
    });
    this.state = {
      searchKey: '',
      sort: null,
      personAge: '0',
      personName: ''
    }
    this.clearDB = this.clearDB.bind(this);
    this.addDB = this.addDB.bind(this);
  }

  addDB(){
    realm.write(() => {
      realm.create('Person', {name: this.state.personName, age: parseInt(this.state.personAge)});
      this.forceUpdate();
    });
    this.clearText('textInput1')
    this.clearText('textInput2')
  }

  clearDB(){
    realm.write(() => {
      realm.delete(realm.objects('Person'));
      this.forceUpdate();
    });
  }
  render() {
    let persons = realm.objects('Person');
    console.log(this.state.searchKey);
    if (this.state.searchKey && this.state.searchKey.length>0){
      persons = persons.filtered(`name CONTAINS "${this.state.searchKey}"`);
    }
    if (this.state.sort){
      persons = persons.sorted(this.state.sort);
    }
    return (
      <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={() => this.setState({sort:'name'})}>
        <Text style={styles.buttonText}>Sort By Name</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => this.setState({sort:'age'})}>
        <Text style={styles.buttonText}>Sort By Age</Text>
      </TouchableOpacity>
      <TextInput style={styles.textInput}
        onChangeText={(text) => this.setState({searchKey: text})}
        value={this.state.searchKey}/>
        {persons.map((person, i)=>(
          <Text key={i} style={styles.instructions}>
            Person - {i}: {person.name}({person.age})
          </Text>
        ))}
        <TouchableOpacity style={styles.button} onPress={this.clearDB}>
          <Text style={styles.buttonText}>Clear!</Text>
        </TouchableOpacity>
        <TextInput style={styles.textInput} ref={'textInput1'}
          onChangeText={(text) => this.setState({personName: text})}
          value={this.state.personName}/>
          <TextInput style={styles.textInput} ref={'textInput2'}
            onChangeText={(text) => this.setState({personAge: text})}
            value={this.state.personAge}/>

        <TouchableOpacity style={styles.button} onPress={this.addDB}>
          <Text style={styles.buttonText}>Add Into Database</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  textInput: {
    height:50,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 10
  },
  pickerInput:{
    width:200,
    height:50,
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
    fontSize: 20
  },
  button:{
    backgroundColor:'darkblue',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    height:40
  },
  buttonText:{
    color: 'white',
    fontSize: 20
  }
});