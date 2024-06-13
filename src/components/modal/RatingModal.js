import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { Modal } from 'antd'
import { useSelector } from 'react-redux'
import { StarOutlined } from '@ant-design/icons'
import { useHistory, useParams } from 'react-router-dom'

const RatingModal = ({ children }) => {



    const { user } = useSelector((state) => ({ ...state }))

    const [modalVisible, setModalVisible] = useState(false)

    let history = useHistory();
    let { slug } = useParams();


    // console.log("User:", user);
    // console.log("Slug:", slug)

    const handleModal = () => {
        if (user && user.token) { setModalVisible(true) }
        else {
            // Redirect the user to the login page and save the intended page slug
            history.push({
                pathname: '/login',
                state: { from: `/product/${slug}` },
            })
        }
    }

    return (

        <>
            <div onClick={handleModal}>
                <StarOutlined className='text-danger' /><br />{""}
                {user ? "Leave rating " : "Login to leave rating"}
            </div>
            <Modal
                title="Leave your rating"
                centered
                open={modalVisible}
                onOk={() => {
                    setModalVisible(false)
                    toast.success("Thanks for your review. It will appear soon")
                }}
                onCancel={() => { setModalVisible(false) }}
            >
                {children}
            </Modal>
        </>
    )
}

export default RatingModal
