import React from 'react';
import {Text, View, Button} from 'react-native';
import {create} from 'ipfs-http-client';

export default function App() {
  const client = create('http://localhost:5001');
  const add = async () => {
    try {
      const file = {
        path: '/tmp/rn-ipfs-add-string',
        content: 'Hello World',
      };
      file[Symbol.iterator] = function* () {
        yield file.path, yield file.content;
      };
      const result = await client.add(file);
      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello!</Text>
        <Button onPress={add} title={'Press Me'} />
      </View>
    </>
  );
}
