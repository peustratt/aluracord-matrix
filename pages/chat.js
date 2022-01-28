import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useState, useEffect } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyMjI2MCwiZXhwIjoxOTU4ODk4MjYwfQ.6Co7yOWdweSTpdt3gLQLXKT1bn95VUWdlW38Z253tBg'
const SUPABASE_URL = 'https://donojqicvarkgazklmcl.supabase.co'
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const listaDeMensagensMock = [
	{
		de: 'lorem',
		texto: 'random-thing happen everyday'
	},
	{
		de: 'lorem',
		texto: 'random-thing happen everyday'
	},
	{
		de: 'lorem',
		texto: 'random-thing happen everyday'
	},
	{
		de: 'lorem',
		texto: 'random-thing happen everyday'
	},
	{
		de: 'lorem',
		texto: 'random-thing happen everyday'
	},
]

export default function ChatPage() {
	const [mensagem, setMensagem] = useState('');
	const [listaDeMensagens, setListaDeMensagens] = useState(listaDeMensagensMock);
	const [hasLoaded, setHasLoaded] = useState(() => false)


	useEffect(() => {
		const dadosSupabase = supabaseClient
			.from('mensagens')
			.select('*')
			.order('id', { ascending: false })
			.then(data => {
				console.log('dados da consulta', data.data);
				setListaDeMensagens(data.data)
				setHasLoaded(true)
			})
	}, [])

	// Desafios solo:
	// - Adicionar botão enviar mensagem 
	// - Add deleção de mensagens utilizando o método Array.filter();
	// - Extra dúvida para a live -> como passar um state como props para um route(outra pág)?

	function handleDelete(id) {
		setListaDeMensagens(prevMenseng => prevMenseng.filter(menseng => menseng.id !== id))
	};

	function handleNovaMensagem(novaMensagem) {
		const mensagem = {
			// id: listaDeMensagens.length + 1,
			de: 'peustratt',
			texto: novaMensagem,
		};

		supabaseClient
			.from('mensagens')
			.insert([
				mensagem
			])
			.then(data => {
				if (data.data[0].texto.length > 0 && isNotAllWhiteSpaces(data.data[0].texto)) {
					setListaDeMensagens((prevListaDeMensagens) => [
						data.data[0],
						...prevListaDeMensagens,
					]);
					setMensagem('');
				}
			})
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
					position: 'relative',
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
				{!hasLoaded && <div style={{
					backgroundColor: 'rgba(255, 255, 255, 0.3)',
					backdropFilter: 'blur(6px)',
					borderRadius: '5px',
					position: 'absolute',
					inset: '0',
					zIndex: '1',
				}}></div>}
				{!hasLoaded && <Spinner customText={"Eita fetch demorado..."} />}
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
	return (
		<>
			<Box
				tag="ul"
				styleSheet={{
					position: 'relative',
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
			{/* <style jsx>{`
				.modal {
					position: absolute;
					inset: 0;
					background: rgba(255, 255, 255, 0.3);
      				backdrop-filter: blur(6px);
					border-radius: 5px;
					z-index: 1;
				}
			`}
			</style> */}
		</>
	)
}

function Spinner(props) {
	return (
		<>
			<div className="spinner-container">

				<svg width="100%" viewBox="0 0 276 276" fill="none" xmlns="http://www.w3.org/2000/svg" >
					<g id="spinner">
						<circle id="bottom" cx="138" cy="138" r="114" stroke="#E4E7EB" stroke-width="18" />
						<circle id="upper" cx="138" cy="138" r="123" stroke="#57AE5B" stroke-width="30" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="373 100" style={{ animationDuration: props.speed + "s" }} />
					</g>
				</svg>
				<p>{props.customText}</p>
			</div>
			<style jsx>{`
				.spinner-container {
					z-index: 99;
					position: fixed;
					width: 100px;
					padding: 10px;
					top: 50%;
					display: flex;
					justify-content: center;
					align-content: center;
					flex-direction: column;
					left: 50%;
					margin-top: -100px; 
					margin-left: -50px;
					border-radius: 0.5rem;
				}

				.spinner-container p
				{
					text-align: center;
					margin: 5px 0 0 0;
				}

				#upper

				{
					animation: rotate;
					animation-duration: 3s;
					animation-iteration-count: infinite;
					transform-origin: center;
				}

				@keyframes rotate {
					0%
					{
						transform: rotateZ(0deg);
					}
					100%
					{
						transform: rotateZ(360deg);
					}
				}
			`}</style>
		</>

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