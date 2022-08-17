import { Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Messenger from "./pages/Messenger";
import UserAuth from "./utils/UserAuth";
import RequireAuth from "./utils/RequireAuth";

const App: React.FC = () => {
  return (
    <UserAuth>
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth>
              <Messenger />
            </RequireAuth>
          }
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </UserAuth>
  );
};

export default App;
