var ClientApp = require('../shared/components/home')
var ClientApp = require('../shared/components/station')

var Layout = require('../shared/components/layout').default
var ReactDOM = require('react-dom')
var React = require('react')

window.loadProps = function(name, layout, props){
	var Component = React.createElement( require("../shared/components/" + name).default, props)
	ReactDOM.render(React.createElement(Layout, props, Component), document)
}