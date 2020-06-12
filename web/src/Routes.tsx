import React from 'react'
import {Route, BrowserRouter} from 'react-router-dom'

import Home from './pages/Home'
import CreatePoint from './pages/CreatePoint'
//criando rotas de navegação
const Routes = () => {
    return (
        <BrowserRouter>
        <Route component={Home} path = "/" exact/>
        <Route component={CreatePoint} path = "/Point"/>
        </BrowserRouter>
    )
}

export default Routes