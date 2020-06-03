import {Request, Response} from 'express'
import knex from '../database/connection'

class PointsController{

    async index(request: Request, response: Response){
        const {city, uf, items} = request.query
        //convertendo em array, por separação com o split
        const parsedItem = String(items)
        .split(',')
        .map(item => Number(item.trim()))

        const points = await knex('points')
        .join('point_items', 'point_id', '=', 'point_items.point_id')
        .whereIn('point_items.item_id', parsedItem)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')
        return response.json(points)
    }

    async show(request: Request, response: Response){
        const {id} = request.params;

        const point = await knex('points').where('id', id).first()
        if(!point){
            return response.status(400).json({
                messagem: 'ponto não encontrado'
            })
        }

        const items = await knex('items').join('point_items', 'items.id', '=', 'point_items.item_id').where('point_items.pont_id', id).select('items.title')

        return response.json({point, items})
    }
    async create(request: Request, response: Response) {
        const {
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body
    
        const trx = await knex.transaction()

        const point = {
            image:'image_fake',
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf

        }
    
        const selectedIds = await trx('points').insert(point)
        //inserindo uma tabela dentro de outra
        const point_id = selectedIds[0]
    
        const pointItems = items.map((item_id: number) =>{
            return {
                item_id,
                point_id,
            }
        })
        await trx('point_items').insert(pointItems);

        await trx.commit()
    
    return response.json({
        id: point_id,
        ...point
    })
    }
}


export default PointsController