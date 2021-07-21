import React from 'react';
import {Text, View, Button} from 'react-native';
import {create} from 'ipfs-http-client';
import {inspect} from 'util';

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
  const cat = async () => {
    const CID = 'QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB';

    try {
      console.log('Demo App .cat start');

      const chunks = [];
      for await (const chunk of client.cat(CID)) {
        console.log('Demo App .cat', {chunk, type: typeof chunk});
        chunks.push(chunk);
      }
      const buffer = chunks.reduce((acc, chunk) => [...acc, ...chunk], []);
      const content = new TextDecoder().decode(new Uint8Array(buffer));

      console.log('Demo App .cat', {content});
    } catch (error) {
      console.error('Demo App .cat', {error});
    }
  };
  const IdScreen = () => {
    const id = async () => {
      try {
        console.log('Demo App .id start');
        console.log('Demo App .id', {result: inspect(await client.id())});
      } catch (error) {
        console.error('Demo App .id', {error});
      }
    };
  };
  const get = async () => {
    const CID = 'QmfGBRT6BbWJd7yUc2uYdaUZJBbnEFvTqehPFoSMQ6wgdr';
    try {
      console.log('Demo App .get start');

      for await (const file of client.get(CID)) {
        if (!file.content) {
          continue;
        }

        const content = [];

        for await (const chunk of file.content) {
          content.push(chunk);
        }

        console.log(
          'Demo App .get',
          inspect({
            file,
            content,
          }),
        );
      }
    } catch (error) {
      console.error('Demo App .get', {error});
    }
  };

  return (
    <>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Hello!</Text>
        <Button onPress={get} title={'Press Me'} />
      </View>
    </>
  );
}
