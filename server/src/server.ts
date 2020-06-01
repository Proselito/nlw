import express from 'express';

const app = express()

app.get('/users', (request, response)=>{
    response.json([
        'Julino',
        'Segunda',
        'Dídimo'
    ])
});

app.listen(3333)