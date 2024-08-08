import {
    AppstoreOutlined,
    LogoutOutlined,
    SettingOutlined,
    ShoppingCartOutlined,
    ShoppingOutlined,
    UserAddOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Menu, Badge } from 'antd';
import firebase from "firebase/compat/app";
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import Seacrh from '../forms/Seacrh';

const { SubMenu, Item } = Menu

const Header = () => {
    const [current, setCurrent] = useState('home');
    let dispatch = useDispatch();
    let history = useHistory()
    let { user, cart } = useSelector((state) => ({ ...state }))

    const handleClick = (e) => {
        // console.log('click ', e);
        setCurrent(e.key);
    };

    const logout = () => {
        firebase.auth().signOut();
        dispatch({
            type: "LOGOUT",
            payload: null,
        });
        history.push('/login');
    }

    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Item key="home" icon={<AppstoreOutlined />}>
                <Link to="/" style={{ textDecoration: "none" }}>Home</Link>
            </Item>
            <Item key="shop" icon={<ShoppingOutlined />}>
                <Link to="/shop" style={{ textDecoration: "none" }}>Shop</Link>
            </Item>

            <Item key="cart" icon={<ShoppingCartOutlined />}>
                <Link to="/cart" style={{ textDecoration: "none" }}>
                    <Badge count={cart.length} size="small" offset={[9, 0]}>
                        Cart
                    </Badge>
                </Link>
            </Item>

            {!user && (
                <Item key="register" icon={<UserAddOutlined />} className='float-right'>
                    <Link style={{ textDecoration: "none" }} to="/register">Register</Link>
                </Item>
            )}

            {!user && (
                <Item key="login" icon={<UserOutlined />} className='float-right'>
                    <Link style={{ textDecoration: "none" }} to="/login">Login</Link>
                </Item>
            )}

            {user && (
                <SubMenu title={user && user.email.split('@')[0]} icon={<SettingOutlined />} className='float-right'>
                    {
                        user && (
                            user.role === 'Subscriber' && <Item key="setting:1"><Link style={{ textDecoration: "none" }} to="/user/history">Dashboard</Link></Item>
                        )
                    }
                    {
                        user && (
                            user.role === 'admin' && <Item key="setting:2"><Link to="/admin/dashboard">Dashboard</Link></Item>
                        )
                    }

                    <Item key="setting:3" onClick={logout} icon={<LogoutOutlined />}>Logout</Item>
                </SubMenu>
            )}

            <span className='float-right p-1'>
                <Seacrh />
            </span>

        </Menu>
    );
};
export default Header;