import "../styles/globals.css";
import { wrapper } from "../store/index";
import Header from "../components/header";
import { AuthContexProvider } from "../store/authContex";
import { FavContexProvider } from "../store/favoriteContex";
function MyApp({ Component, pageProps }) {
  return (
    <FavContexProvider>
      <AuthContexProvider>
        <Header />
        <Component {...pageProps} />
      </AuthContexProvider>
    </FavContexProvider>
  );
}

export default wrapper.withRedux(MyApp);
