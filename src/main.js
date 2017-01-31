import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './Counter';
import Nameplate from './Nameplate';

document.addEventListener('DOMContentLoaded', function() {
	ReactDOM.render(
		React.createElement(Nameplate),
		document.getElementById('root')
	);
});
