// import 'babel-polyfill'

import React from 'react'
import {render} from 'react-dom'
import Root from './containers/Root.jsx'
import "./scss/index.less"
// app.model(require('./models/products'));
render(
	<Root/>,
	document.getElementById('root')
)