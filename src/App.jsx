import './App.css';
import SignUp from './components/SignUp/Signup';
import Home from './components/Home/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn';
import { AuthProvider } from './context/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './components/Profile/Profile';
import EditProfile from './components/EditProfile/EditProfile';
import RouteOutlet from './components/RouteOutlet/RouteOutlet';
import AuthenticatedRoute from './components/hoc/AuthenticatedRoute';
import Chat from './components/Chat/Chat';
import Teams from './components/Teams/Teams';
import NewTeam from './components/NewTeam/NewTeam';
import Users from './components/Users/Users';
import Conversations from './components/Conversations/Conversations';
import { ConversationsProvider } from './context/ConversationsContext';
import Conversation from './components/Conversations/Conversation';
import DefaultConversationView from './components/Conversations/DefaultConversationView';

function App() {
  return (
    <div className="flex flex-1 rounded-lg overflow-hidden shadow-lg">
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Sidebar />}>
              <Route index element={<Home />} />

              <Route
                path="users"
                element={
                  <AuthenticatedRoute>
                    <RouteOutlet />
                  </AuthenticatedRoute>
                }
              >
                <Route index element={<Users />} />
                <Route path=":username" element={<RouteOutlet />}>
                  <Route index element={<Profile />} />
                  <Route path="edit" element={<EditProfile />} />
                </Route>
              </Route>

              <Route
                path="teams"
                element={
                  <AuthenticatedRoute>
                    <RouteOutlet />
                  </AuthenticatedRoute>
                }
              >
                <Route index element={<Teams />} />
                <Route path="new-team" element={<NewTeam />} />
                <Route path=":teamId" element={<Chat />} />
              </Route>
              <Route
                path="conversations"
                element={
                  <AuthenticatedRoute>
                    <ConversationsProvider>
                      <Conversations />
                    </ConversationsProvider>
                  </AuthenticatedRoute>
                }
              >
                <Route index element={<DefaultConversationView />} />
                <Route path=":conversationId" element={<Conversation />} />
              </Route>

              <Route
                path="profile"
                element={
                  <AuthenticatedRoute>
                    <RouteOutlet />
                  </AuthenticatedRoute>
                }
              >
                <Route index element={<Profile />} />
                <Route path="edit" element={<EditProfile />} />
              </Route>
              <Route path="signup" element={<SignUp />} />
              <Route path="signin" element={<SignIn />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
