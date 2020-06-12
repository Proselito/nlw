import React, {useEffect, useState, ChangeEvent, FormEvent} from 'react'
import {Link, useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'

import axios from 'axios'

import {Map, TileLayer, Marker} from 'react-leaflet'

import api from '../../services/api'

import './style.css'
import logo from '../../assets/logo.svg'
import { LeafletMouseEvent } from 'leaflet'

//sempre que criamos um estado para um array, ou objecto precisamos manualmente informar o tipo de variável a ser usada
interface Item {
    id: number,
    title: string,
    image_url: string
}

interface IBGEUFResponse {
    sigla: string
}
interface IBGECityResponse {
    name: string
}
const CreatePoint = () => {
    //usando dados externos (da base de dados) armazenando eles
    //criando estados
    const [items, setItems] = useState<Item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])

    const [inputData, setInputData] = useState({
        name: '',
        email: '',
        whatsapp: ''
    })
    const [selectItem, setSelectItem] = useState<number[]>([])

    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])

    const [selectedUf, setSelesctedUf] = useState("0")
    const [selectedCity, setSelesctedCity] = useState("0")
    const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0])

    const history = useHistory()

    useEffect(() =>{
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude, longitude} = position.coords

            setInitialPosition([latitude, longitude])
        })
    }, [])
    
    useEffect(() => {
        //chamando a api e fazendo ela funcionar, lembrando que esta api é uma prómisse por isso usamos o then()... a api usada aqui é para consumir os dados das imagens das coletas
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []);

    useEffect(() => {
        //A api usada aqui é para coletar os dados do IBGE que exibe os estados por cidade
        axios.get<IBGEUFResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(response => {
            const ufInitials = response.data.map(uf => uf.sigla)
            
            setUfs(ufInitials)
        })
    }, [])

    useEffect(() => {
        if(selectedUf === '0'){
            return
        }
        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`).then(response => {
            const cityNames = response.data.map(city => city.name)
            
            setCities(cityNames)
        })

    }, [selectedUf])

    function handleSelectedUf (event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value
        setSelesctedUf(uf)
    }

    function handleSelectedCity (event: ChangeEvent<HTMLSelectElement>){
        const city = event.target.value
        setSelesctedCity(city)
    }

    function setLocalArea(event: LeafletMouseEvent){
        setSelectedPosition([
            event.latlng.lat,
            event.latlng.lng
        ])
    }

    function handleInputChange(event: ChangeEvent<HTMLInputElement>){
        const {name, value} = event.target
        setInputData({...inputData, [name]: value })
    }

    function handleSelectItem(id: number){
        const alReadySelected = selectItem.findIndex(item => item === id)
        
        if( alReadySelected >= 0 ){
            const filteredItem = selectItem.filter(item => item !== id)
            setSelectItem(filteredItem)

        } else {
            setSelectItem([...selectItem, id])
        }
        console.log('toque')
    }

    async function handleSubmit(event: FormEvent){
        //para previnir recarregamento (reload) da página
        event.preventDefault()
        const {name, email, whatsapp} = inputData
        const uf = selectedUf
        const city = selectedCity
        const [latitude, longitude] = selectedPosition
        const items = selectItem

        const data = {
            name,
            email,
            whatsapp,
            uf,
            city,
            latitude,
            longitude,
            items
        }
        await api.post('points', data)

        alert('Ponto de coleta registrado')
        history.push('/')
    }

    return (
        <div id="page-create-point">
            <header>
                <img src={logo} alt="Simbolo universal de reciclagem" />
                <Link to ="/">
                    <FiArrowLeft/>
                    voltar para home
                </Link>
            </header>
            <form onSubmit={handleSubmit}>
                <h1>Cadastro do <br/>ponto de coleta</h1>
                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>
                    <div className="field">
                        <label htmlFor="name">Nome da entidade: </label>
                        <input 
                        type="text"
                        name="name"
                        id="name"
                        onChange={handleInputChange}
                        />
                    </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">email: </label>
                            <input 
                            type="email"
                            name="email"
                            id="email"
                            onChange={handleInputChange}
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">whatsapp: </label>
                            <input 
                            type="text"
                            name="whatsapp"
                            id="whatsapp"
                            onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>selecione o endereço no mapa</span>
                    </legend>
                    <Map center={ initialPosition } zoom={15} onclick={setLocalArea}>
                        <TileLayer attribution='&amp;
                            copy <a href="http://osm.org/copyright">OpenStreetMap</    a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                        
                        <Marker position ={selectedPosition}/>
                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (UF)</label>
                            <select 
                            name="uf" 
                            id="uf" 
                            value={selectedUf} 
                            onChange={handleSelectedUf}
                            >
                                <option value="0">SELECIONE UMA UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </div>

                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={selectedCity} onChange={ handleSelectedCity }>
                                <option value="0">SELECIONE UMA CIDADE</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Itens de coleta</h2>
                        <span>Selecione um ou mais itens</span>
                    </legend>
                    <ul className="items-grid">
                        {/*varrendo dados de um elemento*/}
                        {items.map(item => (
                            <li key={item.id} onClick={() => handleSelectItem(item.id)} className = {selectItem.includes(item.id) ? 'selected' : ''}>
                                <img src={item.image_url} alt={item.title} />
                                <span>{item.title}</span>
                            </li>
                        ))}

                    </ul>
                </fieldset>
                <button type="submit">
                    Cadastro de coleta
                </button>
            </form>
        </div>
    )
}

export default CreatePoint