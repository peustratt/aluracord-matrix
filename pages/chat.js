import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';

export default function ChatPage() {
  const [mensagem, setMensagem] = React.useState('');
  const [listaDeMensagens, setListaDeMensagens] = React.useState([]);

  // Desafios solo:
  // - Adicionar botão enviar mensagem
  // - Add deleção de mensagens utilizando o método Array.filter();
  // - Extra dúvida para a live -> como passar um state como props para um route(outra pág)?

  /*
  // Usuário
  - Usuário digita no campo textarea
  - Aperta enter para enviar
  - Tem que adicionar o texto na listagem
  
  // Dev
  - [X] Campo criado
  - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
  - [X] Lista de mensagens 
  */
 function handleDelete(id) {
   console.log(listaDeMensagens)
   setListaDeMensagens(prevMenseng => prevMenseng.filter(menseng => menseng.id !== id))
 };
 
 function handleNovaMensagem(novaMensagem) {
   const mensagem = {
     id: listaDeMensagens.length + 1,
     de: 'peustratt',
     texto: novaMensagem,
    };
    
    if(mensagem.texto.length > 0 && isNotAllWhiteSpaces(mensagem.texto)) {
      setListaDeMensagens((prevListaDeMensagens) => [
      mensagem,
      ...pre,
      ]);
      setMensagem('');}
    }

  return (
    <Box
      styleSheet={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
        color: appConfig.theme.colors.neutrals['000']
      }}
    >
      <Box
        styleSheet={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
          borderRadius: '5px',
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: '100%',
          maxWidth: '95%',
          maxHeight: '95vh',
          padding: '32px',
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            height: '80%',
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: 'column',
            borderRadius: '5px',
            padding: '16px',
          }}
        >
          <MessageList 
            mensagens={listaDeMensagens}
            handleDelete={handleDelete}
          />
          {/* {listaDeMensagens.map((mensagemAtual) => {
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )
                    })} */}
          <Box
            as="form"
            styleSheet={{
              display: 'flex',
              alignItems: 'center',
              height: 'fit-content',
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: '100%',
                border: '0',
                resize: 'none',
                borderRadius: '5px',
                padding: '6px 8px',
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: '12px',
                marginTop: '10px',
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <Button
              variant='tertiary'
              colorVariant='neutral'
              label='Enviar'
              onClick={() => handleNovaMensagem(mensagem)}
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
              styleSheet={{
                width: '90px',
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

function Header() {
  return (
    <>
      <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
        <Text variant='heading5'>
          Chat
        </Text>
        <Button
          variant='tertiary'
          colorVariant='neutral'
          label='Logout'
          href="/"
        />
      </Box>
    </>
  )
}

function MessageList(props) {
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: 'hidden scroll',
        display: 'flex',
        flexDirection: 'column-reverse',
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: '16px',
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: '5px',
              padding: '6px',
              marginBottom: '12px',
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              }
            }}
          >
            <Box
              styleSheet={{
                marginBottom: '8px',
                display: 'flex',
              }}
            >
              <Image
                styleSheet={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  display: 'inline-block',
                  marginRight: '8px',
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">
                {mensagem.de}
              </Text>
              <Text
                styleSheet={{
                  fontSize: '10px',
                  marginLeft: '8px',
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {(new Date().toLocaleDateString())}
              </Text>
              <Button
                variant='tertiary'
                colorVariant='neutral'
                label='Delete'
                buttonColors={{
                  contrastColor: appConfig.theme.colors.neutrals["000"],
                  mainColor: "white",
                  mainColorLight: '#ED4337',
                  mainColorStrong: appConfig.theme.colors.primary[600],
                }}
                styleSheet={{
                  marginLeft: 'auto',
                  marginRight: '1em',
                }}
                onClick={() => props.handleDelete(mensagem.id)}
              />
            </Box>
            {mensagem.texto}
          </Text>
        );
      })}
    </Box>
  )
}

// Checa se a string são somente espaços em branco
function isNotAllWhiteSpaces(string) {
  let stringArray = []
  for (let letra of string) {
    stringArray.push(letra)
  }
  return !stringArray.every((letra) => letra === " ")
}