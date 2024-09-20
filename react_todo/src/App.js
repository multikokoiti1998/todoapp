import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Container, Box, TextField, Button, Typography, LinearProgress, Grid } from '@mui/material';
import TodoList from './TodoList';
import MorningTodosDrawer from './MorningTodosDrawer';
import RoutineTodosDrawer from './RoutineTodosDrawer';
import { v4 as uuidv4 } from 'uuid';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from './firebase'; // firebase.jsからauthをインポート

const APP_KEY = 'sampleApp';

function App() {
  const savedState = localStorage.getItem(APP_KEY);
  const initialState = savedState ? JSON.parse(savedState) : {
    todos: [],
    defaultMorningTodos: [],
    routineTodos: [],
    level: 1,
    currentWidth: 0,
    lastTodoTime: null
  };

  const [todos, setTodos] = useState(initialState.todos || []);
  const [level, setLevel] = useState(initialState.level);
  const [defaultMorningTodos, setDefaultMorningTodos] = useState(initialState.defaultMorningTodos || []);
  const [routineTodos, setRoutineTodos] = useState(initialState.routineTodos || []);
  const [currentWidth, setCurrentWidth] = useState(initialState.currentWidth);
  const [lastTodoTime, setLastTodoTime] = useState(initialState.lastTodoTime);
  const [pushupClass, setPushupClass] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const todoNameRef = useRef(null);

   // ユーザー登録（サインアップ）処理
   const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user); // ユーザー登録後にログイン状態にする
      setError(''); // エラーメッセージをクリア
      console.log('ユーザー登録成功:', userCredential.user.email);
    } catch (err) {
      setError('ユーザー登録に失敗しました: ' + err.message);
    }
  };

  // サインイン処理
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError('');
      console.log('サインイン成功:', userCredential.user.email);
    } catch (err) {
      setError('サインインに失敗しました: ' + err.message);
    }
  };

  // サインアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log('サインアウト成功');
    } catch (err) {
      console.error('サインアウトに失敗しました:', err.message);
    }
  };


  useEffect(() => {
    const savedState = localStorage.getItem(APP_KEY);
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      setTodos(parsedState.todos || []);
      setDefaultMorningTodos(parsedState.defaultMorningTodos || []);
      setRoutineTodos(parsedState.routineTodos || []);
      setLevel(parsedState.level || 1);
      setCurrentWidth(parsedState.currentWidth || 0);
      setLastTodoTime(parsedState.lastTodoTime || null);
    }
  }, []); // 初回レンダリング時のみ実行する

  useEffect(() => {
    const stateToSave = { todos, defaultMorningTodos, routineTodos, level, currentWidth, lastTodoTime };
    localStorage.setItem(APP_KEY, JSON.stringify(stateToSave));
    console.log("Saving state to localStorage:", stateToSave);
    console.log("defaultMorningTodos:", defaultMorningTodos);
  }, [todos, defaultMorningTodos, routineTodos, level, currentWidth, lastTodoTime]);
  

  // useEffect(() => {
  //   const checkTimeAndNotify = () => {
  //     const now = new Date();
  //     const hours = now.getHours();
  //     const minutes = now.getMinutes();

  //     if (hours >= 6 && minutes >= 0) {
  //       setTodos((prevTodos) => [...prevTodos, ...defaultMorningTodos.map(todo => ({
  //         ...todo,
  //         id: uuidv4(),
  //         completed: false
  //       }))]);
  //       setLastTodoTime(new Date().toISOString());
  //       new Notification('TODOリマインダー', {
  //         body: `朝だ、準備しろ！ (${hours}:00)。`,
  //         icon: '/path/to/icon.png'
  //       });
  //     }

  //     if (hours >= 8 && minutes >= 0) {
  //       const lastTodoDate = new Date(lastTodoTime);
  //       const today = new Date();
  //       today.setHours(0, 0, 0, 0);

  //       if (!lastTodoTime || lastTodoDate < today) {
  //         new Notification('TODOリマインダー', {
  //           body: `やることやれ (${hours}:00)。`,
  //           icon: '/path/to/icon.png'
  //         });
  //         setLevel(prevLevel => Math.max(0, prevLevel - 1));
  //       }
  //     }

  //     const incompleteTodos = todos.filter(todo => !todo.completed).length;
  //     if (incompleteTodos >= 3) {
  //       setLevel(prevLevel => Math.max(0, prevLevel - 2));
  //     }
  //   };

  //   const interval = setInterval(checkTimeAndNotify, 60000);

  //   return () => clearInterval(interval);
  // }, [lastTodoTime, todos, defaultMorningTodos]);


  const handleAddTodo = () => {
    const name = todoNameRef.current.value;
    if (name === '') return;
    setTodos((prevTodos) => [...prevTodos, { id: uuidv4(), name: name, completed: false }]);
    setLastTodoTime(new Date().toISOString());
    todoNameRef.current.value = '';
  };
  // モーニングタスクを追加する関数
  const handleAddMorningTodos = (newTodoName) => {
    const newTodo = {
      id: Date.now(),
      name: newTodoName,
    };
    setDefaultMorningTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  // ルーティンタスクを追加する関数
  const handleAddRoutineTodo = (newTodoName) => {
    const newTodo = {
      id: Date.now(), // 一意のIDを生成
      name: newTodoName,
      completed: false
    };
    setRoutineTodos((prevTodos) => [...prevTodos, newTodo]);
  };

  
// タスク名を変更する関数
  const handleTodoChange = (id, newName) => {
    setDefaultMorningTodos(defaultMorningTodos.map(todo =>
      todo.id === id ? { ...todo, name: newName } : todo
    ));
    localStorage.setItem('defaultMorningTodos', JSON.stringify(defaultMorningTodos));
  };
// タスク名を変更する関数
  const handleRoutineTodoChange = (id, newName) => {
    setRoutineTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, name: newName } : todo
      )
    );};
//ルーチンをapp.jsに追加
const handleAddAllRoutineTodos = () => {
  if (!routineTodos || routineTodos.length === 0) {
    console.log('No routine todos to add');
    return;
  }

  setTodos((prevTodos) => [
    ...prevTodos,
    ...routineTodos.map(todo => ({ ...todo, id: uuidv4(), completed: false }))
  ]);
};

//レベルアップ関数
  const toggleTodo = (id) => {
    const newTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    const filteredTodos = newTodos.filter(todo => !todo.completed);
    const newWidth = currentWidth + 20;

    if (newWidth >= 100) {
      setLevel(level + 1);
      setCurrentWidth(0);
    } else {
      setCurrentWidth(newWidth);
    }

    setTodos(filteredTodos);
    // アニメーションのクラスを一時的に追加
  setPushupClass('pushup-animation');

  // 0.5秒後にクラスを削除してアニメーションをリセット
  setTimeout(() => {
    setPushupClass('');
  }, 500);
  };
//削除関数
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const handleDeleteMorningTodo = (id) => {
    setDefaultMorningTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
};
  
  const handleDeleteRoutineTodo = (id) => {
    setRoutineTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
};
  
return (
  <>
 {/* ヘッダー部分 */}
 <header>
        <Container maxWidth="lg" style={{ padding: '10px 0', textAlign: 'center', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h4">TODOアプリケーション</Typography>
          {user ? (
            <div>
              <Typography variant="subtitle1">こんにちは、{user.email}さん</Typography>
              <Button variant="contained" color="secondary" onClick={handleLogout}>
                ログアウト
              </Button>
            </div>
          ) : (
            <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
              <TextField
                label="メールアドレス"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                style={{ marginRight: '10px' }}
              />
              <TextField
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="small"
                style={{ marginRight: '10px' }}
              />
              <Button variant="contained" color="primary" type="submit">
                {isSignUp ? '登録' : 'ログイン'}
              </Button>
            </form>
          )}
          {error && <Typography color="error">{error}</Typography>}
          <Button color="primary" onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? '既存アカウントでログイン' : '新規アカウントを作成'}
          </Button>
        </Container>
      </header>

    {/* メインコンテンツ部分 */}
    <Grid container spacing={2}> 
      <Grid item xs={6}>
        <Container maxWidth="sm" className={`app-container ${pushupClass}`} style={{ 
          backgroundImage: 'url("/goodman.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          height: '100vh'
        }}>
          <Box mt={4} mb={2} textAlign="center">
            <Typography variant="h4">TODOリスト</Typography>
          </Box>
          <Box display="flex" mb={2}>
            <TextField
              inputRef={todoNameRef}
              label="新しいタスク"
              variant="outlined"
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleAddTodo}>
              追加
            </Button>
          </Box>
          <TodoList todos={todos} toggleTodo={toggleTodo} deleteTodo={deleteTodo} />
          <Box mt={2}>
            <Typography variant="subtitle1">残りのタスク: {todos.filter((todo) => !todo.completed).length}</Typography>
            <Typography variant="subtitle1">漢レベル: {level}</Typography>
            <LinearProgress variant="determinate" value={currentWidth} />
          </Box>
        </Container>
      </Grid>     
      <Grid item xs={3}>
        <MorningTodosDrawer
          defaultMorningTodos={defaultMorningTodos} 
          handleTodoChange={handleTodoChange} 
          handleAddMorningTodos={handleAddMorningTodos} 
          handleDeleteMorningTodo={handleDeleteMorningTodo}
        />
      </Grid>
      <Grid item xs={3}>
        <RoutineTodosDrawer
          routineTodos={routineTodos} 
          handleAddRoutineTodo={handleAddRoutineTodo} 
          handleRoutineTodoChange={handleRoutineTodoChange} 
          handleDeleteRoutineTodo={handleDeleteRoutineTodo} 
          handleAddAllRoutineTodos={handleAddAllRoutineTodos}
        />
      </Grid>
    </Grid>
  </>
);
}


export default App;
