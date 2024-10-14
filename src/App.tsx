import Layout from "./layout";
import Picker from "./components/picker";

const App = () => (
  <Layout>
    <Picker label="USDT" min="1" max="100" step="1" />
  </Layout>
);

export default App;
