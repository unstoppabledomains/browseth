import Browseth from 'browseth';

global.XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
global.eth = new Browseth().addContract('c1', '[]', { bytecode: '' });
