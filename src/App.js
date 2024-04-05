import React, { useState, useEffect, useContext, useReducer } from 'react';
import './App.css';

const UserContext = React.createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USERS':
      return { ...state, loading: true };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, loading: false, users: action.payload };
    case 'FETCH_USERS_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'DELETE_USER':
      return { ...state, users: state.users.filter(user => user.id !== action.payload) };
    default:
      return state;
  }
};

function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const decrement = () => {
    setCount(count - 1);
  };

  return (
    <div className='container fadeIn'>
      <h2 className='fadeIn'>Пример счетчика:</h2>
      <p className='fadeIn'>Текущее значение: {count}</p>
      <button className='fadeIn buttonScore' onClick={increment}>Увеличить</button>
      <button className='fadeIn buttonScore' onClick={decrement}>Уменьшить</button>
    </div>
  );
}

function App() {
  const [state, dispatch] = useReducer(userReducer, {
    users: [],
    loading: false,
    error: null
  });

  useEffect(() => {
    dispatch({ type: 'FETCH_USERS' });
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(response => response.json())
      .then(data => dispatch({ type: 'FETCH_USERS_SUCCESS', payload: data }))
      .catch(error => dispatch({ type: 'FETCH_USERS_ERROR', payload: error }));
  }, []);

  return (
    <div className='fadeIn container'>
      <h1 className='fadeIn'>Приложение для управления пользователями</h1>
      <UserContext.Provider value={{ state, dispatch }}>
        <UserList />
        <AddUserForm />
      </UserContext.Provider>
      <Counter />
    </div>
  );
}

function UserList() {
  const { state, dispatch } = useContext(UserContext);
  const { users, loading, error } = state;

  const handleDeleteUser = (userId) => {
    dispatch({ type: 'DELETE_USER', payload: userId });
  };

  if (loading) return <p>Загрузка пользователей...</p>;
  if (error) return <p>Ошибка загрузки пользователей: {error.message}</p>;

  return (
    <div className='fadeIn container'>
      <h2 className='fadeIn'>Список пользователей:</h2>
      <ul className='fadeIn'>
        {users.map(user => (
          <li className='fadeIn' key={user.id}>
            {user.name}
            <button className='fadeIn' onClick={() => handleDeleteUser(user.id)}>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function AddUserForm() {
  const { dispatch } = useContext(UserContext);
  const [userName, setUserName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = { id: Date.now(), name: userName };
    dispatch({ type: 'ADD_USER', payload: newUser });
    setUserName('');
  };

  return (
    <div className='fadeIn container'>
      <h2 className='fadeIn'>Добавить нового пользователя:</h2>
      <form className='fadeIn' onSubmit={handleSubmit}>
        <input
          className='fadeIn'
          type="text"
          placeholder="Имя пользователя"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <button className='fadeIn' type="submit">Добавить</button>
      </form>
    </div>
  );
}

export default App;