import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import { Container, Box, TextField, Button, Typography, LinearProgress, Grid } from '@mui/material';
import TodoList from './TodoList';
import MorningTodosDrawer from './MorningTodosDrawer';
import RoutineTodosDrawer from './RoutineTodosDrawer';
import { v4 as uuidv4 } from 'uuid';
import { onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth ,db} from './firebase'; // firebase.jsからauthをインポート
import { doc, getDoc, setDoc } from "firebase/firestore";

const APP_KEY = 'sampleApp';

function App() {


  const [todos, setTodos] = useState([]);
  const [level, setLevel] = useState(1);
  const [loading, setLoading] = useState(true); // 初期ローディング状態
  const [defaultMorningTodos, setDefaultMorningTodos] = useState([]);
  const [routineTodos, setRoutineTodos] = useState([]);
  const [currentWidth, setCurrentWidth] = useState([]);
  const [lastTodoTime, setLastTodoTime] = useState([]);
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

   // Firebase Authenticationの状態監視
  // Firebaseの認証状態を監視してユーザーを特定する
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        console.log("User logged in:", currentUser);
        setUser(currentUser);
        await loadUserData(currentUser); // ユーザーデータをFirestoreから取得
      } else {
        console.log("No user logged in");
        setUser(null);
      }
      setLoading(false); // ローディングを終了
    });

    return () => unsubscribe(); // クリーンアップリスナー
  }, []);


  　const loadUserData = async (user) => {
    try {
      const userDocRef = doc(db, 'users', user.uid); // usersコレクション内にユーザーのドキュメント
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        setTodos(data.todos || []);
        setDefaultMorningTodos(data.defaultMorningTodos || []);
        setRoutineTodos(data.routineTodos || []);
        setLevel(data.level || 1);
        setCurrentWidth(data.currentWidth || 0);
        setLastTodoTime(data.lastTodoTime || null);
      } else {
        console.log("No such document, creating new user data...");
        // ドキュメントがない場合、新規にデータをFirestoreに保存
        saveUserData();
      }
    } catch (error) {
      console.error("Error loading user data: ", error);
    }
  };

  // Firestoreにユーザーデータを保存する関数
  const saveUserData = async () => {
    try {
      const userDocRef = doc(db, 'users', user.uid); // usersコレクション内にユーザーのドキュメント
      const userData = {
        todos,
        defaultMorningTodos,
        routineTodos,
        level,
        currentWidth,
        lastTodoTime,
      };
      await setDoc(userDocRef, userData);
      console.log("User data saved successfully");
    } catch (error) {
      console.error("Error saving user data: ", error);
    }
  };

  // todosが変更された時にFirestoreにデータを保存
useEffect(() => {
  if (user) {
    console.log("User ID:", user.uid);  // ここでユーザーIDを確認
    saveUserData();
    console.log("情報保存OK");
  } else {
    console.log("No user is logged in");
  }
  }, [todos, defaultMorningTodos, routineTodos, level, currentWidth, lastTodoTime]);


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
          <Typography variant="h4">漢を磨くTODOS</Typography>
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
