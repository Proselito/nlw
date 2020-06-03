import express from 'express'
//importanto o banco de dados
import ItemsControllers from './Controllers/ItemsControllers'

import PointsController from './Controllers/PointsController'

const itemsControllers = new ItemsControllers
const pointsControllers = new PointsController


const routes = express.Router()



routes.get('/items', itemsControllers.index );
//adicionando dados na base de dados
routes.post('/points', pointsControllers.create)
routes.get('/points', pointsControllers.index)
routes.get('/points/:id', pointsControllers.show)

export default routes