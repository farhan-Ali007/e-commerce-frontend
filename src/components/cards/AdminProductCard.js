import React from 'react'
import { Card } from 'antd'
import { Link } from 'react-router-dom'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import laptop from '../../images/laptop.png'
const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {

    //destructure

    const { title, images, description, slug } = product

    return (
        <Card cover={
            <img alt=''
                src={images && images.length ? images[0].url : laptop}
                style={{ height: "150px", objectFit: "cover" }}
                className='p-1' />
        }
            actions={[
                <Link to={`/admin/product/${slug}`}> <EditOutlined
                    className='text-success' /></Link>,
                <DeleteOutlined
                    className='text-danger'
                    onClick={() => handleRemove(slug)} />]}>
            <Meta
                title={title}
                description={`${description && description.substring(0, 40)}.... `} />
        </Card>
    )
}

export default AdminProductCard
