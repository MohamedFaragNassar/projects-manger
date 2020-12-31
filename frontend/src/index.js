import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux'
import store from './store'
import { ApolloClient, InMemoryCache,ApolloProvider ,createHttpLink,gql} from '@apollo/client';
import {setContext} from '@apollo/client/link/context'



const userData = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null 

const httpLink = createHttpLink({
  uri: 'http://localhost:5000/graphql',
});

const httpLink2 = createHttpLink({
  uri: 'http://localhost:5000/api',
});
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('userInfo')?JSON.parse(localStorage.getItem('userInfo')).login.token:null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});
const client = new ApolloClient({
  link: userData ? authLink.concat(httpLink) : httpLink2  ,
  cache: new InMemoryCache()
});



ReactDOM.render(
  <ApolloProvider client={client} >
    <Provider store={store}>
      <App />
    </Provider>
  </ApolloProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
