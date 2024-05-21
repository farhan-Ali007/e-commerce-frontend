import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'


const LoadingToRedirect = () => {
    let history = useHistory()

    const [count, setCount] = useState(5)

    useEffect(() => {
        const interval = setInterval(() => {

            setCount((currentCount) => --currentCount)
            //
        }, 1000)

        //redirect once count is equal to 0
        count === 0 && history.push('/')
        //cleanup
        return () => clearInterval(interval)
    }, [history, count])


    return (
        <div className='container p-5 text-center'>Redirecting you in {count} seconds</div>
    );


}

export default LoadingToRedirect
