import "../styles/globals.css";
import { wrapper } from "../store/index";
import Header from "../components/header";
import { AuthContextProvider } from "../store/authContex";
import { FavContexProvider } from "../store/favoriteContex";

function MyApp({ Component, pageProps }) {
  return (
    <FavContexProvider>
      <AuthContextProvider>
        <Header />
        <Component {...pageProps} />
      </AuthContextProvider>
    </FavContexProvider>
  );
}

export default wrapper.withRedux(MyApp);