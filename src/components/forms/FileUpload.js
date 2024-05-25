import React from 'react'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { Avatar, Badge } from 'antd'

const FileUpload = ({ values, setValues, setLoading }) => {


    const { user } = useSelector((state) => ({ ...state }))

    const fileUploadAndResize = (e) => {
        // console.log(e.target.files)
        //resize

        let files = e.target.files
        let allUploadedFiles = values.images
        if (files) {
            setLoading(true)
            for (let i = 0; i < files.length; i++) {
                Resizer.imageFileResizer(files[i], 720, 720, 'JPEG', 100, 0, (uri) => {
                    // console.log(uri)
                    axios.post(`${process.env.REACT_APP_API}/uploadimages`, { image: uri }, {
                        headers: {
                            authtoken: user ? user.token : ''
                        }
                    })
                        .then((res) => {
                            console.log("Image Upload Response data ====>", res)
                            setLoading(false)
                            allUploadedFiles.push(res.data);
                            setValues({ ...values, images: allUploadedFiles })
                        })
                        .catch((err) => {
                            console.log('Cloudinary Upload ERR', err)
                        })
                }, "base64")

            }
        }
        //send back to the server to upload to cloudinary
        //set the url in images[]  in the parent component --> ProductCreate
    }


    const hanleImageRemove = (public_id) => {
        setLoading(true)
        console.log("Remove image id ===>", public_id)
        axios.post(`${process.env.REACT_APP_API}/removeimages`, { public_id }, {
            headers: {
                authtoken: user ? user.token : ''
            }
        })
            .then(res => {
                setLoading(false)
                const { images } = values;
                let filteredImages = images.filter((item) => {
                    return item.public_id !== public_id
                })
                setValues({ ...values, images: filteredImages })
            })
            .catch((err) => {
                console.log("Error in remoiving image ", err)
                setLoading(false)
            })
    }


    return (
        <>
            <div className='row'>
                {
                    values.images && values.images.map((image) => (
                        <Badge count="X"
                            key={image.public_id}
                            onClick={
                                () => hanleImageRemove(image.public_id)}
                            style={{ cursor: "pointer" }}>
                            <Avatar
                                src={image.url}
                                size={60}
                                shape="square"
                                className='ml-3' />
                        </Badge>
                    ))
                }
            </div>
            <div className='row'>
                <label className='btn btn-primary'>
                    Choose File
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        hidden
                        onChange={fileUploadAndResize} />
                </label>
            </div>
        </>
    )
}

export default FileUpload
