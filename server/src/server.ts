import express from 'express';

import cors from 'cors'

import routes from './routes'

import path from 'path'

const app = express()
//para que o request.body funcione chamamos o express.json()
app.use(cors())
app.use(express.json())
app.use(routes)

//Rota: endereço completo da requisição.
//Recurso: entidade a ser acessada.
//Get: quando queremos buscar informação, post: quando queremos criar um novo usuário, put: quando queremos atualizar dado, delete: deletar, eliminar o usuário. as rotas são semânticas.
//Request param: parâmetros que vem na própria rota que identificam um recurso.
//Query param: parametros opcionas incluídos na rota geralmente usado para filtro, paginação e dentre outras especificações de pesquisa.
//Request Body: (corpo da requisição) parâmetros para criação e atualização de informações
//const users = [
    //dados de usuários
    //'Julino',
    //'Segunda',
    //'Dídimo'
//]
//retornando usuários
app.get('/', (request, response)=>{
    //retornando usuário por query param
    //const search = String(request.query.search)
    //adicionando filtro com uma estrutura de decisão ternária
    //const filterUser = search ? users.filter(user => users.includes(search)) : users
    response.json('Hello world!')
});
/*/buscando um usuário individual
app.get('/users/:id', (request, response)=>{
    const id = Number(request.params.id)
    const user = users[id]
    return response.json(user)
})

app.post('/users', (request, response)=>{
    //inserindo dados por request.body
    const data = request.body
    const users = {
        name: data.name,
        email: data.email
    }
    return response.json(users)
})*/
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

app.listen(3333)