import React, { useEffect, lazy, Suspense } from 'react';
import { Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { auth } from './firebase';
import { currentUser } from './functions/auth';
import { Spin } from 'antd'


const Header = lazy(() => import('./components/nav/Header'));
const AdminRoute = lazy(() => import('./components/routes/AdminRoute'));
const UserRoute = lazy(() => import('./components/routes/UserRoute'));
const SideDrawer = lazy(() => import('./components/drawer/SideDrawer'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const CategoryCreate = lazy(() => import('./pages/admin/category/CategoryCreate'));
const CategoryUpdate = lazy(() => import('./pages/admin/category/CategoryUpdate'));
const SubCreate = lazy(() => import('./pages/admin/sub/SubCreate'));
const SubUpdate = lazy(() => import('./pages/admin/sub/SubUpdate'));
const CreateCouponPage = lazy(() => import('./pages/admin/coupons/CreateCouponPage'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const CompleteRegisteration = lazy(() => import('./pages/auth/RegisterComplete'));
const CategoryHome = lazy(() => import('./pages/category/CategoryHome'));
const Home = lazy(() => import('./pages/Home'));
const Shop = lazy(() => import('./pages/Shop'));
const Cart = lazy(() => import('./pages/Cart'));
const Payment = lazy(() => import('./pages/Payment'));
const Checkout = lazy(() => import('./pages/Checkout'));
const History = lazy(() => import('./pages/user/History'));
const Password = lazy(() => import('./pages/user/Password'));
const Wishlist = lazy(() => import('./pages/user/Wishlist'));
const AllProducts = lazy(() => import('./pages/admin/product/AllProducts'));
const ProductCreate = lazy(() => import('./pages/admin/product/ProductCreate'));
const ProductUpdate = lazy(() => import('./pages/admin/product/ProductUpdate'));
const Product = lazy(() => import('./pages/Product'));
const SubHome = lazy(() => import('./pages/sub/SubHome'));


const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        // console.log('user', user);
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: 'LOGGED_IN_USER',
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                id: res.data._id
              },
            })
          })
          .catch(error => console.log(error))
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div className="spinner-container">
          <h1 style={{ color: "rgb(22, 119, 255)", fontWeight: "900" }}>Loading</h1>
          <div class="loader">
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
            <div class="circle"></div>
          </div>

        </div>
      }
    >
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/register' component={Register} />
        <Route exact path='/register/complete' component={CompleteRegisteration} />
        <Route exact path='/forgot/password' component={ForgotPassword} />
        <UserRoute exact path='/user/history' component={History} />
        <UserRoute exact path='/user/password' component={Password} />
        <UserRoute exact path='/user/wishlist' component={Wishlist} />
        <UserRoute exact path='/payment' component={Payment} />
        <AdminRoute exact path='/admin/dashboard' component={AdminDashboard} />
        <AdminRoute exact path='/admin/category' component={CategoryCreate} />
        <AdminRoute exact path='/admin/category/:slug' component={CategoryUpdate} />
        <AdminRoute exact path='/admin/sub' component={SubCreate} />
        <AdminRoute exact path='/admin/sub/:slug' component={SubUpdate} />
        <AdminRoute exact path='/admin/product' component={ProductCreate} />
        <AdminRoute exact path='/admin/products' component={AllProducts} />
        <AdminRoute exact path='/admin/product/:slug' component={ProductUpdate} />
        <AdminRoute exact path='/admin/coupon' component={CreateCouponPage} />
        <Route exact path='/product/:slug' component={Product} />
        <Route exact path='/category/:slug' component={CategoryHome} />
        <Route exact path='/sub/:slug' component={SubHome} />
        <Route exact path='/shop' component={Shop} />
        <Route exact path='/cart' component={Cart} />
        <Route exact path='/checkout' component={Checkout} />

      </Switch>
    </Suspense>
  );
}

export default App;